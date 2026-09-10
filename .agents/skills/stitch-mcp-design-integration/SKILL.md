---
name: stitch-mcp-design-integration
description: Use the project-scoped Google Stitch MCP to create, inspect and export UI design context, then turn it into a traceable AIBOS design contract before implementation.
metadata:
  owner: AIBOS UI/UX
  version: 1.1.0
  status: active
---

# Stitch MCP Design Integration

## Mục đích

Kết nối project hiện tại với Google Stitch qua MCP để UI/UX agent tạo hoặc đọc screen/design context dành riêng cho project. Stitch là design workspace, không thay thế requirement baseline, design contract hoặc QA evidence.

## Kích hoạt

Dùng khi task yêu cầu tạo UI bằng Stitch, đọc Stitch project/screen, lấy design context, export screen/asset hoặc chuyển thiết kế Stitch thành frontend handoff.

## Điều kiện kết nối

- MCP server project-scoped có tên `stitch` và endpoint `https://stitch.googleapis.com/mcp`.
- Authentication dùng OAuth của Codex; credential không được ghi vào repository.
- Mặc định khách hàng không cần tạo, gửi link hoặc cung cấp Stitch project/screen ID; sau khi requirement được duyệt và OAuth thành công, agent tự tạo project mới cho customer job.
- Chỉ yêu cầu project/screen ID khi khách hàng chủ động chọn phương án dùng project Stitch có sẵn.
- Nếu chưa authenticated, dừng ở `blocked` và hướng dẫn chạy `codex mcp login stitch`.

## Quy trình bắt buộc

1. Xác nhận mục tiêu design, người dùng, platform, viewport, localization và phạm vi screen.
2. Kiểm tra tool list bằng `/mcp` hoặc `codex mcp list`.
3. Sau khi customer job được duyệt requirement và OAuth đã connected, mặc định tạo Stitch project mới theo `customer_job_id`; ghi project ID vào working `.md`.
4. Tạo design system, screen và variant trong project vừa tạo; ghi prompt, options và ID artifact vào working `.md`.
5. Nếu khách hàng chọn project có sẵn, kiểm tra đúng scope rồi mới đọc/thay đổi; không lấy project của job khác làm fallback.
6. Khi đọc design, lấy metadata, HTML/screenshot/assets nếu tool cung cấp; ghi nguồn và timestamp.
7. Chuyển kết quả thành `DESIGN.md` hoặc design contract gồm layout, tokens, typography, states, responsive, accessibility và open decisions.
8. Handoff sang Frontend bằng `.md`; export từ Stitch không tự động là production implementation.
9. QA kiểm tra implementation so với design contract và evidence.

## Approval boundary

- Tool tạo, cập nhật hoặc export artifact phải để approval `prompt`; sau khi requirement và quyền tạo design của đúng customer job đã được duyệt, agent được tự tạo project mới theo mặc định.
- Không tự ý ghi đè design project/screen hoặc thay đổi product scope.
- Không đưa dữ liệu mật, PII hoặc credential vào prompt Stitch.

## Customer-job mode

Mỗi request Stitch phải mang theo đúng `customer_job_id`. Với mode mặc định `create_new`, project/screen scope được agent tạo và ghi nhận sau OAuth; khách hàng không phải gửi link. Với mode `use_existing`, khách hàng phải chủ động xác nhận project/screen ID. Không lấy project ID, brand, prompt, asset hoặc design system của job khác làm fallback. Khi OAuth bị từ chối hoặc generation timeout, giữ job ở blocker, lưu failure evidence và retry theo giới hạn; không tạo artifact giả để mở gate.

Design approval là approval riêng của customer job và chỉ bao phủ project/screen mà agent vừa tạo hoặc project có sẵn do khách hàng chọn. Trước khi handoff, kiểm tra design context có đúng locale, CTA, content claims và responsive scope của job; không coi Stitch artifact là bằng chứng implementation hoặc production.

## Output contract

Internal handoff dùng `.md`. Nếu design brief/design decision cần gửi khách hàng hoặc stakeholder, dùng `aibos-document-production` để đóng gói DOCX sau khi scope được chốt.
