import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getPlayerState, savePlayerState, logCodeSubmission, getRecentSubmissions } from './db.ts';
import { generateMentorReply, type MentorRequest } from './mentor.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  const aiConfigured = Boolean(process.env.OPENAI_API_KEY?.trim() || process.env.GEMINI_API_KEY?.trim());
  res.json({
    ok: true,
    service: 'code-quest-api',
    aiProvider: process.env.OPENAI_API_KEY?.trim()
      ? 'openai'
      : process.env.GEMINI_API_KEY?.trim()
        ? 'gemini'
        : 'offline',
    aiConfigured,
  });
});

app.get('/api/state', (_req, res) => {
  const state = getPlayerState('default');
  res.json({ state });
});

app.put('/api/state', (req, res) => {
  const { state } = req.body as { state?: Record<string, unknown> };
  if (!state || typeof state !== 'object') {
    res.status(400).json({ error: 'Invalid state payload' });
    return;
  }
  savePlayerState(state, 'default');
  res.json({ ok: true });
});

app.post('/api/submissions', (req, res) => {
  const { lessonId, language, code, passed, errorMessage } = req.body as {
    lessonId?: string;
    language?: string;
    code?: string;
    passed?: boolean;
    errorMessage?: string;
  };
  if (!lessonId || typeof code !== 'string') {
    res.status(400).json({ error: 'lessonId and code are required' });
    return;
  }
  logCodeSubmission({
    lessonId,
    language: language || 'python',
    code,
    passed: Boolean(passed),
    errorMessage,
  });
  res.json({ ok: true });
});

app.get('/api/submissions', (_req, res) => {
  const submissions = getRecentSubmissions('default', 30);
  res.json({ submissions });
});

app.post('/api/mentor', async (req, res) => {
  const body = req.body as MentorRequest;
  if (!body || !body.message) {
    res.status(400).json({ error: 'message is required' });
    return;
  }
  const reply = await generateMentorReply({
    ...body,
    mode: body.mode || 'explain',
  });
  res.json(reply);
});

app.listen(PORT, () => {
  const mode = process.env.OPENAI_API_KEY?.trim()
    ? 'OpenAI'
    : process.env.GEMINI_API_KEY?.trim()
      ? 'Gemini'
      : 'Smart Offline Mentor';
  console.log(`[Code Quest API] Listening on http://localhost:${PORT} (AI Mentor: ${mode})`);
});
