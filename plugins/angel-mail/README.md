# Angel Mail plugin

Angel Mail is an email client for people who work with AI assistants. This plugin connects an Angel Mail account to Claude, ChatGPT, Codex, Cursor, Grok Bot, Gemini CLI, and OpenClaw, so the assistant can read, search, and triage linked Gmail inboxes and draft replies. Nothing is sent on its own: every draft and every send request waits in Angel Mail → Agent drafts until you review it and press Send. Inbox changes wait in Agent proposals until you approve them.

The agent playbook is [`skills/angel-mail/SKILL.md`](skills/angel-mail/SKILL.md). Worked MCP payloads and CLI scripts are in [`skills/angel-mail/examples/`](skills/angel-mail/examples/).

## Install

Search for **Angel Mail** in Claude's directory, ChatGPT's Plugins, or the Plugins page in Cursor and Grok Bot.

| App | Command or config |
| --- | --- |
| Claude Code | `/plugin marketplace add PirateKing44/angel-mail-plugins` then `/plugin install angel-mail@angel-mail`. `/mcp` → angel-mail → Authenticate. |
| Codex | `codex plugin marketplace add PirateKing44/angel-mail-plugins` then `codex plugin add angel-mail@angel-mail`. |
| ChatGPT | Plugins → connector → `https://app.angelmail.io/mcp` → OAuth. |
| Cursor | Settings → MCP, or this plugin's `cursor-mcp.json`. |
| Grok Bot | Connect Apps → custom MCP `https://app.angelmail.io/mcp`, or the `.grok-plugin` manifest. |
| Gemini CLI | `gemini extensions install https://github.com/PirateKing44/angel-mail-plugins` then `/mcp auth angel-mail`. |
| Skills clients | `npx skills add PirateKing44/angel-mail-plugins` |
| OpenClaw / ClawHub | `openclaw skills install @PirateKing44/angel-mail` after publish. From a checkout: `openclaw skills install ./skills/angel-mail`. |
| CLI | `npm install -g angel-mail-cli` then `angel login`. |

The MCP server is `https://app.angelmail.io/mcp` (Streamable HTTP). You sign in once with your Angel Mail account. The plugin stores no token.

## Check the connection

Ask:

> List my linked inboxes.

The assistant calls `list_accounts` and returns the linked addresses. From a shell with the CLI signed in: `angel accounts`.

## What it contains

- **MCP connections** to `https://app.angelmail.io/mcp`: `.mcp.json` (Claude), `mcp.json` (ChatGPT and other Agent Plugins apps), `cursor-mcp.json` (Cursor and Grok Bot).
- **Manifests** for Claude (`.claude-plugin/`), Cursor (`.cursor-plugin/`), Grok Bot (`.grok-plugin/`), and ChatGPT / Codex (`plugin.json`).
- **A skill** (`skills/angel-mail/SKILL.md`) with hard rules, the tool and `angel` command reference, workflow patterns, an error table, and a one-screen quick reference. Examples sit beside it.

Gemini CLI loads the repo-root `gemini-extension.json` and `GEMINI.md`, plus `skills/angel-mail/` at the repository root (kept identical to this folder by `node scripts/sync-skill.mjs`).

## What it sends and where

The plugin runs no code on your computer. Your assistant calls Angel Mail's server at `app.angelmail.io` with the requests you make (searches, drafts, suggestions). Angel Mail reads your mail from Gmail with the access you granted when you signed up. The privacy policy is at https://angelmail.io/privacy and the terms at https://angelmail.io/terms.

## Permissions

On the sign-in page you choose the name the connection appears under and whether it may send emails you approved in the conversation (off by default). You can switch a connection off or remove it at any time in Angel Mail → Settings → AI connections.

## Running your own Angel Mail server

This plugin connects to Angel Mail's hosted service. If you run Angel Mail yourself, point the assistant at your server's `/mcp` address, as Settings → AI connections on your server shows. For the CLI, set `ANGEL_MAIL_URL` to that origin with no `/mcp` suffix.

## Support

https://angelmail.io · angel@angelmail.io
