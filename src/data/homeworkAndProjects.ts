import type {
  Achievement,
  CareerPath,
  HomeworkAssignment,
  RankTitle,
  SkillProgress,
  ThemeId,
  UserProject,
} from '../types/game';

export const HOMEWORK_ASSIGNMENTS: HomeworkAssignment[] = [
  {
    id: 'hw-character-profile',
    title: 'Hero Character Profile',
    afterConcept: 'Variables & Data Types',
    requiredLessonId: 'lf-1-variables-hero',
    language: 'python',
    xpReward: 180,
    description:
      'Apply what you learned about variables without copying the lesson! Create a complete character sheet with name, class, HP, gold, and a formatted summary printout.',
    requirements: [
      'Create variables `name` (str), `role` (str), `hp` (int > 0), and `gold` (int >= 0)',
      'Compute `power_rating = hp + gold * 2`',
      'Print a summary containing the hero name and power_rating',
    ],
    starterCode: `# HOMEWORK: Create your original RPG Character Profile\nname = ""\nrole = ""\nhp = 100\ngold = 50\n\n# Compute power_rating = hp + gold * 2\npower_rating = \n\n# Print a nice character summary including name and power_rating\n`,
    tests: [
      {
        id: 'h1',
        description: 'Defines non-empty string variables name and role',
        testCode: `assert isinstance(name, str) and len(name.strip()) > 0, "Set name to a non-empty string"\nassert isinstance(role, str) and len(role.strip()) > 0, "Set role to a non-empty string"`,
      },
      {
        id: 'h2',
        description: 'Defines positive int hp, non-negative int gold, and correct power_rating',
        testCode: `assert isinstance(hp, int) and hp > 0\nassert isinstance(gold, int) and gold >= 0\nassert power_rating == hp + gold * 2, f"Expected power_rating == {hp + gold * 2}, got {power_rating}"`,
      },
      {
        id: 'h3',
        description: 'Prints both name and power_rating',
        testCode: `assert name in __CQ_STDOUT__ and str(power_rating) in __CQ_STDOUT__, "Print both your hero name and power_rating!"`,
      },
    ],
  },
  {
    id: 'hw-decision-adventure',
    title: 'Branching Cave Adventure',
    afterConcept: 'Conditions (if / elif / else)',
    requiredLessonId: 'lf-3-password-gate',
    language: 'python',
    xpReward: 200,
    description:
      'Build a decision-based mini-adventure function `explore_path(choice, has_torch)` that reacts to the player’s choice and equipment!',
    requirements: [
      'If `choice == "left"` and `has_torch` is `True`, return `"Found hidden treasure!"`',
      'If `choice == "left"` and `has_torch` is `False`, return `"Too dark to see!"`',
      'If `choice == "right"`, return `"Met a friendly wizard!"`',
      'For any other choice, return `"Returned to camp."`',
    ],
    starterCode: `def explore_path(choice, has_torch):\n    # Implement the branching adventure logic\n    pass\n\nprint(explore_path("left", True))\nprint(explore_path("left", False))\nprint(explore_path("right", False))\n`,
    tests: [
      {
        id: 'h1',
        description: 'Handles "left" with and without torch',
        testCode: `assert explore_path("left", True) == "Found hidden treasure!"\nassert explore_path("left", False) == "Too dark to see!"`,
      },
      {
        id: 'h2',
        description: 'Handles "right" and unknown choices',
        testCode: `assert explore_path("right", False) == "Met a friendly wizard!"\nassert explore_path("back", True) == "Returned to camp."`,
      },
    ],
  },
  {
    id: 'hw-number-guesser',
    title: 'Number Guessing Engine',
    afterConcept: 'Loops & Conditions',
    requiredLessonId: 'lm-3-energy-while',
    language: 'python',
    xpReward: 220,
    description:
      'Build the core logic of a Number Guessing Game! Write a function `check_guess(secret, guess)` and simulate a loop of guesses until the secret is found.',
    requirements: [
      'Write `check_guess(secret, guess)` returning `"Too low"`, `"Too high"`, or `"Correct!"`',
      'Write `count_attempts(secret, guesses)` that loops through a list of guesses and returns how many tries it took to hit `secret` (or `-1` if never found)',
    ],
    starterCode: `def check_guess(secret, guess):\n    # Return "Too low", "Too high", or "Correct!"\n    pass\n\ndef count_attempts(secret, guesses):\n    # Loop through guesses and return attempt count (1-based), or -1 if not found\n    pass\n\nprint(check_guess(7, 4))\nprint(count_attempts(7, [3, 9, 7, 10]))\n`,
    tests: [
      {
        id: 'h1',
        description: 'check_guess accurately reports Too low, Too high, and Correct!',
        testCode: `assert check_guess(10, 5) == "Too low"\nassert check_guess(10, 15) == "Too high"\nassert check_guess(10, 10) == "Correct!"`,
      },
      {
        id: 'h2',
        description: 'count_attempts finds exact try number or returns -1',
        testCode: `assert count_attempts(7, [3, 9, 7, 10]) == 3\nassert count_attempts(7, [1, 2, 3]) == -1`,
      },
    ],
  },
  {
    id: 'hw-modular-calculator',
    title: 'Modular Function Calculator',
    afterConcept: 'Functions & Modular Code',
    requiredLessonId: 'fk-1-damage-calc',
    language: 'python',
    xpReward: 240,
    description:
      'Build a clean calculator built from separate helper functions (`add`, `subtract`, `multiply`, `safe_divide`) so each function does one clear job!',
    requirements: [
      'Implement `add(a, b)`, `subtract(a, b)`, and `multiply(a, b)`',
      'Implement `safe_divide(a, b)` returning `"Cannot divide by zero"` if `b == 0`, otherwise `a / b`',
    ],
    starterCode: `def add(a, b):\n    pass\n\ndef subtract(a, b):\n    pass\n\ndef multiply(a, b):\n    pass\n\ndef safe_divide(a, b):\n    pass\n\nprint(add(10, 5), safe_divide(10, 0))\n`,
    tests: [
      {
        id: 'h1',
        description: 'add, subtract, and multiply return accurate values',
        testCode: `assert add(10, 5) == 15\nassert subtract(10, 4) == 6\nassert multiply(3, 7) == 21`,
      },
      {
        id: 'h2',
        description: 'safe_divide divides cleanly and protects against zero',
        testCode: `assert safe_divide(10, 2) == 5\nassert safe_divide(10, 0) == "Cannot divide by zero"`,
      },
    ],
  },
  {
    id: 'hw-portfolio-site',
    title: 'Personal Developer Portfolio Page',
    afterConcept: 'HTML & CSS Fundamentals',
    requiredLessonId: 'wk-1-hero-card-html',
    language: 'html',
    xpReward: 260,
    description:
      'Design your very own personal developer portfolio webpage with your name, bio, skills list, and a styled project showcase section!',
    requirements: [
      'Include an `<h1>` with your developer name',
      'Include a `<ul>` list with at least 3 `<li>` skills',
      'Include a `<section>` or `<div class="project">` showcasing a project',
    ],
    starterCode: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { background: #090d1a; color: #f1f5f9; font-family: system-ui, sans-serif; padding: 32px; max-width: 680px; margin: auto; }\n    h1 { color: #38bdf8; }\n    .project { background: #131c33; border: 1px solid #38bdf855; padding: 16px; border-radius: 12px; margin-top: 16px; }\n  </style>\n</head>\n<body>\n  <h1>Your Name — Developer</h1>\n  <p>Write a short bio here!</p>\n  <ul>\n    <li>Python</li>\n    <!-- Add 2 more skills -->\n  </ul>\n  <section class="project">\n    <h2>My First Project</h2>\n    <p>Describe what you built!</p>\n  </section>\n</body>\n</html>`,
    tests: [
      {
        id: 'h1',
        description: 'Has an <h1> heading with your name',
        testCode: `const h1 = doc.querySelector('h1'); if (!h1 || !h1.textContent.trim()) throw new Error('Missing <h1> heading');`,
      },
      {
        id: 'h2',
        description: 'Has a <ul> with at least 3 <li> skill items',
        testCode: `const items = doc.querySelectorAll('ul li'); if (items.length < 3) throw new Error('Add at least 3 <li> skills inside <ul>!');`,
      },
      {
        id: 'h3',
        description: 'Includes a project showcase <section> or .project container',
        testCode: `const proj = doc.querySelector('section, .project'); if (!proj || !proj.textContent.trim()) throw new Error('Include a project showcase section!');`,
      },
    ],
  },
];

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'game-dev',
    title: 'Game Developer',
    icon: '🎮',
    tagline: 'Game loops, physics, collision detection & interactive worlds',
    accent: '#a855f7',
    skills: ['Game Loops', '2D/3D Math', 'Collision Detection', 'State Machines', 'Performance'],
    capstoneIdea: 'Build a playable 2D arena survival game with scoring & enemy AI.',
    starterMission: {
      title: '2D AABB Collision Detector',
      language: 'python',
      xpReward: 220,
      task: 'Write `is_colliding(ax, ay, aw, ah, bx, by, bw, bh)` returning `True` if rectangle A overlaps rectangle B, else `False`.',
      starterCode: `def is_colliding(ax, ay, aw, ah, bx, by, bw, bh):\n    # Return True if the two rectangles overlap\n    pass\n\nprint(is_colliding(0, 0, 10, 10, 5, 5, 10, 10))  # True\nprint(is_colliding(0, 0, 10, 10, 20, 20, 5, 5))  # False\n`,
      tests: [
        {
          id: 'c1',
          description: 'Detects overlapping boxes',
          testCode: `assert is_colliding(0, 0, 10, 10, 5, 5, 10, 10) is True`,
        },
        {
          id: 'c2',
          description: 'Detects separated boxes',
          testCode: `assert is_colliding(0, 0, 10, 10, 20, 20, 5, 5) is False`,
        },
      ],
    },
  },
  {
    id: 'web-dev',
    title: 'Web Developer',
    icon: '🌐',
    tagline: 'HTML, CSS, JavaScript, React, APIs & Full-Stack Apps',
    accent: '#38bdf8',
    skills: ['HTML & CSS', 'JavaScript / TS', 'React UI', 'REST APIs & JSON', 'Databases'],
    capstoneIdea: 'Build a full-stack task tracker or interactive web dashboard.',
    starterMission: {
      title: 'API JSON Response Parser',
      language: 'javascript',
      xpReward: 220,
      task: 'Write a JavaScript function `getActiveUserNames(users)` that takes an array of `{ name, active }` objects and returns an array of names where `active === true`.',
      starterCode: `function getActiveUserNames(users) {\n  // Filter active users and map to their names\n  return [];\n}\n\nconsole.log(getActiveUserNames([\n  { name: "Ada", active: true },\n  { name: "Bob", active: false },\n  { name: "Linus", active: true }\n]));\n`,
      tests: [
        {
          id: 'c1',
          description: 'Returns only active user names',
          testCode: `const res = getActiveUserNames([{name:"Ada",active:true},{name:"Bob",active:false},{name:"Linus",active:true}]); if (JSON.stringify(res) !== JSON.stringify(["Ada","Linus"])) throw new Error("Expected ['Ada','Linus'], got " + JSON.stringify(res));`,
        },
      ],
    },
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    icon: '⚙️',
    tagline: 'Algorithms, data structures, OOP, testing & system architecture',
    accent: '#34d399',
    skills: ['Data Structures', 'Algorithms', 'Clean Architecture', 'Automated Testing', 'System Design'],
    capstoneIdea: 'Design a modular CLI task manager with persistent storage and unit tests.',
    starterMission: {
      title: 'Binary Search Speedrun',
      language: 'python',
      xpReward: 240,
      task: 'Write `binary_search(nums, target)` that searches a sorted list `nums` and returns the index of `target`, or `-1` if not found.',
      starterCode: `def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    # Implement binary search loop\n    return -1\n\nprint(binary_search([2, 5, 8, 12, 16, 23], 12))\n`,
      tests: [
        {
          id: 'c1',
          description: 'Finds target index in sorted list',
          testCode: `assert binary_search([2, 5, 8, 12, 16, 23], 12) == 3\nassert binary_search([1, 3, 5], 1) == 0`,
        },
        {
          id: 'c2',
          description: 'Returns -1 when target is missing',
          testCode: `assert binary_search([2, 5, 8], 99) == -1`,
        },
      ],
    },
  },
  {
    id: 'systems-prog',
    title: 'Systems Programmer',
    icon: '🖥️',
    tagline: 'C/C++, Rust, memory, operating systems & networking',
    accent: '#f97316',
    skills: ['Bits & Bitwise Ops', 'Memory Management', 'OS Processes', 'Networking', 'C / Rust'],
    capstoneIdea: 'Implement a mini key-value storage engine or packet parser.',
    starterMission: {
      title: 'Bitwise Permission Flags',
      language: 'python',
      xpReward: 240,
      task: 'In OS kernels, permissions are packed into single bits: `READ = 1` (001), `WRITE = 2` (010), `EXEC = 4` (100). Write `has_permission(mask, flag)` returning `True` if `(mask & flag) != 0`.',
      starterCode: `READ = 1\nWRITE = 2\nEXEC = 4\n\ndef has_permission(mask, flag):\n    # Use bitwise AND (&) to check if flag is set in mask\n    pass\n\nuser_perms = READ | WRITE  # 3 (011)\nprint(has_permission(user_perms, WRITE))  # True\nprint(has_permission(user_perms, EXEC))   # False\n`,
      tests: [
        {
          id: 'c1',
          description: 'Correctly checks bitwise flags',
          testCode: `assert has_permission(READ | WRITE, READ) is True\nassert has_permission(READ | WRITE, EXEC) is False\nassert has_permission(7, EXEC) is True`,
        },
      ],
    },
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning Developer',
    icon: '🧠',
    tagline: 'Python, linear algebra, data pipelines, ML & AI apps',
    accent: '#ec4899',
    skills: ['Python Data Processing', 'Math & Vectors', 'ML Models', 'Neural Networks', 'AI Apps'],
    capstoneIdea: 'Build a text sentiment classifier or recommendation engine.',
    starterMission: {
      title: 'Dot Product & Perceptron Step',
      language: 'python',
      xpReward: 250,
      task: 'Write `dot_product(a, b)` that takes two equal-length lists of numbers and returns the sum of their element-wise products (`a[0]*b[0] + a[1]*b[1] + ...`).',
      starterCode: `def dot_product(a, b):\n    # Compute sum(x * y for x, y in zip(a, b))\n    pass\n\nprint(dot_product([1, 2, 3], [4, 5, 6]))  # 32\n`,
      tests: [
        {
          id: 'c1',
          description: 'Computes vector dot product accurately',
          testCode: `assert dot_product([1, 2, 3], [4, 5, 6]) == 32\nassert dot_product([0.5, 2.0], [4.0, 1.5]) == 5.0`,
        },
      ],
    },
  },
  {
    id: 'mobile-dev',
    title: 'Mobile Developer',
    icon: '📱',
    tagline: 'Responsive mobile UI, local storage, APIs & app architecture',
    accent: '#22d3ee',
    skills: ['Mobile UI Layouts', 'State Management', 'Local Storage', 'API Sync', 'App Publishing'],
    capstoneIdea: 'Build a mobile-first habit tracker app with offline persistence.',
    starterMission: {
      title: 'Mobile Badge Counter Formatter',
      language: 'javascript',
      xpReward: 210,
      task: 'Write `formatBadge(count)` in JavaScript: return `""` if `count <= 0`, `"99+"` if `count > 99`, otherwise `String(count)`.',
      starterCode: `function formatBadge(count) {\n  // Return "", "99+", or String(count)\n}\n\nconsole.log(formatBadge(0), formatBadge(12), formatBadge(150));\n`,
      tests: [
        {
          id: 'c1',
          description: 'Formats 0, normal numbers, and 99+ properly',
          testCode: `if (formatBadge(0) !== "" || formatBadge(12) !== "12" || formatBadge(150) !== "99+") throw new Error("Check edge cases 0, 12, and 150");`,
        },
      ],
    },
  },
];

