---
name: debrief
description: >
  The board half of a processed call. Reads the meeting file `meeting-processor` wrote,
  diffs its Board Actionables against the project's board, drafts every proposed card,
  comment and move in chat for approval, creates approved cards through `card-writer` and
  `add-card`, then rewrites the meeting file's Board Actionables with their cards, keeps the
  tracker's Blockers current, and ends with a reconciliation table re-read from the board.
  Works on any board pm-kit can reach (Asana, Linear). Triggers on "debrief the call",
  "debrief <meeting file>", "/debrief <project>", "reconcile the board", "what came out of
  the <project> call", "action items from today's call", "post-meeting debrief". NOT for
  turning a transcript into a meeting file (that is `meeting-processor`, which offers this at
  the end) and NOT for agendas (use `agenda`).
---

# debrief

One processed call in, board state out. `meeting-processor` already wrote down what the call
said, without seeing the board. This skill is the half that sees it: every Board Actionable
ends up as a card, a comment on a card, or a line the user chose to drop, and the meeting
file and tracker say which.

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/project-folder.md` first: where the folder is, the
row grammar, board sections, and the rules every folder skill keeps.

**Golden rules:**
1. **Draft first.** Nothing is created, commented, moved or assigned until the user approves
   the proposed list in chat.
2. **Every Board Actionable gets a disposition**: a new card, a comment on an existing card, or
   dropped by the user with a reason. None survives as a verbal-only commitment.
3. **End with the reconciliation table**, re-read from the board. A debrief without it is not
   done.

## Inputs

- **The meeting file.** `projects/<key>/meetings/<file>.md`, normally handed over by
  `meeting-processor`. If the user names a call that has no meeting file yet, run
  `meeting-processor` first; this skill never works from a raw transcript or a summary.
- **The board.** The project's board from the tracker header (`**Board:**`), read through
  whatever PM connection the user has: pm-kit's Asana tools (`list_project_tasks`,
  `search_tasks`), or a Linear MCP's issue list and search.

If the meeting file's header already says `Board reconciled: <date>`, say so and ask whether
to reconcile again; a second run only looks at lines still marked `[unverified]` unless the
user says otherwise.

## Steps

1. **Read the meeting file and the tracker.** From the meeting file: every Board Actionables
   line, with its timestamps. From the tracker: the header (`**Sections:**`, and the
   `**New cards:**` line if there is one), Where we are → where we're going, Blockers, and
   the Stakeholder Map.

2. **Find each line's owner in the transcript.** Board Actionables carry no owner by design.
   Read the transcript at each line's timestamps for who was named to do the work. Record
   the name exactly as the transcript has it, or "none named". Never infer an owner from who
   usually does this kind of work.

3. **Fetch the board once** and classify every line:

   | Finding | Proposed action |
   |---|---|
   | An open card already covers the work | **Existing.** A comment only if the call changed something: scope, a decision, a constraint, a date |
   | No card covers it | **New card.** Run duplicate detection first (`add-card` does; say what it compared) |
   | A card covers it but the call contradicted or re-scoped it | **Comment + move**, e.g. back to INBOX for review |
   | The line is a step inside another line's card | **Fold** into that card's comment or body |

   Match on the work, not the wording. When it is unclear whether a card covers the line,
   show both and let the user decide in step 5.

4. **Decide assignment for new cards.** A new card is assigned to the board member the call
   named as owner in step 2, matched against the board's own members. Leave it unassigned
   when:
   - nobody was named, or the name matches no board member (say which);
   - the named person is on the client side (the Stakeholder Map's Org column);
     a client's follow-up becomes a comment naming them, never a card assigned to them;
   - the tracker header says `**New cards:** unassigned`, which opts the whole board out.

5. **Draft everything in chat and stop.** One table:

   | # | Board Actionable (timestamp, phrase) | Action | Card (link, or proposed title) | Section | Assignee | Comment text |
   |---|---|---|---|---|---|---|

   Then, separately: the Blockers changes from step 8, as the lines that will be added and
   removed. Common corrections to expect: split one lumped line into two cards, fix an
   assignee, drop an item the client already deferred. Wait for approval.

6. **Execute what was approved.**
   - **New card:** draft the body with `card-writer` ("full body, target <section>"), then
     create it through `add-card`. Never a raw create tool. `add-card` applies the source
     line and evidence comment; the source is the call recording link from the meeting
     file's header, never the meeting file's local path.
   - **Comment:** through `add-comment`, quoting the call with its timestamp.
   - **Move:** through the board connection the user has, with the reason in a comment.
   - Mute notifications for six or more changes; for five or fewer, ask. pm-kit's Asana tools
     mute past `ASANA_BULK_THRESHOLD` on their own; say so when that applied.

7. **Rewrite the meeting file's Board Actionables**, above `## Full Transcript` only:
   - each reconciled line becomes `· card <link> (existing / new / comment added)` in place of
     `· [unverified]`;
   - a line the user dropped becomes `· dropped — <reason>`;
   - set the header's `Board reconciled:` to today's date.

8. **Keep the tracker's Blockers current.** A Board Actionable whose weight the call stated as
   blocking a roadmap step ("blocks the pilot", "one of two blockers for client testing")
   gets a Blocker row, or its existing row gets the card link:
   `- ■ since:YYYY-MM-DD <what it blocks> — <the work, in a phrase> · card <link>`. Remove a
   Blocker row whose card the board shows done. Bump **Last Updated**. Write nothing else to
   the tracker about board work: the tracker points, the board holds.

9. **Reconciliation table.** Re-fetch every card touched; do not report from memory of what
   was created.

   | # | Board Actionable | Disposition | Card | Section | Assignee | Verified on board? |
   |---|---|---|---|---|---|---|

   Every line from step 1 has a row, including existing and dropped ones. "Verified" means
   the re-fetched card shows the section, assignee and fields that were approved. Fix any
   mismatch, then verify again.

10. **Log it and hand off.** One Communication Log row in `_log.md`: channel `debrief`,
    outcome `N new · C commented · M moved · D dropped`, source the meeting file. Then run
    `tracker-hygiene` on the project, since the board just changed what the tracker's
    questions and blockers mean.

11. **Report in prose**: the cards created and commented with links, what was dropped and
    why, the Blocker changes, and the meeting file path. The user does not open collapsed
    tool output.

## Hard rules

- Never create a card except through `add-card`, and never draft its body except through
  `card-writer`.
- Never assign work to someone on the client side, and never assign on a guess.
- Never edit the meeting file below `## Full Transcript`.
- Never copy card contents or board state into the tracker or log. Links only.
- Never read another project's folder or board.
- If the board cannot be reached, say so and stop. Leave the meeting file `pending`.
