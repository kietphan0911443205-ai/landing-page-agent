---
name: aibos-security-policy-governance
description: "Thiết kế và review policy bảo mật cho hệ thống AIBOS: identity, role, permission, environment, data classification, audit và approval. Dùng khi định nghĩa ai được làm gì trên dữ liệu hoặc tài nguyên nào."
license: MIT
metadata:
  tags: [aibos, security, policy, authorization, governance, audit]
  related_skills: [aibos-backend-secure-coding, aibos-security-credential-management, aibos-security-database-access]
---

# AIBOS Security Policy Governance

## Mục tiêu

Biến yêu cầu bảo mật thành policy có thể review, implement và kiểm chứng. Không tự suy diễn quyền truy cập từ chức danh; quyền phải có owner, phạm vi, điều kiện và bằng chứng.

## Quy tắc bắt buộc

- Fail closed: thiếu policy, thiếu context hoặc policy không đọc được thì từ chối.
- Tách rõ authentication, authorization, data access và operational approval.
- Tách môi trường local, test, staging và production; không dùng policy production làm mặc định cho local.
- Áp dụng least privilege, deny-by-default và separation of duties.
- Không đưa secret, token, password hoặc giá trị nhạy cảm vào policy, log, report hay ví dụ.
- Mọi policy phải nêu owner, version, effective date, scope, allowed action, denied action, điều kiện và audit event.

## Output tối thiểu

1. Policy statement và phạm vi áp dụng.
2. Ma trận subject → resource → action → condition → environment.
3. Data classification và yêu cầu lưu giữ/xóa dữ liệu.
4. Luồng approval cho quyền nhạy cảm.
5. Audit events, alert và cách review định kỳ.
6. Test cases cho allow, deny, boundary và policy conflict.

## Khi review

Kiểm tra privilege escalation, cross-tenant access, IDOR, wildcard permission, quyền ngầm từ admin, credential dùng chung và khả năng thu hồi quyền. Nếu chưa đủ thông tin, ghi rõ open decision thay vì tự chọn.
