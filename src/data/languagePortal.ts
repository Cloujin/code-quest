export interface PortalLanguage {
  id: string;
  name: string;
  typing: string;
  memoryModel: string;
  bestFor: string;
  accent: string;
  runnable?: 'python' | 'javascript' | 'html';
}

export interface PortalConcept {
  id: string;
  title: string;
  summary: string;
  snippets: Record<string, string>;
  keyTakeaway: string;
}

export const PORTAL_LANGUAGES: PortalLanguage[] = [
  {
    id: 'python',
    name: 'Python',
    typing: 'Dynamic & Strong',
    memoryModel: 'Automatic (Garbage Collected)',
    bestFor: 'Beginners, AI/ML, Scripting, Backend APIs',
    accent: '#38bdf8',
    runnable: 'python',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    typing: 'Dynamic & Weak',
    memoryModel: 'Automatic (Garbage Collected)',
    bestFor: 'Interactive Websites, Frontend, Node.js Backends',
    accent: '#facc15',
    runnable: 'javascript',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    typing: 'Static (Compiled to JS)',
    memoryModel: 'Automatic (JS Runtime)',
    bestFor: 'Large-Scale Web Apps & Safer Full-Stack Code',
    accent: '#60a5fa',
  },
  {
    id: 'html-css',
    name: 'HTML & CSS',
    typing: 'Declarative Markup & Styles',
    memoryModel: 'Browser DOM Tree',
    bestFor: 'Web Structure, Layouts, Visual Design',
    accent: '#fb923c',
    runnable: 'html',
  },
  {
    id: 'c',
    name: 'C',
    typing: 'Static & Weak',
    memoryModel: 'Manual (malloc / free)',
    bestFor: 'Operating Systems, Embedded Hardware, Drivers',
    accent: '#94a3b8',
  },
  {
    id: 'cpp',
    name: 'C++',
    typing: 'Static & Strong',
    memoryModel: 'Manual / RAII Smart Pointers',
    bestFor: 'AAA Game Engines, High-Performance Graphics',
    accent: '#818cf8',
  },
  {
    id: 'java',
    name: 'Java',
    typing: 'Static & Strong (OOP)',
    memoryModel: 'Automatic (JVM Garbage Collector)',
    bestFor: 'Enterprise Backends, Android Apps, Large Systems',
    accent: '#f87171',
  },
  {
    id: 'csharp',
    name: 'C#',
    typing: 'Static & Strong',
    memoryModel: 'Automatic (.NET CLR)',
    bestFor: 'Unity Games, Enterprise Web APIs, Desktop Apps',
    accent: '#c084fc',
  },
  {
    id: 'sql',
    name: 'SQL',
    typing: 'Schema-Typed Query Language',
    memoryModel: 'Database Engine Managed',
    bestFor: 'Storing, Querying & Joining Relational Data',
    accent: '#2dd4bf',
  },
  {
    id: 'rust',
    name: 'Rust',
    typing: 'Static & Strict',
    memoryModel: 'Ownership & Borrow Checker (Zero GC)',
    bestFor: 'Memory-Safe Systems, CLI Tools, WebAssembly',
    accent: '#f97316',
  },
  {
    id: 'go',
    name: 'Go',
    typing: 'Static & Strong',
    memoryModel: 'Automatic (Fast Low-Latency GC)',
    bestFor: 'Cloud Services, Microservices, Networking',
    accent: '#22d3ee',
  },
];

