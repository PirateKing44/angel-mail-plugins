# Follow-up reminder and read receipt

Find mail the owner sent that nobody answered. Use read status to choose a reminder or a short nudge. Sample ids are illustrative. Skip any thread that already has a waiting reminder.

## MCP

### 1. What is already covered

```json
{ "name": "list_reminders", "arguments": { "account": "alex@example.com", "status": "waiting" } }
```

```json
{
  "reminders": [
    {
      "thread_id": "t19",
      "remind_at": "2026-11-25T14:00:00.000Z",
      "condition": "if_no_reply",
      "subject": "Signed contract"
    }
  ]
}
```

Skip `t19`.

### 2. Sent mail in the window

`folder` does nothing once `query` is set. Put the mailbox in the query.

```json
{
  "name": "search_mail",
  "arguments": {
    "account": "alex@example.com",
    "query": "in:sent newer_than:14d",
    "limit": 40
  }
}
```

```json
{ "name": "get_thread", "arguments": { "account": "alex@example.com", "thread_id": "t20" } }
```

Keep `t20` only if the owner wrote last, asked for something, and nobody has replied. Drop thanks and confirmations.

### 3. Was it opened?

```json
{ "name": "get_read_status", "arguments": { "thread_id": "t20" } }
```

The tool returns opens and clicks per recipient, with time and device. Opened and still unanswered: draft a nudge. Never opened, and the wait is under about 5 days: a reminder is enough.

### 4. Reminder the owner asked for (applies immediately)

`set_reminder` is the H key. Use it when the owner asked for the reminder. Otherwise put `remind` in the proposal batch so they can approve it.

```json
{
  "name": "set_reminder",
  "arguments": {
    "account": "alex@example.com",
    "thread_id": "t20",
    "when": "tuesday 9am",
    "condition": "if_no_reply"
  }
}
```

```json
{ "remind_at": "2026-11-24T14:00:00.000Z", "condition": "if_no_reply" }
```

### 5. Nudge, then one proposal

```json
{
  "name": "draft_reply",
  "arguments": {
    "account": "alex@example.com",
    "thread_id": "t20",
    "notes": "A short, friendly follow-up about the Q4 agenda. Do not invent dates."
  }
}
```

Second call, after you write `answer` to the schema, returns `review_id`. Then one batch:

```json
{
  "name": "propose_actions",
  "arguments": {
    "account": "alex@example.com",
    "title": "Follow-ups",
    "rationale": "You wrote last and asked for something. Nobody has replied.",
    "items": [
      {
        "thread_id": "t20",
        "action": "draft_reply",
        "review_id": "5PeEKSWTPMF_",
        "reason": "Priya has not answered the Q4 agenda request (opened Tuesday)"
      },
      {
        "thread_id": "t21",
        "action": "remind",
        "when": "friday 9am",
        "condition": "if_no_reply",
        "reason": "Jordan has not opened the deck you sent Monday"
      }
    ]
  }
}
```

Give the owner the proposal `review_url` and the draft `review_url`.

### 6. Brought back, no longer needed

```json
{
  "name": "cancel_reminder",
  "arguments": {
    "account": "alex@example.com",
    "thread_id": "t20",
    "move_to_inbox": false
  }
}
```

## CLI

```bash
angel reminders --account alex@example.com --status waiting --json

angel search "in:sent newer_than:14d" --account alex@example.com --limit 40 --json

angel thread t20 --account alex@example.com --json

angel call get_read_status '{"thread_id":"t20"}' --json

angel remind t20 "tuesday 9am" --account alex@example.com --condition if_no_reply --json
```
