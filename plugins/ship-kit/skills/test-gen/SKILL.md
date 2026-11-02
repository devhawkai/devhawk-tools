---
name: test-gen
description: >
  Generate and run tests for recently written feature code. Writes one test per
  acceptance criterion of the active card, then reads the diff, categorizes
  changes, and produces unit tests (Vitest), integration tests (Vitest + DB),
  and E2E tests (Playwright) following DevHawk conventions.
  Triggers on "write tests", "generate tests", "test this feature", "qa",
  "add tests", "test-gen", or any request to create tests for recent work.

---

# Test Generation

Generate tests for recently changed code. Read docs/testing-patterns.md before writing any test.

Tests check what was **asked for**, not only what was built. A suite derived from the diff alone
confirms the code does what the code does. So the acceptance criteria come first, and the diff
fills in the rest.

## Step 0: Resolve the stack

```bash
eval "$(node ${CLAUDE_PLUGIN_ROOT}/skills/_shared/stack-profile.mjs --env)"
```

**If `$FACTORY_LANGUAGE` is not `typescript`, stop following the templates below.**
The file-pattern table and the code samples in this skill are Vitest/Playwright
against a Next.js layout; emitting them on another stack produces tests that
cannot run. Instead: read the project's own `docs/testing-patterns.md` and its
existing tests, mirror those conventions, and keep only the stack-independent
discipline from this skill — a test per acceptance criterion, the unit /
integration / e2e split, what to always test and what never to test, and running
the suite before handing back.

The run commands resolve either way, so Step 5 below is correct on any stack.

## Step 1: Read the acceptance criteria

Criteria come from the first of these that exists, used **verbatim**:

1. `--criteria=<file>`: one criterion per line, blank lines and `- ` bullets ignored
2. `acceptanceCriteria` in `.devhawk-work.json` (written by `next-task`)
3. the user's request

If there are none (or `acceptanceCriteriaSource` is `none`), say so before generating anything:
"There are no acceptance criteria, so these tests can only check the code against itself." Ask
whether the user wants to give some. **Never write criteria yourself**: a criterion the agent
invented is one it then marks itself as passing.

## Step 2: Detect what changed

```bash
BASE=$(git rev-parse --verify origin/develop 2>/dev/null && echo develop || echo main)
git diff "$BASE"...HEAD --name-only
```

Categorize each changed file:

| File pattern | Category | Test type |
|---|---|---|
| `lib/db/schema/*.ts` | Schema | Unit (Vitest) |
| `"use server"` in file | Server Action | Integration (Vitest + DB) |
| `app/api/*/route.ts` | API route | Integration (Vitest) |
| `lib/jobs/processors/*.ts` | BullMQ processor | Unit (Vitest) |
| `app/**/page.tsx` (new critical flow) | User flow | E2E (Playwright) |
| `components/**/*.tsx` | UI component | Skip — don't test shadcn/ui internals |
| `lib/ai/*.ts` | AI tool/agent | Unit (Vitest, mock provider) |

## Step 3: Generate tests

### Acceptance criteria → one test each

Do these first. For each criterion:

- Look for an existing test that already asserts it (`feature-build` writes them before the code).
  Keep it; don't write a duplicate.
- Otherwise write one, named after the criterion, that asserts the behaviour it describes: what
  the action returns, what is stored, what the user sees. Choose unit, integration or E2E by
  where that behaviour is observable, using the category table above.
- Add the edge cases the criterion implies, where they apply: boundary values, empty and maximum
  input, unauthenticated, another tenant's or user's record, an illegal status transition, a
  double submit.

Then generate the category tests below for what changed that no criterion covers.

### Schema → Unit test

For each new/modified schema file, generate `tests/unit/[domain].test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { insertXSchema } from "@/lib/db/schema/[domain]";

describe("insertXSchema", () => {
  it("accepts valid data", () => { /* valid input → success */ });
  it("rejects missing required fields", () => { /* partial input → failure */ });
  it("rejects invalid values", () => { /* out-of-range, wrong type → failure */ });
});
```

