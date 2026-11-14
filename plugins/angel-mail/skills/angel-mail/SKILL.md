---
name: angel-mail
description: Use when the user asks about their email in Angel Mail, such as what needs a reply, finding or reading a conversation, sorting the inbox, or drafting, replying to or sending an email through Angel Mail.
---

# Angel Mail

Angel Mail connects the user's Gmail inboxes to you through its MCP server (`angel-mail`). The server sends its full instructions when it connects; this is the short version.

## Reading

- `list_accounts` shows the linked inboxes. With more than one, pass `account` to the other tools, and ask the user which inbox an email should come from when it isn't clear.
- `search_mail` takes Gmail search syntax (`is:unread newer_than:2d`, `from:jordan`). `get_thread` reads a whole conversation. `get_read_status` says whether a sent email was opened.

## Writing

Nothing you write is sent by you. Every draft waits in Angel Mail → **Agent drafts** until the user reviews it and presses Send.

- `create_draft` when the email needs the user's touch, `request_send` when you think it is ready to go. Both return a `review_url`: give it to the user and tell them the draft is waiting there.
- `wait_for_review` waits up to 50 seconds for their decision; `get_draft_review` shows what they did: sent it, edited it, or sent it back with a note. If they sent it back, `revise_draft` replaces it with the next version.
- `get_writing_feedback` shows how the user edits drafts, so the next one sounds more like them.
- `send_approved_email` exists only when the user allowed this connection to send. Use it only after showing the user the full preview from `request_send` and getting their explicit yes for that exact email.

## Inbox work

- `propose_actions` sends a batch of suggestions (archive, star, label, remind, unsubscribe, or a reply with its text), each with a one-line reason. The user approves them item by item in **Agent proposals**; `get_proposal` shows what they approved.
- `list_reminders`, `set_reminder` and `cancel_reminder` manage follow-ups on a conversation.

If the Angel Mail tools aren't available in this session, tell the user to connect Angel Mail and stop.
