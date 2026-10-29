---
name: log-item
description: Land a pasted Slack thread, email, call note, or stray thought into the right project folder's tracker and log — "log this", "note this", "file this", "this is worth noting", "put this somewhere". Picks the project, writes the tracker rows (question / action / decision / assumption) and one log entry. Never invents details; never writes to a board or repo.
---

# log-item

Turns one messy input into tracker rows plus a log entry. Three minutes, not thirty.

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/project-folder.md` first: where the folder is, the row grammar, and the rules every folder skill keeps.

## Steps

1. **Read the input whole.** Note who said what, the date, and the channel. If the date is not in the input, use today and say so.
2. **Pick the project.** Match against `projects/*/_project-tracker.md` summaries and stakeholder maps. Client-specific → that client's folder. Internal (people, tooling, how-we-work, "worth noting" from leadership) → `projects/team/`. If it could be two, ask one question; do not split it.
3. **Classify each distinct item** in the input as one of: open question (`?` row) · action item (`→` row) · decision (a Key Decisions table row, no symbol) · assumption/observation (`~` row). Most inputs yield one to three rows. Do not manufacture rows to look thorough.
4. **Do not ask for an audience.** Tags are optional notes and filter nothing. Add one only if the user gives it.
5. **Write, in this order, in one pass:**
   - `_log.md` → one Communication Log row: date, who, channel, what (two sentences max), outcome ("added ? + → to tracker"), source (permalink if given, else "pasted").
   - `_project-tracker.md` → each row in its section, using the row grammar in `project-folder.md`:
     - `- ? since:YYYY-MM-DD raised:0 — text` under Urgent / Important / Deferred (ask if unclear; default Important).
     - `- → due:YYYY-MM-DD Owner: what — why` under Action Items. If it belongs on a board, do NOT add it here; say "this is a card" and stop for the user's call.
     - Decisions → Key Decisions table row with Source = the log entry.
     - Assumptions → Unvalidated Assumptions.
   - Add any new person to the Stakeholder Map with `[TBD: role]` rather than guessing.
   - Bump **Last Updated**.
6. **Show the rows you wrote**, in prose, with the file path. The user does not open collapsed tool output.

## Hard rules
- Never write to Asana, Linear, GitHub, Slack, or the kb from this skill. It lands things locally, full stop.
- Never read another project's folder to decide where this goes; read summaries only.
- Never invent a name, date, role, or owner. `[TBD: …]` it.
