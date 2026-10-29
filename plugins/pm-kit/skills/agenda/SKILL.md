---
name: agenda
description: >
  Draft a tight, owner-tagged agenda for a project's next call, led by a stack-ranked
  Priorities (as of M/D) recap, then short bullets ordered client action items → pressing →
  outages → carry-over → upcoming meetings. Reads the project folder (tracker, recent meeting
  files, the last agenda) and the board; works on any board pm-kit can reach. Saves the final
  agenda to the folder and counts each open question it carried (`raised:`). Output stays in
  chat; you send it. Triggers on "/agenda <project>", "agenda for today's call", "set the table
  for this week", "prep the <project> meeting", "week-ahead agenda", "priorities recap". NOT for
  processing a call afterwards (`meeting-processor`, then `debrief`) and NOT for a status page
  (use milestone-mapper).
---

# agenda

An agenda the reader absorbs in thirty seconds. **The failure mode is density**: a dense
multi-paragraph report is a rejected agenda however accurate it is.

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/project-folder.md` first: where the folder is, the
row grammar, and the rules every folder skill keeps.

A weekly "set the table" request covers **all** of the previous week's calls for the project,
not only the most recent one.

## Step 1: Gather

1. **The tracker**: Where we are → where we're going, Blockers, Open Questions (every tier,
   with `raised:`), Action Items, and the Stakeholder Map (its Org column says who is on the
   client side).
2. **The last agenda** in `projects/<key>/agendas/`. Its Priorities block is the running
   stack rank you carry forward. No previous agenda means you are seeding the rank.
3. **The signal blocks of the meeting files since the last agenda** in
   `projects/<key>/meetings/`: decisions, open questions, commitments, explicit deferrals. Read
   the transcript below the signal only to check a specific point.
4. **The board**, for workstream status and owners, through whatever PM connection the user
   has (pm-kit's Asana tools, or a Linear MCP). In-flight columns only.
5. **Side channels**, if the user names one or one is connected (a Slack channel, an email
   thread): only to find items already resolved, so the agenda does not raise dead ones.

If there is no project folder, say so and offer `project-planner`. An agenda built from the
board alone drops every commitment made out loud, which is most of them.

## Step 2: Verify before listing

- **Deferred is not open.** Before listing an item, confirm the client did not already say it
  is fine for now, or park it. Resurrected items are the most common correction this skill
  gets.
- **Client-owed items are sourced, not inferred.** A client item is a concrete, still-open ask
  with a consequence. Venting in a team channel is framing, not an action item. Drop asks a
  workaround has already made moot.
- **Owners are exact.** Each item's owner is whoever owns it per the meeting file and the
  board's assignee, not whoever mentioned it.

## Step 3: Structure (fixed order)

The agenda LEADS with the Priorities block, so line one is always what the client cares about
most.

**Priorities (as of M/D)**, always first, and it doubles as a standalone recap:

- Start from the last agenda's rank and keep its P0…Pn numbering as the baseline.
- **Drop** anything shipped or resolved since. **Add** new items, each flagged `(new)` right
  after the P-number. **Re-rank** to the order the client stated on the latest call; the
  client's order wins over last week's.
- One line each: `P0 — <topic>: <next step + owner + when>`. Never a bare status.
- `(new)`, not `**`: the owner on the same line is already bold, and a stray `**` bolds the
  wrong span in Markdown and in a Slack paste.
- Close with a `cc: <names>` line so the block stands alone as a postable recap.
- About six lines at most. Anything that is not a real priority this week belongs below.

Then the working detail, which may overlap the rank on purpose:

0. **Client Action Items**, conditional: the few client-side items that need airtime or a
   decision on this call, grouped by client-side owner. Title it exactly **Client Action
   Items**, phrase each line as a plain forward request, and omit the section when nothing
   qualifies.
1. **Pressing from last week**, conditional: only new or unresolved client-facing fires. Not
   the progress of in-flight work, which is carry-over. Omit when nothing is new.
2. **Outages / availability**: who is out, capacity windows. Omit if none.
3. **Carry-over items**: active workstreams by topic, each with owner, status and a concrete
   target when known. Group by the board's themes or Features, so the agenda and the board use
   the same names.
4. **Open questions**: the tracker's Urgent and Important questions this call can answer, one
   line each, owner of the answer in bold. Leave out a question no one on this call can
   answer.
5. **Upcoming Meetings**, conditional: calls that need a time or attendees confirmed on this
   call. Omit otherwise.

## Step 4: Format rules

- One line per item, **owner in bold** with the item: `**Rate shop V1 → V2 (Priya)**`.
- **Forward framing.** Every Priorities and Carry-over line resolves to next step + owner +
  when, phrased to invite the client's input. "Rate shop: Priya + Jack scope Tue, then we give
  a testing turnaround" drives a discussion; "Rate shop: in progress" stalls it. A line that
  cannot name a next step is not ready for the agenda.
- No prose sections, no inline citations, no summaries below the Priorities block.
- **No table pipes.** `|` breaks a Slack paste. Plain bullets only.
- Keep it client-safe: no sore points or internal noise in anything the client may see.
- Off-topic strategic items go to the milestone tracker (`milestone-mapper`), not here.

## Step 5: Deliver, then record

1. **Return the agenda in chat.** Do not post, send or schedule it. A corrected version coming
   back usually means "this is what I sent", not "send this".
2. **Once the user says it is final** (or sent), save it as
   `projects/<key>/agendas/YYYY-MM-DD.md`, exactly as final. The next agenda's Priorities start
   from this file.
3. **Count the questions it carried.** For every tracker open question that appears in the
   final agenda, increment its `raised:` by one. Any question that reaches `raised:3`: say so in
   one line; `tracker-hygiene` asks the user to escalate, park or drop it. Bump **Last
   Updated**.
4. One Communication Log row in `_log.md`: channel `agenda`, outcome `agenda saved · N questions
   raised`, source the agenda file.

## What this does not do

- **It does not write to the board.** Everything here is a read. Use `add-card` or
  `add-comment` if something needs recording.
- **It does not process a call afterwards.** That is `meeting-processor`, then `debrief`.
- **It does not touch the tracker before the agenda is final**, and it changes nothing there
  except `raised:` counts and Last Updated.