export const PORTAL_CONCEPTS: PortalConcept[] = [
  {
    id: 'variables',
    title: 'Variables & Data Types',
    summary: 'Storing a hero name, health number, and active flag across languages.',
    keyTakeaway:
      'Python & JavaScript infer types automatically, whereas C, C++, Java, C#, TypeScript, Rust, and Go check types before your code runs to catch mistakes early!',
    snippets: {
      python: `hero = "Nova"\nhp = 100\nis_ready = True\nprint(f"{hero}: {hp} HP (Ready={is_ready})")`,
      javascript: `const hero = "Nova";\nlet hp = 100;\nlet isReady = true;\nconsole.log(\`\${hero}: \${hp} HP (Ready=\${isReady})\`);`,
      typescript: `const hero: string = "Nova";\nlet hp: number = 100;\nlet isReady: boolean = true;\nconsole.log(\`\${hero}: \${hp} HP\`);`,
      'html-css': `<div style="font-family:sans-serif;color:#38bdf8;background:#0f172a;padding:16px;border-radius:10px">\n  <h2>Hero: Nova</h2>\n  <p>HP: 100 | Ready: True</p>\n</div>`,
      c: `#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n    const char* hero = "Nova";\n    int hp = 100;\n    bool is_ready = true;\n    printf("%s: %d HP\\n", hero, hp);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\n\nint main() {\n    std::string hero = "Nova";\n    int hp = 100;\n    bool isReady = true;\n    std::cout << hero << ": " << hp << " HP\\n";\n}`,
      java: `public class Main {\n    public static void main(String[] args) {\n        String hero = "Nova";\n        int hp = 100;\n        boolean isReady = true;\n        System.out.println(hero + ": " + hp + " HP");\n    }\n}`,
      csharp: `string hero = "Nova";\nint hp = 100;\nbool isReady = true;\nConsole.WriteLine($"{hero}: {hp} HP");`,
      sql: `CREATE TABLE heroes (\n  name TEXT NOT NULL,\n  hp INTEGER NOT NULL,\n  is_ready BOOLEAN DEFAULT TRUE\n);\nINSERT INTO heroes VALUES ('Nova', 100, TRUE);`,
      rust: `fn main() {\n    let hero: &str = "Nova";\n    let mut hp: i32 = 100;\n    let is_ready: bool = true;\n    println!("{hero}: {hp} HP (Ready={is_ready})");\n}`,
      go: `package main\nimport "fmt"\n\nfunc main() {\n    hero := "Nova"\n    hp := 100\n    isReady := true\n    fmt.Printf("%s: %d HP (%v)\\n", hero, hp, isReady)\n}`,
    },
  },
  {
    id: 'conditions',
    title: 'Conditions (If / Else)',
    summary: 'Making branching decisions based on a condition.',
    keyTakeaway:
      'Every language has the exact same mental model for branching — only the punctuation (colons + indentation vs curly braces `{}`) changes!',
    snippets: {
      python: `hp = 25\nif hp <= 0:\n    print("Defeated")\nelif hp < 30:\n    print("Low Health! Drink a potion.")\nelse:\n    print("Healthy")`,
      javascript: `const hp = 25;\nif (hp <= 0) {\n  console.log("Defeated");\n} else if (hp < 30) {\n  console.log("Low Health! Drink a potion.");\n} else {\n  console.log("Healthy");\n}`,
      typescript: `const hp: number = 25;\nconst status: string = hp <= 0 ? "Defeated" : hp < 30 ? "Low Health!" : "Healthy";\nconsole.log(status);`,
      'html-css': `<style>.warn { color: #facc15; background: #1e293b; padding: 12px; border-left: 4px solid #facc15; font-family: sans-serif; }</style>\n<div class="warn">Low Health! Drink a potion.</div>`,
      c: `int hp = 25;\nif (hp <= 0) {\n    printf("Defeated\\n");\n} else if (hp < 30) {\n    printf("Low Health!\\n");\n} else {\n    printf("Healthy\\n");\n}`,
      cpp: `int hp = 25;\nif (hp <= 0) std::cout << "Defeated\\n";\nelse if (hp < 30) std::cout << "Low Health!\\n";\nelse std::cout << "Healthy\\n";`,
      java: `int hp = 25;\nif (hp <= 0) {\n    System.out.println("Defeated");\n} else if (hp < 30) {\n    System.out.println("Low Health!");\n} else {\n    System.out.println("Healthy");\n}`,
      csharp: `int hp = 25;\nif (hp <= 0) Console.WriteLine("Defeated");\nelse if (hp < 30) Console.WriteLine("Low Health!");\nelse Console.WriteLine("Healthy");`,
      sql: `SELECT name,\n  CASE\n    WHEN hp <= 0 THEN 'Defeated'\n    WHEN hp < 30 THEN 'Low Health!'\n    ELSE 'Healthy'\n  END AS status\nFROM heroes;`,
      rust: `let hp = 25;\nif hp <= 0 {\n    println!("Defeated");\n} else if hp < 30 {\n    println!("Low Health!");\n} else {\n    println!("Healthy");\n}`,
      go: `hp := 25\nif hp <= 0 {\n    fmt.Println("Defeated")\n} else if hp < 30 {\n    fmt.Println("Low Health!")\n} else {\n    fmt.Println("Healthy")\n}`,
    },
  },
  {
    id: 'loops',
    title: 'Loops & Iteration',
    summary: 'Repeating an instruction 5 times cleanly.',
    keyTakeaway:
      'Once you understand how a loop repeats a counter from 1 to 5, you can read loops in almost any programming language on sight.',
    snippets: {
      python: `for step in range(1, 6):\n    print(f"Step {step}")`,
      javascript: `for (let step = 1; step <= 5; step++) {\n  console.log(\`Step \${step}\`);\n}`,
      typescript: `for (let step: number = 1; step <= 5; step++) {\n  console.log(\`Step \${step}\`);\n}`,
      'html-css': `<ol style="color:#a78bfa;font-family:sans-serif;background:#0f172a;padding:16px 32px;border-radius:8px">\n  <li>Step 1</li><li>Step 2</li><li>Step 3</li><li>Step 4</li><li>Step 5</li>\n</ol>`,
      c: `for (int step = 1; step <= 5; step++) {\n    printf("Step %d\\n", step);\n}`,
      cpp: `for (int step = 1; step <= 5; ++step) {\n    std::cout << "Step " << step << "\\n";\n}`,
      java: `for (int step = 1; step <= 5; step++) {\n    System.out.println("Step " + step);\n}`,
      csharp: `for (int step = 1; step <= 5; step++) {\n    Console.WriteLine($"Step {step}");\n}`,
      sql: `-- SQL operates on entire sets at once instead of manual loops!\nSELECT name, hp FROM heroes ORDER BY hp DESC LIMIT 5;`,
      rust: `for step in 1..=5 {\n    println!("Step {step}");\n}`,
      go: `for step := 1; step <= 5; step++ {\n    fmt.Printf("Step %d\\n", step)\n}`,
    },
  },
  {
    id: 'functions',
    title: 'Functions & Return Values',
    summary: 'Defining a reusable damage calculator across languages.',
    keyTakeaway:
      'Functions always take inputs (parameters), perform work, and return a result — whether written with `def`, `function`, `fn`, or `func`.',
    snippets: {
      python: `def calc_damage(attack, defense):\n    return max(0, attack - defense)\n\nprint("Damage:", calc_damage(45, 15))`,
      javascript: `function calcDamage(attack, defense) {\n  return Math.max(0, attack - defense);\n}\nconsole.log("Damage:", calcDamage(45, 15));`,
      typescript: `function calcDamage(attack: number, defense: number): number {\n  return Math.max(0, attack - defense);\n}\nconsole.log("Damage:", calcDamage(45, 15));`,
      'html-css': `<div style="color:#34d399;font-family:monospace;background:#0f172a;padding:14px;border-radius:8px">Damage: 30 (HTML uses JavaScript for functions!)</div>`,
      c: `int calc_damage(int attack, int defense) {\n    int dmg = attack - defense;\n    return dmg > 0 ? dmg : 0;\n}`,
      cpp: `int calcDamage(int attack, int defense) {\n    return std::max(0, attack - defense);\n}`,
      java: `public static int calcDamage(int attack, int defense) {\n    return Math.max(0, attack - defense);\n}`,
      csharp: `int CalcDamage(int attack, int defense) => Math.Max(0, attack - defense);`,
      sql: `SELECT name, GREATEST(0, attack - defense) AS damage FROM combat_log;`,
      rust: `fn calc_damage(attack: i32, defense: i32) -> i32 {\n    (attack - defense).max(0)\n}`,
      go: `func calcDamage(attack int, defense int) int {\n    if attack > defense {\n        return attack - defense\n    }\n    return 0\n}`,
    },
  },
];
