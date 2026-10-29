# Vision Doc

The flagship planning document. A full narrative that captures what the project is, why it
matters, who it's for, and how it works — at a conceptual level, not a technical spec level.

---

## Audience

Leadership, clients, or anyone who needs to understand the full picture. The reader may not be
technical. They need to walk away understanding the project's purpose, scope, and shape
without reading code or specs.

---

## Structure

```
# [Project Name] — Full Vision

**Audience:** [me] / [team] / [client] / [dev]
**Last Updated:** [date]
**Author:** [name]

---

## What This Is
One to two paragraphs. What is this project, at the highest level? What does it
enable that doesn't exist today? Be specific enough to be meaningful, conceptual
enough to be accessible.

---

## The Opportunity
Two to three paragraphs. Why does this matter? What gap exists today, and what are
its consequences? What becomes possible once this gap is closed? This is the
narrative heart of the document — it should make the reader feel the weight of the
problem and the value of solving it.

---

## The Vision
The bulk of the document. Organized into logical sections that describe the
solution conceptually. Each section should have:
- A clear heading (### or ####)
- Prose that explains the concept and why it matters
- Bold subheadings with descriptor lines for named features or components
- Bulleted examples where helpful (framed as "Some examples are:")

This section can be as long as it needs to be. The depth should match the
complexity of the project.

---

## Who This Is For
One to three paragraphs describing the primary users and their orientations.
Not just job titles — describe how different users would actually use this,
what questions they're trying to answer, what mode they're in.

---

## Considerations and Open Questions
Named considerations with a brief paragraph each — things like data dependencies,
infrastructure requirements, compliance concerns, adjacent workstreams.

Followed by an explicit Open Questions list — things that need answers but
don't have them yet. Framed as questions, not problems.
```

---

## Tone

Confident, narrative, forward-looking. This document describes a future state as if it's
already understood — the reader should feel like the thinking is done, not that it's still
being figured out. Open questions are collected in their own section, not scattered through
the prose as hedges.

---

## Common Mistakes

- **Too technical.** If you're describing database schemas or API endpoints, you've gone too
  deep. Describe what the user experiences, not how it's built.
- **Too vague.** "This will improve the experience" says nothing. What specific capability
  does the user gain? What question can they now answer?
- **Comprehensive lists instead of illustrative examples.** Don't try to enumerate every
  metric or feature. Give enough examples to convey the concept, then let the reader
  extrapolate.
- **Missing the narrative.** The Opportunity section should tell a story — here's the world
  today, here's what's broken, here's what it looks like when it's fixed. If it reads like a
  bullet list of problems, it's not working.
