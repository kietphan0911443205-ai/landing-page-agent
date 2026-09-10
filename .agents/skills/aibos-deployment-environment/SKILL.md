---
name: aibos-deployment-environment
description: "Thiết kế environment contract cho local, test, staging và production: biến cấu hình, dependency, ports, health checks, secret boundary, data safety và promotion criteria. Dùng trước khi chạy hoặc deploy một project."
license: MIT
metadata:
  tags: [aibos, deployment, environments, configuration, secrets, health-check]
  related_skills: [aibos-deployment-local-run, aibos-security-policy-governance, aibos-security-credential-management, aibos-qa-launch-readiness]
---

# AIBOS Environment Contract

## Contract bắt buộc

Mỗi environment phải khai báo rõ:

- purpose, owner và data classification;
- service list, dependency, port và network boundary;
- required/non-required variables và safe default;
- secret source, credential tier và rotation owner;
- database target, migration policy, seed policy và backup boundary;
- health/readiness endpoint, smoke command và teardown/rollback command;
- promotion criteria và evidence cần lưu.

## Boundary

| Environment | Data | Credential | DB action | Promotion |
|---|---|---|---|---|
| local | synthetic/local | developer-local | reset được khi có scope | test pass |
| test | synthetic/isolated | CI/test-only | migration + seed controlled | CI evidence |
| staging | masked/approved | staging-only | migration reviewed | QA + security gate |
| production | real/confidential | managed secret, least privilege | approved migration only | release approval |

Không được promote `.env`, database dump, private key hoặc credential giữa các environment. Mọi biến nhạy cảm phải có trong `.env.example` dưới dạng rỗng hoặc placeholder mô tả, không có giá trị thật.

## Customer-job deployment mode

Mỗi deployment của Landing Page Agent phải gắn với một `customer_job_id` và resource tuple riêng: source/build version, Vercel project/scope, domain, database target, secret references, analytics destination và rollback target. Không dùng project, domain, database hoặc env value của job trước làm mặc định.

Chỉ render public env từ field đã được BA/customer duyệt; secret runtime inject bởi Vercel/secret manager theo environment. `staging` và `production` của cùng job vẫn là target khác nhau, có approval/promotion evidence riêng. Nếu target/scope/rollback chưa xác định, trạng thái là blocked và không thực hiện external write.
