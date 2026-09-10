---
name: aibos-context-engineering
description: "Chuẩn bị và quản lý context cho coding agent/subagent: chọn đúng artifact, giới hạn phạm vi, progressive disclosure, evidence và handoff; dùng khi task lớn, nhiều lane hoặc dễ quá tải context."
---

# AIBOS Context Engineering

## Quy trình

1. Viết task contract: goal, scope, non-goals, output, constraints và tiêu chí nghiệm thu.
2. Nạp context theo tầng: `AGENTS.md` → skill đang dùng → file contract/requirement → source liên quan → test/evidence.
3. Chỉ đọc file cần cho quyết định hiện tại; không nạp toàn bộ repository hoặc toàn bộ skill bundle.
4. Tách facts khỏi assumptions và proposed decisions; gắn nguồn cho kết luận quan trọng.
5. Khi handoff, truyền bounded scope, paths/symbols, findings, coverage, unresolved questions và expected output.
6. Trước khi kết luận, kiểm tra freshness, missing coverage, conflicting instructions và evidence.

Khi thiếu một quyết định nhưng có thể giới hạn thành các phương án, gửi structured choice thay vì yêu cầu người dùng mô tả lại toàn bộ context; giữ nguyên context đã xác nhận và chỉ hỏi phần còn thiếu.

## Guardrails

- Không suy đoán khi thiếu source hoặc test quan trọng.
- Không truyền credential, secret hoặc dữ liệu nhạy cảm vào context không cần thiết.
- Không để subagent tự mở rộng scope hoặc tự coi kết quả provisional là confirmed.
- Ưu tiên summary có cấu trúc, link/file cụ thể và câu hỏi còn mở thay vì dump log dài.
