---
name: aibos-workflow-planning
description: "Chuyển requirement hoặc issue thành kế hoạch triển khai có thứ tự, dependency, acceptance criteria và handoff; dùng sau orchestration bootstrap và trước khi giao việc cho agent/subagent hoặc bắt đầu feature lớn."
---

# AIBOS Workflow Planning

## Entry dependency

Với request cross-lane, feature/change code hoặc task cần subagent, phải kích hoạt `aibos-orchestration-bootstrap` trước. Skill này lập execution plan bên trong task graph do Orchestrator sở hữu; không tự route task nếu chưa có Orchestrator owner.

## Quy trình

1. Xác định outcome, in-scope, out-of-scope, stakeholder và tiêu chí thành công.
2. Đọc requirement, architecture, schema, API contract và trạng thái code hiện tại; tách `confirmed`, `assumption`, `open question`, `risk`.
3. Chia công việc thành vertical slice nhỏ, mỗi task có mục tiêu, input, file/scope, dependency, acceptance criteria và cách verify.
4. Sắp xếp theo dependency: contract/domain → persistence/API → UI/integration → QA/deployment.
5. Chỉ giao subagent phần độc lập; mỗi handoff phải nêu rõ output, giới hạn tác động và blocker.
6. Chốt plan trước khi implementation; khi phát hiện scope mới, cập nhật plan thay vì âm thầm mở rộng.

Nếu còn quyết định cần người dùng xác nhận, đưa thành choose question: 2–4 options, option khuyến nghị đầu tiên, trade-off ngắn và `Khác/Bổ sung ý kiến`. Sau lựa chọn chỉ cập nhật phần bị ảnh hưởng trong plan.

## Đầu ra bắt buộc

- Goal và non-goals.
- Assumption/open questions/risk.
- Task list có thứ tự và dependency.
- Acceptance criteria kiểm thử được.
- Verification plan và definition of done.
- Handoff contract nếu có subagent.

Không biến đề xuất thành quyết định đã được duyệt và không tạo task chỉ để làm đẹp kế hoạch.
