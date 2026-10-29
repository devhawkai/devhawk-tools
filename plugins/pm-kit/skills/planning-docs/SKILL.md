---
name: planning-docs
description: >
  Writes project planning documents — vision docs, one-pagers, technical briefs, and decision
  docs — with an outline-first workflow and a structured rejection protocol. Use when the user
  asks to write, draft, or create a planning document, says "vision doc", "one-pager",
  "technical brief", or "decision doc", wants a project's vision or rationale written up for
  stakeholders, asks to "write up" findings from planning, needs a document shaped for a
  specific audience (team, client, dev), or when project-planner hands off document
  generation. Do NOT trigger for Asana/Linear cards (use card-writer), generic document
  editing, or non-planning content.
---

# planning-docs

Works alongside **project-planner**, which manages the planning lifecycle and decides when a
document is needed. This skill handles the writing.

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/project-folder.md` first: where the folder is, the
templates, the row grammar, voice, and the rules every folder skill keeps.

## Steps

1. **Read context** — the project's tracker, any files the user references. Understand the
   project before writing about it.
2. **Identify the document type** (ask if not obvious):

   | The user needs... | Type | Reference |
   |---|---|---|
   | Full narrative: vision, rationale, scope | Vision Doc | `references/vision-doc.md` |
   | Short-form summary for quick alignment | One-Pager | `references/one-pager.md` |
   | Technically-oriented doc for the build team | Technical Brief | `references/technical-brief.md` |
   | Deep exploration of one decision: options, tradeoffs | Decision Doc | `references/decision-doc.md` |

3. **Read the matching reference file** for structure and guidance.
4. **Read `_me/voice.md`** before drafting anything — register, sentence habits, what to
   avoid.
5. **Produce a structural outline first** — heading structure, what each section
   communicates, the formatting approach per section (prose, bullets, table). Not content.
   **Wait for approval before writing the full document.** An outline catches a wrong
   structure in 30 seconds; 1,500 words of polished prose doesn't.
6. **Write the document**, section by section, per the approved outline and the style rules
   below.
7. **Save** to `projects/<key>/[DocType]_[short-description].md` (e.g.
   `Vision_reporting-v2.md`, `Decision_export-format.md`).
8. **Add a row to the tracker's Files Index** (`_project-tracker.md`) pointing at the new file.
9. **Confirm the file path** to the user.

## When output is rejected

Don't immediately rewrite — a fast fix on a misdiagnosed problem usually produces a second
miss. Instead:
1. Ask one specific diagnostic question.
2. Offer candidate causes: "Is it the formatting, the level of detail, the framing/language,
   or something else?"
3. Wait for confirmation of the root cause before changing anything.

## Style rules (all document types)

- **Audience line at the top of every doc**: `Audience: [me]` / `[team]` / `[client]` /
  `[dev]`. It says who the doc is written for. It is a note, not a release gate.
- Bold headers with a one-line descriptor for named features or concepts, then supporting
  bullets.
- Prose for narrative sections; specifics are illustrative examples ("Some examples are:"),
  not comprehensive lists.
- Confident and narrative, not hedging ("might," "could potentially") — state what the project
  does, and put genuine unknowns in Open Questions instead.
- Never invent a missing detail. Write `[TBD: …]` inline and collect it under an Open
  Questions section at the end.
- Paragraphs 3-5 sentences. `---` between major sections. Metadata header: title, audience,
  last updated, author.
- Follow `_me/voice.md`: no greetings, no sign-offs, no exclamation points, "we" for shared
  work.

## Hard rules

- Outline before full draft, every time a doc runs longer than a few paragraphs. Wait for
  approval.
- Never rewrite blind after a rejection — diagnose first.
- Every doc gets an audience line saying who it is written for.
- Saved file gets a Files Index row in the tracker — this skill doesn't restate tracker
  content, it points to the new file.
- Never invent owners, timelines, or metrics not present in context. `[TBD: …]` it.

## Reference Files

- `references/vision-doc.md`
- `references/one-pager.md`
- `references/technical-brief.md`
- `references/decision-doc.md`
