import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const STATES = [
  "queued",
  "ba_in_progress",
  "requirement_pending_customer",
  "requirement_approved",
  "stitch_auth_pending",
  "design_pending_customer",
  "design_approved",
  "implementation_in_progress",
  "ready_for_qa",
  "ready_for_deploy",
  "production_approval_pending",
  "deployed",
];

const TRANSITIONS = new Map([
  ["queued", ["ba_in_progress"]],
  ["ba_in_progress", ["requirement_pending_customer"]],
  ["requirement_pending_customer", ["requirement_approved"]],
  ["requirement_approved", ["stitch_auth_pending"]],
  ["stitch_auth_pending", ["design_pending_customer"]],
  ["design_pending_customer", ["design_approved"]],
  ["design_approved", ["implementation_in_progress"]],
  ["implementation_in_progress", ["ready_for_qa"]],
  ["ready_for_qa", ["ready_for_deploy"]],
  ["ready_for_deploy", ["production_approval_pending", "deployed"]],
  ["production_approval_pending", ["deployed"]],
  ["deployed", []],
]);

const APPROVAL_ACTORS = {
  requirement_approved: "customer",
  design_approved: "customer",
  security_passed: "security",
  qa_passed: "qa",
  production_approved: "customer",
};

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  const absolutePath = path.resolve(filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function newJob() {
  const opaqueId = crypto.randomBytes(5).toString("hex");
  return {
    schema_version: 1,
    kind: "landing_page_customer_job",
    customer_job: {
      id: `job_${opaqueId}`,
      status: "queued",
      owner: "customer",
      locale: { default: "vi-VN", languages: ["vi-VN"], translation_owner: "customer" },
      audit: [{ event: "created", actor: "landing-page-agent", at: new Date().toISOString() }],
    },
    business: {
      product_name: null,
      brand_name: null,
      audience: [],
      value_proposition: null,
      cta: { label: null, destination: null },
      sections: ["hero", "benefits", "features", "faq", "pricing", "footer"],
      pricing: { display_mode: "pending_customer_decision", values: [] },
      proof: { testimonials: "pending_source_and_approval", logos: "pending_source_and_approval", metrics: "pending_source_and_approval" },
    },
    lead_capture: {
      enabled: null,
      fields: [],
      consent: { required: null, policy_version: null, owner: null },
      retention: { maximum_months: null, deletion_or_anonymization: null },
      contact: { privacy_email: null, public_address: null },
    },
    analytics: { enabled: null, vendor: null, events: [], consent_dependency: "pending_customer_decision" },
    integrations: {
      stitch: { project_id: null, auth_status: "pending", customer_approval: false },
      vercel: { project_id: null, scope: null, auth_status: "pending", customer_approval: false },
      database: { provider: null, environment: null, target_id: null, secret_reference: null },
    },
    gates: { requirement_approved: false, design_approved: false, security_passed: false, qa_passed: false, production_approved: false },
    release: { environment: "pending_customer_decision", deployment_id: null, immutable_version: null, rollback_target: null },
  };
}

function appendAudit(job, event, actor) {
  job.customer_job.audit ??= [];
  job.customer_job.audit.push({ event, actor, at: new Date().toISOString() });
}

function assertJobShape(job) {
  if (!job || job.kind !== "landing_page_customer_job") fail("Không phải landing_page_customer_job");
  const customerJob = job.customer_job;
  if (!customerJob?.id?.startsWith("job_")) fail("customer_job.id phải là opaque ID bắt đầu bằng job_");
  if (!STATES.includes(customerJob.status)) fail(`Trạng thái không hợp lệ: ${customerJob.status}`);
  if (customerJob.owner !== "customer") fail("customer_job.owner phải là customer");
  if (!job.gates || !job.integrations || !job.release) fail("Job thiếu gates, integrations hoặc release");
}

function missingFor(job, targetState) {
  const missing = [];
  if (targetState === "requirement_approved" && !job.gates.requirement_approved) missing.push("BA chưa ghi nhận customer approval cho requirement");
  if (targetState === "design_pending_customer") {
    if (job.integrations.stitch.auth_status !== "connected") missing.push("Stitch OAuth chưa connected");
    if (!job.integrations.stitch.project_id) missing.push("thiếu Stitch project_id");
    if (!job.integrations.stitch.customer_approval) missing.push("khách hàng chưa xác nhận Stitch project");
  }
  if (targetState === "design_approved" && !job.gates.design_approved) missing.push("chưa có customer approval cho thiết kế");
  if (targetState === "ready_for_qa" && !job.gates.requirement_approved) missing.push("requirement gate chưa pass");
  if (targetState === "ready_for_deploy") {
    if (!job.gates.security_passed) missing.push("Security gate chưa pass");
    if (!job.gates.qa_passed) missing.push("QA gate chưa pass");
    if (!job.integrations.vercel.project_id) missing.push("thiếu Vercel project_id");
    if (job.integrations.vercel.auth_status !== "connected") missing.push("Vercel OAuth chưa connected");
    if (!job.integrations.vercel.customer_approval) missing.push("khách hàng chưa xác nhận Vercel project/scope");
  }
  if (targetState === "production_approval_pending" && job.release.environment !== "production") missing.push("release.environment chưa là production");
  if (targetState === "deployed") {
    if (!["staging", "production"].includes(job.release.environment)) missing.push("release.environment phải là staging hoặc production");
    if (job.release.environment === "production" && !job.gates.production_approved) missing.push("chưa có customer production approval");
    for (const field of ["deployment_id", "immutable_version", "rollback_target"]) if (!job.release[field]) missing.push(`thiếu release.${field}`);
  }
  return missing;
}

function nextAction(job) {
  const actions = {
    queued: "Kích hoạt BA và tạo task graph cho customer job.",
    ba_in_progress: "BA hỏi khách hàng về identity, audience, CTA, content, privacy, analytics và môi trường.",
    requirement_pending_customer: "Trình requirement summary cho khách hàng duyệt; không tự chuyển gate.",
    requirement_approved: "Chuyển sang bước xác thực Stitch của đúng khách hàng.",
    stitch_auth_pending: "Khách hàng xác thực Stitch; agent chỉ dùng project_id đã được xác nhận.",
    design_pending_customer: "Trình design handoff để khách hàng duyệt.",
    design_approved: "Frontend/Backend triển khai vertical slice trong workspace riêng.",
    implementation_in_progress: "Hoàn thiện build local và chuyển QA.",
    ready_for_qa: "Chạy QA UI/UX, accessibility, responsive, E2E và security gate.",
    ready_for_deploy: "Xác thực Vercel scope, release version, rollback và xin production approval.",
    production_approval_pending: "Chờ customer approval cuối trước khi deploy production.",
    deployed: "Theo dõi health, smoke test và lưu release evidence.",
  };
  return actions[job.customer_job.status];
}

export function inspectJob(job) {
  assertJobShape(job);
  const possible = TRANSITIONS.get(job.customer_job.status) ?? [];
  return {
    id: job.customer_job.id,
    status: job.customer_job.status,
    next_action: nextAction(job),
    allowed_next_states: possible,
    blockers: possible.flatMap((state) => missingFor(job, state).map((message) => ({ target_state: state, message }))),
  };
}

export function recordApproval(job, gate, actor) {
  assertJobShape(job);
  if (!(gate in APPROVAL_ACTORS)) fail(`Gate không hợp lệ: ${gate}`);
  if (APPROVAL_ACTORS[gate] !== actor) fail(`Gate ${gate} chỉ được ghi bởi actor ${APPROVAL_ACTORS[gate]}`);
  job.gates[gate] = true;
  appendAudit(job, `approval:${gate}`, actor);
  return job;
}

export function advanceJob(job, targetState, actor = "landing-page-agent") {
  assertJobShape(job);
  const currentState = job.customer_job.status;
  if (!TRANSITIONS.get(currentState)?.includes(targetState)) fail(`Không được chuyển ${currentState} → ${targetState}`);
  if (currentState === "ready_for_deploy" && targetState === "deployed" && job.release.environment === "production") {
    fail("Production phải đi qua production_approval_pending trước khi deployed");
  }
  const blockers = missingFor(job, targetState);
  if (blockers.length > 0) fail(`Chưa đủ điều kiện ${currentState} → ${targetState}: ${blockers.join("; ")}`);
  job.customer_job.status = targetState;
  appendAudit(job, `state:${targetState}`, actor);
  return job;
}

function usage() {
  console.log(`Dùng:
  node scripts/landing-page-agent.mjs create <output.json>
  node scripts/landing-page-agent.mjs status <job.json>
  node scripts/landing-page-agent.mjs approve <job.json> <gate> <actor>
  node scripts/landing-page-agent.mjs advance <job.json> <target-state> [actor]

Actor hợp lệ: customer, security, qa.
Gate: requirement_approved, design_approved, security_passed, qa_passed, production_approved.`);
}

function main(argv = process.argv.slice(2)) {
  const [command, filePath, argument, actor = "landing-page-agent"] = argv;
  if (!command || command === "help") return usage();
  if (command === "create") {
    if (!filePath) fail("Thiếu output.json");
    const job = newJob();
    writeJson(filePath, job);
    console.log(`CREATED ${path.resolve(filePath)} ${job.customer_job.id}`);
    return;
  }
  if (!filePath) fail("Thiếu job.json");
  const job = readJson(filePath);
  if (command === "status") {
    console.log(JSON.stringify(inspectJob(job), null, 2));
    return;
  }
  if (command === "approve") {
    if (!argument || !actor) fail("Dùng approve <job.json> <gate> <actor>");
    recordApproval(job, argument, actor);
    writeJson(filePath, job);
    console.log(`APPROVED ${argument} by ${actor}`);
    return;
  }
  if (command === "advance") {
    if (!argument) fail("Dùng advance <job.json> <target-state> [actor]");
    advanceJob(job, argument, actor);
    writeJson(filePath, job);
    console.log(`ADVANCED ${job.customer_job.id} → ${argument}`);
    return;
  }
  fail(`Lệnh không hợp lệ: ${command}`);
}

if (process.argv[1]?.endsWith("landing-page-agent.mjs")) main();
