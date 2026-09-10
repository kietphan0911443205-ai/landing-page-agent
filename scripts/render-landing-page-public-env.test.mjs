import assert from "node:assert/strict";
import test from "node:test";

import { renderPublicEnv } from "./render-landing-page-public-env.mjs";

const completeJob = {
  schema_version: 1,
  kind: "landing_page_customer_job",
  customer_job: { id: "job_renderer_001", status: "requirement_approved", owner: "customer", locale: { default: "vi-VN", languages: ["vi-VN"] } },
  business: { product_name: "Huấn luyện cầu lông", brand_name: "Cầu lông Hà Nội", cta: { label: "Đăng ký tư vấn", destination: "#lead" }, sections: ["hero"] },
  lead_capture: { contact: { data_controller: "Người phụ trách mẫu", privacy_email: "privacy@example.com", public_address: "Hà Nội" }, consent: { policy_version: "v1" } },
  integrations: { stitch: {}, vercel: {}, database: {} },
  gates: { requirement_approved: true, design_approved: false, security_passed: false, qa_passed: false, production_approved: false },
  release: { environment: "staging" },
};

test("render chỉ tạo public env từ job", () => {
  const result = renderPublicEnv(completeJob);
  assert.match(result, /NEXT_PUBLIC_LANDING_BRAND_NAME=Cầu lông Hà Nội/);
  assert.match(result, /NEXT_PUBLIC_LANDING_PRIMARY_CTA_DESTINATION=#lead/);
  assert.doesNotMatch(result, /DATABASE_URL|CRON_SECRET|token|secret/i);
});

test("render từ chối dữ liệu public còn thiếu", () => {
  const incomplete = structuredClone(completeJob);
  incomplete.lead_capture.contact.privacy_email = null;
  assert.throws(() => renderPublicEnv(incomplete), /PRIVACY_EMAIL/);
});
