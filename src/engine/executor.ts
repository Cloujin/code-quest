import type { CodeLanguage, ExecutionResult, LessonTestCase, TestRunResult } from '../types/game';

const PYODIDE_WORKER_SOURCE = `
let pyodide = null;
let pyodideReadyPromise = null;

async function ensurePyodide() {
  if (pyodide) return pyodide;
  if (!pyodideReadyPromise) {
    self.postMessage({ type: 'status', status: 'loading' });
    importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js');
    pyodideReadyPromise = loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
    }).then((py) => {
      pyodide = py;
      self.postMessage({ type: 'status', status: 'ready' });
      return py;
    });
  }
  return pyodideReadyPromise;
}

const RUNNER_PY = \`
import sys, io, traceback, builtins, json

def _cq_run(user_code, tests_json, default_inputs_json):
    tests = json.loads(tests_json)
    default_inputs = json.loads(default_inputs_json)

    def run_single(code_str, inputs_list):
        stdout_buf = io.StringIO()
        stderr_buf = io.StringIO()
        old_stdout, old_stderr, old_input = sys.stdout, sys.stderr, builtins.input
        input_iter = iter(inputs_list)
        def fake_input(prompt=''):
            if prompt:
                stdout_buf.write(str(prompt))
            try:
                return str(next(input_iter))
            except StopIteration:
                return ''
        ns = {'__name__': '__main__'}
        error_text = ''
        error_line = None
        try:
            sys.stdout = stdout_buf
            sys.stderr = stderr_buf
            builtins.input = fake_input
            compiled = compile(code_str, '<user_code>', 'exec')
            exec(compiled, ns)
        except SyntaxError as e:
            error_line = e.lineno
            error_text = f"SyntaxError on line {e.lineno}: {e.msg}"
        except Exception as e:
            tb = traceback.extract_tb(e.__traceback__)
            for frame in reversed(tb):
                if frame.filename == '<user_code>':
                    error_line = frame.lineno
                    break
            error_text = f"{type(e).__name__}: {e}"
            if error_line:
                error_text = f"{type(e).__name__} on line {error_line}: {e}"
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr
            builtins.input = old_input
        return ns, stdout_buf.getvalue(), stderr_buf.getvalue(), error_text, error_line

    ns, stdout, stderr, err_text, err_line = run_single(user_code, default_inputs)
    if err_text:
        return json.dumps({
            'ok': False,
            'stdout': stdout,
            'stderr': err_text,
            'errorLine': err_line,
            'testResults': []
        })

    test_results = []
    for t in tests:
        t_inputs = t.get('mockInputs') or default_inputs
        if t.get('mockInputs'):
            t_ns, t_stdout, _, t_err, _ = run_single(user_code, t_inputs)
            if t_err:
                test_results.append({
                    'id': t['id'],
                    'description': t['description'],
                    'hidden': bool(t.get('hidden', False)),
                    'passed': False,
                    'error': t_err
                })
                continue
        else:
            t_ns = dict(ns)
            t_stdout = stdout

        t_ns['__CQ_STDOUT__'] = t_stdout
        t_ns['__CQ_CODE__'] = user_code
        try:
            exec(t['testCode'], t_ns)
            test_results.append({
                'id': t['id'],
                'description': t['description'],
                'hidden': bool(t.get('hidden', False)),
                'passed': True
            })
        except AssertionError as ae:
            msg = str(ae) or 'Output or return value did not match expected result.'
            test_results.append({
                'id': t['id'],
                'description': t['description'],
                'hidden': bool(t.get('hidden', False)),
                'passed': False,
                'error': msg
            })
        except Exception as ex:
            test_results.append({
                'id': t['id'],
                'description': t['description'],
                'hidden': bool(t.get('hidden', False)),
                'passed': False,
                'error': f"{type(ex).__name__}: {ex}"
            })

    return json.dumps({
        'ok': True,
        'stdout': stdout,
        'stderr': stderr,
        'errorLine': None,
        'testResults': test_results
    })
\`;

let runnerInitialized = false;

self.onmessage = async (event) => {
  const { id, type, code, tests, defaultInputs } = event.data;
  if (type === 'warmup') {
    try {
      await ensurePyodide();
      if (!runnerInitialized) {
        pyodide.runPython(RUNNER_PY);
        runnerInitialized = true;
      }
      self.postMessage({ id, ok: true });
    } catch (err) {
      self.postMessage({ id, ok: false, error: String(err) });
    }
    return;
  }

  if (type === 'run') {
    try {
      await ensurePyodide();
      if (!runnerInitialized) {
        pyodide.runPython(RUNNER_PY);
        runnerInitialized = true;
      }
      pyodide.globals.set('_cq_user_code', code);
      pyodide.globals.set('_cq_tests_json', JSON.stringify(tests || []));
      pyodide.globals.set('_cq_inputs_json', JSON.stringify(defaultInputs || []));
      const raw = pyodide.runPython('_cq_run(_cq_user_code, _cq_tests_json, _cq_inputs_json)');
      self.postMessage({ id, ok: true, result: JSON.parse(raw) });
    } catch (err) {
      self.postMessage({ id, ok: false, error: String(err) });
    }
  }
};
`;

