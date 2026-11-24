# Triage batch proposal

Morning sort of the primary inbox. Nothing is archived until the owner approves the batch in Agent proposals. Addresses and ids below are sample values from a demo mailbox. Copy real ids from `list_accounts` and `sort_conversations`.

## MCP

### 1. Discover

```json
{
  "name": "list_accounts",
  "arguments": {}
}
```

```json
{
  "accounts": [
    { "email": "alex@example.com", "name": "Alex", "primary": true },
    { "email": "alex@morganreed.example", "name": "Morgan Reed", "primary": false }
  ]
}
```

One inbox, or the owner said the primary one. Pass `account` anyway when more than one is linked.

### 2. Fetch the skill material

```json
{
  "name": "sort_conversations",
  "arguments": {
    "account": "alex@example.com"
  }
}
```

The response carries `instructions`, `material`, `schema`, and `ticket`. If it is empty, tell the owner there is nothing new and stop.

A scheduled run that should no-op when the inbox is not due:

```json
{
  "name": "sort_conversations",
  "arguments": {
    "account": "alex@example.com",
    "only_due": true
  }
}
```

### 3. File the batch

Every item has all six fields. Empty strings where the field does not apply.

```json
{
  "name": "sort_conversations",
  "arguments": {
    "account": "alex@example.com",
    "ticket": "v1.s0.PASTE_TICKET",
    "model": "the model you are running",
    "answer": {
      "summary": "One invite filed, one reply drafted.",
      "items": [
        {
          "thread_id": "t12",
          "action": "done",
          "reason": "Calendar invite, already on the calendar",
          "when": "",
          "label": "",
          "body": ""
        },
        {
          "thread_id": "t1",
          "action": "reply",
          "reason": "Priya asked to move the call",
          "when": "",
          "label": "",
          "body": "Thursday at 2pm ET works."
        }
      ]
    }
  }
}
```

Give the owner the `review_url`. If the check returns `Not saved: …`, fix the named problem and call again with the same ticket.

### 4. A batch you decided yourself

Use `propose_actions` when you are not running the triage skill. The file [proposal.json](proposal.json) is the same payload the CLI reads.

```json
{
  "name": "propose_actions",
  "arguments": {
    "account": "alex@example.com",
    "title": "Newsletters you never open",
    "rationale": "Six senders, none opened in 30 days.",
    "items": [
      {
        "thread_id": "t31",
        "action": "unsubscribe",
        "reason": "8 emails in 30 days, all unread"
      },
      {
        "thread_id": "t32",
        "action": "done",
        "reason": "Shipping notice, delivered"
      },
      {
        "thread_id": "t33",
        "action": "remind",
        "when": "monday 9am",
        "condition": "if_no_reply",
        "reason": "Waiting on the signed contract"
      },
      {
        "thread_id": "t34",
        "action": "label",
        "label": "Receipts",
        "reason": "Invoice"
      },
      {
        "thread_id": "t35",
        "action": "reply",
        "body": "Thanks, got it.",
        "reason": "Asked to confirm receipt"
      }
    ]
  }
}
```

```json
{
  "proposal_id": "8CFcxKY1h8Sn",
  "review_url": "https://app.angelmail.io/?proposal=8CFcxKY1h8Sn",
  "status": "open",
  "items": [
    {
      "item_id": "bCVi2q2QEOI",
      "thread_id": "t31",
      "action": "unsubscribe",
      "status": "pending"
    }
  ]
}
```

## CLI

```bash
angel accounts --json

angel workflow sort_inbox --account alex@example.com

angel call sort_conversations '{"account":"alex@example.com"}' --json

angel propose --file examples/proposal.json --json
```

`angel propose --file` posts the JSON object as the `propose_actions` arguments. Include `account` inside the file when more than one inbox is linked.
