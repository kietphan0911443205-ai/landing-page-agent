# UI/UX Test Matrix

## Nhóm kiểm tra

| Nhóm | Kiểm tra tối thiểu | Evidence |
|---|---|---|
| Critical journey | happy path, validation, cancel/back, retry, refresh | Playwright trace hoặc video |
| State coverage | loading, empty, error, offline/slow, unauthorized, forbidden | screenshot + response/status |
| Responsive | mobile, tablet, desktop; overflow; fixed/sticky element; touch target | screenshot theo viewport |
| Keyboard | tab order, visible focus, escape, enter/space, modal focus trap | test log + screenshot |
| Accessibility | role/name/state, label, contrast risk, heading structure, reduced motion | scan result + manual note |
| Visual | layout, typography, spacing, color, icon, data density | baseline diff có threshold |
| Recovery | duplicate submit, timeout, stale data, server error, destructive confirmation | steps + expected recovery |

## Format test case

Mỗi case nên có: `id`, `journey`, `priority`, `precondition`, `viewport`, `steps`, `expected`, `automation`, `evidence` và `status`.

## Quy tắc ưu tiên

- P0: không thể sử dụng, mất dữ liệu, bypass quyền hoặc ảnh hưởng phần lớn người dùng.
- P1: critical journey thất bại, accessibility barrier hoặc layout hỏng ở viewport chính.
- P2: lỗi usability/visual có workaround rõ ràng.
- P3: polish, copy hoặc consistency; không chặn release nếu không có rủi ro khác.

## Kết luận release

Không kết luận “đạt” chỉ vì E2E pass. Cần nêu riêng: functional automation, visual stability, accessibility confidence, manual usability findings và rủi ro còn lại.
