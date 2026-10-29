# Technical Brief

A technically-oriented document for the engineering and product team. Where the vision doc
describes what and why, the technical brief adds how — at a level of detail that helps
developers understand the scope, the technical approach, and the constraints before they
start writing code.

---

## Audience

Engineers, product managers, designers — the people who will build this. They're technical,
they want specifics, and they want to know what they're getting into. They don't need to be
sold on the idea — they need to understand it well enough to build it.

---

## Structure

```
# [Project Name] — Technical Brief

**Audience:** [me] / [team] / [client] / [dev]
**Date:** [date]
**Author:** [name]
**Related Docs:** [links to vision doc, decision docs, etc.]

---

## Summary
3-5 sentences. What is this project, what does it achieve, and why are we
doing it now? Assume the reader has context on the product but not on this
specific initiative.

## Scope
### In Scope (v1)
Bulleted list of what's included. Be specific — name features, UI changes,
data work. Each bullet should be concrete enough that someone could estimate it.

### Out of Scope (Deferred)
Bulleted list of what's explicitly deferred. This matters because it prevents
scope creep and manages expectations.

## Technical Context
What the team needs to know about the existing system:
- UI surfaces affected and how
- Data model: existing tables/fields involved, new ones needed
- Data gaps and how they'll be addressed
- API or pipeline dependencies
- Performance considerations

## Approach
The recommended technical direction. Not a full spec, but enough to align the
team on the general shape of the implementation. If there are alternatives
that were considered and rejected, note them briefly with the reason.

## Open Questions
Bulleted list of unresolved technical questions. Each one should name who
can answer it or what's needed to resolve it.

## Dependencies and Risks
- What needs to happen before this can start?
- What could go wrong or take longer than expected?
- Are there parallel workstreams this depends on or intersects with?
```

---

## Tone

Clear, specific, and honest about unknowns. Technical without being dense — a senior engineer
reading this should understand the scope and approach in 5 minutes. No marketing language. No
"this will revolutionize" — just describe what it does and how.

---

## Common Mistakes

- **Too vague on scope.** "Improve the tables" is not a scope statement. Which tables? What
  improvements? What's the user-visible change?
- **Missing the out-of-scope section.** This is as important as the in-scope section. Without
  it, everyone assumes their pet feature is included.
- **Handwaving the technical context.** If you don't know the data model implications, say so
  — don't skip the section. "We need to investigate this" is more useful than silence.
- **Specifying too much.** The technical brief frames the work — it doesn't replace technical
  design docs or PR descriptions. Leave room for engineering judgment on implementation
  details.
