# Decision Doc

A focused document that takes a single question and walks the reader through why it matters,
what the options are, and what the tradeoffs look like. Used when a project hits a fork in the
road and the team needs to make a deliberate choice rather than defaulting into one.

Example questions a decision doc might address:
- "What methodology should we use for tracking [metric]?"
- "Should the dashboard default to a per-account or per-org view?"
- "Do we build on the existing table component or adopt a new one?"

---

## Audience

Whoever needs to make or approve the decision — typically leadership or a cross-functional
group. The reader may not have deep context on the technical details, so the document needs to
make the question and the tradeoffs accessible without oversimplifying.

---

## Structure

```
# [Decision Topic] — Decision Doc

**Audience:** [me] / [team] / [client] / [dev]
**Date:** [date]
**Author:** [name]
**Project:** [which project this relates to]
**Status:** [Open / Decided — if decided, note the outcome]

---

## Why This Matters
1-2 short paragraphs. What decision needs to be made, and why does it matter?
What downstream consequences hang on this choice? Keep this tight — the
reader should understand the stakes quickly before moving to the options.

## Context
1-2 paragraphs of relevant background. What do you need to know to evaluate
the options? What's the current state? What constraints exist?

## Options

### Option A: [Descriptive Name]
A paragraph describing the approach, followed by:

**Advantages:**
- [specific, concrete advantages]

**Disadvantages:**
- [specific, concrete disadvantages]

**What this assumes:**
- [key assumptions that need to be true for this option to work]

### Option B: [Descriptive Name]
[Same structure as Option A]

### Option C: [Descriptive Name] (if applicable)
[Same structure]

## Recommendation
1-2 paragraphs. If you have a recommendation, state it and explain why.
If you don't have enough information to recommend, say so and name what
you'd need to know.

## Open Questions
Bulleted list of things that could change the recommendation or that need
to be resolved regardless of which option is chosen.
```

---

## Tone

Balanced and analytical. The document's credibility depends on presenting each option fairly —
if the reader feels like the analysis is tilted toward a predetermined conclusion, the document
fails. Present genuine tradeoffs, not straw men. The recommendation section is where you can be
opinionated; the options section should be honest.

---

## Common Mistakes

- **Straw-man options.** If Option B is obviously terrible and only exists to make Option A
  look good, the document isn't doing its job. Every option presented should be something a
  reasonable person could advocate for.
- **Missing the "why this matters" section.** Without stakes, the reader doesn't know how much
  attention to give this. A decision about icon colors is different from a decision about data
  architecture.
- **Recommendation without reasoning.** "We recommend Option A" is incomplete. Why? Under what
  conditions? What would change your mind?
- **Mixing decisions.** One doc, one decision. If you find yourself presenting options for two
  different questions, split it into two documents.
- **Not naming assumptions.** Every option rests on assumptions. Making them explicit is the
  difference between a decision that holds up and one that unravels when reality diverges.
