# CODE QUEST — Gamified Programming Academy

An interactive, full-stack gamified coding academy designed to transform complete beginners into independent software developers.

## Features
- **Beginner-Friendly Interactive Onboarding**: Recipe analogy, interactive stepper, and your first real Python program executed live.
- **Interactive World Map (10 Regions)**: Binary Valley, Logic Forest, Looping Mountains, Function Kingdom, Object-Oriented Empire, Debugging Dungeon, Data Ocean, Web Kingdom, Software Engineering Citadel, and Advanced Developer Realm — with skill-based unlocking.
- **Real Sandboxed Code Execution**:
  - **Python 3** via Pyodide inside an isolated Web Worker (real `stdout`/`stderr`, exact error line numbers, beginner-friendly error translation, automated test suites, and infinite-loop timeout protection).
  - **JavaScript** inside an isolated Web Worker.
  - **HTML & CSS** with live sandboxed `<iframe>` preview and DOM verification tests.
- **Monaco Coding IDE**: Syntax highlighting, line numbers, error line markers, progressive hints, and interactive visualizers (8-Bit Binary Explorer, RGB Pixel Mixer, Git Workflow Simulator).
- **AI Coding Mentor (ARIA)**: 6 Socratic modes (`Explain`, `Hint`, `Debug`, `Review`, `Step-by-Step`, `Challenge`) via secure backend `/api/mentor`, with OpenAI/Gemini support and a smart context-aware offline mentor fallback.
- **Language Portal**: Side-by-side comparison across 11 languages (Python, JavaScript, TypeScript, HTML/CSS, C, C++, Java, C#, SQL, Rust, Go) with live runnable snippets.
- **Homework Center, Project Workshop & Developer Portfolio**: Independent verified homework assignments, custom Python/JS/HTML projects with milestones, and AI code reviews.
- **Career Paths & Capstone Graduation**: 6 developer career tracks with playable missions + Capstone Project submission & Personalized Developer Graduation Report.
- **SQLite + LocalStorage Persistence**: Built-in Node 24 `node:sqlite` backend (`data/codequest.sqlite`) synced seamlessly with browser `localStorage`.

## Getting Started

```bash
cd c:\ds\code-quest
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### Optional: Enable Live AI Mentor (OpenAI or Gemini)
1. Copy `.env.example` to `.env`.
2. Add `OPENAI_API_KEY=...` or `GEMINI_API_KEY=...`.
3. Restart `npm run dev`. API keys stay strictly on the Express backend (`server/mentor.ts`) and are never exposed to frontend code.
