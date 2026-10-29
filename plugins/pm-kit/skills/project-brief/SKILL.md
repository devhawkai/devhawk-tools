---
name: project-brief
description: >
  Writes or refreshes the project brief at the top of an Asana board's Agendas page tab: a
  five-minute read for a CEO (the client's or ours) on what the project is trying to achieve
  and what is in motion to get there. Built from the tracker roadmap plus the live board, in
  the shape of `_templates/project-brief.md`. Triggers on "project brief <project>", "overview
  for <project>", "refresh the brief", "update the overview", and the offer at the end of
  `tracker-hygiene`. Output is a local HTML file plus, on refresh, a list of line changes;
  the user updates the page by hand. Nothing is posted. NOT for vision docs or one-pagers (use
  planning-docs) and NOT for agendas (use agenda).
---

# project-brief

The brief is the one place the client, our team, and either CEO all look. This verb keeps it
honest: the why from an initiative's shape (goal, what done looks like, scope), the road from the tracker roadmap, the
status from the board on the day it is written.

**Where it lives.** At the top of the board's **Agendas** tab, an Asana "Page" (a shared
doc), above a divider line. Old agendas with comments sit below the divider. The Overview's
project description is not used: editing it needs board-admin rights a PM often lacks. The
user updates the page by hand; this skill never reads or writes it.

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/project-folder.md` first: where the folder is, the
templates, voice, and the rules every folder skill keeps.

## Inputs
- **project key**. One folder under `projects/`. Never two, never another project's files.
- **mode**: `new` (default when `projects/<key>/project-brief.html` does not exist) or
  `refresh` (default when it does). Refresh rewrites the date, the road, what could slow us
  down, and decisions; it leaves the goal, done, and scope alone unless the roadmap line
  changed.

## Steps

1. **Read the folder.** `_project-tracker.md` (Summary, roadmap, Blockers, Open Questions,
   Key Decisions, Stakeholder Map), any planning doc in the folder (`Vision_*`, `One-Pager_*`,
   an Initiative doc), the current `project-brief.html` if one exists, `_templates/project-brief.md`,
   and `_me/voice.md`.

2. **Refresh only: ask about the user's edits.** One question: "Did you change the brief in
   Asana since the last version? If so, paste it." If they paste it, fold their wording into the
   local file before drafting. Their wording wins.

3. **Fetch the board once** (pm-kit's `list_project_tasks`, or the Linear MCP's issue list). The result is large: save it and
   filter with a script, ignore DONE. Use it for two things: a status per roadmap step
   (In motion / Up next / Waiting on N / Done) and the facts behind each slow-down line
   (card state, who holds it, what the card says is left). Fetch, use, discard.

4. **Ask about gaps, all at once.** Any section that would need a `[TBD]` (no success
   condition on record, no named decider, a step with no visible card) becomes a question to
   the user in chat. Wait for answers. The page never carries a `[TBD]`.

5. **Draft** to the template's order and rules. The two judgment calls:
   - **What could slow us down** is the candid section. Pick the three to five things that
     hold up the earliest roadmap steps: Blocker lines first, then urgent open questions and
     stuck cards. Name people. Say where the work stands and who can move it; never "X hasn't
     done Y". Name our own side when we hold the next move.
   - **Decisions we need** names who decides. A client-side disagreement is a decision with
     both positions, not a conflict.

6. **Write** `projects/<key>/project-brief.html`: a doctype, a charset meta, a title, then a
   `<body>` using only Asana's rich-text tags (`h2`, `p`, `strong`, `em`, `a`, `ul`, `ol`,
   `li`). Overwrite the previous version. Send it to the user rendered.

7. **Hand off.**
   - **New:** The user opens the file in a browser, selects all, copies, and pastes it at the
     top of the Agendas page with a divider under it. Ask them for the page URL for the Files
     Index row.
   - **Refresh:** also give the changes in chat, grouped by section, one line each: the old
     line, then the new line, with lines that did not change left out. The user edits those lines
     on the page themselves, so they never have to repaste the whole brief over the old agendas.

8. **Log.** First time: add a Files Index row to the tracker with the page URL. Every time:
   one row in the log's Outward drafts table (kind `project brief`, audience `client + team`,
   sent as whatever the user reports). If the tracker has an action to create or update the
   overview, ask before closing it.

## Hard rules
- Never read or write the Asana page. The user updates it.
- Never put a `[TBD]`, an internal working norm, team capacity, or anyone's lateness on the page.
- The road is always a numbered list matching the tracker roadmap's numbers.
- Never invent a success condition, a decider, or an owner. Ask.
- Never copy the brief back into the tracker. The tracker points at the file and the page.
