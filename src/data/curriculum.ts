import type { Lesson, Region } from '../types/game';

export const REGIONS: Region[] = [
  {
    id: 'binary-valley',
    number: 1,
    name: 'The Binary Valley',
    subtitle: 'How Computers Think',
    description:
      'Discover how computers turn 1s and 0s into numbers, colors, and living programs — and write your very first Python commands.',
    topics: ['Computers & Instructions', 'Bits & Bytes', 'Binary Numbers', 'Pixels & Colors', 'First Python Output'],
    accentColor: '#38bdf8',
    mapX: 110,
    mapY: 430,
  },
  {
    id: 'logic-forest',
    number: 2,
    name: 'The Logic Forest',
    subtitle: 'Variables & Decisions',
    description:
      'Store data in variables, perform math, and teach your programs to make smart decisions using conditions and boolean logic.',
    topics: ['Algorithms', 'Variables & Data Types', 'Operators', 'Conditions (if/elif/else)', 'Boolean Logic'],
    accentColor: '#34d399',
    mapX: 245,
    mapY: 310,
    requiredRegionId: 'binary-valley',
  },
  {
    id: 'looping-mountains',
    number: 3,
    name: 'The Looping Mountains',
    subtitle: 'Repetition & Lists',
    description:
      'Climb the peaks of automation! Use for loops, while loops, and lists to process dozens of items in just a few lines of code.',
    topics: ['For Loops', 'While Loops', 'Lists & Indexing', 'Iterating Data', 'Nested Loops'],
    accentColor: '#a78bfa',
    mapX: 390,
    mapY: 410,
    requiredRegionId: 'logic-forest',
  },
  {
    id: 'function-kingdom',
    number: 4,
    name: 'The Function Kingdom',
    subtitle: 'Reusable Code & Scope',
    description:
      'Build reusable code machines! Master functions, parameters, return values, and clean organization.',
    topics: ['Functions', 'Parameters & Arguments', 'Return Values', 'Scope', 'Modular Design'],
    accentColor: '#f472b6',
    mapX: 520,
    mapY: 250,
    requiredRegionId: 'looping-mountains',
  },
  {
    id: 'oop-empire',
    number: 5,
    name: 'The Object-Oriented Empire',
    subtitle: 'Classes & Blueprints',
    description:
      'Forge blueprints for heroes, monsters, and real-world systems using classes, objects, methods, and inheritance.',
    topics: ['Classes & Objects', 'Constructors (__init__)', 'Methods', 'Encapsulation', 'Inheritance'],
    accentColor: '#fb923c',
    mapX: 660,
    mapY: 370,
    requiredRegionId: 'function-kingdom',
  },
  {
    id: 'debugging-dungeon',
    number: 6,
    name: 'The Debugging Dungeon',
    subtitle: 'Hunt & Squash Bugs',
    description:
      'Enter the dungeon of broken code! Learn to read stack traces, spot syntax, runtime, and logic bugs, and patch real systems.',
    topics: ['Syntax Errors', 'Runtime Errors', 'Logic Errors', 'Reading Tracebacks', 'Testing'],
    accentColor: '#f87171',
    mapX: 785,
    mapY: 240,
    requiredRegionId: 'oop-empire',
  },
  {
    id: 'data-ocean',
    number: 7,
    name: 'The Data Ocean',
    subtitle: 'Structures & Algorithms',
    description:
      'Navigate vast datasets with dictionaries, sets, stacks, queues, searching, sorting, and Big-O efficiency.',
    topics: ['Dictionaries', 'Sets', 'Stacks & Queues', 'Searching & Sorting', 'Algorithm Complexity'],
    accentColor: '#22d3ee',
    mapX: 880,
    mapY: 390,
    requiredRegionId: 'debugging-dungeon',
  },
  {
    id: 'web-kingdom',
    number: 8,
    name: 'The Web Kingdom',
    subtitle: 'HTML, CSS, JS & APIs',
    description:
      'Build real interactive web pages with HTML, CSS, and JavaScript, and understand how frontend, backend, HTTP, and JSON connect.',
    topics: ['HTML Structure', 'CSS Styling', 'JavaScript Logic', 'HTTP & JSON', 'Full-Stack Basics'],
    accentColor: '#facc15',
    mapX: 720,
    mapY: 115,
    requiredRegionId: 'data-ocean',
  },
  {
    id: 'engineering-citadel',
    number: 9,
    name: 'The Software Engineering Citadel',
    subtitle: 'Git, CLI & Clean Code',
    description:
      'Train like a professional engineer: version control with Git, terminal workflows, automated unit tests, and clean architecture.',
    topics: ['Git & GitHub', 'Command Line', 'Clean Code', 'Unit Testing', 'Security Basics'],
    accentColor: '#818cf8',
    mapX: 480,
    mapY: 105,
    requiredRegionId: 'web-kingdom',
  },
  {
    id: 'advanced-realm',
    number: 10,
    name: 'The Advanced Developer Realm',
    subtitle: 'Mastery & Architecture',
    description:
      'Conquer recursion, performance optimization, caching, design patterns, and prepare for your Capstone Graduation!',
    topics: ['Recursion & Memoization', 'Design Patterns', 'Optimization', 'Concurrency', 'CS Fundamentals'],
    accentColor: '#c084fc',
    mapX: 230,
    mapY: 120,
    requiredRegionId: 'engineering-citadel',
  },
];

