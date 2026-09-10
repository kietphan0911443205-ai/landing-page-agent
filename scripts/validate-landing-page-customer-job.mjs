import fs from "node:fs";

const secretKeyPattern = /(password|token|secret|api[_-]?key|private[_-]?key|database[_-]?url)/i;
const jobIdPattern = /^job_[a-z0-9][a-z0-9_-]{2,63}$/;

function fail(message) {
  throw new Error(message);
}

function object(value, path) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${path} must be an object`);
  return value;
}

function required(value, path) {
  if (value === undefined || value === null || value === "") fail(`${path} is required`);
}

function scanKeys(value, path = "job") {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (secretKeyPattern.test(key) && key !== "secret_reference") fail(`${path}.${key} must not contain a secret value`);
    scanKeys(child, `${path}.${key}`);
  }
}

export function validateJob(job) {
  object(job, "job");
  if (job.schema_version !== 1) fail("schema_version must be 1");
  if (job.kind !== "landing_page_customer_job") fail("kind must be landing_page_customer_job");

  const customerJob = object(job.customer_job, "customer_job");
  required(customerJob.id, "customer_job.id");
  if (!jobIdPattern.test(customerJob.id)) fail("customer_job.id must be opaque and start with job_");
  if (customerJob.owner !== "customer") fail("customer_job.owner must be customer");
  object(customerJob.locale, "customer_job.locale");
  required(customerJob.locale.default, "customer_job.locale.default");
  if (!Array.isArray(customerJob.locale.languages) || customerJob.locale.languages.length === 0) fail("customer_job.locale.languages must be non-empty");

  const business = object(job.business, "business");
  required(business.product_name, "business.product_name");
  object(business.cta, "business.cta");
  required(business.cta.label, "business.cta.label");
  required(business.cta.destination, "business.cta.destination");
  if (!Array.isArray(business.sections) || business.sections.length === 0) fail("business.sections must be non-empty");

  object(job.integrations, "integrations");
  for (const integration of ["stitch", "vercel", "database"]) object(job.integrations[integration], `integrations.${integration}`);
  object(job.gates, "gates");
  for (const gate of ["requirement_approved", "design_approved", "security_passed", "qa_passed", "production_approved"]) {
    if (typeof job.gates[gate] !== "boolean") fail(`gates.${gate} must be boolean`);
  }
  object(job.release, "release");
  required(job.release.environment, "release.environment");

  scanKeys(job);
  return job;
}

function main() {
  const inputPath = process.argv[2] ?? "docs/ai/contracts/landing-page-customer-job.example.json";
  const job = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  validateJob(job);
  console.log(`PASS ${inputPath}`);
}

if (process.argv[1]?.endsWith("validate-landing-page-customer-job.mjs")) main();