const JS_WORKER_SOURCE = `
self.onmessage = (event) => {
  const { id, code, tests } = event.data;
  const logs = [];
  const fakeConsole = {
    log: (...args) => logs.push(args.map((a) => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
    error: (...args) => logs.push('[error] ' + args.map(String).join(' ')),
    warn: (...args) => logs.push('[warn] ' + args.map(String).join(' ')),
  };

  try {
    const fn = new Function('console', code);
    fn(fakeConsole);
    const stdout = logs.join('\\n');
    const testResults = [];

    for (const t of (tests || [])) {
      try {
        const testFn = new Function('console', '__CQ_STDOUT__', '__CQ_CODE__', code + '\\n' + t.testCode);
        const silentConsole = { log: () => {}, error: () => {}, warn: () => {} };
        testFn(silentConsole, stdout, code);
        testResults.push({
          id: t.id,
          description: t.description,
          hidden: Boolean(t.hidden),
          passed: true,
        });
      } catch (err) {
        testResults.push({
          id: t.id,
          description: t.description,
          hidden: Boolean(t.hidden),
          passed: false,
          error: err && err.message ? err.message : String(err),
        });
      }
    }

    self.postMessage({
      id,
      ok: true,
      result: { ok: true, stdout, stderr: '', testResults },
    });
  } catch (err) {
    self.postMessage({
      id,
      ok: true,
      result: {
        ok: false,
        stdout: logs.join('\\n'),
        stderr: err && err.message ? err.name + ': ' + err.message : String(err),
        testResults: [],
      },
    });
  }
};
`;

type PyRuntimeStatus = 'idle' | 'loading' | 'ready' | 'error';

let pyWorker: Worker | null = null;
let pyStatus: PyRuntimeStatus = 'idle';
const statusListeners = new Set<(status: PyRuntimeStatus) => void>();
let reqCounter = 0;

function setPyStatus(s: PyRuntimeStatus) {
  pyStatus = s;
  statusListeners.forEach((fn) => fn(s));
}

export function subscribePythonStatus(fn: (status: PyRuntimeStatus) => void): () => void {
  statusListeners.add(fn);
  fn(pyStatus);
  return () => statusListeners.delete(fn);
}

