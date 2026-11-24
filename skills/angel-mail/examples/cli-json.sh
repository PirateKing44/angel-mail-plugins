#!/usr/bin/env bash
# Angel Mail CLI pipelines. Requires `angel` on PATH and `jq`.
# Authenticate first: angel login, or ANGEL_MAIL_TOKEN + ANGEL_MAIL_URL.
# Nothing here sends mail. propose and draft only queue work for the owner.
set -euo pipefail

ACCOUNT="${ANGEL_MAIL_ACCOUNT:-}"
account_flag=()
if [[ -n "$ACCOUNT" ]]; then
  account_flag=(--account "$ACCOUNT")
fi

echo "Linked inboxes"
angel accounts --json | jq -r '.accounts[] | "\(.email)\tprimary=\(.primary)"'

echo "Unread inbox from the last 2 days"
angel search "in:inbox is:unread newer_than:2d" "${account_flag[@]}" --limit 20 --json \
  | jq -r '.threads[] | "\(.thread_id)\t\(.subject)"'

# Draft a reply only when THREAD is set, then wait once.
if [[ -n "${THREAD:-}" && -n "${BODY_FILE:-}" ]]; then
  review_id=$(
    angel draft "${account_flag[@]}" --reply-to "$THREAD" --body-file "$BODY_FILE" --json \
      | jq -r '.review_id'
  )
  echo "Queued $review_id"
  angel wait "$review_id" --timeout 50 --json | jq '{decided, items}'
  angel review "$review_id" --json | jq '{status, owner_note, subject}'
fi

# File a proposal when PROPOSAL points at a JSON file of propose_actions arguments.
if [[ -n "${PROPOSAL:-}" ]]; then
  angel propose --file "$PROPOSAL" --json | jq '{proposal_id, review_url, status}'
fi
