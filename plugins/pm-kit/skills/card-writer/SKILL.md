---
name: card-writer
description: >
  Drafts an Asana/Linear card body from a tracker decision or planning doc, using
  `_templates/card-body.md` exactly, then hands off to pm-kit `add-card` on the user's OK. Use
  when the user says "write the card for X", "turn this decision into a card", "draft a ticket
  for X", or project-planner/planning-docs reaches a point where work needs to go on the
  board. Task cards only for now — epic/initiative shapes are deferred. Do NOT call raw
  Asana/Linear create tools directly; always route through pm-kit `add-card`.
---

# card-writer

Adapted from a Jira task template's flow and Missing Information Rule, retargeted at the
card body template and Asana/Linear via pm-kit.

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/project-folder.md` first: where the folder is, the
templates, board sections, and the rules every folder skill keeps.

## Steps

1. **Read the source** — the tracker decision (Key Decisions row), planning doc, or other
   context the card comes from. Read it whole; don't work from a summary someone gave you
   verbally if the written source is available.
2. **Decide the section first**, using what this board's sections mean: the tracker header's
   `**Sections:**` line, else pm-kit's convention (see `project-folder.md` → Board sections).
   Every card gets the **full body** below regardless of section; the pm-kit one-liner
   shortcut for INBOX cards is not used for cards drafted here. When `debrief` calls this
   skill it will say "full body, target INBOX", and that is the norm, not the exception.
3. **Draft the card body** using `_templates/card-body.md` exactly — same headers, same
   order. Skip a sub-bullet only when it truly doesn't apply; don't pad it to look complete.
   The one-liner at the top is the Asana description the board shows. Fill in the bottom
   `Source:` line in pm-kit's format (where the requirement came from, e.g. `2026-09-28 client call`,
   `Slack #channel 2026-09-28`, `ad-hoc — <name> 2026-09-28`) plus a link anyone on the board
   can open: the call recording for a call (a Fireflies link, for example), the Slack permalink for a
   thread. Never a local path (tracker, meeting file): the client and
   developers cannot open the user's folder. `add-card` appends its own
   `Created-By` footer after it; do not write that footer yourself.
3a. **Optional: a flowchart image.** Offer one when the work moves, reads, or writes data
   across systems or environments (a CRM, a reporting database, S3, dev / staging / prod),
   or when the user asks. One picture of what reads from what replaces a paragraph the
   developer would have to decode. Skip it for pure UI or copy changes.
   - Write the chart as Mermaid (`flowchart LR` for a left-to-right flow, `TD` when it
     branches). Conventions:
     - Data stores are cylinders, named with their environment: `RS[(Reporting staging DB)]`.
     - Screens and jobs are boxes: `AP[Admin account page]`.
     - Every edge is labelled with what moves and how: `-- "read, one-time" -->`,
       `-- "writes ticket link" -->`, `-- "display only" -->`.
     - A write the card must NOT make is a dashed edge ending in an x:
       `RS -. "never writes" .-x CRM`.
     - Anything the source leaves unclear is a dashed node: `Q{{"[TBD: instructions editable?]"}}`.
       Never draw a guessed arrow.
     - Five to eight nodes. A chart that needs more is two cards.
   - Render it with the script beside this file (needs Chrome or Edge, and network access
     for Mermaid):
     ```bash
     node "${CLAUDE_PLUGIN_ROOT}/skills/card-writer/scripts/render-flowchart.mjs" <chart.mmd> <scratchpad>/<slug>-flow.png [1400x600]
     ```
     Use a wide frame for `LR`, a tall one (`900x1100`) for `TD`. Keep the `.mmd` and `.png`
     in the scratchpad, not the project folder.
   - Open the PNG with Read and check it before showing it: labels legible, no crossed or
     clipped edges. Then show it in chat with the draft (step 4).
   - In the card body, the Overview's last line reads `Flowchart attached: <one-line
     caption>.` The image does not replace a `Visual:` screenshot; that is a different picture.

4. **Show the draft in chat.** The user reads and edits here, not in a collapsed tool pane.
5. **On the user's OK**, invoke the **pm-kit `add-card`** skill with the finished body. Do not
   call Asana or Linear create tools directly — `add-card` applies hygiene and audit
   attribution this skill doesn't. If a flowchart was approved, attach it once the card
   exists (the pm-kit Asana MCP cannot upload files; the script can):
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/skills/_shared/pm-python.mjs" asana_ops.py --attach-file <task_gid> <scratchpad>/<slug>-flow.png
   ```
   The same command adds a flowchart to an existing card when the user asks for one. It
   needs pm-kit's Asana login (`/pm-setup`). On Linear, attach through the Linear MCP if it
   can upload files; otherwise give the user the PNG path to drag onto the issue.
6. **Note the result in the tracker**, not the card contents: an Action Item or Key Decision
   row gets `— see card <link>` appended, or a new Files Index-style pointer if that fits
   better. Never restate the card body in the tracker; the tracker points, the card holds the
   content.

## Missing Information Rule

Never invent a requirement, owner, estimate, or edge case. Where something is missing:
- Write `[TBD: what's missing]` inline in the relevant section.
- Add a corresponding line under **Dependencies, Assumptions, & Open Questions**.

This applies to functional requirements, edge cases, dependencies — anything not
actually present in the source material.

## Scope

Task cards only. If the user asks for an epic or initiative-level card, say that shape isn't
built yet and ask whether a task card (possibly one of several) covers it, or whether this
should wait.

## Hard rules

- Use `_templates/card-body.md`'s exact headers and order. No extra sections, no commentary
  outside them.
- Never call Asana/Linear MCP create tools directly. Always hand off to pm-kit `add-card`.
- Never write the card body into the tracker. The tracker holds a pointer (`see card <link>`)
  once `add-card` returns one.
- Don't draft from memory of a conversation — read the actual tracker row or doc first.
- If the source material doesn't support a section, `[TBD: …]` it and list it under Open
  Questions rather than leaving it blank or guessing.
