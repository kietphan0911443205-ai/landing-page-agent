import assert from "node:assert/strict";
import test from "node:test";

import { advanceJob, inspectJob, recordApproval } from "./landing-page-agent.mjs";

function job() {
  return {
    schema_version: 1,
    kind: "landing_page_customer_job",
    customer_job: { id: "job_test_001", status: "requirement_pending_customer", owner: "customer" },
    integrations: {
      stitch: { project_id: null, auth_status: "pending", customer_approval: false },
      vercel: { project_id: null, auth_status: "pending", customer_approval: false },
    },
    gates: { requirement_approved: false, design_approved: false, security_passed: false, qa_passed: false, production_approved: false },
    release: { environment: "pending_customer_decision", deployment_id: null, immutable_version: null, rollback_target: null },
  };
}

test("không cho job tự vượt requirement approval", () => {
  assert.throws(() => advanceJob(job(), "requirement_approved"), /customer approval/);
});

test("chỉ actor đúng được ghi approval", () => {
  const candidate = job();
  assert.throws(() => recordApproval(candidate, "requirement_approved", "landing-page-agent"), /actor customer/);
  recordApproval(candidate, "requirement_approved", "customer");
  assert.equal(candidate.gates.requirement_approved, true);
});

test("inspect chỉ ra bước kế tiếp và blocker", () => {
  const result = inspectJob(job());
  assert.equal(result.status, "requirement_pending_customer");
  assert.deepEqual(result.allowed_next_states, ["requirement_approved"]);
  assert.match(result.blockers[0].message, /customer approval/);
});

test("không cho nhảy qua state machine", () => {
  const candidate = job();
  assert.throws(() => advanceJob(candidate, "deployed"), /Không được chuyển/);
});

test("staging có thể deploy sau các gate kỹ thuật", () => {
  const candidate = job();
  candidate.customer_job.status = "ready_for_deploy";
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
});

test("production không được bỏ qua approval pending", () => {
  const candidate = job();
  candidate.customer_job.status = "ready_for_deploy";
  candidate.release.environment = "production";
  assert.throws(() => advanceJob(candidate, "deployed"), /production_approval_pending/);
});
