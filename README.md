# Angel Mail plugins

The Angel Mail plugin for Claude, ChatGPT, Cursor and Grok Bot. It connects your assistant to your Angel Mail inbox through Angel Mail's MCP server (`https://app.angelmail.io/mcp`), with a skill that explains how to use it. Everything the assistant writes waits in Angel Mail → Agent drafts until you send it.

The plugin is in [`plugins/angel-mail/`](plugins/angel-mail/README.md). One folder serves every app:

| App | Reads |
|---|---|
| Claude (Claude Code, claude.ai, the desktop app) | `.claude-plugin/plugin.json`, `.mcp.json`, `skills/` |
| ChatGPT and Codex | `plugin.json` (Agent Plugins, `extensions.com.openai`), `mcp.json`, `skills/` |
| Cursor and Grok Bot | `.cursor-plugin/plugin.json`, `cursor-mcp.json`, `skills/` |

## Install

Once each directory lists it, search for **Angel Mail** in Claude's directory, ChatGPT's Plugins, or the Plugins page in Cursor and Grok Bot. Before that:

Claude Code:

```
/plugin marketplace add PirateKing44/angel-mail-plugins
/plugin install angel-mail@angel-mail
```

Then type `/mcp`, pick angel-mail and choose Authenticate.

Codex:

```
codex plugin marketplace add PirateKing44/angel-mail-plugins
codex plugin add angel-mail@angel-mail
```

Any app that takes a custom MCP connector (claude.ai, ChatGPT, Grok Bot, grok.com, Cursor) can also add `https://app.angelmail.io/mcp` directly and sign in.

## Releasing

Raise `version` in `plugins/angel-mail/.claude-plugin/plugin.json`, `plugin.json` and `.cursor-plugin/plugin.json` together, then check with `claude plugin validate plugins/angel-mail`.
