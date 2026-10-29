---
name: meeting-processor
description: >
  Turn one call transcript into a meeting file inside the project folder (signal on top,
  verbatim transcript below), plus tracker rows and a log entry. Use when the user hands over a
  transcript and says "process this call", "process the <project> call", "meeting processor", "file this
  meeting", "write up the <date> call", or drops a transcript .md at session start. Ends by
  offering the `debrief` skill for the board half. NOT for agendas (use `agenda`) and
  NOT for writing to Asana (that is `debrief`). Never rewrites transcript text; the
  transcript is moved with code only.
---

# meeting-processor

One transcript in, one meeting file out, tracker and log kept current. Process, not prose.
Write plainly, keep the transcript byte-exact, and stop at the gates.

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/project-folder.md` first: where the folder is, the
templates, the row grammar, and the rules every folder skill keeps.

Read `references/signal-style-guide.md` (beside this file) before writing any Decisions, Open Questions,
Observations, Non-Board Actionables, Board Actionables, or Key Quotes. It sets the bar.

## Inputs

- **Transcript.** Normally a file the user hands over at session start. If none was given, ask
  once: "No transcript attached. Should I fetch it from Fireflies?" Only on a yes:
  - Find the meeting's id: the user's Fireflies link, or the connected Fireflies MCP's search
    by title, date and attendees. More than one plausible match means list them and ask.
  - Save the transcript **with the script, never by writing it out yourself**. A transcript the
    model types back is no longer the transcript, and the byte-exact check in step 5 would only
    compare it with itself:
    ```bash
    node "${CLAUDE_PLUGIN_ROOT}/skills/meeting-processor/scripts/fetch-transcript.mjs" <id or link> <scratchpad>/<slug>-transcript.md
    ```
    It needs `FIREFLIES_API_KEY`. Without one, ask the user to download the transcript from the
    meeting page and hand over the file. Do not fall back to saving MCP output by hand.
  - Treat the saved file as the source from then on. Never work from a Fireflies summary;
    full transcript only.
- **Project key.** One folder under `projects/`. Pick it the way `log-item` does: match
  participants and topics against tracker summaries and stakeholder maps. Two plausible
  projects means ask one question, not split the call.
- **Date and participants.** From the transcript header if present. If not, ask. Do not
  infer full names; use whatever handle the transcript uses.

## Steps

0. **Read the project before the call.** Before opening the transcript, read:
   - the tracker: Project Summary, Where we are → where we're going, Open Questions, Blockers,
     and the Stakeholder Map;
   - the signal block of the last two meeting files in `projects/<key>/meetings/`.
   This is where the vocabulary comes from: which systems exist, which data lives where,
   which threads are already open, who is on which side. A call that mentions two systems
   or two data sources gets each bullet pinned to the right one. If the transcript does not
   make clear which one is meant, write `[TBD: which system]` rather than picking.

1. **Read the whole transcript.** Do not start extracting partway through. While reading,
   note: who is on the call and which side they are on, every commitment the user made or was
   handed, every decision with its reasoning, anything that closes a question already open
   in the tracker, and any new person or term.

2. **Draft the signal block** using the headers and order of `_templates/meeting.md`:
   Summary, Decisions, Open Questions, Observations, Non-Board Actionables, Board
   Actionables, Key Quotes. Copy the template's headers and structure, never its comment or
   its italic guidance notes; the rules live in the style guide. Key Quotes is mandatory: at
   least one, verbatim, with speaker. **Every bullet and every quote starts with the
   timestamp of its moment in the call** (`[14:22]`), in the transcript's own format; the user
   uses these to jump back into the transcript for context. A section with nothing in it is
   dropped, except Key Quotes. Five to seven bullets per section at most; more means the
   level of detail is wrong.
   - **Nothing in the file that was not said.** Every bullet and sub-bullet traces to words
     spoken at its timestamp. No purpose, reason, or "so that" clause unless someone said it.
     If you think unstated reasoning matters, put it in chat at the gate (step 4) under
     "My read, not in the file", and the user decides.
   - **A Non-Board Actionable needs an accepted, discrete ask.** The style guide's
     commitment test applies: a discrete thing to do, and either someone said they would do
     it or it was put to them directly and not declined. "We should look at that" is not an
     ask. Direction about who owns something is a Decision, not an action.
   - **You cannot see the board, so do not write as if you can.** This skill never fetches
     Asana. Anything a developer will build or fix goes under **Board Actionables** as the work and
     why it matters, with no owner, ending in `[unverified]`. It never appears as
     "<developer>: build X" under Non-Board Actionables, and never as "the user: add a card for X".
     `debrief` reads the board next and rewrites those lines with their cards. The
     split is defined in the style guide under "Non-Board Actionables versus Board Actionables".
   - Set the header's **Board reconciled** field to `pending`.

3. **Do not ask for an audience.** Tags on tracker rows are optional notes and filter
   nothing. Write new rows without one unless the user gives one.

4. **Show the signal block in chat and stop.** The user edits here, not in a collapsed tool
   pane. Also list, as a plain list: which tracker rows you intend to add, which existing
   tracker rows the call closed, and any new stakeholder. Say in one line that Board Actionables is
   unverified and gets settled by `debrief`, so the user only needs to correct what the
   draft got wrong about the call, not what the board will answer. If you have reasoning
   that is not in the file, add it under **My read, not in the file**. Wait for the go-ahead.

5. **Assemble the meeting file with code.** Path:
   `projects/<key>/meetings/YYYY-MM-DD_<slug>.md`, slug from the meeting title in kebab
   case (`2026-10-14_weekly-status.md`). Create the folder if it is missing.
   - Write the signal block (everything through the `---` above `## Full Transcript`) with
     one `Write` call.
   - Append the marker and the transcript with bash, never by typing transcript lines:
     ```bash
     printf '\n## Full Transcript\n\n' >> "projects/<key>/meetings/<file>.md"
     cat "<source transcript>" >> "projects/<key>/meetings/<file>.md"
     ```
   - Verify byte-exactness before reporting done:
     ```bash
     diff <(sed -n '/^## Full Transcript$/,$p' "projects/<key>/meetings/<file>.md" | tail -n +3) "<source transcript>" && echo VERBATIM-OK
     ```
     If `diff` prints anything, fix the assembly and re-run. Do not hand-patch the transcript.
   - If the source came from Fireflies, delete the scratchpad copy after `VERBATIM-OK`.
   - Any later edit to a meeting file touches only the text above `## Full Transcript`.

