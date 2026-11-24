# Angel Mail plugins

Angel Mail plugins connect an assistant to Angel Mail over the hosted MCP server at `https://app.angelmail.io/mcp`, with a skill that explains how to use the tools. Drafts wait in Angel Mail → Agent drafts until you send them. Inbox changes wait in Agent proposals until you approve them.

The plugin is [`plugins/angel-mail/`](plugins/angel-mail/README.md). The playbook agents load is [`plugins/angel-mail/skills/angel-mail/SKILL.md`](plugins/angel-mail/skills/angel-mail/SKILL.md), with copy-paste workflows in [`examples/`](plugins/angel-mail/skills/angel-mail/examples/). The same skill is published at the repository root and under `skills/angel-mail/` and `.agents/skills/angel-mail/` so `npx skills add`, Gemini CLI, and OpenClaw can find it. `node scripts/sync-skill.mjs` refreshes those copies from the plugin skill. `node scripts/validate.mjs` checks they match.

## Platforms

| App | How it is installed | What it reads |
| --- | --- | --- |
| Claude (Claude Code, claude.ai, desktop) | Marketplace plugin, or the MCP URL | `.claude-plugin/plugin.json`, `.mcp.json`, `skills/` |
| ChatGPT and Codex | Marketplace plugin, or the MCP URL | `plugin.json`, `mcp.json`, `skills/` |
| Cursor | Marketplace plugin, or the MCP URL | `.cursor-plugin/plugin.json`, `cursor-mcp.json`, `skills/` |
| Grok Bot and grok.com | `.grok-plugin`, or the MCP URL | `.grok-plugin/plugin.json`, `cursor-mcp.json`, `skills/` |
| Gemini CLI | `gemini extensions install` of this repo | `gemini-extension.json`, `GEMINI.md`, `skills/angel-mail/` |
| OpenClaw / ClawHub | `openclaw skills install` after publish, or a local skill folder | `skills/angel-mail/SKILL.md` frontmatter (`metadata.openclaw`) |
| Any skills client | `npx skills add PirateKing44/angel-mail-plugins` | Root `SKILL.md`, `skills/`, and `.agents/skills/` |

MCP URL for every client: `https://app.angelmail.io/mcp` (Streamable HTTP, OAuth). Self-host by swapping the host and keeping `/mcp`.

## Install

Skill (Claude Code, Cursor, Codex, OpenClaw, and other clients that read Agent Skills):

```bash
npx skills add PirateKing44/angel-mail-plugins
```

CLI (binary `angel`):

```bash
npm install -g angel-mail-cli
angel login
```

`angel-mail-cli` is the package name for the CLI. Until it is on npm, install `angel` the way [the CLI docs](https://angelmail.io/docs/cli.md) describe. Node 22. Headless: `ANGEL_MAIL_TOKEN` (`smt_…` from Angel Mail → Settings → AI connections) and `ANGEL_MAIL_URL=https://app.angelmail.io`.

Claude Code:

```text
/plugin marketplace add PirateKing44/angel-mail-plugins
/plugin install angel-mail@angel-mail
```

Then `/mcp`, pick angel-mail, and choose Authenticate.

Codex:

```bash
codex plugin marketplace add PirateKing44/angel-mail-plugins
codex plugin add angel-mail@angel-mail
```

Gemini CLI:

```bash
gemini extensions install https://github.com/PirateKing44/angel-mail-plugins
```

Trust the extension, then `/mcp auth angel-mail`.

OpenClaw, after the skill is published to ClawHub (see the release checklist):

```bash
openclaw skills install @PirateKing44/angel-mail
angel login
openclaw skills list --eligible
```

A local checkout installs the same folder OpenClaw expects (`SKILL.md` at the folder root):

```bash
openclaw skills install ./skills/angel-mail
```

`openclaw skills install git:PirateKing44/angel-mail-plugins` loads the root `SKILL.md`.

Any app that takes a custom MCP connector (claude.ai, ChatGPT, Grok Bot, grok.com, Cursor, VS Code, Hermes) can add `https://app.angelmail.io/mcp` and sign in. Per-app steps: https://angelmail.io/docs/connect.md

## Check the connection

Ask the agent:

> List my linked inboxes.

A working connection calls `list_accounts` and returns the linked addresses. From a shell:

```bash
angel accounts
```

## Releasing

Bump `version` to the same value in all of these, then run the checks:

- `plugins/angel-mail/.claude-plugin/plugin.json`
- `plugins/angel-mail/.cursor-plugin/plugin.json`
- `plugins/angel-mail/.grok-plugin/plugin.json`
- `plugins/angel-mail/plugin.json`
- `gemini-extension.json`
- `version` in the skill frontmatter (`plugins/angel-mail/skills/angel-mail/SKILL.md`)

```bash
node scripts/sync-skill.mjs
node scripts/validate.mjs
claude plugin validate plugins/angel-mail
```

`claude plugin validate` needs the Claude Code CLI. `scripts/validate.mjs` checks JSON, the skill frontmatter, relative links, matching skill copies, and that this repo does not reintroduce a retired product name.

After merge, publish the skill to ClawHub (sign in first; the owner handle is the ClawHub account that owns the listing, `PirateKing44` when that is the publisher):

```bash
clawhub login
clawhub skill publish ./skills/angel-mail \
  --slug angel-mail \
  --name "Angel Mail" \
  --version 1.1.0 \
  --changelog "Full agent playbook, workflow examples, and multi-platform manifests." \
  --categories productivity,communication \
  --topics "email,gmail,inbox,drafts,triage"
```

Install it with `openclaw skills install @PirateKing44/angel-mail`.

## Support

https://angelmail.io · angel@angelmail.io

Tool, workflow, and CLI references: https://angelmail.io/llms.txt

License: MIT
