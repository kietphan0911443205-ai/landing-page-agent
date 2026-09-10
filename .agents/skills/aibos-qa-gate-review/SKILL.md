---
name: aibos-qa-gate-review
description: "Use when a quality gate is due: feature merged, design approved, sprint complete, or before any production deploy. Runs a panel of narrow-lens expert reviews (CTO, QA, Security, UX, SRE, Product Owner) as parallel clean-context subagents, each returning PASS / CONDITIONAL / BLOCK with file:line findings. Triggers: 'gate review', 'review trước khi deploy', 'hội đồng review', 'nghiệm thu', stage advancement. Verdicts have teeth: BLOCK stops the pipeline; overrides must be recorded, never silent."
license: MIT
metadata:
  hermes:
    tags: [sdlc-pro, gate-review, quality, review-panel, verdict, personas]
    related_skills: [sdlc-orchestration, adr-decision-log, aibos-qa-launch-readiness, requesting-code-review]
---

# Gate Review Panel — Narrow Lenses, Real Verdicts

## Overview

One generalist review misses what specialists catch: the security reviewer isn't distracted by naming; the UX reviewer doesn't care about connection pooling. A gate = the right 2-4 lenses, each reviewing **independently in a clean context** (no anchoring on each other), each returning a verdict with evidence. The consolidated result advances the stage, conditions it, or blocks it. `requesting-code-review` is the per-commit hygiene pass; this skill is the milestone-level panel.

## When to Use

- Triggered by `sdlc-orchestration` §4: feature merged, design approved, sprint end, pre-deploy, stage advance
- User asks for a serious multi-angle review before something irreversible
- Don't use for: routine commit review (`requesting-code-review`), exploratory bug hunts (`aibos-qa-exploratory`), single-lens deep dives (invoke that lens's skill directly)

## 1. The lens roster

| Lens | Reviews | Never reviews | Fires at |
|---|---|---|---|
| **QA** | test coverage vs the case matrix, sad paths, boundaries, test quality (asserts behavior?) | code style | every feature merge |
| **Security** | authn/authz per resource, injection, secrets, `aibos-backend-secure-coding` ASVS-lite items | test coverage | auth/data/payment touched; always pre-deploy |
| **CTO/Architecture** | boundaries, dependency direction, schema fit, tech-debt introduced, scale posture | pixel details | design approval; pre-deploy |
| **UX** | flows vs SRS user stories, friction, a11y (WCAG AA), error-state UX | backend internals | UI feature built; design approval |
| **SRE** | rollback tested? runbook? alerts? backup/restore? migration reversibility? | feature logic | pre-deploy, always |
| **Product Owner** | built-vs-SRS alignment, scope creep, Must-FRs verified | implementation | sprint/milestone end |

Panel composition comes from the trigger (see `sdlc-orchestration` §4). 2-4 lenses per gate — a 6-lens gate for a small feature is ceremony, not quality.

## 2. Running the panel

1. **Scope brief** (you write once): what changed (diff/PRs), which SRS items it claims to satisfy, which backlog items (`aibos-qa-launch-readiness`) it touches. Same brief to every lens.
2. **Dispatch in parallel, clean contexts** — via delegate/subagent batch: each lens gets the brief + its lens definition + read access, and **must not see other lenses' output** (independence is the point; consensus comes after, not during).
3. Each lens returns the **verdict contract** (§3).
4. **Consolidate** (§4).

Lens prompt skeleton (per lens):

```
You are the <LENS> reviewer at a <trigger> gate.
Review ONLY through your lens: <lens's "Reviews" column>.
Out of scope for you: <"Never reviews" column> — do not comment on it.
For every finding: exact file:line, why it matters, concrete fix.
Findings without a location are opinions — omit them.
Default to evidence: run/read, don't assume.
Return the verdict contract exactly.
```

## 3. The verdict contract (every lens, no deviation)

```
LENS: <name>          VERDICT: PASS | CONDITIONAL | BLOCK

BLOCKING (must fix before proceeding — only if BLOCK)
  1. <file:line — issue — why — fix>
CONDITIONS (proceed, but fix by <named deadline/event> — only if CONDITIONAL)
  1. <file:line — issue — deadline: before public launch>
NON-GATING OBSERVATIONS
  • <improvement worth noting — never affects the verdict>
CLEAN
  ✓ <areas verified and found solid — name them explicitly>
DECISIONS SPOTTED
  • <any decision made in this work that belongs in the decision log>
```

