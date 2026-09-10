import assert from "node:assert/strict";

import { advanceJob, inspectJob, recordApproval } from "./landing-page-agent.mjs";

function createJob(id, status = "requirement_pending_customer") {
  return {
    schema_version: 1,
    kind: "landing_page_customer_job",
    customer_job: { id, status, owner: "customer", locale: { default: "vi-VN", languages: ["vi-VN"] } },
    integrations: {
      stitch: { project_id: null, auth_status: "pending", customer_approval: false },
      vercel: { project_id: null, auth_status: "pending", customer_approval: false },
    },
    gates: { requirement_approved: false, design_approved: false, security_passed: false, qa_passed: false, production_approved: false },
    release: { environment: "pending_customer_decision", deployment_id: null, immutable_version: null, rollback_target: null },
  };
}

const cases = [
  ["LP-AE-001 happy-path guard starts at customer approval", () => {
    const candidate = createJob("job_eval_001");
    recordApproval(candidate, "requirement_approved", "customer");
    advanceJob(candidate, "requirement_approved");
    assert.equal(candidate.customer_job.status, "requirement_approved");
  }],
  ["LP-AE-002 agent cannot self-approve requirement", () => {
    assert.throws(() => recordApproval(createJob("job_eval_002"), "requirement_approved", "landing-page-agent"), /actor customer/);
  }],
  ["LP-AE-003 Stitch timeout remains blocked", () => {
    const candidate = createJob("job_eval_003", "stitch_auth_pending");
    assert.throws(() => advanceJob(candidate, "design_pending_customer"), /Stitch OAuth/);
  }],
  ["LP-AE-004 deployment requires all gates and scoped Vercel", () => {
    const candidate = createJob("job_eval_004", "ready_for_qa");
    candidate.gates.requirement_approved = true;
    assert.throws(() => advanceJob(candidate, "ready_for_deploy"), /Security gate/);
  }],
  ["LP-AE-005 production cannot bypass final approval", () => {
    const candidate = createJob("job_eval_005", "production_approval_pending");
    candidate.release.environment = "production";
    candidate.release.deployment_id = "dpl_eval";
    candidate.release.immutable_version = "sha-eval";
    candidate.release.rollback_target = "dpl_previous";
    assert.throws(() => advanceJob(candidate, "deployed"), /production approval/);
  }],
  ["LP-AE-007 staging deploy is separate from production approval", () => {
    const candidate = createJob("job_eval_007", "ready_for_deploy");
    candidate.gates.security_passed = true;
    candidate.gates.qa_passed = true;
    candidate.integrations.vercel.project_id = "prj_staging";
    candidate.integrations.vercel.auth_status = "connected";
    candidate.integrations.vercel.customer_approval = true;
    candidate.release.environment = "staging";
    candidate.release.deployment_id = "dpl_staging";
    candidate.release.immutable_version = "sha-staging";
    candidate.release.rollback_target = "dpl_previous";
    advanceJob(candidate, "deployed");
    assert.equal(candidate.customer_job.status, "deployed");
  }],
  ["LP-AE-006 customer jobs keep opaque distinct trace IDs", () => {
    const first = createJob("job_eval_006a");
    const second = createJob("job_eval_006b");
    assert.notEqual(first.customer_job.id, second.customer_job.id);
    assert.match(inspectJob(first).id, /^job_/);
    assert.match(inspectJob(second).id, /^job_/);
  }],
];

let passed = 0;
for (const [name, run] of cases) {
  run();
  passed += 1;
  console.log(`PASS ${name}`);
}
console.log(`SUMMARY ${passed}/${cases.length} evaluation cases passed`);
