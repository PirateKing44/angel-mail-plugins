# Draft, review, and revise

Find a thread, match the owner's voice, queue a reply, wait, and replace it if they send it back. Nothing is sent by these calls. Sample ids are from the demo mailbox in the recipes. Use the ids your own calls return.

## MCP

### 1. Voice, then the thread

```json
{ "name": "get_writing_feedback", "arguments": { "account": "alex@example.com", "limit": 30 } }
```

```json
{ "name": "search_mail", "arguments": { "account": "alex@example.com", "query": "from:priya newer_than:7d", "limit": 5 } }
```

```json
{
  "threads": [
    {
      "thread_id": "t1",
      "subject": "Q4 planning call",
      "participants": ["Priya Shah <priya@northwind.example>"],
      "snippet": "Can we move our planning call to Thursday at 2pm ET?",
      "unread": true
    }
  ]
}
```

```json
{ "name": "get_thread", "arguments": { "account": "alex@example.com", "thread_id": "t1" } }
```

### 2. Draft with the draft skill (preferred)

First call returns the material. Write `answer` exactly in the shape `schema` describes.

```json
{
  "name": "draft_reply",
  "arguments": {
    "account": "alex@example.com",
    "thread_id": "t1",
    "notes": "Yes to Thursday; agenda tomorrow"
  }
}
```

```json
{
  "tool": "draft_reply",
  "skill": "draft",
  "version": "draft.2",
  "instructions": "…",
  "material": "…",
  "schema": { "type": "object", "properties": { "body": {}, "unsure": {} } },
  "ticket": "v1.s0.PASTE_TICKET",
  "next": "Call draft_reply again with thread_id, answer, and ticket."
}
```

```json
{
  "name": "draft_reply",
  "arguments": {
    "account": "alex@example.com",
    "thread_id": "t1",
    "ticket": "v1.s0.PASTE_TICKET",
    "answer": {
      "body": "Hi Priya,\n\nThursday at 2pm ET works. I'll send the agenda tomorrow.",
      "unsure": []
    }
  }
}
```

Tell the owner the draft is in Agent drafts. Give them `review_url`. List anything in `unsure`.

### 3. Or a direct draft when the text is already settled

```json
{
  "name": "create_draft",
  "arguments": {
    "account": "alex@example.com",
    "reply_to_thread_id": "t1",
    "body": "Hi Priya,\n\nThursday at 2pm ET works. See you then."
  }
}
```

```json
{
  "status": "waiting",
  "review_id": "5PeEKSWTPMF_",
  "review_url": "https://app.angelmail.io/?review=5PeEKSWTPMF_",
  "to": ["priya@northwind.example"],
  "subject": "Re: Q4 planning call",
  "note": "Not sent. It is waiting in Agent drafts. Tell the owner and give them review_url."
}
```

Use `request_send` with the same fields when the owner said the text is ready to go. It still waits, marked "Wants to send", and returns `preview`.

### 4. Wait

```json
{
  "name": "wait_for_review",
  "arguments": {
    "review_ids": ["5PeEKSWTPMF_"],
    "timeout_seconds": 50
  }
}
```

```json
{
  "decided": true,
  "items": [
    {
      "review_id": "5PeEKSWTPMF_",
      "status": "returned",
      "note": "Mention I'll send the agenda tomorrow."
    }
  ]
}
```

`decided: false` means the timeout elapsed. Call `wait_for_review` again. Do not poll.

### 5. Read the note and replace the draft

```json
{ "name": "get_draft_review", "arguments": { "review_id": "5PeEKSWTPMF_" } }
```

Trust `current_draft` for what is saved now. `your_version` is the original snapshot. `owner_note` is what they asked to change.

```json
{
  "name": "revise_draft",
  "arguments": {
    "review_id": "5PeEKSWTPMF_",
    "account": "alex@example.com",
    "reply_to_thread_id": "t1",
    "body": "Hi Priya,\n\nThursday at 2pm ET works. I'll send the agenda tomorrow."
  }
}
```

Omit `attachments` to keep the files already on the draft. Then `wait_for_review` again and give the same `review_url`.

### 6. Do not send from this loop

`send_approved_email` is a different path. It requires Can send, a `request_send` preview shown in the conversation, and an explicit yes to that exact email within 2 hours:

```json
{
  "name": "request_send",
  "arguments": {
    "account": "alex@example.com",
    "to": ["jordan@example.com"],
    "subject": "Friday",
    "body": "Friday at 10 works."
  }
}
```

Show `preview`. After the owner says yes to that exact text:

```json
{
  "name": "send_approved_email",
  "arguments": {
    "request_id": "Hk2PASTE",
    "owner_approved": true
  }
}
```

If `send_approved_email` is not in `tools/list`, stop after the `review_url`.

## CLI

```bash
angel feedback --account alex@example.com --json
angel search "from:priya newer_than:7d" --account alex@example.com --json

id=$(angel draft --account alex@example.com --reply-to t1 --body-file note.md --json | jq -r '.review_id')
angel wait "$id" --timeout 50
angel review "$id" --json | jq '{status, owner_note, current_draft}'
angel revise "$id" --account alex@example.com --reply-to t1 --body-file note-v2.md --json
```
