---
name: aibos-qa-e2e-playwright
description: "Use when writing end-to-end browser tests, deriving test cases systematically from a spec, measuring coverage, or fixing flaky test suites. Triggers: 'E2E', 'Playwright', 'test tự động', 'test case', 'coverage', 'flaky test', 'kiểm thử giao diện'. Covers Playwright discipline (role-based selectors, no sleeps, POM-lite), test-case matrix design (equivalence partitioning, boundary analysis, decision tables), coverage reporting, and CI artifacts. Complements aibos-backend-tdd (unit) and aibos-qa-exploratory (exploratory)."
license: MIT
metadata:
  hermes:
    tags: [sdlc-pro, testing, e2e, playwright, coverage, test-design, qa]
    related_skills: [aibos-backend-tdd, aibos-backend-systematic-debugging, ba-srs-authoring, aibos-frontend-modern-stack]
---

# E2E Testing — Playwright Discipline + Systematic Test Design

## Overview

Three layers, each with a different job: **unit** (TDD skill — logic, fast, thousands), **E2E** (this skill — user journeys through the real stack, dozens not hundreds), **exploratory** (`aibos-qa-exploratory` — what scripts miss). E2E tests earn their slot only for money paths: signup, login, checkout, the core domain flow. Everything else belongs lower in the pyramid.

## When to Use

- Writing browser tests for critical user journeys
- Turning an SRS/user story into a systematic test-case list (matrix design applies to unit tests too)
- A suite is flaky and trust is eroding
- Don't use for: pure logic testing (unit/TDD), API-only testing (schema + integration tests), open-ended bug hunting (`aibos-qa-exploratory`)

## 1. Test-case design — derive, don't brainstorm

From each requirement (FR with Gherkin from `ba-srs-authoring`):

**Equivalence partitioning**: split every input into valid/invalid classes; one test per class, not per value. `age: 18-99` → classes: `<18`, `18-99`, `>99`, non-numeric, empty.

**Boundary analysis**: test AT each boundary and one beyond: `17, 18, 99, 100`. Off-by-one bugs live exactly here.

**Decision table** when 2+ conditions interact:

| Logged in | Item in stock | Coupon valid | → Expected |
|---|---|---|---|
| Y | Y | Y | discount applied, order placed |
| Y | Y | N | error on coupon field, order placeable |
| Y | N | – | disabled buy button + restock notice |
| N | – | – | redirect to login, cart preserved |

Every row = one test with a name matching the row. Rows you decide not to automate get a written reason ("covered by unit test X" / "risk accepted").

**State transitions** for anything with a lifecycle (order: draft→paid→shipped→refunded): test each legal transition + one illegal one per state.

**Done when:** the matrix exists as a table in the test plan file, and every automated test maps to a row (name or comment references it).

## 2. Playwright setup & discipline

Setup: `npm init playwright@latest`; run against a **production build** (`next build && next start`, not dev server — dev-mode masks hydration/timing bugs); `webServer` block in config boots the app; test data via API/DB seeding in `beforeEach`, NEVER by clicking through UI to create fixtures.

**Selector hierarchy (hard rule):**
1. `getByRole('button', {name: 'Checkout'})` — tests what users perceive AND enforces a11y as a side effect
2. `getByLabel` / `getByPlaceholder` for inputs
3. `getByTestId` — only when role/label genuinely can't work (canvas, icon grids)
4. CSS/XPath — banned; they're implementation-coupled and rot on every refactor

**Flake elimination (the whole list, no exceptions):**
- Zero `waitForTimeout`/sleep — use web-first assertions (`await expect(locator).toBeVisible()`) which auto-retry
- Never assert intermediate loading states unless testing them specifically
- Each test independent: own data, own login (or storageState reuse), runnable alone AND parallel — `test.describe.serial` is a smell requiring justification
- Network-dependent externals (payment, email) mocked at the boundary via `page.route()`; your E2E tests YOUR system, not Stripe's uptime
- Clock-sensitive logic → `page.clock` fake timers

**POM-lite**: extract page objects only for screens used by ≥3 tests; helpers as plain functions. A full ceremonial POM layer for 15 tests is over-engineering.

**A11y integration**: one `@axe-core/playwright` scan per key page inside existing tests (ties to `aibos-frontend-modern-stack` checklist).

## 3. Coverage — measured, with honest targets

- **Unit/integration**: `pytest --cov --cov-report=term-missing` / vitest `--coverage`. Gate in CI on the **diff** (patch coverage ≥80%) rather than repo-total — total-coverage gates incentivize junk tests on old code.
- **E2E**: coverage metric is the **matrix**, not lines: every Must-FR has ≥1 E2E row automated; report "X/Y matrix rows automated, rows skipped with reasons".
- Never chase 100% lines — the last 15% is getters and error-message strings; the matrix rows are what pays.

## 4. Reporting & CI

`playwright.config`: `trace: 'on-first-retry'`, `video: 'retain-on-failure'`, `screenshot: 'only-on-failure'`, retries: 2 in CI / 0 locally (a test needing local retries is broken — fix it). CI (ties to `ci-cd-pipeline`): E2E stage after build, sharded if >5min; HTML report + traces uploaded as artifacts; failure summary posted with trace links. **A red E2E gate blocks merge — a suite people override is worse than no suite** (trust is the deliverable).

Flaky quarantine protocol: flaky test → move to `@quarantine` tag same day (runs, doesn't block) → root-cause within the week via `aibos-backend-systematic-debugging` → fix or delete. A quarantine older than 2 weeks = delete the test.

## Common Pitfalls

1. **Testing through the UI what a unit test covers** — E2E asserting price-rounding math is 1000x slower than the unit test that already exists; E2E asserts the journey, units assert the logic.
2. **Fixture creation by UI clicking** — 40s of clicking before every test; seed via API/DB.
3. **CSS selectors "just this once"** — they metastasize; the lint rule (`eslint-plugin-playwright`) exists, enable it.
4. **Sleeps to "stabilize"** — every `waitForTimeout` is a future flake plus permanent latency; find the real condition and assert it.
5. **One mega-test covering the whole app** — fails at step 3, hides steps 4-9; one journey per test, matrix rows for variants.
6. **Ignoring the red suite** — auto-merge-on-override normalizes failure; quarantine protocol instead.
7. **Testing against dev server** — hydration and race bugs only reproduce on production builds.

## Verification Checklist

- [ ] Test-case matrix written (equivalence + boundaries + decision tables); every Must-FR covered
- [ ] Every automated test maps to a matrix row; skipped rows have written reasons
- [ ] Zero `waitForTimeout` (grep), zero CSS/XPath selectors (lint rule active)
- [ ] Tests run green: alone, in parallel, and in CI against production build
- [ ] External services mocked at boundary; seeding via API/DB not UI
- [ ] Trace/video/screenshot artifacts configured and verified downloadable from a forced failure
- [ ] Patch coverage gate active in CI; matrix automation ratio reported
- [ ] axe scan present on key pages
- [ ] Quarantine protocol documented in the repo's testing README