### Server Action → Integration test

For each Server Action, generate `tests/integration/[action].test.ts`:
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";

describe("[actionName]", () => {
  it("returns { success: true } with valid input", () => { /* happy path */ });
  it("returns { success: false } without auth", () => { /* no session → unauthorized */ });
  it("validates input with Zod", () => { /* invalid input → error message */ });
  // Org variant: it("filters by organizationId", () => { /* wrong org → not found */ });
  // Solo variant: it("requires admin role for admin-only mutations", () => { /* role=user → forbidden */ });
});
```

### API route → Integration test

For webhook routes, test signature verification + correct status codes. For external API routes, test auth + response shape.

### BullMQ processor → Unit test

Test the processor function directly with mock job data. Verify it returns expected results and handles errors by throwing (BullMQ retries).

### E2E → Playwright spec

**Only for critical user flows** — auth (sign up, sign in), core workflow, payment. Not every page.

Generate `tests/e2e/[flow].spec.ts`:
```typescript
import { test, expect } from "@playwright/test";

test("[flow description]", async ({ page }) => {
  await page.goto("/[starting-page]");
  // interact with elements
  // assert final state
});
```

Use the **Playwright MCP** (if available) to interact with the running app and derive selectors from real page state instead of guessing. Start the app first: `$FACTORY_DEV`.

## Step 4: Write test files

Follow naming conventions from docs/testing-patterns.md:
- `tests/unit/[module].test.ts`
- `tests/integration/[module].test.ts`
- `tests/e2e/[flow].spec.ts`
- Describe: module or feature name
- It: plain English starting with a verb

## Step 5: Run tests

```bash
eval "$FACTORY_TYPECHECK"  # the test files too: a mock with the wrong shape tests nothing
eval "$FACTORY_TEST"       # unit + integration
eval "$FACTORY_TEST_E2E"   # end-to-end (if specs were generated)
```

Iterate until green, but **the criterion decides what to fix.** When a test fails, check its
expectation against the criterion or the code's documented contract:

- The code is wrong → fix the code.
- The test misread the criterion → fix the test, and say which one and why in the report.
- Never weaken, skip or delete an assertion just to get green. A test loosened until it passes
  has stopped testing.

Common issues that are neither:
- Integration tests need the DB running (`docker compose up -d`)
- E2E tests need the app running (`$FACTORY_DEV`)
- Missing env vars in test context

## Step 6: Report

> **Acceptance criteria:**
> | Criterion (verbatim) | Test |
> |---|---|
> | [criterion] | `[file] > [test name]` |
>
> **Tests generated:**
> - Unit: [N] files, [N] test cases
> - Integration: [N] files, [N] test cases
> - E2E: [N] specs
> All passing.

A criterion with no passing test is not done: list it under the table as uncovered, and say why.
Name any test you changed because it misread a criterion.

If the active card (`.devhawk-work.json`) exists, comment on it: "Tests added: [N] unit, [N] integration, [N] E2E."

## What NOT to test

Per docs/testing-patterns.md:
- shadcn/ui component internals
- Next.js framework behavior
- Third-party library correctness
- Every page (E2E is for critical paths only)

## E2E scope guidance

E2E tests are expensive to write and maintain. Generate them only for:
- **Auth flows** — sign up, sign in, password reset (always)
- **Core workflow** — the main thing the product does (always)
- **Payment flows** — if Stripe is integrated (always)
- **Admin actions** — if admin panel exists (first deploy only)

Do NOT generate E2E for: settings pages, profile editing, static content pages, or features that are adequately covered by integration tests on the Server Action.

Document the E2E scope decision in the project's `docs/testing-patterns.md` or `CLAUDE.md` addendum so future test-gen invocations follow the same scope.
