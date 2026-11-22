export type MentorMode =
  | 'explain'
  | 'hint'
  | 'debug'
  | 'review'
  | 'step-by-step'
  | 'challenge';

export interface MentorRequest {
  mode: MentorMode;
  message: string;
  code?: string;
  language?: string;
  error?: string;
  lessonTitle?: string;
  lessonConcept?: string;
  lessonTask?: string;
  hints?: string[];
  attemptCount?: number;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface MentorResponse {
  reply: string;
  provider: 'openai' | 'gemini' | 'offline';
  mode: MentorMode;
}

const SYSTEM_PROMPT = `You are ARIA, the AI Coding Mentor inside Code Quest — a gamified programming academy for complete beginners.

PEDAGOGY RULES (CRITICAL):
1. Teaching-first approach: NEVER immediately blurt out the complete final solution code unless the student has made multiple attempts or explicitly asks after trying.
2. Follow this structure when helping:
   - Briefly clarify what the mission/problem is asking.
   - Identify the core programming concept involved.
   - Give a small, actionable hint or guiding question.
   - Encourage the learner to try it.
3. Never shame or condescend. Be warm, patient, encouraging, and honest.
4. Use simple, jargon-free analogies for beginners.
5. When debugging, explain the exact error message in plain English and point to the likely line/cause.
6. Keep responses focused, well-structured with short bullet points, and easy to read.`;

export async function generateMentorReply(req: MentorRequest): Promise<MentorResponse> {
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  const contextBlock = [
    `Selected Mentor Mode: ${req.mode.toUpperCase()}`,
    req.lessonTitle ? `Current Mission: ${req.lessonTitle}` : '',
    req.lessonConcept ? `Core Concept: ${req.lessonConcept}` : '',
    req.lessonTask ? `Mission Task: ${req.lessonTask}` : '',
    req.language ? `Language: ${req.language}` : 'Language: python',
    typeof req.attemptCount === 'number' ? `Student Attempts So Far: ${req.attemptCount}` : '',
    req.code ? `Student's Current Code:\n\`\`\`${req.language || 'python'}\n${req.code}\n\`\`\`` : '',
    req.error ? `Latest Error Output:\n${req.error}` : '',
    `Student Question: ${req.message}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  if (openaiKey) {
    try {
      const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(req.history || []).slice(-6),
        { role: 'user', content: contextBlock },
      ];
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({ model, messages, temperature: 0.5, max_tokens: 550 }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const content = data.choices?.[0]?.message?.content?.trim();
        if (content) {
          return { reply: content, provider: 'openai', mode: req.mode };
        }
      }
    } catch {
      // Fall through cleanly to offline mentor
    }
  }

  if (geminiKey) {
    try {
      const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: contextBlock }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 550 },
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          return { reply: text, provider: 'gemini', mode: req.mode };
        }
      }
    } catch {
      // Fall through cleanly to offline mentor
    }
  }

  return {
    reply: generateSmartOfflineReply(req),
    provider: 'offline',
    mode: req.mode,
  };
}

function diagnoseErrorOffline(error: string, code: string): string {
  const errLower = error.toLowerCase();

  if (errLower.includes('syntaxerror')) {
    if (error.includes('EOL') || error.includes('unterminated string')) {
      return `**What happened:** You started text with a quote (\`"\` or \`'\`), but forgot to close it at the end.\n\n**How to check:** Look at the highlighted line and make sure every opening quote has a matching closing quote.`;
    }
    if (error.includes("expected ':'")) {
      return `**What happened:** Python expects a colon \`:\` at the end of \`if\`, \`elif\`, \`else\`, \`for\`, \`while\`, \`def\`, or \`class\` lines.\n\n**Try this:** Add \`:\` to the end of that statement line and run again!`;
    }
    return `**What happened:** Python couldn't understand the grammar (syntax) of your code.\n\n**Common things to check:**\n- Did you close all parentheses \`()\` and quotes \`""\`?\n- Did you put a colon \`:\` after \`if\`, \`for\`, \`while\`, or \`def\`?\n- Did you use \`==\` (comparison) instead of \`=\` (assignment) inside an \`if\`?`;
  }

  if (errLower.includes('indentationerror')) {
    return `**What happened:** Python uses **spaces at the start of a line** (indentation) to know which lines belong inside an \`if\`, loop, or function.\n\n**Try this:** Make sure lines inside a block are indented by **4 spaces**, and lines outside the block start at the left edge.`;
  }

  if (errLower.includes('nameerror')) {
    const match = error.match(/name '([^']+)' is not defined/i);
    const varName = match ? match[1] : 'that name';
    return `**What happened:** Python doesn't recognize \`${varName}\` yet.\n\n**Why this happens:**\n1. A small typo in the variable or function name (Python is case-sensitive: \`Score\` ≠ \`score\`).\n2. You forgot quotes around text (e.g., \`print(hello)\` instead of \`print("hello")\`).\n3. You used \`${varName}\` before creating it.\n\nCheck your spelling and quotes — you're very close!`;
  }

