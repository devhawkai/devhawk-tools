# The project folder

The local half of project management: one folder per project holding what the
board does not — the roadmap, open questions, decisions and their reasons, who
the stakeholders are, and what every call actually said. The board holds the
work; the folder holds the project. The skills that read and write it are
`project-planner`, `planning-docs`, `log-item`, `meeting-processor`, `debrief`,
`agenda`, `tracker-hygiene`, `project-brief` and `card-writer`.

It needs no factory, no repository and no credentials of its own. The board is
read live through whatever PM connection the user has (pm-kit's Asana tools, a
Linear MCP); cards are written only through `add-card` and `add-comment`.

## Where it lives

Resolve the folder root once per session, in this order:

1. `$DEVHAWK_PROJECTS_DIR`, when it is set.
2. The nearest directory, from the current one upward, that has a `projects/`
   folder containing at least one `projects/*/_project-tracker.md`.
3. Otherwise ask: "Where do you keep your project folders?" Offer to create
   `projects/` there, and tell the user they can add `export DEVHAWK_PROJECTS_DIR=<path>` to
   their shell profile so the question doesn't come back.

```
<root>/
  projects/
    <key>/                    one per project; <key> is short and kebab-case
      _project-tracker.md     current state only
      _log.md                 append-only history
      meetings/               one file per processed call
      agendas/                each final agenda
      assets/                 diagrams, exports, screenshots
      Vision_<slug>.md, Decision_<slug>.md, …   planning docs
    team/                     internal: people, tooling, how we work
  _templates/                 optional: your own versions of the templates
  _me/voice.md                optional: how you write
```

Paths in the skills are relative to `<root>`. Never read another project's
folder to decide something about this one; read tracker summaries only.

## Templates

`_templates/<name>` means: `<root>/_templates/<name>` if the user has one,
else the copy shipped with pm-kit at
`${CLAUDE_PLUGIN_ROOT}/skills/_shared/project-folder/templates/<name>`.

| Template | Used by |
|---|---|
| `project-tracker.md` | `project-planner` creates a tracker from it |
| `log.md` | `project-planner`; `tracker-hygiene` adds missing log tables from it |
| `meeting.md` | `meeting-processor` |
| `card-body.md` | `card-writer` |
| `project-brief.md` | `project-brief` |

Copy a template's headers and structure. Never copy its italic guidance notes
or comments into the user's file.

## Row grammar

Tracker rows start with a symbol, because other skills parse them. Tags
(`[me]` `[team]` `[dev]` `[client]`) are optional notes on who a row concerns;
never ask for one and never filter on one.

| Row | Section | Form |
|---|---|---|
| Open question | Open Questions → Urgent / Important / Deferred | `- ? [tag] since:YYYY-MM-DD raised:0 — text` |
| Action item | Action Items | `- → [tag] due:YYYY-MM-DD Owner: what — why / what it unblocks` |
| Assumption | Unvalidated Assumptions | `- ~ [tag] text` |
| Blocker | Where we are → Blockers | `- ■ [tag] since:YYYY-MM-DD what it blocks — the work, in a phrase · card <link>` |
| Decision | Key Decisions table | Date · Decision · Reasoning · Who Decided · Audience · Source |

- `raised:` counts how many agendas have carried a question; `agenda` increments it
  when an agenda is final. At 3 the user decides: escalate, park it in the log with
  a reason, or drop it.
- Default tier for a new question is Important; ask only when it is plainly
  blocking or plainly later.
- An action row is small, off-board work: a conversation, a question to chase,
  a decision to get. Work a developer does is a card, never an action row.
- Anything that closes moves to `_log.md` in the same edit: Resolved Questions,
  Done Actions, Superseded or Settled Decisions, Parked.
- Every edit bumps **Last Updated** in the tracker header.
- A new person goes in the Stakeholder Map with `[TBD: role]`, never a guess.

## Board sections

Read what a board's sections mean from the tracker header's `**Sections:**`
line when it has one, for example:

```
**Sections:** INBOX = new, unassigned, the PM triages · TODO = dev-ready · BACKLOG = on ice
```

Without that line, use pm-kit's convention (`asana-conventions.md`): INBOX is an
unvalidated idea, BACKLOG is validated and ready to schedule. Never assume one
board's meaning on another.

## Voice

Read `_me/voice.md` before drafting anything another person will read, when it
exists. Without it, write like this: no greetings, no sign-offs, no exclamation
points; "we" for shared work; plain sentences; state what is known and put
genuine unknowns in an Open Questions section instead of hedging.

## Rules every folder skill keeps

- **Never invent** a name, date, role, owner, estimate or requirement. Write
  `[TBD: what is missing]` and add an open question.
- **Show what you wrote** in the reply, in prose, with the file path. The user
  does not open collapsed tool output.
- **The tracker points, the board holds.** Never copy card contents or board
  state into the tracker or log; link the card.
- **Sources on cards are links anyone on the board can open** — a call
  recording, a Slack permalink. Never a local path: nobody else can open the
  user's folder.
- **Board writes go through `add-card` and `add-comment`**, never a raw create
  tool.