Calibration rules: **BLOCK** = deploying/merging this causes user harm, data loss, security exposure, or unrecoverable states. **CONDITIONAL** = real issue, bounded risk, named deadline. **PASS** ≠ perfect — it means "no issue above the line for this stage's maturity" (an MVP gate and a Launch gate have different bars — see `aibos-qa-launch-readiness` phases). The CLEAN section is mandatory: a review that only lists faults teaches nothing about what's trustworthy.

Finding quality bar (from the strong/weak contrast): *"Webhook handler src/api/billing/webhook.ts — no test for `subscription.deleted`; if it throws, user keeps access after cancelling. Fix: mock payload, assert status=CANCELED in same transaction"* — location, consequence, fix. "Billing needs more tests" would be rejected.

## 4. Consolidation & aftermath (the part that makes gates real)

Overall = worst individual verdict (any BLOCK → gate BLOCK; else any CONDITIONAL → CONDITIONAL).

Mandatory, in order, before the gate is "closed":
1. **Verdict recorded**: gate name, date, lenses, outcome, conditions list — into the project log (kanban comment on the milestone / gates section of the status file).
2. **Conditions become kanban tasks** with the deadline event on them — a condition without a task evaporates.
3. **Backlog items updated** (`aibos-qa-launch-readiness`): items this gate verified → `done` with evidence; items it failed → back to `in-progress` with the finding linked.
4. **Decisions written**: every "DECISIONS SPOTTED" line → `adr-decision-log` NOW. **A gate does not close with unrecorded decisions.**
5. BLOCK findings → also risk entries if they're accepted-for-now rather than fixed.

**Override protocol** (user wants to proceed despite BLOCK/missing gate): acknowledge once, state the risk in one sentence, record ADR ("bypassed X gate because Y") + risk entry (impact, likelihood, review date) via `adr-decision-log`, then proceed without relitigating. Never silent, never repeated nagging — recorded and moved on.

**Hard rule carried from `sdlc-orchestration`:** production deploy requires SRE PASS + Security PASS. This one is not overridable by note — it's overridable only by the user explicitly accepting it in writing after seeing the named risks.

## 5. Re-review loop

BLOCK fixed → re-run **only the blocking lens**, scoped to the fix (full re-panel only if the fix was architectural). Max 3 fix→re-review cycles; a 4th means the work needs redesign, not another patch — send it back to the stage's primary skill with the accumulated findings.

## Common Pitfalls

1. **Shared-context panel** — lens B reads lens A's findings and anchors; independence lost. Clean contexts, consolidate after.
2. **Verdicts without teeth** — CONDITIONAL with no deadline and no task = PASS with decoration. Conditions get tasks + deadline events, always.
3. **The everything-lens** — one reviewer asked to check security AND architecture AND UX produces shallow coverage of all three; narrow lenses exist because attention is finite.
4. **Gate inflation** — paneling every commit; the per-commit tool is `requesting-code-review`, gates are for milestones. Over-gating trains everyone to rubber-stamp.
5. **Findings without locations** — unactionable, unverifiable; the contract rejects them.
6. **Silent overrides** — skipping a gate under deadline pressure without the ADR+risk record; the override protocol costs 2 minutes and preserves the audit trail.
7. **Re-running the full panel for a one-line fix** — re-review is scoped to the blocking lens; respect everyone's tokens.
8. **No CLEAN section** — reviews that never say "this part is solid" erode trust in the panel and hide what needs no re-checking.

## Verification Checklist

- [ ] Panel composition matches the trigger (2-4 lenses, from §1 table)
- [ ] Identical scope brief sent to all lenses; contexts were clean (no cross-reads)
- [ ] Every lens returned the exact verdict contract; findings all have file:line
- [ ] Overall verdict = worst lens verdict; recorded with date + lenses + outcome
- [ ] Every CONDITIONAL item now exists as a kanban task with deadline event
- [ ] Backlog items updated with evidence links (done/failed both directions)
- [ ] All "DECISIONS SPOTTED" recorded before gate closed
- [ ] Any override followed the protocol (ADR + risk with review date)
- [ ] Re-reviews were scoped to the blocking lens; ≤3 cycles respected
