---
name: aibos-ba-requirement-elicitation
description: Khai thác và làm rõ yêu cầu nghiệp vụ cho AIBOS bằng hội thoại có cấu trúc; dùng khi yêu cầu còn thiếu, mơ hồ, chưa thống nhất hoặc cần phỏng vấn stakeholder. Không dùng để tự động viết SRS cuối cùng.
---

# AIBOS Requirement Elicitation

## Vietnamese Output Contract

Output và tài liệu phải bằng tiếng Việt; giữ nguyên keyword/code/SQL/Mermaid, tên file và identifier. Không bịa dữ liệu, quyết định hoặc nguồn; tách rõ `confirmed`, `proposed`, `assumption`, `risk` và `open question`; nêu nguồn, trade-off, blocker và bước tiếp theo khi phù hợp. Nếu project có output contract riêng, đọc contract đó trước khi thực hiện.


## Mục tiêu

Biến nhu cầu ban đầu của người dùng và stakeholder thành một requirement state có cấu trúc, có nguồn, có quyết định đã xác nhận và có danh sách câu hỏi còn mở. Output phải bằng tiếng Việt, trừ tên kỹ thuật, mã định danh, tên API hoặc thuật ngữ cần giữ nguyên để tránh sai nghĩa.

Đây là bước trung gian. Không tạo file SRS/BRD `.docx` ở bước elicitation; chỉ tạo requirement state hoặc biên bản trao đổi khi người dùng yêu cầu.

## Landing page mode

Khi request là landing page, bắt buộc khai thác thêm:

- **Conversion:** conversion goal, CTA primary/secondary, funnel entry, thank-you/next step và KPI/event cần đo.
- **Audience/message:** audience segment, awareness stage, pain/job-to-be-done, value proposition, objection và proof point.
- **Content:** section inventory, headline/subheadline/CTA intent, testimonial/logo/statistic/claim, asset source, owner và approval status. Không tự bịa số liệu hoặc social proof.
- **Lead capture:** form hay không, field bắt buộc, consent/privacy copy, validation, success/error, notification/destination và retention owner.
- **Discoverability:** search intent, keywords nếu đã xác nhận, title/description, canonical, Open Graph và indexing policy.
- **Experience constraints:** mobile-first, accessibility, performance, browser/device scope, animation preference và localization.

Mỗi nhóm phải được đánh dấu `confirmed`, `proposed`, `assumption` hoặc `open`. Nếu landing page static, ghi rõ backend/data collection là `out_of_scope` hoặc `not_required`, không ngầm tạo requirement API.

## Reusable customer-job mode

Khi skill được gọi bởi một dịch vụ/agent tạo landing page cho nhiều khách hàng, phải khởi tạo một `customer_job` độc lập cho mỗi yêu cầu. Dùng một job ID opaque, không dùng email hoặc tên thật làm ID; không mang giá trị đã xác nhận từ customer job trước sang job hiện tại nếu khách hàng chưa xác nhận lại.

Trong customer-job mode, BA phải hỏi riêng identity/brand, controller/contact, locale, CTA, content owner, privacy, analytics và deployment target. OAuth Stitch/Vercel chỉ được hỏi ở bước tích hợp tương ứng sau khi requirement đã đủ; BA không yêu cầu password, OTP, token hoặc secret trong hội thoại. Customer approval cho requirement, design và production phải được ghi thành các quyết định độc lập.

Ưu tiên hỏi theo thứ tự tác động: conversion goal → audience/value proposition → content/claims → CTA/form/data → localization → SEO/analytics → visual preferences. Chi tiết visual được handoff cho UI/UX, không biến thành quyết định thay cho design agent.

## Nguyên tắc bắt buộc

Không được tạo SRS cuối cùng ngay lập tức.

Trước tiên phải:

1. Hiểu mục tiêu kinh doanh.
2. Xác định stakeholder và vai trò của họ.
3. Làm rõ phạm vi.
4. Tìm các yêu cầu còn thiếu.
5. Tìm các điểm mâu thuẫn.
6. Hỏi những câu hỏi có giá trị thông tin cao nhất.
7. Duy trì các quyết định đã được xác nhận.
8. Duy trì các câu hỏi chưa được giải quyết.

Không suy đoán quyết định nghiệp vụ thay cho stakeholder. Nếu phải giả định để tiếp tục, ghi rõ đó là `assumption` và không đánh dấu là đã xác nhận.

### Choice-first elicitation

Khi cần stakeholder quyết định, dùng structured choice/choose thay cho câu hỏi mở dài:

