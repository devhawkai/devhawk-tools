# Phase Guidance

Detailed guidance for each phase of the planning lifecycle. Read the relevant section when
entering a new phase — don't load the whole file upfront.

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Prior Art Research](#2-prior-art-research)
3. [Problem Framing](#3-problem-framing)
4. [Technical Discovery](#4-technical-discovery)
5. [Solution Exploration](#5-solution-exploration)
6. [Vision Documentation](#6-vision-documentation)
7. [Level of Effort Estimation](#7-level-of-effort-estimation)
8. [Consolidation into Shippable Initiative](#8-consolidation-into-shippable-initiative)
9. [Update Solution Artifacts](#9-update-solution-artifacts)
10. [Tactical Documentation](#10-tactical-documentation)

---

## 1. Project Setup

### What to do
- Create `projects/<key>/` and gather raw inputs into it: transcripts, survey results,
  support tickets, data exports, screenshots, emails — anything that sparked or informed
  this project
- Initialize `_project-tracker.md` from `_templates/project-tracker.md` and `_log.md` from
  `_templates/log.md`
- Build the initial Files Index in the tracker

### Key questions to ask
- What kicked this off? (a client request, an internal observation, a strategic goal?)
- Is there a deadline or external pressure driving timing?
- Who already knows about this? Who should?
- Are there existing files or conversations to read?

### Stakeholder considerations
- Identify the core people early: who raised this, who will own it, who needs to approve it
- Populate the Stakeholder Map — even a rough first pass, tagged with the right audience, is
  better than empty

### What "done" looks like
Known raw inputs are in the project folder, the tracker has a first-pass Project Summary, and
the Stakeholder Map has at least the core people identified.

### Common pitfalls
- Analyzing before everything is gathered — the problem gets framed around the first file
  read, not the full picture
- Forgetting to ask about verbal decisions that were never written down

---

## 2. Prior Art Research

### What to do
- Search for related support requests, feature requests, or bug reports
- Check for past explorations of this problem space
- Look at whether adjacent features or workstreams have touched this area
- Check if any data or analysis already exists that's relevant

### Key questions to ask
- Has anyone asked for this before — client, internal team, support?
- Has anyone tried to solve this (or something similar) before? What happened?
- Are there related projects currently in flight that might overlap or conflict?
- Is there existing analysis or reporting that touches this space?

### Stakeholder considerations
- The people who raised the original issue are often the best source of prior art
- If past attempts exist, find out who was involved and whether they have context worth
  capturing

### What "done" looks like
You can confidently say "here's what already exists" — prior attempts, adjacent work,
available data — captured in the project folder and indexed in the tracker.

### Common pitfalls
- Treating this as a box-checking exercise instead of genuine research
- Missing adjacent workstreams that aren't obviously related but share dependencies
- Not asking about verbal knowledge that isn't documented anywhere

---

## 3. Problem Framing

The most important phase to get right. A bad problem frame leads to a well-executed solution
to the wrong problem. **Never skip this phase, and never accept the first framing
uncritically.**

### What to do
- Articulate the problem as currently understood
- Challenge the framing: root problem or symptom? Who actually experiences this, and how?
- Identify what success looks like — the outcome, not the solution
- Define what's explicitly out of scope for this framing exercise (not the build yet)
- Consider: what happens if we do nothing? How bad is the status quo?

### Key questions to ask
- Who experiences this problem most acutely? Walk through a specific scenario.
- What are they doing today to work around it?
- Is this a missing-capability problem, or is the capability there but hard to use?
- What would "solved" look like from the user's perspective? From the business's?
- Are there separate problems bundled into this one?
- What's the cost of not solving this?

### What "done" looks like
A clear, written problem statement the user has validated. Names the who, the what, the why.
Distinguishes root cause from symptom. Any assumptions in the framing land in the tracker's
Unvalidated Assumptions section.

### Stakeholder considerations
- Has the person who originally raised this validated the reframing, if it changed?
- Are there end users who should validate the problem statement before the team invests in
  solutions?

### Challenge patterns
- **Flip the audience:** "You've framed this for [user type A] — does the same problem exist
  for [user type B]? Same problem or a different one?"
- **Zoom out:** "This sounds like a specific instance of a broader gap. Right scope, or should
  we think about the pattern?"
- **Zoom in:** "You said '[users] want better visibility.' Which users, in what context, what
  decision are they trying to make?"
- **Question the premise:** "This assumes [audience] is the right target. Has that been
  validated, or is it an internal assumption?"

---

## 4. Technical Discovery

### What to do
- Map every UI surface this touches or could touch
- Identify data model implications — new tables/fields, changes to existing structures
- Surface data gaps: what does the solution need that doesn't exist today?
- Identify upstream dependencies (APIs, data feeds, other features that need to ship first)
- Check for intersections with parallel workstreams

### Key questions to ask
- Walk through the app today — which screens, tables, views does this touch?
- What data exists that's relevant? What's missing?
- Are there API or pipeline dependencies that need to be in place first?
- Does this interact with work currently in development?
- Are there performance concerns at scale?

### What "done" looks like
A clear map of the technical surface: what exists, what needs to be built, what's blocked,
what data gaps need filling. Documented in the project folder, summarized in the tracker.

### Stakeholder considerations
- Engineering leads know the system's actual constraints, not just its documented ones
- If discovery reshapes the solution space, give leadership an early heads-up

### Common pitfalls
- Surface-level scans instead of real investigation — "touches the accounts table" isn't
  enough; which columns, what joins, what scale?
- Missing the read vs. write distinction — does it just display data, or modify it?
- Missing pipeline work that looks small but is actually a prerequisite

---

## 5. Solution Exploration

About creativity and breadth. Generate genuinely different approaches, not two variations on
the same idea. Start broad and wild, then narrow based on what resonates.

### What to do
- Brainstorm radically different interfaces before refining anything. Don't filter for
  feasibility yet.
- Generate a diverse set — if options feel like minor variations, push harder.
- For each approach, probe its limits: when does it break? What interaction feels awkward?
  What needs to be guaranteed accurate, and can this approach deliver it?
- Once a direction emerges, narrow and add detail — wireframes, flow descriptions,
  interaction patterns.

### What gets explored
Not limited to UI/UX — "how does the user interface with this work?" covers mocks and flow
diagrams, methodology (how to calculate a metric), export formats, API interaction patterns,
workflow design, or any artifact that answers that question.

### Key questions to ask
- What are the wildest and most conventional approaches you can imagine?
- What constraints are truly hard (technical, compliance) vs. soft (convention, habit)?
- Are there patterns elsewhere in the product to follow or deliberately break from?
- For each approach: when does it break? What interaction feels unsafe at scale?
- Where does this need to be deterministic vs. where is approximation acceptable?

### Stakeholder considerations
- Designers and frontend engineers should see explorations early
- If the exploration is converging on something unconventional, flag it for leadership before
  the vision doc stage

### What "done" looks like
Genuinely different approaches explored with enough detail to react to — and the user has
reacted. The selected direction is documented with tradeoffs; hard design questions are
surfaced even if unresolved. All exploration artifacts live in the project folder.

### Common pitfalls
- Options too similar to be meaningfully different
- Polishing too early — these should be sketches, not specs, at the start
- Only exploring UI when the problem has non-UI dimensions
- Not stress-testing each option for its breaking point

---

## 6. Vision Documentation

Paints the full picture — not just v1, but where this could go. The most expansive, most
abstract artifact in the process. Emphasize the problem and the user; scoping discipline comes
in phase 8.

### What to do
- Hand off to **planning-docs** with doc type "vision doc"
- Provide problem framing, technical discovery findings, solution exploration output, and the
  intended audience
- Capture the full picture — where this initiative could go over multiple releases
- Emphasize the problem and user experience over technical approach
- Explore the outer edges of what's possible if there were no constraints
- Review the output against the planning context so nothing important was lost or
  mischaracterized

### Key questions to ask
- Who's the primary audience? (leadership, client, internal team, all of the above?)
- What tone should it strike?
- What's the most ambitious version of this you can imagine?
- Are there future capabilities worth planting a flag on, even years out?
- Anything to specifically emphasize or de-emphasize?

### Stakeholder considerations
- Often the first artifact leadership or a client sees — the user should review before sharing
- If the vision is broader than stakeholders expect, frame that clearly: "this is the full
  vision; v1 scope is defined separately"

### What "done" looks like
A narrative document capturing the full ambition — what it is, why it matters, who it's for,
what it looks like fully realized. Someone outside the project can read it and understand both
immediate value and long-term potential. The user has reviewed it and it reflects their intent.

---

## 7. Level of Effort Estimation

### What to do
- Break the project into estimable chunks (logical work units, not cards yet)
- For each chunk: a t-shirt size (S/M/L/XL) and a time range
- For each chunk: certainty level and the assumptions it rests on
- Identify dependencies between chunks
- Run a tail risk assessment — name the assumptions or dependencies that, if they fail, would
  sink the project. Not generic "risks" — the things that could actually break it.

### Key questions to ask
- Where is effort genuinely unknown because this hasn't been done before?
- What's the team capacity or timeline constraint?
- What can be parallelized vs. must be sequential?
- Worst case: what's the one thing that would hurt most if it went wrong?
- Any external dependency where a delay would cascade?

### Stakeholder considerations
- Engineering leads should review estimates — they'll catch sizing errors and hidden
  complexity
- If estimates run larger than expected, surface that now, not after commitment

### What "done" looks like
A rough effort breakdown with certainty levels and assumptions per chunk. Tail risks named.
The user agrees it's a reasonable starting point. Blockers and dependencies called out.

### Common pitfalls
- Estimating without surfacing the conditions the estimate depends on
- Treating all uncertainty as equal
- Precision theater — hour-by-hour estimates this early are false confidence
- Ignoring tail risk in favor of "how long will this take"

---

## 8. Consolidation into Shippable Initiative

Narrows the broad vision to an agreed v1 scope. Two artifacts:
1. **A v1 summary doc** — via **planning-docs**, same vision-doc format but scoped to what's
   shipping now. Readable by anyone in the company, including but not limited to developers.
2. **Cards** — via **card-writer**, once scope is firm. Card-writer drafts task-level cards
   only today; group related cards under a shared Asana/Linear theme or epic field rather than
   a separate initiative artifact.

### What to do
- Produce the v1 summary doc, explicit about what's in scope and what's deferred, and why
- Once scope is firm, draft cards via **card-writer** for the work items
- Verify v1 scope is consistent across vision doc, technical discovery, effort estimates, and
  the new summary
- Make sure open questions are documented, not hidden, and none of them block starting
- Check nothing discussed verbally was left out of the documentation

### Key questions to ask
- Is the v1 scope agreed? Does it deliver value without overreaching?
- Anything still unresolved that would block a developer from starting?
- Who needs to sign off before this becomes "the plan"?
- Anything discussed that didn't make it into any document?
- Does the deferred list feel right?

### Stakeholder considerations
- A natural sign-off point — leadership should see and approve v1 scope before commitment
- The summary doc should be readable company-wide, not just by the project team
- If v1 is much smaller than the broad vision, frame that delta explicitly

### What "done" looks like
An agreed v1 scope. The summary doc and the drafted cards are consistent with each other and
with the broader planning artifacts. Anyone can read the summary and understand what's being
built and why. Stakeholders have signed off.

---

## 9. Update Solution Artifacts

Always invoke this immediately after phase 8 — scoping v1 almost always changes something.
Recurs throughout the project's life beyond that.

### What to do
- After v1 scoping: revisit phase 5 artifacts and reconcile them with the agreed scope
- As the project evolves, check planning docs against current reality
- Flag drift specifically — what changed, what needs updating, not a vague "update this"
- Update the tracker to reflect current state

### When to invoke
- Immediately after phase 8 (always)
- After a stakeholder conversation that changes direction
- When development surfaces something unanticipated
- When scope changes
- When the user explicitly asks to "update the docs" or check everything is current

### What "done" looks like
All planning artifacts reflect current reality. The tracker is current. Nothing in the docs
would surprise someone who's been following the project closely.

---

## 10. Tactical Documentation

### What to do
- Assess whether planning artifacts are solid enough to draft cards from
- If yes, suggest the user invoke **card-writer**
- Help identify which artifacts map to which cards
- If not ready, name what's missing

### Key questions to ask
- Ready to start breaking this into cards, or is there more planning to do?
- Which parts of the project should become the first cards?
- Any parts clear enough for a card but not yet for detailed acceptance criteria?

### What "done" looks like
the user has drafted cards via card-writer that accurately reflect the planning work, consistent
with the vision doc and effort estimates.
