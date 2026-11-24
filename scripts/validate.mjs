#!/usr/bin/env node
// JSON, skill frontmatter, relative links, version alignment, skill copies.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (message) => errors.push(message);

const VERSION = "1.1.0";
const VERSION_FILES = [
  "plugins/angel-mail/plugin.json",
  "plugins/angel-mail/.claude-plugin/plugin.json",
  "plugins/angel-mail/.cursor-plugin/plugin.json",
  "plugins/angel-mail/.grok-plugin/plugin.json",
  "gemini-extension.json",
];

const SKILL_FILES = [
  "plugins/angel-mail/skills/angel-mail/SKILL.md",
  "skills/angel-mail/SKILL.md",
  ".agents/skills/angel-mail/SKILL.md",
  "SKILL.md",
];

const EXAMPLE_DIRS = [
  "plugins/angel-mail/skills/angel-mail/examples",
  "skills/angel-mail/examples",
  ".agents/skills/angel-mail/examples",
  "examples",
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function rel(path) {
  return relative(root, path);
}

const files = walk(root);

for (const path of files) {
  if (!path.endsWith(".json")) continue;
  const text = readFileSync(path, "utf8");
  try {
    JSON.parse(text);
  } catch (error) {
    fail(`${rel(path)}: invalid JSON (${error.message})`);
  }
  if (/"version"\s*:\s*"1\.0\.0"/.test(text)) fail(`${rel(path)}: still at version 1.0.0`);
}

for (const file of VERSION_FILES) {
  const path = join(root, file);
  if (!existsSync(path)) {
    fail(`missing ${file}`);
    continue;
  }
  const json = JSON.parse(readFileSync(path, "utf8"));
  if (json.version !== VERSION) fail(`${file}: version is ${json.version}, expected ${VERSION}`);
}

const gemini = JSON.parse(readFileSync(join(root, "gemini-extension.json"), "utf8"));
const server = gemini.mcpServers?.["angel-mail"];
if (server?.url !== "https://app.angelmail.io/mcp") {
  fail("gemini-extension.json: angel-mail url is not https://app.angelmail.io/mcp");
}
if (server?.type !== "http") fail("gemini-extension.json: angel-mail type must be http");
if (gemini.contextFileName !== "GEMINI.md") fail("gemini-extension.json: contextFileName must be GEMINI.md");
if (!existsSync(join(root, "GEMINI.md"))) fail("missing GEMINI.md");
if (!existsSync(join(root, "skills/angel-mail/SKILL.md"))) fail("Gemini skills/angel-mail/SKILL.md is missing");

const requiredFrontmatter = [
  /^name:\s*angel-mail\s*$/m,
  /^version:\s*1\.1\.0\s*$/m,
  /^allowed-tools:\s*"Bash\(angel:\*\)"\s*$/m,
  /^homepage:\s*https:\/\/angelmail\.io\/docs\s*$/m,
  /^\s*emoji:\s*"✉️"\s*$/m,
  /^\s*homepage:\s*https:\/\/angelmail\.io\s*$/m,
  /^\s*requires:\s*$/m,
  /^\s*install:\s*$/m,
  /^\s*package:\s*angel-mail-cli\s*$/m,
  /^\s*primaryEnv:\s*ANGEL_MAIL_TOKEN\s*$/m,
];

let canonical = "";
for (const file of SKILL_FILES) {
  const path = join(root, file);
  if (!existsSync(path)) {
    fail(`missing ${file}`);
    continue;
  }
  const text = readFileSync(path, "utf8");
  if (!text.startsWith("---\n")) fail(`${file}: missing YAML frontmatter`);
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) fail(`${file}: frontmatter is not closed`);
  const frontmatter = text.slice(4, end);
  for (const pattern of requiredFrontmatter) {
    if (!pattern.test(frontmatter)) fail(`${file}: frontmatter missing ${pattern}`);
  }
  if (canonical === "") canonical = text;
  else if (text !== canonical) fail(`${file}: SKILL.md differs from plugins/angel-mail/skills/angel-mail/SKILL.md`);
}

function listFiles(dir) {
  return walk(join(root, dir))
    .map((path) => relative(join(root, dir), path))
    .sort();
}

const canonicalExamples = listFiles(EXAMPLE_DIRS[0]);
for (const dir of EXAMPLE_DIRS.slice(1)) {
  const names = listFiles(dir);
  if (names.join("\n") !== canonicalExamples.join("\n")) {
    fail(`${dir}: example files differ from ${EXAMPLE_DIRS[0]}`);
    continue;
  }
  for (const name of names) {
    const a = readFileSync(join(root, EXAMPLE_DIRS[0], name));
    const b = readFileSync(join(root, dir, name));
    if (!a.equals(b)) fail(`${dir}/${name}: content differs from the plugin skill examples`);
  }
}

const linkRe = /\[[^\]]*\]\(([^)\s]+)\)/g;
for (const path of files) {
  if (!path.endsWith(".md")) continue;
  const text = readFileSync(path, "utf8");
  for (const match of text.matchAll(linkRe)) {
    const target = match[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const [pathPart, hash] = target.split("#");
    if (!pathPart) continue;
    const resolved = resolve(dirname(path), pathPart);
    if (!existsSync(resolved)) fail(`${rel(path)}: broken link ${target}`);
    else if (hash && resolved.endsWith(".md") === false && statSync(resolved).isDirectory()) {
      fail(`${rel(path)}: link ${target} points at a directory with a hash`);
    }
  }
}

const forbidden = new RegExp(String.fromCharCode(115, 116, 101, 114, 108, 105, 110, 103), "i");
for (const path of files) {
  if (path.endsWith(".png") || path.endsWith(".svg")) continue;
  const text = readFileSync(path, "utf8");
  if (forbidden.test(text)) fail(`${rel(path)}: contains a retired product name`);
}

const pluginMcpFiles = [
  "plugins/angel-mail/.mcp.json",
  "plugins/angel-mail/mcp.json",
  "plugins/angel-mail/cursor-mcp.json",
];
for (const file of pluginMcpFiles) {
  const json = JSON.parse(readFileSync(join(root, file), "utf8"));
  const url = json.mcpServers?.["angel-mail"]?.url;
  if (url !== "https://app.angelmail.io/mcp") fail(`${file}: MCP url is ${url}`);
}

if (errors.length) {
  console.error(`Validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated JSON, skill frontmatter, links, and version ${VERSION}.`);