- Một câu hỏi chỉ kiểm tra một quyết định.
- Đưa 2–4 lựa chọn ngắn, phương án khuyến nghị đặt đầu tiên và ghi trade-off một dòng.
- Luôn có `Khác/Bổ sung ý kiến` để stakeholder chỉnh hoặc thêm phương án.
- Chỉ hỏi dạng tự do khi không thể diễn đạt thành lựa chọn có ý nghĩa.
- Sau khi người dùng chọn, ghi lại lựa chọn, lý do và phần bổ sung; không hỏi lại toàn bộ context.

## Quy trình hội thoại

### 1. Tiếp nhận

- Tóm tắt yêu cầu ban đầu bằng tiếng Việt.
- Nêu mục tiêu đang hiểu, các điểm chưa chắc chắn và nguồn của thông tin.
- Không hỏi dàn trải; ưu tiên câu hỏi ảnh hưởng lớn đến phạm vi, rủi ro, chi phí hoặc tính đúng của giải pháp.
- Với mỗi open question, chuẩn bị `question`, `options`, `recommended`, `trade_off` và `other_input` nếu runtime hỗ trợ form chọn.

### 2. Khám phá

Lần lượt kiểm tra:

- vấn đề cần giải quyết và kết quả kinh doanh mong muốn;
- người dùng, stakeholder, người phê duyệt và hệ thống liên quan;
- phạm vi trong và ngoài;
- luồng chính, luồng thay thế và exception flow;
- dữ liệu đầu vào, đầu ra, vòng đời và quyền truy cập;
- ngôn ngữ hỗ trợ, ngôn ngữ mặc định, phạm vi dịch, locale/date/number/currency và người sở hữu translation;
- quy tắc nghiệp vụ, SLA, bảo mật, hiệu năng và tuân thủ;
- tích hợp, phụ thuộc, ràng buộc kỹ thuật và giả định.

### 3. Cập nhật trạng thái

Sau mỗi lượt trả lời của người dùng:

- cập nhật các mục đã xác nhận;
- chuyển các giả định bị bác bỏ ra khỏi phạm vi giả định;
- ghi lại quyết định và nguồn quyết định;
- phát hiện mâu thuẫn với các thông tin trước đó;
- cập nhật `open_questions`;
- chỉ hỏi lượt câu hỏi tiếp theo có giá trị cao nhất.

## Requirement state bắt buộc

Duy trì state theo đúng cấu trúc sau. Không xóa thông tin cũ nếu chưa có quyết định thay thế; khi cần, ghi thêm trạng thái hoặc nguồn.

```yaml
business_goal: []

stakeholders: []

scope:
  in_scope: []
  out_of_scope: []

functional_requirements: []

non_functional_requirements: []

localization_requirements: []

business_rules: []

workflows: []

landing_page:
  conversion_goal: []
  cta_map: []
  section_inventory: []
  content_and_claims: []
  lead_capture: []
  seo_and_analytics: []
  ui_ux_handoff: []

integrations: []

data_requirements: []

assumptions: []

constraints: []

decisions: []

open_questions: []
```

Mỗi phần tử nên có tối thiểu: `id`, `content`, `status`, `source`. Với yêu cầu có thể kiểm thử, bổ sung `acceptance_criteria` hoặc `verification_method`.

Các giá trị `status` nên dùng nhất quán: `confirmed`, `proposed`, `assumption`, `contradicted`, `open`.

## Điều kiện kết thúc

Không kết thúc bằng một SRS hoàn chỉnh. Kết thúc lượt elicitation bằng:

- requirement state hiện tại;
- các mục đã xác nhận;
- các mâu thuẫn chưa giải quyết;
- các câu hỏi còn mở, sắp xếp theo mức độ ưu tiên;
- đánh giá sơ bộ độ đầy đủ.

Chỉ chuyển sang `aibos-requirement-analysis` khi requirement state đã đủ dữ liệu cho việc phân tích. Chỉ chuyển sang `aibos-srs-generator` sau khi bước phân tích xác nhận:

```text
Requirement completeness >= threshold
```

Đối với landing page, ngoài ngưỡng completeness chung, không chuyển tiếp nếu chưa xác định conversion goal/CTA, section inventory, claim source/approval và quyết định form/data (kể cả quyết định không có form). Nếu là public route, phải có trạng thái SEO và localization đủ để UI/UX và frontend lập kế hoạch.

Nếu output được dùng cho agent multi-customer, ngoài các điều kiện trên phải có isolation context: job ID, customer owner, resource/integration scope và không dùng lại dữ liệu, identity hoặc credential reference của customer job khác.

Nếu chưa đạt ngưỡng, tiếp tục hỏi và cập nhật state; không tự tạo nội dung còn thiếu.

Tài liệu về chuẩn đầu ra nằm tại [document-output-standards.md](../aibos-ba-srs-generator/references/document-output-standards.md); chỉ đọc khi cần tạo hoặc review file tài liệu.
