---
name: aibos-qa-launch-readiness
description: "Use when setting up or maintaining a launch-readiness view of a product: what must be true across product, code quality, security, reliability, design, compliance, and operations before MVP / Beta / Launch. Triggers: 'launch checklist', 'sẵn sàng ra mắt', 'production readiness', 'backlog init', 'còn thiếu gì để launch'. Items are machine-parseable records — ID, Outcome, Standard reference (OWASP/WCAG/SRE), Phase bar, Status, Evidence — seeded into Hermes kanban, verified at gates, never 'done' with empty Evidence."
license: MIT
metadata:
  hermes:
    tags: [sdlc-pro, backlog, launch-readiness, checklist, standards, evidence]
    related_skills: [aibos-qa-gate-review, sdlc-orchestration, aibos-backend-secure-coding, observability-monitoring]
---

# Launch-Readiness Backlog — Checklists as Tracked Data

## Overview

A checklist inside a document is read once and forgotten; a **backlog item with Status and Evidence** is tracked until proven. This skill turns launch-readiness into data: every item names the outcome (not the activity), cites the industry standard it comes from, states which phase bar it must clear, and cannot be marked done without evidence. Feature tasks answer "does it work?"; this backlog answers "is it ready?" — the two lists are maintained separately because features crowd out readiness every time.

## When to Use

- Project start (right after `plan`) — seed the backlog for the stack
- Before each phase gate (MVP→Beta→Launch): compute readiness per domain
- Gate aftermath (`aibos-qa-gate-review` §4 step 3 updates items here)
- Don't use for: feature/dev task tracking (regular kanban), one-off audits

## 1. The item format (strict — parseable by grep, honest by design)

```markdown
### [SEC-002] Queries scoped to authenticated user's tenant
- Outcome: user A cannot read user B's data by manipulating ids
- Standard: OWASP ASVS 4.0 — V4.2.1
- Phase: 1-MVP
- Status: not-started | in-progress | done | not-applicable
- Evidence: —
```

Field rules:
- **ID** `[DOM-NNN]` stable forever — gates, tasks, and commits reference it.
- **Outcome** is a verifiable end-state, never an activity ("rate limiting works on login (429 after N attempts)" — not "add rate limiting").
- **Standard**: real citation (OWASP ASVS section, WCAG criterion, Google SRE practice, GDPR article). Anchors the item in "the industry says so", ends bikeshedding; no standard exists → write `project decision — <ADR ref>`.
- **Phase** = the maturity bar at which this item MUST be done: `1-MVP`, `2-Beta`, `3-Launch`, `4-Growth`. This is the anti-perfectionism field — CSP headers are a Launch item, not an MVP blocker.
- **Status → done requires Evidence.** Best evidence is a command/script a reviewer can re-run (goal-verifier-able); acceptable: file:line, commit hash, gate verdict link, screenshot path. `Evidence: —` + `Status: done` is a lie by construction.
- **not-applicable is a decision**: requires one line of why + an `adr-decision-log` entry if non-obvious. N/A without a reason is a skipped item wearing a costume.

## 2. The seven domains (default set — trim to the project)

| Domain | Seed source | Typical MVP items | Typical Launch items |
|---|---|---|---|
| 01 PRODUCT | SRS Must-FRs (`ba-srs-authoring`) | every Must-FR verified E2E | onboarding flow tested cold |
| 02 CODE QUALITY | `aibos-frontend-app-scaffolding` DoD + `aibos-qa-e2e-playwright` | lint zero-warn in CI, patch-coverage gate | case-matrix rows automated |
| 03 SECURITY | `aibos-backend-secure-coding` ASVS-lite checklist | auth on all routes, no secrets in repo, tenant scoping | rate limiting, CSP, audit log, 2FA option |
| 04 RELIABILITY | `vps-provisioning` + `release-it` | health endpoint, rollback tested, backups off-box | restore drill dated, timeouts/retries on externals |
| 05 DESIGN/UX | `aibos-frontend-modern-stack` a11y + `aibos-ui-ux-heuristics` | keyboard walkthrough passes | WCAG AA sweep, empty/error states everywhere |
| 06 OBSERVABILITY | `observability-monitoring` | external uptime check, error tracking | RED dashboards, SLO + burn alert, dead-man's switch |
| 07 COMPLIANCE/DOCS | `user-manual-authoring` + legal needs | privacy policy if PII, ENV documented | user manual cold-run passed, data deletion path works |

