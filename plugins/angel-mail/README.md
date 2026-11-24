# Angel Mail plugin

Angel Mail is an email client for people who work with AI assistants. This plugin connects your Angel Mail account to Claude, ChatGPT, Cursor and Grok Bot, so your assistant can read, search and triage your Gmail inboxes and draft replies for you. Drafts and send requests wait in Angel Mail → Agent drafts for review. By default, you send them there yourself. If you enable sending for a connection, your assistant can send only after showing the full email preview and receiving your explicit approval for that exact email.

## Install

Search for **Angel Mail** in Claude's directory, ChatGPT's Plugins, or the Plugins page in Cursor and Grok Bot. In Claude Code you can also install it in one step:

```
/plugin install angel-mail --marketplace PirateKing44/angel-mail-plugins
```

Then sign in to Angel Mail when the app asks (in Claude Code: type `/mcp`, pick angel-mail and choose Authenticate).

## What it contains

- **An MCP server connection** to `https://app.angelmail.io/mcp`, Angel Mail's own hosted server (`.mcp.json` for Claude, `mcp.json` for ChatGPT and other Agent Plugins apps, `cursor-mcp.json` for Cursor and Grok Bot). You sign in once with your Angel Mail account (OAuth); no key or token is stored in the plugin.
- **A skill** (`skills/angel-mail/SKILL.md`) that tells the assistant how to use the tools: drafts go to your review queue, inbox changes go out as suggestions you approve.

## What it sends and where

The plugin runs no code on your computer. Your assistant calls Angel Mail's server at `app.angelmail.io` with the requests you make (searches, drafts, suggestions). Angel Mail reads your mail from Gmail with the access you granted it when you signed up. The privacy policy is at https://angelmail.io/privacy and the terms at https://angelmail.io/terms.

## Permissions

On the sign-in page you choose the name the connection appears under and whether it may send emails you approved in the conversation (off by default). You can switch a connection off or remove it at any time in Angel Mail → Settings → AI connections.

## Running your own Angel Mail server

This plugin connects to Angel Mail's hosted service. If you run Angel Mail yourself, connect your assistant to your own server's `/mcp` address instead, as Settings → AI connections on your server shows.

## Support

https://angelmail.io · angel@angelmail.io
