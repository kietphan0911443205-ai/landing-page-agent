---
name: aibos-qa-ui-ux-validation
description: "Đánh giá và tự động hóa chất lượng UI/UX của web app: usability, accessibility, responsive, visual regression, interaction flow và Playwright; dùng khi cần kiểm thử trải nghiệm hoặc tối ưu UI dựa trên bằng chứng."
---

# AIBOS UI/UX Validation

## Mục tiêu

Biến yêu cầu UI/UX hoặc feedback người dùng thành testable checks, automation test và báo cáo ưu tiên theo mức độ ảnh hưởng. Không đánh giá “đẹp/xấu” một cách chủ quan; mọi finding cần có bước tái hiện, bằng chứng và tiêu chí chấp nhận.

## Chọn mode

- **Usability review**: kiểm tra task flow, information architecture, affordance, feedback, error recovery và cognitive load.
- **Accessibility audit**: kiểm tra semantic HTML, keyboard navigation, focus, labels, contrast, target size, reduced motion và screen reader risk.
- **Responsive/interaction review**: kiểm tra breakpoint, overflow, touch, loading, empty, error, permission và network state.
- **Automation**: viết hoặc cập nhật Playwright test cho critical journey, form validation, auth boundary, API error, visual baseline và accessibility scan.
- **Optimization**: đề xuất thay đổi UI/UX theo impact, effort, risk; sau đó đo lại bằng test, screenshot hoặc UX metric.

## Quy trình

1. Đọc requirement, user story, acceptance criteria, design contract và route/component liên quan.
2. Xác định persona, critical user journeys, trạng thái UI và device/browser scope. Nếu thiếu, ghi rõ assumption.
3. Lập test matrix trước khi code; ưu tiên journey gây mất dữ liệu, mất chuyển đổi, lỗi quyền hoặc ảnh hưởng người dùng khuyết tật.
4. Kiểm tra thủ công để tìm vấn đề về flow và ngữ cảnh; tự động hóa các invariant lặp lại.
5. Với automation, dùng locator theo role/label/test id ổn định, Page Object hoặc fixture dùng chung; tránh selector phụ thuộc CSS/layout và `waitForTimeout`.
6. Chụp evidence khi fail: URL, viewport, bước tái hiện, console/network nếu liên quan, screenshot/video/trace và expected-versus-actual.
7. Phân loại severity (blocker/critical/major/minor), đề xuất fix cụ thể và chạy regression sau khi sửa.

## Tiêu chí bắt buộc

- Test phải độc lập, repeatable, có setup/cleanup và không phụ thuộc thứ tự chạy.
- Không dùng snapshot mù quáng: visual baseline phải ổn định font, viewport, timezone, locale và dữ liệu.
- Accessibility automation chỉ là bộ lọc ban đầu; vẫn phải kiểm tra keyboard và flow thực tế.
- Không hy sinh usability để làm test pass. Nếu design và behavior mâu thuẫn, báo rõ decision cần xác nhận.
- Không đưa credential thật, dữ liệu người dùng thật hoặc tên project cụ thể vào skill, test fixture hay report mẫu.

## Đầu ra

Tạo các artifact phù hợp với scope:

- `ui-ux-test-matrix`: journey, precondition, steps, expected result, priority, automation status.
- `ui-ux-findings`: severity, evidence, impact, root cause hypothesis, recommendation và retest status.
- Test code/fixture/configuration và baseline có thể chạy lại.
- Summary gồm coverage, known limitation, flaky test, accessibility risk và release recommendation.

Đối với Next.js/Angular, ưu tiên Playwright cho browser journey; dùng công cụ accessibility/visual phù hợp stack hiện tại. Đọc [references/ui-ux-test-matrix.md](references/ui-ux-test-matrix.md) khi cần thiết kế matrix hoặc báo cáo chi tiết.

## Chế độ Landing Page Agent theo customer job

Mỗi test run phải ghi rõ `customer_job_id`, template/version, locale, public config và environment; không dùng snapshot hoặc test data của customer job khác. Kiểm tra tối thiểu CTA/destination, brand/copy đã duyệt, form field/consent, success/error/retry, keyboard/accessibility, responsive desktop/tablet/mobile và no-secret/no-PII trong rendered HTML.

Với hai job chạy liên tiếp, test phải chứng minh không lẫn brand, CTA, analytics event, form field, screenshot baseline hoặc link privacy. OAuth/connector failure và content/legal chưa duyệt là blocker testable; QA không tự hạ severity để cho phép deploy.
