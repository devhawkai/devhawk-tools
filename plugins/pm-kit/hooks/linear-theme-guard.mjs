#!/usr/bin/env node
// PreToolUse hook: ask before a direct Linear create that names no product.
//
// On a team several products share, a card with no project and no label routes
// to nobody. This asks rather than denies, because it can't tell a shared team
// from a single-product one, and it runs on every Linear board its users touch.
// It reads no board, so any label other than the audit marker counts.
//
// Never blocks on its own failure: bad input means no opinion.

import { readFileSync } from 'node:fs';

const AUDIT_MARKER = 'devhawk:add-card';

/** The reason to ask about this tool call, or undefined to stay out of it. */
export function reasonToAsk(input) {
  const tool = input?.tool_input;
  if (!tool || typeof tool !== 'object') return undefined;
  // save_issue with an id is an update: the issue already has what it has.
  if (tool.id || tool.issueId) return undefined;
  if (tool.project || tool.projectId) return undefined;
  const labels = [tool.labels, tool.labelIds]
    .flatMap((l) => (Array.isArray(l) ? l : []))
    .filter((l) => l !== AUDIT_MARKER);
  if (labels.length > 0) return undefined;
  return (
    'This Linear card has no project and no label, so on a team several products share it ' +
    'routes to nobody. Set its project or Theme label, or confirm the team has one product.'
  );
}

function main() {
  let input;
  try {
    input = JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return;
  }
  const reason = reasonToAsk(input);
  if (!reason) return;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: reason,
      },
    }),
  );
}

main();