function getOrCreatePyWorker(): Worker {
  if (!pyWorker) {
    const blob = new Blob([PYODIDE_WORKER_SOURCE], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    pyWorker = new Worker(url);
    pyWorker.addEventListener('message', (e) => {
      if (e.data?.type === 'status') {
        setPyStatus(e.data.status);
      }
    });
  }
  return pyWorker;
}

export function warmupPythonRuntime(): void {
  try {
    const w = getOrCreatePyWorker();
    if (pyStatus === 'idle') {
      setPyStatus('loading');
      w.postMessage({ id: ++reqCounter, type: 'warmup' });
    }
  } catch {
    setPyStatus('error');
  }
}

export function translateFriendlyError(stderr: string, language: CodeLanguage): string | undefined {
  if (!stderr) return undefined;
  const lower = stderr.toLowerCase();

  if (language === 'python') {
    if (lower.includes('syntaxerror')) {
      if (lower.includes('unterminated string') || lower.includes('eol')) {
        return 'Missing closing quote! Make sure every " or \' you open also has a matching closing quote.';
      }
      if (lower.includes("expected ':'")) {
        return 'Missing colon! Statements like if, elif, else, for, while, def, and class must end with a colon (:).';
      }
      return 'Grammar (Syntax) Error: Check for missing parentheses (), quotes "", or colons (:).';
    }
    if (lower.includes('indentationerror')) {
      return 'Indentation Error: Python uses 4 spaces at the start of a line to group code inside if/for/while/def blocks.';
    }
    if (lower.includes('nameerror')) {
      return 'Name Error: Python does not recognize that variable or function name. Check for typos, capitalization, or missing quotes around text!';
    }
    if (lower.includes('typeerror')) {
      return 'Type Error: You tried to combine incompatible types (like adding text + a number). Try converting with str() or int(), or use an f-string.';
    }
    if (lower.includes('zerodivisionerror')) {
      return 'Zero Division Error: You cannot divide a number by 0. Check your math or add an if-check before dividing.';
    }
    if (lower.includes('indexerror')) {
      return 'Index Error: You tried to access a list position that does not exist. Remember, Python starts counting at 0!';
    }
    if (lower.includes('keyerror')) {
      return 'Key Error: That key does not exist in your dictionary. Check spelling or use .get().';
    }
  }

  if (language === 'javascript') {
    if (lower.includes('referenceerror')) {
      return 'Reference Error: That variable or function has not been defined yet. Check spelling and capitalization!';
    }
    if (lower.includes('syntaxerror')) {
      return 'Syntax Error: Check your braces {}, parentheses (), semicolons, and quotes.';
    }
  }

  return 'Read the error message carefully — it points to what went wrong so you can fix it like a real developer!';
}

async function runPython(
  code: string,
  tests: LessonTestCase[] = [],
  defaultInputs: string[] = []
): Promise<ExecutionResult> {
  const start = performance.now();
  const w = getOrCreatePyWorker();
  const id = ++reqCounter;

  return new Promise<ExecutionResult>((resolve) => {
    const timeoutMs = pyStatus === 'ready' ? 6000 : 25000;
    const timer = window.setTimeout(() => {
      // Terminate hung worker (e.g., infinite while True loop) and reset
      w.terminate();
      pyWorker = null;
      setPyStatus('idle');
      resolve({
        ok: false,
        stdout: '',
        stderr: 'TimeoutError: Execution exceeded time limit (possible infinite loop).',
        friendlyError:
          'Your program took too long to finish! If you wrote a while loop, make sure its condition eventually becomes False.',
        executionMs: Math.round(performance.now() - start),
      });
    }, timeoutMs);

    const handler = (event: MessageEvent) => {
      if (event.data?.id !== id) return;
      window.clearTimeout(timer);
      w.removeEventListener('message', handler);
      const elapsed = Math.round(performance.now() - start);

      if (!event.data.ok) {
        const err = String(event.data.error || 'Python runtime error');
        resolve({
          ok: false,
          stdout: '',
          stderr: err,
          friendlyError: translateFriendlyError(err, 'python'),
          executionMs: elapsed,
        });
        return;
      }

      const res = event.data.result as {
        ok: boolean;
        stdout: string;
        stderr: string;
        errorLine?: number;
        testResults: TestRunResult[];
      };

      const allTestsPassed =
        res.ok && tests.length > 0 ? res.testResults.every((t) => t.passed) : res.ok;

      resolve({
        ok: res.ok,
        stdout: res.stdout,
        stderr: res.stderr,
        errorLine: res.errorLine || undefined,
        friendlyError: res.stderr ? translateFriendlyError(res.stderr, 'python') : undefined,
        testResults: res.testResults,
        allTestsPassed,
        executionMs: elapsed,
      });
    };

    w.addEventListener('message', handler);
    w.postMessage({ id, type: 'run', code, tests, defaultInputs });
  });
}

async function runJavaScript(
  code: string,
  tests: LessonTestCase[] = []
): Promise<ExecutionResult> {
  const start = performance.now();
  const blob = new Blob([JS_WORKER_SOURCE], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const w = new Worker(url);
  const id = ++reqCounter;

  return new Promise<ExecutionResult>((resolve) => {
    const timer = window.setTimeout(() => {
      w.terminate();
      URL.revokeObjectURL(url);
      resolve({
        ok: false,
        stdout: '',
        stderr: 'TimeoutError: Script exceeded 4s limit (possible infinite loop).',
        friendlyError: 'Your JavaScript code ran for too long — check your loops!',
        executionMs: Math.round(performance.now() - start),
      });
    }, 4000);

    w.onmessage = (event) => {
      if (event.data?.id !== id) return;
      window.clearTimeout(timer);
      w.terminate();
      URL.revokeObjectURL(url);
      const elapsed = Math.round(performance.now() - start);
      const res = event.data.result as {
        ok: boolean;
        stdout: string;
        stderr: string;
        testResults: TestRunResult[];
      };
      const allTestsPassed =
        res.ok && tests.length > 0 ? res.testResults.every((t) => t.passed) : res.ok;
      resolve({
        ok: res.ok,
        stdout: res.stdout,
        stderr: res.stderr,
        friendlyError: res.stderr ? translateFriendlyError(res.stderr, 'javascript') : undefined,
        testResults: res.testResults,
        allTestsPassed,
        executionMs: elapsed,
      });
    };

    w.postMessage({ id, code, tests });
  });
}

async function runHtml(code: string, tests: LessonTestCase[] = []): Promise<ExecutionResult> {
  const start = performance.now();
  const parser = new DOMParser();
  const doc = parser.parseFromString(code, 'text/html');
  const testResults: TestRunResult[] = [];

  for (const t of tests) {
    try {
      const fn = new Function('doc', 'code', t.testCode);
      fn(doc, code);
      testResults.push({
        id: t.id,
        description: t.description,
        hidden: Boolean(t.hidden),
        passed: true,
      });
    } catch (err) {
      testResults.push({
        id: t.id,
        description: t.description,
        hidden: Boolean(t.hidden),
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const allTestsPassed = tests.length > 0 ? testResults.every((t) => t.passed) : true;
  return {
    ok: true,
    stdout: 'Live HTML/CSS preview updated successfully.',
    stderr: '',
    testResults,
    allTestsPassed,
    executionMs: Math.round(performance.now() - start),
  };
}

export async function executeCode(
  language: CodeLanguage,
  code: string,
  tests: LessonTestCase[] = [],
  defaultInputs: string[] = []
): Promise<ExecutionResult> {
  if (language === 'python') {
    return runPython(code, tests, defaultInputs);
  }
  if (language === 'javascript') {
    return runJavaScript(code, tests);
  }
  return runHtml(code, tests);
}