  if (errLower.includes('typeerror')) {
    return `**What happened:** You tried to combine two incompatible data types (for example, adding a number like \`5\` directly to text like \`"Score: "\`).\n\n**How to fix:** Convert numbers to text with \`str(number)\`, or use an f-string like \`f"Score: {score}"\`.`;
  }

  if (errLower.includes('zerodivisionerror')) {
    return `**What happened:** Your code tried to divide a number by \`0\`, which isn't mathematically possible.\n\n**Tip:** Check your divisor with an \`if divisor == 0:\` condition before dividing!`;
  }

  if (errLower.includes('indexerror')) {
    return `**What happened:** You tried to grab an item from a list at a position that doesn't exist.\n\n**Remember:** Python starts counting list positions at **0**! A list of 3 items has indexes \`0, 1, 2\`.`;
  }

  if (code.trim().length === 0) {
    return `Your editor is currently empty! Start by writing a small first line, click **Run Code**, and let's build from there step by step.`;
  }

  return `**Error Analysis:**\n\`\`\`\n${error.slice(0, 260)}\n\`\`\`\n\nRead the very last line of the error first — it tells you the *type* of problem, and the line number shows where Python noticed it. Want to tell me what you expected that line to do?`;
}

function generateSmartOfflineReply(req: MentorRequest): string {
  const code = (req.code || '').trim();
  const lines = code ? code.split('\n') : [];
  const concept = req.lessonConcept || 'Programming Fundamentals';
  const task = req.lessonTask || 'solving this coding challenge';

  if (req.mode === 'debug') {
    if (req.error) {
      return `Great catch asking to debug — reading errors is a real developer superpower!\n\n${diagnoseErrorOffline(req.error, code)}`;
    }
    return `I don't see an error message yet! Click **Run Code** or **Run Tests** first so we can see what your program outputs. If your code runs without crashing but fails a test, that's a **logic bug** — tell me what your code prints versus what the mission expects!`;
  }

  if (req.mode === 'hint') {
    const attempt = req.attemptCount || 0;
    const hints = req.hints || [];
    if (hints.length > 0) {
      const idx = Math.min(attempt, hints.length - 1);
      return `**Concept in focus:** ${concept}\n\n**Hint ${idx + 1} of ${hints.length}:**\n> ${hints[idx]}\n\nGive that a try in the editor and hit **Run Code**! Every experiment teaches your brain how the computer thinks.`;
    }
    return `**Concept:** ${concept}\n\n**Small Hint:** Break **${task}** into tiny steps:\n1. What data do you start with?\n2. What transformation or check needs to happen?\n3. What should be printed or returned at the end?\n\nTry writing just Step 1 first and running it!`;
  }

  if (req.mode === 'review') {
    if (!code) {
      return `Write a draft of your solution first, then ask me to **Review** it — I'll check readability, structure, and edge cases with you!`;
    }
    const notes: string[] = [];
    if (lines.length === 1 && code.startsWith('#')) {
      notes.push('- Right now your file only has comments (`#`). Try writing your first executable line underneath!');
    }
    if (!code.includes('#') && lines.length > 6) {
      notes.push('- Consider adding a short `# comment` explaining the trickiest part of your logic.');
    }
    if (/\b[a-z]\s*=/.test(code) && !/\bfor\s+[ijk]\s+in/.test(code)) {
      notes.push('- Tip: Descriptive variable names (like `player_score` instead of `x`) make code much easier to read later.');
    }
    if (code.includes('print(')) {
      notes.push('- Good use of `print()` to inspect or display output.');
    }
    if (code.includes('def ')) {
      notes.push('- Nice! Organizing logic into a function (`def`) makes it reusable and testable.');
    }
    if (notes.length === 0) {
      notes.push('- Your code is clean, concise, and easy to follow!');
    }
    return `**Code Review (${lines.length} line${lines.length === 1 ? '' : 's'}):**\n\n${notes.join('\n')}\n\nHave you tested edge cases (like \`0\`, empty text, or unexpected values)?`;
  }

  if (req.mode === 'step-by-step') {
    return `Let's tackle **${req.lessonTitle || 'this mission'}** one tiny step at a time:\n\n1. **Understand the goal:** ${task}\n2. **Identify the tool:** We're practicing **${concept}**.\n3. **Start tiny:** Write just the first line (e.g., create one variable or print one test value) and press **Run Code**.\n4. **Verify & expand:** Once that works, add the next piece and run **Submit & Test**.\n\nWhat do you think the very first line of code should do?`;
  }

  if (req.mode === 'challenge') {
    return `Love the ambition! Here is a **Bonus Mini-Challenge** for **${concept}**:\n\n- Once your current mission passes all tests, try modifying your code so it handles **two different inputs** or prints a formatted status report using an f-string (\`f"..."\`).\n- Ask yourself: *"What would happen if someone passed in a negative number or an empty string?"*\n\nTry testing that in the editor and tell me what happens!`;
  }

  // Default: 'explain'
  const q = req.message.toLowerCase();
  if (q.includes('variable')) {
    return `**What is a Variable?**\nThink of a variable like a **labeled storage box** in the computer's memory.\n\n- The **label** is the name (like \`hero_name\`).\n- The **contents** are the value (like \`"Nova"\` or \`100\`).\n\nIn Python, \`=\` puts a value inside the box: \`hp = 100\`. Later, whenever you write \`hp\`, the computer looks inside the box and grabs \`100\`!`;
  }
  if (q.includes('loop') || q.includes('for') || q.includes('while')) {
    return `**What is a Loop?**\nA loop tells the computer: *"Repeat these instructions without me having to copy-paste them 100 times!"*\n\n- Use a **\`for\` loop** when you know how many times to repeat (or want to visit every item in a list).\n- Use a **\`while\` loop** when you want to repeat *as long as* a condition stays \`True\`.\n\nJust remember to indent the lines inside the loop by 4 spaces!`;
  }
  if (q.includes('function') || q.includes('def') || q.includes('return')) {
    return `**What is a Function?**\nA function is a **reusable mini-recipe** with a name.\n\n- **Parameters** are the ingredients you pass in.\n- The **body** is the steps it performs.\n- **\`return\`** hands the finished dish back so the rest of your program can use it!\n\nNote the difference: \`print()\` only shows text on screen, while \`return\` gives the actual value back to your code.`;
  }
  if (q.includes('if') || q.includes('else') || q.includes('condition')) {
    return `**What is a Condition (\`if / elif / else\`)?**\nConditions let your program **make decisions** — just like a fork in a road.\n\n- \`if\` checks whether something is \`True\`.\n- \`elif\` ("else if") checks a backup condition.\n- \`else\` runs when none of the above were \`True\`.\n\nRemember: use \`==\` to *compare* two things, and \`=\` to *store* a value!`;
  }

  return `**Exploring ${concept}:**\n\nA computer follows your code **line by line, from top to bottom**, taking every instruction literally.\n\nFor **${req.lessonTitle || 'your current quest'}**, focus on:\n- **Goal:** ${task}\n- **Tip:** Don't be afraid to click **Run Code** often! Professional programmers run their code constantly to test small ideas.\n\nIf you'd like, switch me to **Give me a hint** or **Debug my code**, or ask about any specific line!`;
}
