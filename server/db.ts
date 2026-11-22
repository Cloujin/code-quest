import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'codequest.sqlite');
const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS player_state (
    id TEXT PRIMARY KEY,
    state_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS code_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    passed INTEGER NOT NULL,
    error_message TEXT,
    created_at TEXT NOT NULL
  );
`);

export function getPlayerState(playerId = 'default'): Record<string, unknown> | null {
  const stmt = db.prepare('SELECT state_json FROM player_state WHERE id = ?');
  const row = stmt.get(playerId) as { state_json: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.state_json);
  } catch {
    return null;
  }
}

export function savePlayerState(state: Record<string, unknown>, playerId = 'default'): void {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO player_state (id, state_json, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      state_json = excluded.state_json,
      updated_at = excluded.updated_at
  `);
  stmt.run(playerId, JSON.stringify(state), now);
}

export function logCodeSubmission(params: {
  playerId?: string;
  lessonId: string;
  language: string;
  code: string;
  passed: boolean;
  errorMessage?: string;
}): void {
  const stmt = db.prepare(`
    INSERT INTO code_submissions (player_id, lesson_id, language, code, passed, error_message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    params.playerId || 'default',
    params.lessonId,
    params.language,
    params.code,
    params.passed ? 1 : 0,
    params.errorMessage || null,
    new Date().toISOString()
  );
}

export function getRecentSubmissions(playerId = 'default', limit = 20) {
  const stmt = db.prepare(`
    SELECT id, lesson_id, language, passed, error_message, created_at
    FROM code_submissions
    WHERE player_id = ?
    ORDER BY id DESC
    LIMIT ?
  `);
  return stmt.all(playerId, limit);
}
