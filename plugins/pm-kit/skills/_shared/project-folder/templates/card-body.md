# Card body template (Asana / Linear)

*Adapted from a Jira task template. This is what goes INSIDE a card that pm-kit `add-card` creates. The card is for developers and building agents: intent first, so the request is not solved as written; where to find the problem; explicit states and edge cases; testable acceptance criteria. Never invent a missing value: write `[TBD: …]` and list it under Dependencies & Open Questions. Feature tracking stays in the Asana Feature field, not in the body.*

*Use the exact headers and order. Skip a sub-bullet only when it truly does not apply; do not pad.*

*House rules from pm-kit (`skills/_shared/asana-conventions.md`): every card needs a **one-to-two-sentence description at the top** and a **`Source: …` line at the bottom**; `add-card` appends its own `Created-By` footer after the Source line. Cards drafted by `card-writer` get the full body below in every section, INBOX included. If an agent enriches cards on the board after they are created, check the card before adding more.*

---

[One or two sentences: what this card is and why. This is the Asana description the board shows; everything below is the detail.]

---

**Overview:**

[What is being done, in two to four sentences. A summary of the work, not reasoning: no rejected alternatives, no "not X because Y", no who-said-what.]

---

**Where:** [How a developer gets to the thing. The URL or route of the page (`/clients/123/holdings`), or the file, job, or endpoint if there is no page, plus the two or three clicks to reproduce it if it is not obvious. `[TBD: URL]` if nobody has it yet. A link beats a description.]

---

**Requirements:**

- **Functional Requirements**:
  - [What the system must do. Clear must/should language. Rules, calculations, decision logic.]
  - [UI: placement, interaction, defaults, user-visible labels and text.]
  - [API/data: inputs, outputs, schema, validation.]

- **States & Edge Cases**:
  - Empty data:
  - Partial data:
  - Unsupported data:
  - Permissions / access:
  - System error / timeout:
  - [User-facing message for each where there is a UI; fallback behavior where there is not.]

---

**Acceptance Criteria**

- [ ] [Observable, testable. "A user can…" / "The endpoint returns…" / "Given X, when Y, then Z."]
- [ ] [Include the soft ones that are easy to leave unsaid: look, feel, copy.]

---

**Dependencies, Assumptions, & Open Questions:**
- [Teams, APIs, data sources, other cards this waits on]
- [Decisions needed or missing details, including every `[TBD]` above]

---

**Visual:** [The test: does this work change or display anything in the UI? No → `not a UI card`. Yes, and an image is on the card → `screenshot attached`. Yes, and no image yet → `screenshot needed — [what it should show]`, plus the call timestamp `[ts]` when the card came from a call. Unsure → treat as yes. A developer sorts a UI card faster with a picture of the problem than with a description of it.]

---

Source: [pm-kit format — where the requirement came from: `2026-09-28 client call`, `Slack #channel 2026-09-28`, `ad-hoc — the user 2026-09-28`; plus a link anyone on the board can open: the Fireflies recording (`https://app.fireflies.ai/view/<id>`) or the Slack permalink. Never a local path]
