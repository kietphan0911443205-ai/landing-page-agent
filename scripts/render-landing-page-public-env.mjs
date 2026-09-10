import fs from "node:fs";
import path from "node:path";

import { validateJob } from "./validate-landing-page-customer-job.mjs";

const PUBLIC_FIELDS = [
  ["NEXT_PUBLIC_LANDING_BRAND_NAME", (job) => job.business.brand_name || job.business.product_name],
  ["NEXT_PUBLIC_LANDING_PRIMARY_CTA_LABEL", (job) => job.business.cta.label],
  ["NEXT_PUBLIC_LANDING_PRIMARY_CTA_DESTINATION", (job) => job.business.cta.destination],
  ["NEXT_PUBLIC_LANDING_SITE_TITLE", (job) => `${job.business.brand_name || job.business.product_name} | Landing page`],
  ["NEXT_PUBLIC_LANDING_DATA_CONTROLLER_NAME", (job) => job.lead_capture.contact.data_controller || ""],
  ["NEXT_PUBLIC_LANDING_PRIVACY_EMAIL", (job) => job.lead_capture.contact.privacy_email || ""],
  ["NEXT_PUBLIC_LANDING_CONTACT_ADDRESS", (job) => job.lead_capture.contact.public_address || ""],
  ["NEXT_PUBLIC_LANDING_CONSENT_VERSION", (job) => job.lead_capture.consent.policy_version || ""],
];

function fail(message) {
  throw new Error(message);
}

function safeValue(value, key) {
  if (typeof value !== "string" || !value.trim()) fail(`${key} chưa được BA/customer cung cấp`);
  if (/[\r\n]/.test(value)) fail(`${key} chứa ký tự xuống dòng không hợp lệ`);
  return value.trim();
}

export function renderPublicEnv(job) {
  validateJob(job);
  const lines = [`# Generated from ${job.customer_job.id}; public values only.`];
  for (const [key, getter] of PUBLIC_FIELDS) lines.push(`${key}=${safeValue(getter(job), key)}`);
  return `${lines.join("\n")}\n`;
}

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) fail("Dùng: node scripts/render-landing-page-public-env.mjs <job.json> <output.env>");
  const job = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const absoluteOutput = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  fs.writeFileSync(absoluteOutput, renderPublicEnv(job), "utf8");
  console.log(`RENDERED ${absoluteOutput}`);
}

if (process.argv[1]?.endsWith("render-landing-page-public-env.mjs")) main();
