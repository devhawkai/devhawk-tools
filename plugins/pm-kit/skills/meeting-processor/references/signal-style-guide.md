# Signal style guide

How to write the block at the top of a meeting file: Summary, Decisions, Open Questions,
Observations, Non-Board Actionables, Key Quotes. Sections are plain subheaders; the section tells the
reader what kind of thing a bullet is, so bullets carry no symbol prefix.

All examples below are invented. Northwind Freight, its dispatch console, and the people
named do not exist.

---

## Timestamps

Every bullet in Decisions, Open Questions, Observations, and Non-Board Actionables, and every quote,
starts with the timestamp of the moment in the call it came from, in square brackets, in
the transcript's own format: `[14:22]` or `[01:14:22]`. This is how the user jumps from a bullet
back into the transcript for context, so it is not optional.

- A bullet that draws on more than one moment lists them: `[14:22, 41:05]`.
- A sub-bullet carries its own stamp only when it comes from a different moment than its
  parent.
- The Summary has no stamp.
- If the transcript has no timestamps, use a short verbatim anchor phrase from the
  transcript instead, in quotes inside the brackets: `["go back to the spreadsheet"]`. Pick
  words a search will land on once.
- Never guess a stamp. If the moment cannot be located, use the anchor-phrase form.

## Framing

**Lead with the insight, not the event.** A bullet answers: what does someone need to know
coming into this project cold? Who said it and when is secondary.

- Weak: "[18:40] Priya said the driver app should get offline mode before the map redesign."
- Better: "[18:40] Offline mode ships before the map redesign; drivers lose signal in the yard and
  the map is useless without location (Priya)."

Attribution goes at the end in parentheses, only when it affects credibility, ownership, or
follow-up. Leave it off when the point stands on its own.

## Voice and length

One idea per bullet. A bullet past two lines is usually two bullets. Five to seven bullets
per section at most; beyond that, merge bullets that point at the same thing and cut
anything the transcript already holds that does not inform future action.

**Nothing that was not said.** Every bullet and sub-bullet traces to words spoken at its
timestamp. The file records the call; it does not explain it. No purpose, reason, or "so
that" clause unless someone said it. Reasoning the writer thinks is missing goes in chat at
the draft gate, never in the file.

Sub-bullets earn their place only when they add a condition, exception, or piece of
evidence that changes how someone acts on the parent. One level of nesting. Use them in
technical and data calls where conditions matter; use them rarely in strategy calls.

---

## Summary

Two or three sentences. What the call was for, where it landed, what changed since last
time. Written so the user can decide in ten seconds whether to read further.

```
Weekly status with Northwind on the dispatch console. Load-matching v2 is in QA and the
client agreed to a two-week pilot with the Dallas yard only. The carrier-rating feature
was pushed to Q1 pending legal review.
```

---

## Decisions

State the outcome directly. Include scope, conditions, or exceptions as sub-bullets when
they would change how someone acts on it.

```
- [22:10] Dallas yard pilots load-matching v2 for two weeks starting Nov 3; Houston waits for
  pilot results
  - Pilot runs on live loads, not a sandbox
  - Rollback is a feature flag, no data migration involved
- [37:55] Carrier-rating feature moves to Q1; legal wants the dispute flow reviewed first (Marcus)
```

## Open Questions

State what is unknown. Add a sub-bullet for what would resolve it or who owns the answer,
if that came up.

- **Frame it at the level where it gets decided.** If one person's request exposed a
  larger question, write the larger question. "Whether operations gets a dedicated
  infrastructure budget", not "who is Dana's dedicated person". Pick Key Quotes the same way.
- **Drop a question the same call made moot.** If a later decision on the call removes the
  reason to ask ("was the sync ever run?" after the team agreed to wipe and reload), it is
  not an open question.
- **A question the board would answer is not an open question.** "Did the fix ship?" is
  board state. Leave it out; `debrief` reads the board.

```
- [25:03] Whether pilot drivers need the new mobile build or can stay on 3.4
  - Dana to check with the fleet lead; blocks the pilot start date
- [29:41] What "acceptable match rate" means for calling the pilot a success
```

## Observations

State the insight. Add supporting evidence as a sub-bullet only when it is specific enough
to be useful later.

```
- [08:15, 33:20] Dispatchers keep asking for the same three filters (lane, equipment, pickup window),
  which suggests the saved-view feature matters more than the roadmap shows
  - Priya and Marcus raised it independently on separate calls
- [41:02] Client tends to agree on the call and reopen in email; confirm decisions in writing
```

---

## Non-Board Actionables versus Board Actionables

Two sections, split by one test: **does this get done on the board?**

The user is the project manager. They do not track whether a developer did a piece of work;
the board does that. So work a developer will do is never written as a person's action
item. It is written as the work itself, under Board Actionables, and `debrief` attaches
the card. What the user reads afterward is "this matters because X, here is the card", never
"did Tomas do Y yet?"

