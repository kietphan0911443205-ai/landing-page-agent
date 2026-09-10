---
name: aibos-security-database-access
description: "Thiết kế và review chính sách truy cập database cho AIBOS: DB roles, read/write/migration separation, tenant isolation, RLS, network boundary, audit và safe verification. Dùng khi agent hoặc ứng dụng cần truy cập DB."
license: MIT
metadata:
  tags: [aibos, security, database, access-control, rls, audit]
  related_skills: [aibos-database-design, aibos-security-policy-governance, aibos-security-credential-management]
---

# AIBOS Database Access Policy

## Mặc định an toàn

- Không kết nối production nếu chưa có target, mục đích, authorization, thời gian và credential scope rõ ràng.
- Mặc định dùng read-only cho inspection, schema review và reporting.
- Không chạy `DROP`, `TRUNCATE`, destructive migration, bulk update/delete hoặc thay đổi permission nếu chưa có approval riêng.
- Không expose rows chứa PII/secrets; mask dữ liệu trong output và artifact.
- Tách database role cho runtime read/write, migration, analytics và break-glass.
- Database runtime không được dùng quyền owner/superuser.

## Access matrix cần tạo

| Actor | Environment | Database/resource | Action | Role | Approval | Audit |
|---|---|---|---|---|---|---|
| service runtime | staging/production | schema/table | read/write cần thiết | runtime role | owner | bắt buộc |
| migration pipeline | staging/production | schema | DDL/migration | migration role | release owner | bắt buộc |
| analyst/agent | local/staging | approved views | read-only | reporting role | data owner | bắt buộc |

## Kiểm tra bắt buộc

1. Xác minh target và environment không chỉ dựa vào tên biến.
2. Xác minh role hiện tại và quyền thực tế trước thao tác nhạy cảm.
3. Kiểm tra tenant boundary, row-level security, foreign-key boundary và query parameterization.
4. Với migration: review expand-contract, backup/rollback, lock impact và zero-downtime risk.
5. Ghi audit event gồm actor, action, target, timestamp, result và correlation ID; tuyệt đối không ghi secret.

## Kết quả khi bị chặn

Trả về blocker cụ thể: thiếu authorization, thiếu target, credential hết hạn, role quá rộng, thiếu RLS, thiếu rollback hoặc không xác định được dữ liệu ảnh hưởng. Không tự chuyển sang quyền cao hơn.

## Customer-job database mode

Với Landing Page Agent, mỗi customer job phải có database target và environment rõ ràng; không mặc định dùng chung production database giữa các job. Nếu dùng shared database theo quyết định kiến trúc, bắt buộc có tenant key, query scoping/RLS, ownership test A/B và migration/backup evidence tương ứng.

Lead data phải được truy cập bằng runtime role tối thiểu, migration dùng role tách biệt, analytics/reporting chỉ qua scope được duyệt. `customer_job_id` do browser gửi không được tự tạo quyền truy cập; server/deployment binding mới là nguồn quyết định. Output kiểm tra phải mask email/PII và không ghi connection string.