6. **Write the tracker and log, in one pass.** Row grammar is the one in `project-folder.md`;
   the symbols stay in the tracker because `agenda`, `debrief` and `tracker-hygiene` read them. Only the meeting
   file uses plain subheaders.
   - `projects/<key>/_log.md` → one Communication Log row: date, who, channel `call`, what
     (two sentences), outcome (`meeting file + N tracker rows`), source = the meeting file
     path, plus the Fireflies link if there is one.
   - `projects/<key>/_project-tracker.md` →
     - Decisions → Key Decisions row, Source = the meeting file.
     - Open questions → `- ? since:YYYY-MM-DD raised:0 — text` under the tier the user
       chose (default Important).
     - Observations that the project is treating as true → Unvalidated Assumptions.
     - Non-Board Actionables → `- → due:YYYY-MM-DD Owner: what — why` under the tracker's Action Items.
     - **Board Actionables writes nothing to the tracker.** No action row, no open question asking
       whether a developer did it, no "check the card exists" row. `debrief` decides
       what the tracker says about board work once it has seen the board.
     - Do not add an open question whose answer is board state ("did the fix ship?").
     - Anything the call closed moves to `_log.md` (Resolved Questions or Done Actions) in
       the same edit, with the meeting file as the source.
     - New people → Stakeholder Map with `[TBD: role]` rather than a guess.
     - Bump **Last Updated**.

7. **Hand off the board half.** If the file has a Board Actionables section, ask: "Run
   `debrief` now? It reads the board, attaches cards, and cleans up this file and
   the tracker to match." On yes, invoke the `debrief` skill with the meeting
   file path. On no, say that the file is still marked `Board reconciled: pending` and its
   Board Actionables lines are unverified until debrief runs. `debrief` can be run later
   from the meeting file on its own.

8. **Report in prose**: the meeting file path, the rows written with file paths, what
   closed, and whether debrief ran. The user does not open collapsed tool output.

## Hard rules

- Never retype, paraphrase, clean up, or "fix" transcript text. Transcript moves by `cat`,
  `sed`, or `cp` only. If you catch yourself typing dialogue, stop and use bash.
- Never modify the source transcript file the user handed over.
- Never write to Asana, Linear, GitHub, Slack, or Fireflies from this skill. Board writes
  are `debrief`'s job and go through pm-kit `add-card` and `add-comment`.
- Never read another project's folder to decide routing or to build the signal block.
- Never invent a name, date, role, owner, or timestamp. Write `[TBD: …]` and add an open
  question.
- Quotes are exact. If the transcript is garbled at the point of a good quote, pick another
  or note `[transcript unclear]` after it; do not repair the words.

## When things are ambiguous

- **No timestamps in the transcript:** replace the stamp with a short verbatim anchor
  phrase in quotes inside the brackets (`["go back to the spreadsheet"]`) so a search in the
  transcript lands on it. Omit the Duration field in the header.
- **Action item could be the user's or someone else's:** include it and flag it for the user.
- **Call spans two projects:** ask once, file under one, and add a single pointer line in
  the other project's log rather than two meeting files.
- **The call closes a question that is not in the tracker:** record the decision anyway;
  do not manufacture a question to close.
