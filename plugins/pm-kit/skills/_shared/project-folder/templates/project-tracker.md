# Project Tracker — [Project Name]

**Key:** [short kebab-case project key, or `team`] · **Board:** [Asana/Linear link or "none"] · **Repo:** [org/repo or "none"]
**Created:** [date] · **Last Updated:** [date] · **Current Phase:** [phase number and name, or "steady state"]
**Sections:** [optional — what this board's sections mean, e.g. "INBOX = new, unassigned, the PM triages · TODO = dev-ready · BACKLOG = on ice". Omit to use pm-kit's convention.]
**New cards:** [optional — write `unassigned` to stop `debrief` assigning new cards to the owner the call named. Omit to assign.]

*CURRENT only. Anything closed moves to `_log.md` in the same edit. A row may carry a tag (`[me]` `[team]` `[dev]` `[client]`) as a note on who it concerns; it is optional and filters nothing.*

---

## Project Summary

[One paragraph: what it is, why it exists, what outcome it drives toward. Update as understanding deepens.]

## Where we are → where we're going

*This section is the roadmap, and the roadmap is the triage standard for everything else in this file. Every open question, action, blocker, assumption, and decision below must serve a numbered step here. A row that serves none is parked in the log by `tracker-hygiene`, or the roadmap grows a step. Keep this section honest first.*

**Today:** [Two or three sentences on the honest current state. Fetch the board for numbers; do not copy them here.]

**A → B:**
1. [Step or milestone. What has to be true for the next one to start.]
2. [Step or milestone.]

**Blockers:** *What stands between today and the next step, each pointing at its card. The line says why it matters; the card says who and when. No owner, no status, no "did X do Y yet". Remove a line the moment its card ships or the item stops blocking. `debrief` adds and links these; `tracker-hygiene` removes the ones whose card is done.*
- ■ [tag] since:[date] [what it blocks] — [the work, in a phrase] · card [link]

---

## Open Questions

### Urgent (blocking current phase)
- ? [tag] since:[date] raised:0 — 

### Important (needed soon, not blocking)
- ? [tag] since:[date] raised:0 — 

### Deferred (relevant later)
- ? [tag] since:[date] raised:0 — 

*`raised:` counts how many agendas have carried it. At 3, decide: escalate, park in the log with a reason, or drop.*

---

## Action Items

*Small actions that are NOT board cards: a conversation, a question to chase, a decision to get. Work a developer does is a card, never a row here. If it matters at project level, it is a Blocker line pointing at the card; otherwise the board alone holds it.*

- → [tag] due:[date] Owner: what — why / what it unblocks

---

## Unvalidated Assumptions

Things this project treats as true but has not confirmed. Each one is a risk.

- ~ [tag] 

---

## Key Decisions (still in force)

*A decision stays here while it still constrains a roadmap step that has not shipped. Once the work it governed is done, `tracker-hygiene` moves it to the log as settled.*

| Date | Decision | Reasoning | Who Decided | Audience | Source |
|------|----------|-----------|-------------|----------|--------|
| | | | | `[team]` | [log entry / Slack link / call] |

*Superseded decisions move to `_log.md`.*

---

## Phase Log

| Phase | Status | Started | Completed | Key Output |
|-------|--------|---------|-----------|------------|
| 1. Project Setup | | | | |
| 2. Prior Art Research | | | | |
| 3. Problem Framing | | | | |
| 4. Technical Discovery | | | | |
| 5. Solution Exploration | | | | |
| 6. Vision Documentation | | | | |
| 7. Level of Effort Estimation | | | | |
| 8. Consolidation into Shippable Initiative | | | | |
| 9. Update Solution Artifacts | | | | |
| 10. Tactical Documentation | | | | |

*(For a project taken over mid-flight, mark earlier phases "inherited" and note what evidence exists for each.)*

---

## Stakeholder Map

| Person | Org | Role | Involvement | Loop In At | Audience |
|--------|-----|------|-------------|------------|----------|
| | client / us | Decision-maker / SME / Observer | | [phases or milestones] | `[client]` / `[team]` / `[dev]` |

---

## Files Index

*One line per file or folder. Folders get one line, never one per file inside them.*

| File | What It Contains | Added |
|------|-----------------|-------|
| _project-tracker.md | This file | [date] |
| _log.md | Append-only history for this project | [date] |
| meetings/ | One file per processed call: signal on top, transcript below | [date] |
| agendas/ | Each final agenda | [date] |