export const LESSONS: Lesson[] = [
  // ==================== REGION 1: BINARY VALLEY ====================
  {
    id: 'bv-1-hello-beacon',
    regionId: 'binary-valley',
    order: 1,
    title: 'Awaken the Digital Beacon',
    subtitle: 'Your first real computer instructions',
    concept: 'Commands & Output (print)',
    skillId: 'basics-io',
    language: 'python',
    xpReward: 100,
    estimatedMinutes: 4,
    story:
      'The power beacon in Binary Valley has gone dark! Computers are super fast, but they cannot guess what you want — they only obey exact instructions called code.',
    explanation: [
      'A computer program is simply a list of step-by-step instructions written in a language the computer understands.',
      'In Python, the `print()` command tells the computer to display text on the screen.',
      'Any text you want the computer to display must be wrapped inside quotes, like `"Beacon Online"`.',
    ],
    analogy: 'Think of `print("Hello")` like speaking into a megaphone: whatever you put inside the parentheses and quotes gets broadcast to the console!',
    task: 'Use `print()` to output the exact message `Beacon Online` on the first line, and `Ready to Code` on the second line.',
    starterCode: `# Write two print() commands below to activate the beacon\nprint("Beacon Online")\n`,
    solutionCode: `print("Beacon Online")\nprint("Ready to Code")`,
    hints: [
      'The first line `print("Beacon Online")` is already done for you! Add a second `print(...)` on line 3.',
      'Make sure the capitalization matches exactly: `Ready to Code` inside double quotes.',
      'Line 3 should look like: `print("Ready to Code")`',
    ],
    conceptLearned: 'You just gave a computer exact step-by-step instructions! Programs run top-to-bottom, one line at a time.',
    tests: [
      {
        id: 't1',
        description: 'Prints "Beacon Online" on the first line',
        testCode: `lines = [l.strip() for l in __CQ_STDOUT__.strip().splitlines()]\nassert len(lines) >= 1 and lines[0] == "Beacon Online", f"Expected first line 'Beacon Online', got {lines[0] if lines else 'nothing'}"`,
      },
      {
        id: 't2',
        description: 'Prints "Ready to Code" on the second line',
        testCode: `lines = [l.strip() for l in __CQ_STDOUT__.strip().splitlines()]\nassert len(lines) >= 2 and lines[1] == "Ready to Code", f"Expected second line 'Ready to Code', got {lines[1] if len(lines) > 1 else 'only 1 line'}"`,
      },
    ],
  },
  {
    id: 'bv-2-binary-bits',
    regionId: 'binary-valley',
    order: 2,
    title: 'Decoding Bits & Bytes',
    subtitle: 'How computers store numbers using only 0s and 1s',
    concept: 'Binary Numbers & Bits',
    skillId: 'binary-fundamentals',
    language: 'python',
    xpReward: 120,
    estimatedMinutes: 6,
    interactiveWidget: 'binary-explorer',
    story:
      'Deep inside your CPU, there are billions of tiny switches. Each switch can only be OFF (`0`) or ON (`1`). That single switch is called a **bit**, and 8 bits make a **byte**!',
    explanation: [
      'Humans count in Base-10 (0 through 9). Computers count in Base-2 (**binary**), using only `0` and `1`.',
      'Try toggling the 8 switches in the Interactive Bit Explorer below to see how binary builds any number from 0 to 255!',
      'In Python, you can convert a normal number into binary using `bin(number)`, or convert a binary string like `"1010"` back to a number using `int("1010", 2)`.',
    ],
    analogy: 'Think of binary like a row of lightbulbs worth 8, 4, 2, and 1. Turning on the 8-bulb and 2-bulb (`1010`) adds up to 10!',
    task: 'Create a variable `secret_number` by converting the binary string `"101010"` into a decimal integer using `int("101010", 2)`, then print `secret_number`.',
    starterCode: `# Convert the binary code "101010" into a normal decimal number\nsecret_number = \nprint(secret_number)\n`,
    solutionCode: `secret_number = int("101010", 2)\nprint(secret_number)`,
    hints: [
      'In Python, `int("1010", 2)` converts the binary string `"1010"` into the integer `10`.',
      'Replace the blank after `secret_number = ` with `int("101010", 2)`.',
      'Your finished line should be `secret_number = int("101010", 2)` — it equals 42!',
    ],
    conceptLearned: 'Every number, letter, and instruction inside a computer is ultimately stored as patterns of 0s and 1s (bits).',
    tests: [
      {
        id: 't1',
        description: 'secret_number holds the decoded value 42',
        testCode: `assert 'secret_number' in locals(), "Make sure you create the variable named secret_number"\nassert secret_number == 42, f"Expected 42, got {secret_number}"`,
      },
      {
        id: 't2',
        description: 'Prints 42 to the console',
        testCode: `assert "42" in __CQ_STDOUT__, "Make sure you print(secret_number)!"`,
      },
    ],
  },
  {
    id: 'bv-3-pixels-rgb',
    regionId: 'binary-valley',
    order: 3,
    title: 'Painting with Pixels (RGB)',
    subtitle: 'How screens turn numbers into glowing colors',
    concept: 'Pixels & Data Representation',
    skillId: 'binary-fundamentals',
    language: 'python',
    xpReward: 130,
    estimatedMinutes: 6,
    interactiveWidget: 'pixel-mixer',
    story:
      'Your screen is a grid of millions of tiny glowing dots called **pixels**. Every pixel is just three numbers: **Red, Green, and Blue (RGB)** — each from `0` (off) to `255` (max brightness)!',
    explanation: [
      'Because 1 byte (8 bits) holds numbers from `0` to `255`, each color channel (Red, Green, Blue) fits neatly inside a single byte!',
      'Play with the Interactive RGB Pixel Mixer below to see how mixing Red, Green, and Blue creates any color.',
      'In Python, we can store a pixel color in three variables: `red`, `green`, and `blue`.',
    ],
    task: 'Create three variables: `red = 56`, `green = 189`, `blue = 248` (Code Quest Neon Cyan!), then print the total brightness sum `red + green + blue`.',
    starterCode: `# Define the Neon Cyan pixel channels\nred = 56\ngreen = \nblue = \n\n# Print the sum of red + green + blue\n`,
    solutionCode: `red = 56\ngreen = 189\nblue = 248\nprint(red + green + blue)`,
    hints: [
      'Set `green = 189` and `blue = 248`.',
      'Use `print(red + green + blue)` on the last line to display their sum.',
    ],
    conceptLearned: 'Images, photos, and video games are all built from numbers! Each pixel is simply 3 bytes representing Red, Green, and Blue.',
    tests: [
      {
        id: 't1',
        description: 'red, green, and blue variables have the correct RGB values',
        testCode: `assert red == 56 and green == 189 and blue == 248, "Check your RGB numbers: red=56, green=189, blue=248"`,
      },
      {
        id: 't2',
        description: 'Prints the combined brightness sum (493)',
        testCode: `assert "493" in __CQ_STDOUT__, f"Expected output to include 493, got: {__CQ_STDOUT__!r}"`,
      },
    ],
  },

  // ==================== REGION 2: LOGIC FOREST ====================
  {
    id: 'lf-1-variables-hero',
    regionId: 'logic-forest',
    order: 1,
    title: 'Forging Your Hero Stats',
    subtitle: 'Variables, Strings, Integers & Booleans',
    concept: 'Variables & Data Types',
    skillId: 'variables-types',
    language: 'python',
    xpReward: 130,
    estimatedMinutes: 6,
    story:
      'Welcome to the Logic Forest! To survive here, your program must remember information — your hero’s name, health points, and whether your shield is active.',
    explanation: [
      'A **variable** is a labeled container that stores a value in memory: `health = 100`.',
      'Values have **data types**:\n- **String (`str`)**: text in quotes, e.g. `"Nova"`\n- **Integer (`int`)**: whole numbers, e.g. `100`\n- **Float (`float`)**: decimal numbers, e.g. `9.5`\n- **Boolean (`bool`)**: `True` or `False`',
      'Use an **f-string** like `f"Hero: {hero_name}"` to cleanly insert variables into text!',
    ],
    analogy: 'Variables are like labeled inventory slots in an RPG. The slot name stays the same, while the value inside can change as you play.',
    task: 'Create three variables: `hero_name` (any non-empty string), `level = 1`, and `has_shield = True`. Then print an f-string: `f"{hero_name} is level {level}"`.',
    starterCode: `# Create your hero's starting variables\nhero_name = "Nova"\nlevel = \nhas_shield = \n\n# Print the hero status message using an f-string\n`,
    solutionCode: `hero_name = "Nova"\nlevel = 1\nhas_shield = True\nprint(f"{hero_name} is level {level}")`,
    hints: [
      'Set `level = 1` (no quotes — it is a number) and `has_shield = True` (capital T, no quotes).',
      'Print using an f-string: `print(f"{hero_name} is level {level}")`.',
    ],
    conceptLearned: 'Variables store data in memory, and data types tell Python whether something is text, a number, or a True/False flag.',
    tests: [
      {
        id: 't1',
        description: 'hero_name is a non-empty string',
        testCode: `assert isinstance(hero_name, str) and len(hero_name.strip()) > 0, "hero_name should be a non-empty text string"`,
      },
      {
        id: 't2',
        description: 'level is integer 1 and has_shield is boolean True',
        testCode: `assert level == 1 and type(level) is int, "level must be the integer 1"\nassert has_shield is True, "has_shield must be the boolean True (capital T, no quotes)"`,
      },
      {
        id: 't3',
        description: 'Prints "<hero_name> is level 1"',
        testCode: `expected = f"{hero_name} is level {level}"\nassert expected in __CQ_STDOUT__, f"Expected '{expected}' in output, got: {__CQ_STDOUT__!r}"`,
      },
    ],
  },
  {
    id: 'lf-2-score-calculator',
    regionId: 'logic-forest',
    order: 2,
    title: 'The Score Multiplier Engine',
    subtitle: 'Math Operators & Expressions',
    concept: 'Operators & Calculations',
    skillId: 'variables-types',
    language: 'python',
    xpReward: 140,
    estimatedMinutes: 6,
    story:
      'Every game needs a scoring engine! You defeated 3 cyber-slimes and collected 15 energy gems, and your combo multiplier doubles the total.',
    explanation: [
      'Python is a super-powered calculator: `+` (add), `-` (subtract), `*` (multiply), `/` (divide), `//` (whole-number divide), `%` (remainder).',
      'Just like in math, parentheses `( )` control which calculation happens first!',
    ],
    task: 'Given `slimes = 3` (worth 50 points each) and `gems = 15` (worth 10 points each), calculate `base_score = slimes * 50 + gems * 10`, then calculate `final_score = base_score * 2`, and print `final_score`.',
    starterCode: `slimes = 3\ngems = 15\n\n# 1. Calculate base_score\nbase_score = \n\n# 2. Double it for final_score\nfinal_score = \n\n# 3. Print final_score\n`,
    solutionCode: `slimes = 3\ngems = 15\nbase_score = slimes * 50 + gems * 10\nfinal_score = base_score * 2\nprint(final_score)`,
    hints: [
      'Multiply `slimes * 50` and add `gems * 10` to get `base_score` (300).',
      'Then set `final_score = base_score * 2` (600) and `print(final_score)`.',
    ],
    conceptLearned: 'Expressions combine variables and operators to compute new values dynamically.',
    tests: [
      {
        id: 't1',
        description: 'base_score equals 300',
        testCode: `assert base_score == 300, f"Expected base_score to be 300, got {base_score}"`,
      },
      {
        id: 't2',
        description: 'final_score equals 600 and is printed',
        testCode: `assert final_score == 600, f"Expected final_score to be 600, got {final_score}"\nassert "600" in __CQ_STDOUT__, "Make sure to print(final_score)"`,
      },
    ],
  },
  {
    id: 'lf-3-password-gate',
    regionId: 'logic-forest',
    order: 3,
    title: 'The Citadel Password Gate',
    subtitle: 'Making Decisions with if / elif / else',
    concept: 'Conditions & Boolean Logic',
    skillId: 'conditionals',
    language: 'python',
    xpReward: 160,
    estimatedMinutes: 8,
    story:
      'A glowing energy gate blocks the path out of Logic Forest. Program the gate’s security checker so it evaluates password strength!',
    explanation: [
      '`if`, `elif`, and `else` let your code choose different paths based on whether a condition is `True` or `False`.',
      'Comparison operators: `==` (equals), `!=` (not equals), `>` (greater), `<` (less), `>=` (greater or equal).',
      'Use `len(text)` to check how many characters are in a string, and `and` / `or` to combine conditions.',
    ],
    analogy: 'An `if/else` statement is a bouncer at a futuristic club checking your badge before deciding whether to open the gate.',
    task: 'Write a function `check_password(password)` (we started it for you!) that returns:\n- `"Strong"` if `len(password) >= 8`\n- `"Medium"` if `len(password) >= 5`\n- `"Weak"` otherwise.',
    starterCode: `def check_password(password):\n    # Check the length of password using len(password)\n    if len(password) >= 8:\n        return "Strong"\n    # Add elif for >= 5 returning "Medium", and else returning "Weak"\n\nprint(check_password("cyberquest99"))\nprint(check_password("hello"))\nprint(check_password("123"))\n`,
    solutionCode: `def check_password(password):\n    if len(password) >= 8:\n        return "Strong"\n    elif len(password) >= 5:\n        return "Medium"\n    else:\n        return "Weak"\n\nprint(check_password("cyberquest99"))\nprint(check_password("hello"))\nprint(check_password("123"))`,
    hints: [
      'Right below `return "Strong"`, line up `elif len(password) >= 5:` with `if`.',
      'Indent `return "Medium"` by 4 spaces inside the `elif`.',
      'Finally add `else:` followed by an indented `return "Weak"`.',
    ],
    conceptLearned: 'Conditional branching (`if/elif/else`) gives programs intelligence to react differently to different inputs!',
    tests: [
      {
        id: 't1',
        description: 'Returns "Strong" for passwords with 8+ characters',
        testCode: `assert check_password("cyberquest99") == "Strong"\nassert check_password("12345678") == "Strong"`,
      },
      {
        id: 't2',
        description: 'Returns "Medium" for passwords with 5–7 characters',
        testCode: `assert check_password("hello") == "Medium"\nassert check_password("abcdefg") == "Medium"`,
      },
      {
        id: 't3',
        description: 'Returns "Weak" for short passwords (hidden edge case)',
        hidden: true,
        testCode: `assert check_password("abc") == "Weak"\nassert check_password("") == "Weak"`,
      },
    ],
  },

  // ==================== REGION 3: LOOPING MOUNTAINS ====================
  {
    id: 'lm-1-robot-march',
    regionId: 'looping-mountains',
    order: 1,
    title: 'March of the Mountain Drone',
    subtitle: 'Repeating actions automatically with for loops',
    concept: 'For Loops & range()',
    skillId: 'loops',
    language: 'python',
    xpReward: 150,
    estimatedMinutes: 6,
    story:
      'Your scout drone needs to take 5 steps up the mountain trail and report each step number. Don’t copy-paste `print()` 5 times — use a loop!',
    explanation: [
      'A `for` loop repeats a block of code automatically.',
      '`range(1, 6)` generates the numbers `1, 2, 3, 4, 5` (note: the second number `6` is where it stops, so it is NOT included).',
      'Every line indented inside the `for` loop runs once per number.',
    ],
    analogy: 'A loop is like a music playlist on repeat — you write the instructions once and tell Python how many times to play them.',
    task: 'Use a `for` loop with `range(1, 6)` to print:\n`Step 1`\n`Step 2`\n`Step 3`\n`Step 4`\n`Step 5`',
    starterCode: `# Use a for loop to print Step 1 through Step 5\nfor step in range(1, 6):\n    # print each step below\n    \n`,
    solutionCode: `for step in range(1, 6):\n    print(f"Step {step}")`,
    hints: [
      'Inside the loop (indented 4 spaces), use `print(f"Step {step}")`.',
      'Remember `range(1, 6)` produces 1, 2, 3, 4, 5.',
    ],
    conceptLearned: 'Loops eliminate repetitive code and let computers handle thousands of steps effortlessly.',
    tests: [
      {
        id: 't1',
        description: 'Prints Step 1 through Step 5 in order',
        testCode: `lines = [l.strip() for l in __CQ_STDOUT__.strip().splitlines()]\nassert lines == ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"], f"Got: {lines}"`,
      },
      {
        id: 't2',
        description: 'Uses a for loop (not hardcoded prints)',
        hidden: true,
        testCode: `assert "for " in __CQ_CODE__, "Make sure you use a for loop!"`,
      },
    ],
  },
  {
    id: 'lm-2-inventory-list',
    regionId: 'looping-mountains',
    order: 2,
    title: 'The Backpack Inventory',
    subtitle: 'Storing & Looping Through Lists',
    concept: 'Lists & Iteration',
    skillId: 'lists',
    language: 'python',
    xpReward: 160,
    estimatedMinutes: 7,
    story:
      'Your hero’s backpack holds multiple items. Instead of creating 20 separate variables, programmers store collections inside a **list**.',
    explanation: [
      'A list holds multiple values in order inside square brackets: `items = ["Sword", "Potion", "Shield"]`.',
      'Add an item to the end with `items.append("Torch")`.',
      'Loop over every item directly with `for item in items:`.',
    ],
    task: '1. Start with `inventory = ["Laser Blade", "Health Potion"]`.\n2. Append `"Grappling Hook"` to `inventory`.\n3. Loop through `inventory` and calculate `total_items` (or print each item prefixed with `Item: `). Print each item as `Item: <name>`.',
    starterCode: `inventory = ["Laser Blade", "Health Potion"]\n\n# 1. Add "Grappling Hook" to inventory using .append()\n\n# 2. Loop through inventory and print "Item: <name>" for each\n`,
    solutionCode: `inventory = ["Laser Blade", "Health Potion"]\ninventory.append("Grappling Hook")\nfor item in inventory:\n    print(f"Item: {item}")`,
    hints: [
      'Use `inventory.append("Grappling Hook")` to add the 3rd item.',
      'Loop with `for item in inventory:` and inside print `f"Item: {item}"`.',
    ],
    conceptLearned: 'Lists let you store, grow, and iterate over collections of any size.',
    tests: [
      {
        id: 't1',
        description: 'inventory contains all 3 items including "Grappling Hook"',
        testCode: `assert inventory == ["Laser Blade", "Health Potion", "Grappling Hook"], f"Got inventory: {inventory}"`,
      },
      {
        id: 't2',
        description: 'Prints each item with "Item: " prefix',
        testCode: `lines = [l.strip() for l in __CQ_STDOUT__.strip().splitlines()]\nassert lines == ["Item: Laser Blade", "Item: Health Potion", "Item: Grappling Hook"], f"Got output lines: {lines}"`,
      },
    ],
  },
  {
    id: 'lm-3-energy-while',
    regionId: 'looping-mountains',
    order: 3,
    title: 'Charging the Summit Core',
    subtitle: 'Repeating until a goal is reached with while loops',
    concept: 'While Loops & Accumulators',
    skillId: 'loops',
    language: 'python',
    xpReward: 170,
    estimatedMinutes: 7,
    story:
      'A frozen relay tower at the mountain summit has `energy = 0`. Each pulse adds `25` energy. Keep pulsing *while* energy is below `100`!',
    explanation: [
      'A `while` loop keeps running **as long as** its condition is `True`.',
      'CRITICAL RULE: Always make sure something inside the loop changes so the condition eventually becomes `False` — otherwise you get an **infinite loop**!',
    ],
    task: 'Start with `energy = 0` and `pulses = 0`. Write a `while energy < 100:` loop that adds `25` to `energy` and adds `1` to `pulses` each time. After the loop, print `f"Charged in {pulses} pulses!"`.',
    starterCode: `energy = 0\npulses = 0\n\n# Write a while loop while energy < 100\n\n\nprint(f"Charged in {pulses} pulses!")\n`,
    solutionCode: `energy = 0\npulses = 0\nwhile energy < 100:\n    energy += 25\n    pulses += 1\nprint(f"Charged in {pulses} pulses!")`,
    hints: [
      'Start the loop with `while energy < 100:`',
      'Inside the loop (indented 4 spaces): `energy += 25` and `pulses += 1`.',
    ],
    conceptLearned: '`while` loops are ideal when you want to repeat until a condition is met (like a game loop or charging bar).',
    tests: [
      {
        id: 't1',
        description: 'energy reaches 100 and pulses equals 4',
        testCode: `assert energy == 100, f"Expected energy == 100, got {energy}"\nassert pulses == 4, f"Expected pulses == 4, got {pulses}"`,
      },
      {
        id: 't2',
        description: 'Prints "Charged in 4 pulses!"',
        testCode: `assert "Charged in 4 pulses!" in __CQ_STDOUT__`,
      },
    ],
  },

  // ==================== REGION 4: FUNCTION KINGDOM ====================
  {
    id: 'fk-1-damage-calc',
    regionId: 'function-kingdom',
    order: 1,
    title: 'The Royal Damage Calculator',
    subtitle: 'Creating Functions with Parameters & Return',
    concept: 'Functions & Return Values',
    skillId: 'functions',
    language: 'python',
    xpReward: 180,
    estimatedMinutes: 8,
    story:
      'In the Function Kingdom, knights never repeat formulas by hand. Build a reusable `calculate_damage(attack, defense)` function for the arena!',
    explanation: [
      'Define a function with `def function_name(param1, param2):`.',
      'Use `return` to send a calculated answer back to whoever called the function.',
      'Remember: `print()` shows text on screen, while `return` hands back a usable value!',
    ],
    analogy: 'A function is like a vending machine: you put coins in (parameters), it runs its internal steps, and hands you a snack (return value).',
    task: 'Write a function `calculate_damage(attack, defense)` that computes `attack - defense`. If the result is less than `0`, return `0` (so attacks never heal the enemy!). Otherwise return the damage.',
    starterCode: `def calculate_damage(attack, defense):\n    # Compute damage and ensure it is never negative\n    pass\n\nprint(calculate_damage(50, 20))\nprint(calculate_damage(10, 30))\n`,
    solutionCode: `def calculate_damage(attack, defense):\n    damage = attack - defense\n    if damage < 0:\n        return 0\n    return damage\n\nprint(calculate_damage(50, 20))\nprint(calculate_damage(10, 30))`,
    hints: [
      'Replace `pass` with `damage = attack - defense`.',
      'Check `if damage < 0: return 0`, otherwise `return damage` (or use `return max(0, attack - defense)`!).',
    ],
    conceptLearned: 'Functions bundle logic into named, testable, reusable building blocks.',
    tests: [
      {
        id: 't1',
        description: 'calculate_damage(50, 20) returns 30',
        testCode: `assert calculate_damage(50, 20) == 30, f"Expected 30, got {calculate_damage(50, 20)}"`,
      },
      {
        id: 't2',
        description: 'calculate_damage(10, 30) returns 0 (never negative)',
        testCode: `assert calculate_damage(10, 30) == 0, f"Expected 0 when defense > attack, got {calculate_damage(10, 30)}"`,
      },
      {
        id: 't3',
        description: 'Handles equal attack and defense (hidden)',
        hidden: true,
        testCode: `assert calculate_damage(25, 25) == 0`,
      },
    ],
  },
  {
    id: 'fk-2-shopping-cart',
    regionId: 'function-kingdom',
    order: 2,
    title: 'The Kingdom Cart Totalizer',
    subtitle: 'Combining Functions, Lists & Loops',
    concept: 'Reusable Functions with Collections',
    skillId: 'functions',
    language: 'python',
    xpReward: 190,
    estimatedMinutes: 8,
    story:
      'Merchants in the Function Kingdom need a reliable checkout function that totals any list of item prices and applies a discount when the cart is large.',
    explanation: [
      'Functions can accept lists as parameters!',
      'Inside the function, you can loop over the list or use Python’s built-in `sum(prices)`.',
    ],
    task: 'Write a function `cart_total(prices)` that sums all numbers in `prices`. If the total is `>= 100`, apply a 10% discount (`total * 0.9`). Return the final total.',
    starterCode: `def cart_total(prices):\n    # Sum prices, apply 10% discount if total >= 100, and return\n    pass\n\nprint(cart_total([20, 30]))\nprint(cart_total([60, 50]))\n`,
    solutionCode: `def cart_total(prices):\n    total = sum(prices)\n    if total >= 100:\n        return total * 0.9\n    return total\n\nprint(cart_total([20, 30]))\nprint(cart_total([60, 50]))`,
    hints: [
      'Start with `total = sum(prices)`.',
      'If `total >= 100`, return `total * 0.9`, else return `total`.',
    ],
    conceptLearned: 'Combining functions, lists, and conditions lets you solve real business logic cleanly.',
    tests: [
      {
        id: 't1',
        description: 'cart_total([20, 30]) returns 50 (no discount)',
        testCode: `assert cart_total([20, 30]) == 50`,
      },
      {
        id: 't2',
        description: 'cart_total([60, 50]) returns 99.0 (10% discount applied)',
        testCode: `assert abs(cart_total([60, 50]) - 99.0) < 1e-6`,
      },
      {
        id: 't3',
        description: 'Handles empty cart [] returning 0 (hidden)',
        hidden: true,
        testCode: `assert cart_total([]) == 0`,
      },
    ],
  },

  // ==================== REGION 5: OOP EMPIRE ====================
  {
    id: 'oop-1-hero-class',
    regionId: 'oop-empire',
    order: 1,
    title: 'Blueprint of a Champion',
    subtitle: 'Classes, Constructors & Methods',
    concept: 'Object-Oriented Programming (Classes)',
    skillId: 'oop',
    language: 'python',
    xpReward: 220,
    estimatedMinutes: 10,
    story:
      'In the Object-Oriented Empire, instead of juggling loose variables for every character, you forge a **Class** — a reusable blueprint that bundles data and actions together.',
    explanation: [
      'A `class` defines a new custom type (like `Hero`).',
      '`def __init__(self, name, hp):` is the **constructor** that runs whenever you create a new hero (`Hero("Aria", 100)`).',
      '**Methods** are functions inside a class that use `self` to read or update that object’s own attributes.',
    ],
    task: 'Create a `Hero` class with:\n1. `__init__(self, name, hp)` storing `self.name` and `self.hp`\n2. A method `take_damage(self, amount)` that subtracts `amount` from `self.hp` (never going below `0`)\n3. A method `is_alive(self)` returning `True` if `self.hp > 0`, else `False`.',
    starterCode: `class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\n    def take_damage(self, amount):\n        # Subtract amount from self.hp, clamping at 0\n        pass\n\n    def is_alive(self):\n        # Return True if self.hp > 0, else False\n        pass\n\nh = Hero("Aria", 50)\nh.take_damage(20)\nprint(h.name, h.hp, h.is_alive())\n`,
    solutionCode: `class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\n    def take_damage(self, amount):\n        self.hp = max(0, self.hp - amount)\n\n    def is_alive(self):\n        return self.hp > 0\n\nh = Hero("Aria", 50)\nh.take_damage(20)\nprint(h.name, h.hp, h.is_alive())`,
    hints: [
      'In `take_damage`, update `self.hp = max(0, self.hp - amount)`.',
      'In `is_alive`, simply `return self.hp > 0`.',
    ],
    conceptLearned: 'Classes let you model complex game entities and real-world systems cleanly with encapsulated state and behavior.',
    tests: [
      {
        id: 't1',
        description: 'Hero initializes name and hp properly',
        testCode: `x = Hero("Zed", 100)\nassert x.name == "Zed" and x.hp == 100`,
      },
      {
        id: 't2',
        description: 'take_damage reduces hp and clamps at 0',
        testCode: `x = Hero("Zed", 40)\nx.take_damage(15)\nassert x.hp == 25 and x.is_alive() is True\nx.take_damage(100)\nassert x.hp == 0 and x.is_alive() is False`,
      },
    ],
  },

  // ==================== REGION 6: DEBUGGING DUNGEON ====================
  {
    id: 'dbg-1-broken-shop',
    regionId: 'debugging-dungeon',
    order: 1,
    title: 'Incident #404: The Broken Checkout',
    subtitle: 'Find & Fix Syntax, Runtime, and Logic Bugs',
    concept: 'Debugging & Error Analysis',
    skillId: 'debugging',
    language: 'python',
    xpReward: 230,
    estimatedMinutes: 9,
    story:
      'ALERT! After a late-night update, the kingdom’s average-score calculator crashed in production. Inspect the broken code below, read the error messages, and patch all 3 bugs!',
    explanation: [
      'Real developers spend huge amounts of time debugging — finding bugs is a core skill, never a failure!',
      'There are 3 classic bug families:\n1. **Syntax Error**: broken grammar (missing colon, quote, parenthesis).\n2. **Runtime Error**: crashes while running (e.g., dividing by 0 on an empty list).\n3. **Logic Error**: runs without crashing, but computes the wrong answer!',
    ],
    task: 'Fix the buggy `average_score(scores)` function so:\n1. It has no syntax errors.\n2. It returns `0` if `scores` is empty (no `ZeroDivisionError`!).\n3. It returns the true average `sum(scores) / len(scores)` (not dividing by `len(scores) + 1`!).',
    starterCode: `# BUGGY CODE — Find and fix all 3 bugs!\ndef average_score(scores)\n    if len(scores) == 0:\n        return 0\n    total = 0\n    for s in scores:\n        total += s\n    return total / (len(scores) + 1)\n\nprint(average_score([80, 90, 100]))\nprint(average_score([]))\n`,
    solutionCode: `def average_score(scores):\n    if len(scores) == 0:\n        return 0\n    total = 0\n    for s in scores:\n        total += s\n    return total / len(scores)\n\nprint(average_score([80, 90, 100]))\nprint(average_score([]))`,
    hints: [
      'Bug 1 (SyntaxError): Look at the end of line 2 (`def average_score(scores)`). What is missing?',
      'Bug 2 (Logic Error): Look at the return line — why is it adding `+ 1` to `len(scores)`?',
      'Remove `+ 1` so it divides by `len(scores)`!',
    ],
    conceptLearned: 'Reading tracebacks calmly and checking edge cases (like empty lists) turns crashes into quick fixes.',
    tests: [
      {
        id: 't1',
        description: 'average_score([80, 90, 100]) returns 90.0',
        testCode: `assert abs(average_score([80, 90, 100]) - 90.0) < 1e-6`,
      },
      {
        id: 't2',
        description: 'average_score([]) safely returns 0 without crashing',
        testCode: `assert average_score([]) == 0`,
      },
    ],
  },

  // ==================== REGION 7: DATA OCEAN ====================
  {
    id: 'do-1-dict-counter',
    regionId: 'data-ocean',
    order: 1,
    title: 'Treasure Map Frequency Counter',
    subtitle: 'Dictionaries & Fast O(1) Lookups',
    concept: 'Dictionaries & Hash Maps',
    skillId: 'data-structures',
    language: 'python',
    xpReward: 240,
    estimatedMinutes: 9,
    story:
      'You discovered a sunken chest full of glowing runes! Use a **dictionary** (`dict`) to count how many of each rune you found in a single fast pass.',
    explanation: [
      'A **dictionary** stores `key: value` pairs, like `{"fire": 3, "ice": 2}`.',
      'Looking up a key in a dictionary takes **O(1)** constant time — instant even with a million entries!',
      'Use `counts.get(item, 0) + 1` to safely increment a count.',
    ],
    task: 'Write a function `count_items(items)` that takes a list of strings and returns a dictionary mapping each unique string to how many times it appeared.',
    starterCode: `def count_items(items):\n    counts = {}\n    # Loop over items and count each one in the counts dictionary\n    \n    return counts\n\nprint(count_items(["fire", "ice", "fire", "wind", "fire"]))\n`,
    solutionCode: `def count_items(items):\n    counts = {}\n    for item in items:\n        counts[item] = counts.get(item, 0) + 1\n    return counts\n\nprint(count_items(["fire", "ice", "fire", "wind", "fire"]))`,
    hints: [
      'Loop with `for item in items:`.',
      'Inside the loop: `counts[item] = counts.get(item, 0) + 1`.',
    ],
    conceptLearned: 'Dictionaries (hash maps) are one of the most powerful data structures in computer science for counting, indexing, and caching.',
    tests: [
      {
        id: 't1',
        description: 'Counts duplicate runes accurately',
        testCode: `assert count_items(["fire", "ice", "fire", "wind", "fire"]) == {"fire": 3, "ice": 1, "wind": 1}`,
      },
      {
        id: 't2',
        description: 'Returns empty dict for empty list (hidden)',
        hidden: true,
        testCode: `assert count_items([]) == {}`,
      },
    ],
  },

  // ==================== REGION 8: WEB KINGDOM ====================
  {
    id: 'wk-1-hero-card-html',
    regionId: 'web-kingdom',
    order: 1,
    title: 'Build Your Live Web Hero Card',
    subtitle: 'HTML Structure & CSS Styling with Live Preview',
    concept: 'HTML & CSS Fundamentals',
    skillId: 'web-dev',
    language: 'html',
    xpReward: 240,
    estimatedMinutes: 10,
    story:
      'Every website on Earth is built from **HTML** (structure), **CSS** (visual style), and **JavaScript** (interactivity). Craft your first live-rendered Hero Profile Card right here!',
    explanation: [
      '**HTML** uses tags like `<h1>`, `<p>`, and `<button>` to define the content of a page.',
      '**CSS** inside `<style>` controls colors, fonts, borders, and layout.',
      'Watch the Live Browser Preview update instantly when you click **Run Code**!',
    ],
    task: 'Create an HTML page containing:\n1. An `<h1>` tag with your hero title\n2. A `<p>` tag describing your quest\n3. A `<button>` tag (for example, `Start Quest`)\n4. A `<style>` block styling the card.',
    starterCode: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body {\n      background: #0b1120;\n      color: #e2e8f0;\n      font-family: sans-serif;\n      display: flex;\n      justify-content: center;\n      padding: 24px;\n    }\n    .card {\n      background: #1e293b;\n      border: 1px solid #38bdf8;\n      border-radius: 14px;\n      padding: 24px;\n      max-width: 340px;\n    }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <!-- Add an <h1>, a <p>, and a <button> below -->\n    <h1>Cyber Apprentice</h1>\n  </div>\n</body>\n</html>`,
    solutionCode: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { background: #0b1120; color: #e2e8f0; font-family: sans-serif; display: flex; justify-content: center; padding: 24px; }\n    .card { background: #1e293b; border: 1px solid #38bdf8; border-radius: 14px; padding: 24px; max-width: 340px; }\n    button { background: #38bdf8; color: #0b1120; border: none; padding: 10px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <h1>Cyber Apprentice</h1>\n    <p>Building the future one line of code at a time.</p>\n    <button>Start Quest</button>\n  </div>\n</body>\n</html>`,
    hints: [
      'Inside `<div class="card">`, add `<p>Your bio here</p>` right under the `<h1>`.',
      'Add `<button>Start Quest</button>` below the paragraph!',
    ],
    conceptLearned: 'HTML defines semantic page structure while CSS brings visual design to life in the browser.',
    tests: [
      {
        id: 't1',
        description: 'Contains a non-empty <h1> heading',
        testCode: `const h1 = doc.querySelector('h1'); if (!h1 || !h1.textContent.trim()) throw new Error('Add a non-empty <h1> tag!');`,
      },
      {
        id: 't2',
        description: 'Contains a <p> description paragraph',
        testCode: `const p = doc.querySelector('p'); if (!p || !p.textContent.trim()) throw new Error('Add a <p> paragraph inside your card!');`,
      },
      {
        id: 't3',
        description: 'Contains a <button> element',
        testCode: `const btn = doc.querySelector('button'); if (!btn || !btn.textContent.trim()) throw new Error('Add a <button> element!');`,
      },
    ],
  },

  // ==================== REGION 9: ENGINEERING CITADEL ====================
  {
    id: 'ec-1-unit-testing',
    regionId: 'engineering-citadel',
    order: 1,
    title: 'Git & Automated Unit Testing',
    subtitle: 'Write Clean Code + Automated Tests Like a Pro',
    concept: 'Software Engineering & Testing',
    skillId: 'engineering',
    language: 'python',
    xpReward: 260,
    estimatedMinutes: 10,
    interactiveWidget: 'git-sim',
    story:
      'At the Software Engineering Citadel, code is never shipped without **version control (Git)** and **automated tests**. Try the interactive Git workflow simulator below, then implement a clean, tested email validator!',
    explanation: [
      'Professional teams use **Git** (`git status`, `git add`, `git commit`, `git push`) to track every change safely.',
      'They also write **unit tests** using `assert` so bugs are caught automatically before users ever see them.',
    ],
    task: 'Write a clean function `is_valid_email(email)` that returns `True` only if:\n1. `email` is a string containing `"@"`\n2. There is at least 1 character before `"@"`\n3. The part after `"@"` contains a `"."` and no spaces.',
    starterCode: `def is_valid_email(email):\n    # Return True if email is valid, False otherwise\n    pass\n\n# Your own unit tests:\nassert is_valid_email("hero@codequest.dev") is True\nassert is_valid_email("invalid-email") is False\nprint("All local tests passed!")\n`,
    solutionCode: `def is_valid_email(email):\n    if not isinstance(email, str) or " " in email:\n        return False\n    parts = email.split("@")\n    if len(parts) != 2:\n        return False\n    user, domain = parts\n    return len(user) > 0 and "." in domain and not domain.startswith(".") and not domain.endswith(".")\n\nassert is_valid_email("hero@codequest.dev") is True\nassert is_valid_email("invalid-email") is False\nprint("All local tests passed!")`,
    hints: [
      'Check `" " not in email` and split on `"@"` with `parts = email.split("@")`.',
      'Make sure `len(parts) == 2`, `len(parts[0]) > 0`, and `"." in parts[1]`.',
    ],
    conceptLearned: 'Clean edge-case validation paired with automated assertions is the backbone of reliable software engineering.',
    tests: [
      {
        id: 't1',
        description: 'Accepts valid emails like "hero@codequest.dev"',
        testCode: `assert is_valid_email("hero@codequest.dev") is True\nassert is_valid_email("a@b.co") is True`,
      },
      {
        id: 't2',
        description: 'Rejects invalid emails (missing @, spaces, missing domain dot)',
        testCode: `assert is_valid_email("no-at-sign.com") is False\nassert is_valid_email("@missinguser.com") is False\nassert is_valid_email("user@nodot") is False\nassert is_valid_email("bad space@site.com") is False`,
      },
    ],
  },

  // ==================== REGION 10: ADVANCED REALM ====================
  {
    id: 'ar-1-memoized-fib',
    regionId: 'advanced-realm',
    order: 1,
    title: 'Mastering Recursion & Optimization',
    subtitle: 'Dynamic Programming & Memoization',
    concept: 'Algorithms & Performance Optimization',
    skillId: 'algorithms',
    language: 'python',
    xpReward: 320,
    estimatedMinutes: 12,
    story:
      'Welcome to the Advanced Developer Realm! Naive recursion can take *centuries* on large inputs — but adding a simple cache (**memoization**) makes it finish in under a millisecond!',
    explanation: [
      'The Fibonacci sequence is `0, 1, 1, 2, 3, 5, 8, 13...` where each number is the sum of the two before it.',
      'By storing already-computed answers in a dictionary (or computing iteratively in O(n) time), you avoid repeating millions of calculations.',
    ],
    task: 'Write a fast function `fast_fib(n)` that returns the `n`-th Fibonacci number (`fast_fib(0) == 0`, `fast_fib(1) == 1`, `fast_fib(10) == 55`) and runs instantly even for `n = 50`!',
    starterCode: `def fast_fib(n, memo=None):\n    # Implement fast O(n) Fibonacci using memoization or iteration\n    pass\n\nprint("fib(10) =", fast_fib(10))\nprint("fib(50) =", fast_fib(50))\n`,
    solutionCode: `def fast_fib(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n <= 1:\n        return n\n    if n not in memo:\n        memo[n] = fast_fib(n - 1, memo) + fast_fib(n - 2, memo)\n    return memo[n]\n\nprint("fib(10) =", fast_fib(10))\nprint("fib(50) =", fast_fib(50))`,
    hints: [
      'Initialize `if memo is None: memo = {}`, and handle base cases `if n <= 1: return n`.',
      'Check `if n not in memo: memo[n] = fast_fib(n - 1, memo) + fast_fib(n - 2, memo)` then `return memo[n]`.',
    ],
    conceptLearned: 'Algorithmic optimization (turning O(2^n) into O(n) with caching) is what separates a coder from a systems-level engineer!',
    tests: [
      {
        id: 't1',
        description: 'Computes small Fibonacci numbers accurately',
        testCode: `assert fast_fib(0) == 0 and fast_fib(1) == 1 and fast_fib(10) == 55`,
      },
      {
        id: 't2',
        description: 'Computes fast_fib(50) == 12586269025 instantly',
        testCode: `assert fast_fib(50) == 12586269025`,
      },
    ],
  },
];

export function getLessonsForRegion(regionId: string): Lesson[] {
  return LESSONS.filter((l) => l.regionId === regionId).sort((a, b) => a.order - b.order);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === lessonId);
}