export const INITIAL_SKILLS: Record<string, SkillProgress> = {
  'basics-io': { skillId: 'basics-io', name: 'Commands & Output', category: 'Foundations', mastery: 0, attempts: 0, errors: 0 },
  'binary-fundamentals': { skillId: 'binary-fundamentals', name: 'Binary & Pixels', category: 'Foundations', mastery: 0, attempts: 0, errors: 0 },
  'variables-types': { skillId: 'variables-types', name: 'Variables & Math', category: 'Core Python', mastery: 0, attempts: 0, errors: 0 },
  conditionals: { skillId: 'conditionals', name: 'Conditions & Logic', category: 'Core Python', mastery: 0, attempts: 0, errors: 0 },
  loops: { skillId: 'loops', name: 'Loops (For & While)', category: 'Core Python', mastery: 0, attempts: 0, errors: 0 },
  lists: { skillId: 'lists', name: 'Lists & Iteration', category: 'Core Python', mastery: 0, attempts: 0, errors: 0 },
  functions: { skillId: 'functions', name: 'Functions & Scope', category: 'Core Python', mastery: 0, attempts: 0, errors: 0 },
  oop: { skillId: 'oop', name: 'Classes & OOP', category: 'Architecture', mastery: 0, attempts: 0, errors: 0 },
  debugging: { skillId: 'debugging', name: 'Debugging & Testing', category: 'Engineering', mastery: 0, attempts: 0, errors: 0 },
  'data-structures': { skillId: 'data-structures', name: 'Data Structures', category: 'CS Core', mastery: 0, attempts: 0, errors: 0 },
  'web-dev': { skillId: 'web-dev', name: 'HTML, CSS & JS', category: 'Web Stack', mastery: 0, attempts: 0, errors: 0 },
  engineering: { skillId: 'engineering', name: 'Git & Clean Code', category: 'Engineering', mastery: 0, attempts: 0, errors: 0 },
  algorithms: { skillId: 'algorithms', name: 'Algorithms & Optimization', category: 'CS Core', mastery: 0, attempts: 0, errors: 0 },
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-spark', title: 'First Spark', description: 'Complete the beginner onboarding and run your first Python program.', icon: '⚡', xpBonus: 50 },
  { id: 'first-quest', title: 'Quest Initiate', description: 'Complete your first coding mission on the World Map.', icon: '🏆', xpBonus: 75 },
  { id: 'bug-squasher', title: 'Bug Squasher', description: 'Recover from an error and get your code passing tests.', icon: '🐛', xpBonus: 80 },
  { id: 'binary-master', title: 'Binary Valley Master', description: 'Complete every mission in The Binary Valley.', icon: '💾', xpBonus: 120 },
  { id: 'logic-master', title: 'Logic Forest Master', description: 'Master variables, math, and conditions in The Logic Forest.', icon: '🌲', xpBonus: 150 },
  { id: 'homework-hero', title: 'Homework Hero', description: 'Submit and pass your first independent Homework Assignment.', icon: '📚', xpBonus: 100 },
  { id: 'project-builder', title: 'Builder of Worlds', description: 'Create and submit a personal project in the Project Workshop.', icon: '🚀', xpBonus: 150 },
  { id: 'polyglot', title: 'Polyglot Explorer', description: 'Compare concepts across languages in the Language Portal.', icon: '🌍', xpBonus: 60 },
  { id: 'graduate', title: 'Code Quest Graduate', description: 'Submit your Capstone Project and earn your Developer Report.', icon: '🎓', xpBonus: 300 },
];

