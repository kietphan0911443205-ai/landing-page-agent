# Bộ skill bổ trợ cho UI/UX Designer Agent

Đây là bộ skill bổ trợ đi kèm AIBOS UI/UX. Khi dùng chúng, output, nhận xét và tài liệu phải bằng tiếng Việt; giữ nguyên tên framework, thuật ngữ chuyên môn và code khi cần.

## Discovery / UX

- `aibos-ui-ux-design-everyday-things`: affordance, signifier, feedback, constraint, mental model và khả năng discoverability.

## Visual Design

- `aibos-ui-ux-refactoring-ui`: hierarchy, spacing, color, depth và design system.
- `aibos-ui-ux-web-typography`: lựa chọn, ghép và triển khai typography cho web.
- `aibos-ui-ux-top-design`: trải nghiệm web giàu tính trình diễn, motion và storytelling; không ưu tiên hơn khả năng sử dụng của control plane.

## Interaction

- `aibos-ui-ux-microinteractions`: trigger, rule, feedback, loop/mode và trạng thái tương tác.

## Platform

## Review / QA

- `aibos-ui-ux-heuristics`: audit usability theo heuristic, severity và accessibility.

## Quy tắc chọn skill

1. Luôn đọc `DESIGN.md` và áp dụng token-only rule của AIBOS.
2. Dùng `ui-ux-pro-max` để tạo baseline design system khi thiết kế page hoặc surface mới.
3. Chọn skill bổ trợ theo vấn đề cụ thể, không nạp tất cả cùng lúc.
4. Review UX bằng `aibos-ui-ux-heuristics`; review visual bằng `aibos-ui-ux-refactoring-ui`.
5. Với web React của AIBOS, ưu tiên `aibos-ui-ux-refactoring-ui`, `aibos-ui-ux-web-typography`, `aibos-ui-ux-microinteractions` và `aibos-ui-ux-heuristics`.

## Tính portable

Các skill và reference trong bundle phải tự đủ để sao chép sang project khác. Không đưa tên project, đường dẫn máy cá nhân, credential hoặc assumption riêng của một codebase vào nội dung skill. Khi cập nhật bundle, kiểm tra lại đường dẫn nội bộ và quy tắc output trước khi thay thế.
