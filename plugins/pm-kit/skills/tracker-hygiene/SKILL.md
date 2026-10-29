---
name: tracker-hygiene
description: >
  Triage a project tracker against its own roadmap. Every open question, action, blocker,
  assumption, and decision must serve a step in "Where we are → where we're going"; rows that
  serve none are parked in the log, or the roadmap grows a step. Also clears rows the board
  has answered and folds the Files Index to one line per folder. Nothing is deleted; every
  removal is a log row with a reason. Triggers on "tracker hygiene", "tracker-hygiene <project>", "sweep <project>", "triage the tracker",
  "clean up the <project> tracker", "eviction pass", "Friday pass", and at the end of every
  `debrief` run. Reads the board; never writes to it.
---

# tracker-hygiene

The tracker may be long. It may not hold anything that is not pulling toward the roadmap.
This is the weekly eviction pass, as a verb.

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/project-folder.md` first: where the folder is, the
row grammar, and the rules every folder skill keeps.

**The standard is relevance, not age.** A row stays because it serves a numbered step in
"Where we are → where we're going", or the honest state in "Today". A row goes because it
serves none. Dates (`since:`, `due:`, `raised:`) are information for the user's call, not the
trigger. The one date rule that exists already, `raised:3`, still applies.

**Nothing is deleted.** A parked row lands in the log with the roadmap as it stood, so it
can come back if the roadmap grows to cover it.

## Inputs
- **project key**. One folder under `projects/`. Never two.
- **mode**, optional. Default is the full interactive run below. Two other modes exist so
  the scheduled Friday pass can fan out one subagent per project and still gate on the user
  once:
  - **propose**: do steps 1 to 4 but ask nothing. Show the roadmap as found and triage
    against it as is. Return the full triage list as text, in the step 5 layout, headed by
    the project key and the roadmap used. Write nothing: no tracker, no log, no scratch
    file.
  - **apply**: take an approved triage (the propose output plus the user's corrections) and do
    steps 6 and 7 exactly as approved. Do not re-triage, do not add dispositions that were
    not approved. If the tracker changed since the proposal (Last Updated is newer than the
    proposal's date), stop and say so instead of applying.

## Steps

1. **Confirm the roadmap first.** Show "Today" and the numbered A → B steps from the tracker
   and ask one question: still right? The roadmap itself goes stale, and triaging against a
   stale roadmap parks the wrong things. Apply the user's edits before anything else. If the
   steps are not numbered, number them now; the triage below refers to them by number.

2. **Fetch the board once** (pm-kit's `list_project_tasks`, or the Linear MCP's issue list) for two things only: the state of
   every card a Blocker line points at, and whether any open question or action is answered
   by a card's state. Fetch, use, discard. Ignore any cards marked as Done.

3. **Triage every row.** For each row in Open Questions (all tiers), Action Items, Blockers,
   Unvalidated Assumptions, and Key Decisions, name the roadmap step it serves, or "none".
   Then propose a disposition:

   | Finding | Proposed disposition |
   |---|---|
   | Serves a step | Keep. Say which step |
   | Serves no step | **Park** in the log, or add a roadmap step that it serves. Default is park |
   | Open question the board answers | Resolve in the log, answer `see card <link>` |
   | Open question at `raised:3` | Escalate, park, or drop. The user picks |
   | Action that is done, per the log or the board | Move to Done Actions |
   | Action that is dev work in disguise | Remove; it belongs to `debrief` |
   | Blocker whose card is done | Remove |
   | Blocker whose card is in BACKLOG (on ice) | Flag: either it is not a blocker or the card is in the wrong place |
   | Decision whose governed work has shipped | Move to Settled Decisions in the log |
   | Decision still constraining a step | Keep |
   | Assumption that serves no step | Park |

   A row that serves a step is never parked for being old. A row that serves none is never
   kept for being recent.

4. **Fold the Files Index** to one line per file or folder. Per-file rows for `meetings/`,
   `agendas/`, or `assets/` become one row for the folder.

5. **Show the triage in chat and stop.** Group it by roadmap step, with the "none" group
   last and the Files Index fold at the bottom. One line per row: the row as it is, the step
   or "none", the proposed disposition. The user corrects by exception: "keep 4, add a step for
   7 and 9, rest as proposed". One approval covers everything.

6. **Apply, in one pass.**
   - Tracker: remove, move, or keep each row as approved. New roadmap steps go in A → B.
     Rows the user attached to a new step stay. Bump **Last Updated**.
   - Log: a row for every removal, in the right table. Parked rows go to **Parked (off the
     roadmap)** with the row text as it was, the roadmap step list at the time, and why.
     Settled decisions go to **Settled Decisions**. Resolved questions and done actions go to
     their tables. If a project log predates these tables, add them from `_templates/log.md`.
   - Communication Log: one row, channel `tracker-hygiene`, outcome `kept K · parked P · resolved R ·
     settled S · removed blockers B`.

7. **Report in prose**: the counts, which steps were added to the roadmap, and the one or
   two rows the user should look at again next time.

8. **Offer the brief refresh.** If `projects/<key>/project-brief.html` exists, close with one
   line: "Refresh the project brief?" On yes, run `project-brief` in refresh mode; the
   roadmap and blockers it reads are the ones just confirmed. If no brief exists, say nothing.

## Hard rules
- Never write to the board. This skill reads it to decide; `debrief` writes.
- Never delete a row without a log row. Parked is not deleted.
- Never park a row that serves a roadmap step, whatever its age.
- Never change the roadmap without the user's answer in step 1 or an explicit "add a step" in
  step 5.
- Never read another project's folder or board.
- Never copy board state into the tracker or log. Links only.
