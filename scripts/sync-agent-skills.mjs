import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const SOURCE = join(".claude", "skills");
const TARGET = join(".agents", "skills");

export function syncAgentSkills() {
  if (!existsSync(SOURCE)) return [];
  const names = readdirSync(SOURCE, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  for (const name of names) {
    const target = join(TARGET, name);
    rmSync(target, { recursive: true, force: true });
    cpSync(join(SOURCE, name), target, { recursive: true });
  }
  return names;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`Copied to ${TARGET}: ${syncAgentSkills().join(", ")}`);
}