export const THEMES: Array<{ id: ThemeId; name: string; unlockLevel: number; preview: string }> = [
  { id: 'cyber-neon', name: 'Cyber Neon', unlockLevel: 1, preview: 'linear-gradient(135deg, #38bdf8, #a855f7)' },
  { id: 'emerald-matrix', name: 'Emerald Matrix', unlockLevel: 2, preview: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  { id: 'solar-flare', name: 'Solar Flare', unlockLevel: 3, preview: 'linear-gradient(135deg, #f97316, #eab308)' },
  { id: 'abyssal-void', name: 'Abyssal Void', unlockLevel: 4, preview: 'linear-gradient(135deg, #c084fc, #ec4899)' },
];

export const DEFAULT_STARTER_PROJECT: UserProject = {
  id: 'proj-rpg-battle',
  title: 'Mini RPG Battle Simulator',
  description: 'A starter personal project where you can expand a Python turn-based battle simulator with your own spells, items, and enemies!',
  language: 'python',
  code: `# Personal Project: Mini RPG Battle Simulator\nhero_name = "Nova"\nhero_hp = 100\nmonster_hp = 80\n\nround_num = 1\nwhile hero_hp > 0 and monster_hp > 0:\n    hero_dmg = 22\n    monster_dmg = 14\n    monster_hp = max(0, monster_hp - hero_dmg)\n    print(f"Round {round_num}: {hero_name} strikes for {hero_dmg}! Monster HP: {monster_hp}")\n    if monster_hp == 0:\n        break\n    hero_hp = max(0, hero_hp - monster_dmg)\n    print(f"Round {round_num}: Monster hits back for {monster_dmg}! {hero_name} HP: {hero_hp}")\n    round_num += 1\n\nwinner = hero_name if hero_hp > 0 else "Monster"\nprint(f"\\nVictory! Winner: {winner}")\n`,
  milestones: [
    { id: 'm1', text: 'Run the starter battle simulator and inspect the output', done: false },
    { id: 'm2', text: 'Add a critical hit or healing potion mechanic', done: false },
    { id: 'm3', text: 'Wrap the battle logic inside a reusable function', done: false },
  ],
  submitted: false,
  updatedAt: new Date().toISOString(),
};

export function getLevelFromXp(xp: number): number {
  return Math.floor(xp / 350) + 1;
}

export function getXpProgressInLevel(xp: number): { current: number; needed: number; pct: number } {
  const needed = 350;
  const current = xp % needed;
  return { current, needed, pct: Math.round((current / needed) * 100) };
}

export function getRankForLevel(level: number): RankTitle {
  if (level >= 12) return 'Master Programmer';
  if (level >= 9) return 'Full-Stack Architect';
  if (level >= 7) return 'Senior Developer';
  if (level >= 5) return 'Software Engineer';
  if (level >= 3) return 'Junior Developer';
  return 'Code Apprentice';
}