| On the call | Goes in | Written as |
|---|---|---|
| "Tomas will fix the export bug" | Board Actionables | The export bug and why it matters. No owner |
| "Someone should rebuild that modal" | Board Actionables | The modal rebuild and what it blocks |
| A bug someone noticed in passing | Board Actionables | The bug and where it shows. Also an Observation only if it says something larger |
| "Tomas, can you pull a sample so we can see the values?" | Nothing on its own | A step inside a card. Fold it into the Board Actionables line it serves, or drop it |
| "the user, set up the test plan with Dana" | Non-Board Actionables | A person and a commitment |
| "Dana will ask the vendor" | Non-Board Actionables | A person and a commitment |
| "Marcus will raise staffing with the execs" | Non-Board Actionables | A person and a commitment |

Never write "the user: add a card for X" as an action item. Creating the card is what
`debrief` does with a Board Actionables line; it is not a commitment worth tracking.

## Non-Board Actionables

Commitments that live off the board: a conversation to have, a question to chase, a
decision to get, something to send. Each item is self-contained: the reader should not need
a Decision bullet to understand what is owed or why.

Format:

```
- [timestamp] [Person or team]: [what they committed to] — [why it matters / what it unblocks]
```

### The commitment test

A line goes here only if both hold:

1. **A discrete thing to do.** Something that can be done and seen to be done: send, ask,
   confirm, set up, decide by. "Think about X" and "keep an eye on Y" fail this.
2. **It was accepted.** Either the owner said they would do it, or it was put to them
   directly and they did not decline. "Put to them directly" means the ask named the thing
   and was addressed to a person or a team, and the reply was not a no. The owner can be a
   team: "ok, so the DevHawk team owes us the revised estimate by next week" is a valid
   line, owner "DevHawk team".

What fails the test is filed by what it really was:

- Direction about who owns something ("that data belongs with your team") is a Decision.
- "We should look at that", with no one taking it, is an Observation.
- An ask made to the room that nobody picked up is an Open Question, if it is still worth
  answering.
- If it is unclear whether the ask was accepted, it goes under Observations marked
  "(possible action, not committed)". Do not promote it on a guess.

Rules:

- Always include the why inline: what it unblocks, who it is for, what slips if it does not
  happen.
- When an item resolves an open question, say so.
- The user's items in full. Other people's items only when they affect the user's work or create
  a dependency.
- Flat. No sub-bullets.

```
- [30:12] the user: Send the pilot success criteria draft to Priya by Friday — resolves the open
  question on match rate; Northwind will not schedule driver training without it
- [25:40] Dana: Confirm with the fleet lead which mobile build the Dallas drivers are on —
  blocks the Nov 3 start
- [38:30] Marcus: Get legal's written list of concerns on the dispute flow — determines whether
  carrier rating is a Q1 build or a Q2 build
```

## Board Actionables

The work, why it matters to the project, and no owner. `meeting-processor` cannot see the
board, so every line it writes ends in `[unverified]`. It does not guess whether a card
exists, and it does not ask the user to confirm one.

Format before `debrief` runs:

```
- [timestamp] [The work, in a phrase] — [why it matters: what it blocks or unblocks] · [unverified]
```

Format after `debrief` reconciles the file:

```
- [timestamp] [The work, in a phrase] — [why it matters] · card [link] ([existing / new / comment added])
```

Rules:

- State the project-level weight when the call gave one: "blocks the pilot", "one of two
  remaining blockers for client testing". That weight is what the tracker will carry.
- One line per piece of work. Steps inside it are folded in, not listed.
- If two moments in the call are about the same piece of work, one line, both timestamps.
- Flat. No sub-bullets. No assignee, even when the call named one.

```
- [08:00] Synced notes show raw HTML when the text has bold in it — visible in the first
  thing pilot dispatchers will try · [unverified]
- [26:27] Manual load-entry modal, built from Priya's mockup — one of two remaining blockers
  for the Dallas pilot · [unverified]
```

After reconciliation:

```
- [08:00] Synced notes show raw HTML when the text has bold in it — visible in the first
  thing pilot dispatchers will try · card https://example.test/card/4411 (new)
- [26:27] Manual load-entry modal, built from Priya's mockup — one of two remaining blockers
  for the Dallas pilot · card https://example.test/card/3907 (existing, comment added)
```

---

## Key Quotes

Mandatory section. One to three quotes per call. A quote earns its place when it would
change how someone thinks about the project or a decision: a constraint stated plainly, a
strong framing, a moment of clarity the bullets above do not fully carry.

Quotes are verbatim from the transcript. Do not clean grammar, tighten phrasing, or
paraphrase. If the transcript is garbled at that point, choose another quote or append
`[transcript unclear]`.

Format:

```
> [timestamp] "[exact quote]" — Speaker
```

Quotes that clear the bar:

```
> [14:22] "If a dispatcher has to click more than twice to find the load, they'll go back to the
> spreadsheet." — Priya

> [31:05] "We're not buying a map. We're buying fewer phone calls." — Marcus
```

Quotes that do not clear the bar:

- Restates a Decision bullet without adding color
- Confirms something already clearly decided
- Interesting but would not change how anyone acts

If only one quote clears the bar, one is enough. Do not pad to three.
