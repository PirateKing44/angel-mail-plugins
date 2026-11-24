#!/usr/bin/env node
// Copy the plugin skill to every path a client discovers.
// Canonical tree: plugins/angel-mail/skills/angel-mail/
import { cpSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "plugins/angel-mail/skills/angel-mail");
const dirs = [
  join(root, "skills/angel-mail"),
  join(root, ".agents/skills/angel-mail"),
];

for (const dest of dirs) {
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
}

copyFileSync(join(src, "SKILL.md"), join(root, "SKILL.md"));
const rootExamples = join(root, "examples");
rmSync(rootExamples, { recursive: true, force: true });
cpSync(join(src, "examples"), rootExamples, { recursive: true });

console.log("Synced angel-mail skill to skills/, .agents/skills/, and the repository root.");
