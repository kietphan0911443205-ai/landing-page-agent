---
name: aibos-security-credential-management
description: "Quản lý credential và secret cho AIBOS: DB URL, password, API key, token, certificate, rotation, revocation, secret manager và kiểm tra rò rỉ. Dùng khi hệ thống cần truy cập tài nguyên có xác thực."
license: MIT
metadata:
  tags: [aibos, security, secrets, credentials, rotation, vault]
  related_skills: [aibos-security-policy-governance, aibos-security-database-access, aibos-backend-secure-coding]
---

# AIBOS Credential Management

## Nguyên tắc không thương lượng

- Không hardcode secret trong source, skill, prompt, tài liệu, fixture, log hoặc commit.
- Không in toàn bộ `DATABASE_URL`, token, password, private key hoặc connection string ra output.
- Chỉ đọc credential khi task đã có scope và authorization rõ ràng.
- Ưu tiên secret manager hoặc environment injection; `.env` local phải nằm trong `.gitignore` và không được commit.
- Mỗi service và môi trường dùng credential riêng; không dùng credential cá nhân cho service runtime.
- Credential phải có owner, TTL hoặc lịch rotation, phạm vi quyền và quy trình revoke.

## Quy trình

1. Xác định resource, environment, owner và action cần thực hiện.
2. Chọn credential tối thiểu cho action đó.
3. Resolve secret từ secret manager hoặc environment đã cấu hình.
4. Kiểm tra tồn tại, scope, expiry và target trước khi dùng.
5. Thực hiện thao tác với audit trail không chứa secret.
6. Xóa credential khỏi biến tạm/cache nếu workflow cho phép.
7. Rotation/revocation khi lộ secret, đổi owner, hết hạn hoặc kết thúc task.

## DB credential tiers

- `read-only`: đọc schema/data được phép; dùng cho inspection và reporting.
- `read-write`: ứng dụng runtime; không có quyền thay đổi schema.
- `migration`: chỉ dùng bởi migration pipeline, có approval và backup/rollback plan.
- `break-glass`: khẩn cấp, thời hạn ngắn, ghi audit đầy đủ; không dùng thường xuyên.

Nếu thiếu authorization hoặc không xác định được target, dừng ở bước chuẩn bị và yêu cầu thông tin tối thiểu; không thử credential khác.

## Customer-job isolation

Với Landing Page Agent, credential scope gắn với đúng `customer_job_id`, provider resource, environment và action cụ thể. Stitch OAuth, Vercel OAuth, database runtime và migration là các scope độc lập; không dùng credential/resource của job khác làm fallback. Chỉ lưu reference/metadata như provider, scope, expiry và pass/fail; không lưu giá trị token/password trong job contract, prompt, test fixture hoặc log.

Approval của khách hàng chỉ cho phép action đã nêu (ví dụ xác thực Stitch project hoặc deploy Vercel project). Approval không mở rộng sang database, domain, environment khác hay secret mutation. OAuth denial/expiry chuyển job sang blocker và giữ artifact local; agent không tự thử tài khoản hoặc scope khác.