Seeding: walk each referenced skill's Verification Checklist and convert applicable lines into items (the checklists were written to be convertible — outcome-shaped, evidence-demanding). 20-60 items total for a typical SaaS; 300 items = you imported a compliance framework, not a backlog. Stack-specific items get their own IDs (`[SEC-STK-001] Stripe webhook signature verified via constructEvent — server-side amounts only`).

## 3. Storage & seeding into Hermes

- Canonical file: the project's launch-readiness document (default: `docs/launch-readiness.md`) with one section per domain and items in §1 format — greppable, diffable, survives tooling changes.
- Each item also seeded as a kanban task titled `[ID] outcome-summary`, tagged by domain, so `sdlc-orchestration` sees readiness debt next to feature work and `progress-reporting` counts it.
- Items whose Evidence is a runnable command get registered as goal/milestone verify scripts where the project uses Hermes goals — then **done isn't even claimable without the script passing** (stronger than any self-reported evidence).

## 4. Phase gates — the roll-up

Before advancing a phase (MVP→Beta etc.), compute per domain: `done / (items at or below target phase, excluding n-a)`. The phase gate (via `aibos-qa-gate-review`, PO + relevant lenses) reviews:
- Domains below 100% at the target bar → each open item is either **fixed now**, **rephased** (with recorded reason — moving SEC items down-phase needs the Security lens to agree), or **risk-accepted** (ADR + risk entry, review date).
- No silent rephasing: the diff of Phase fields since last gate is part of the gate brief.

Readiness % per domain is a standing line in `progress-reporting`'s weekly numbers — readiness debt stays visible all project, not discovered the week before launch.

## 5. Maintenance rules

- New feature introduces new surface (file upload, payment, PII field) → add the corresponding items **in the same PR** (the reviewer checks for this — it's in the QA lens).
- Gate findings map to items: a Security BLOCK on missing tenant scoping re-opens `[SEC-002]` (status back to in-progress, finding linked in Evidence line) — findings and backlog never diverge.
- Quarterly (or per phase): sweep for stale evidence — an item verified 6 months ago on code that has since changed gets re-verified or demoted to in-progress (same staleness logic the core evidence ledger applies to tests).

## Common Pitfalls

1. **Activity-shaped items** ("set up monitoring") — undone-able; outcomes only ("alert fires when app down — drill dated YYYY-MM-DD").
2. **Everything Phase-1** — the backlog becomes a wall, the team ignores it, launch slips; the Phase field exists to make MVP honest AND small.
3. **Evidence theater** — "done, see codebase" is not evidence; command, file:line, or gate link.
4. **One list for features and readiness** — features always win the sort order; keep the views separate, review both in orientation.
5. **N/A as a trapdoor** — half the security domain marked n-a without reasons; every n-a has a why, non-obvious ones have an ADR.
6. **Importing a 400-item compliance pack** — readiness backlogs die of obesity; seed from this project's actual skills/checklists, add on new surface only.
7. **Set-and-forget** — seeded at kickoff, untouched until pre-launch panic; the weekly report line + gate updates are what keep it alive.

## Verification Checklist

- [ ] The project's launch-readiness document exists; every item parses (ID, Outcome, Standard, Phase, Status, Evidence)
- [ ] Outcomes are end-states; spot-check 5 items for activity-phrasing
- [ ] Standards cited are real (spot-check 3 against the actual OWASP/WCAG text)
- [ ] Zero items with Status:done + Evidence:— (grep proves it)
- [ ] Every n-a has a reason; non-obvious ones link an ADR
- [ ] Items mirrored into kanban; readiness % appears in the weekly report
- [ ] Runnable-evidence items wired as verify scripts where goals are used
- [ ] Phase-field changes since last gate were reviewed, not silent
- [ ] New-surface PRs this period added their items (check the latest 2-3 risky PRs)

## Chế độ phát hành Landing Page Agent

Khi sản phẩm là agent phục vụ nhiều customer job, readiness phải tách hai lớp: (1) output landing page của một job và (2) năng lực reusable của agent. Lớp agent không được đánh dấu `done` chỉ vì một deployment mẫu pass; cần evidence cho intake, isolation, approval actor, OAuth failure/recovery, connector scope, QA regression giữa hai job và rollback.

Các item liên quan đến customer job phải ghi opaque job ID, template/skill version, environment và command/evidence có thể chạy lại. PII thật, credential thật và production write không được dùng trong candidate evaluation.
