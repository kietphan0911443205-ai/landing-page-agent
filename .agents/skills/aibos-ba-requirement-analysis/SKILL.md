---
name: aibos-ba-requirement-analysis
description: Phân tích requirement state của AIBOS để phát hiện thiếu sót, mơ hồ, mâu thuẫn, rủi ro và khả năng kiểm thử; dùng trước khi viết SRS. Output bằng tiếng Việt và không tự bịa quyết định chưa được xác nhận.
---

# AIBOS Requirement Analysis

## Vietnamese Output Contract

Output và tài liệu phải bằng tiếng Việt; giữ nguyên keyword/code/SQL/Mermaid, tên file và identifier. Không bịa dữ liệu, quyết định hoặc nguồn; tách rõ `confirmed`, `proposed`, `assumption`, `risk` và `open question`; nêu nguồn, trade-off, blocker và bước tiếp theo khi phù hợp. Nếu project có output contract riêng, đọc contract đó trước khi thực hiện.


## Mục tiêu

Kiểm tra requirement state do `aibos-requirement-elicitation` tạo ra, chuẩn hóa các yêu cầu và đánh giá mức độ sẵn sàng để viết SRS. Skill này là lớp phân tích độc lập; không thay stakeholder quyết định nội dung nghiệp vụ.

Đây cũng là bước trung gian: report phân tích có thể ở dạng cấu trúc/Markdown, nhưng không được coi là deliverable `.docx` cuối. Chỉ `aibos-srs-generator` tạo tài liệu SRS/BRD phát hành.

## Nguyên tắc

- Chỉ coi thông tin có `status: confirmed` là cơ sở chắc chắn cho SRS.
- Phân biệt rõ yêu cầu, giả định, ràng buộc, quyết định và câu hỏi mở.
- Không tự chuyển `proposed`, `assumption` hoặc `open` thành `confirmed`.
- Mọi nhận định phải truy được về `source` hoặc đánh dấu là phát hiện của analyst.
- Output và nhận xét bằng tiếng Việt; giữ nguyên tên kỹ thuật cần thiết.

## Landing page analysis profile

Khi phân tích landing page, bổ sung các kiểm tra sau:

- Mục tiêu kinh doanh có gắn với một conversion goal và KPI/event đo được không.
- CTA có một hành động chính, destination rõ, trạng thái success/failure và fallback không.
- Mỗi section có purpose, audience need, content owner, source của claim và traceability tới CTA/requirement không.
- Headline/value proposition có khớp audience, positioning và product identity không; có overclaim hoặc claim chưa được duyệt không.
- Testimonial, logo, số liệu, chứng nhận và case study có nguồn/approval/legal status không.
- Form có field tối thiểu, consent, privacy purpose, validation, error/success, destination và retention owner không.
- SEO có search intent, metadata, canonical, Open Graph, indexing policy và content ownership không.
- Analytics có event naming, trigger, parameters, consent dependency và owner không; không tự invent tool/vendor.
- Responsive, accessibility, performance và localization có acceptance criteria đo được không.
- Có quyết định rõ landing page static hay cần backend/API; không tạo dependency backend nếu không có data behavior.

Khi landing page được tạo bởi agent phục vụ nhiều khách hàng, kiểm tra thêm:

- customer job có ID opaque và owner riêng, không dùng email/PII làm định danh;
- identity, brand, controller, contact, locale, content và analytics không bị kế thừa ngầm từ job khác;
- Stitch project, Vercel project, database target và secret scope có boundary riêng hoặc được đánh dấu `open`;
- requirement approval, design approval và production approval là các gate độc lập;
- OAuth/credential requirement chỉ mô tả việc customer xác thực qua provider, không yêu cầu secret xuất hiện trong requirement state;
- failure/retry/rollback behavior của external service có acceptance criteria.

Các phát hiện về copy, claim, privacy hoặc compliance phải được đánh dấu risk/blocker khi chưa có owner xác nhận; analyst không tự phê duyệt chúng.

## Các kiểm tra bắt buộc

### Tính đầy đủ

Kiểm tra ít nhất:

- mục tiêu kinh doanh có đo được hoặc có kết quả mong muốn rõ ràng không;
- stakeholder, người dùng, owner và người phê duyệt đã đủ chưa;
- in-scope và out-of-scope có ranh giới rõ không;
- mỗi functional requirement có actor, trigger, behavior, output và acceptance criteria chưa;
- đã có luồng thay thế, exception flow và trạng thái lỗi chưa;
- NFR có chỉ số, ngưỡng hoặc phương pháp xác minh chưa;
- business rules có điều kiện, kết quả và thứ tự ưu tiên chưa;
- dữ liệu có nguồn, trường chính, chất lượng, lưu trữ, retention và quyền truy cập chưa;
- integrations có bên liên quan, giao thức, dữ liệu, lỗi và retry chưa;
- assumptions và constraints có owner hoặc cách xác minh chưa.

### Tính rõ ràng và kiểm thử được

Đánh dấu các từ mơ hồ như “nhanh”, “dễ dùng”, “hợp lý”, “đầy đủ”, “có thể”, “thường xuyên” nếu không có tiêu chí đo. Chuyển mỗi phát hiện thành câu hỏi hoặc đề xuất tiêu chí cụ thể, không tự điền giá trị.

### Mâu thuẫn và trùng lặp

- So sánh yêu cầu, business rules, workflows, scope và decisions với nhau.
- Phát hiện hai mục yêu cầu kết quả khác nhau trong cùng điều kiện.
- Phát hiện một mục vừa in-scope vừa out-of-scope.
- Phát hiện quyết định mới phủ định quyết định cũ nhưng chưa ghi rõ thay thế.
- Gộp các yêu cầu trùng lặp chỉ khi không làm mất nguồn hoặc ý nghĩa.

### Truy xuất nguồn

Mỗi yêu cầu phải có nguồn: stakeholder, cuộc trao đổi, tài liệu, ticket hoặc quan sát hệ thống. Nếu thiếu nguồn, đưa vào danh sách cần xác nhận và không coi là yêu cầu đã chốt.

## Chấm điểm completeness

Tính điểm theo thang 0–100 và giải thích bằng tiếng Việt. Có thể dùng trọng số sau:

- mục tiêu, stakeholder và scope: 20 điểm;
- functional requirements và workflows: 25 điểm;
- business rules và exception flows: 15 điểm;
- NFR và tiêu chí chấp nhận: 20 điểm;
- data và integrations: 10 điểm;
- assumptions, constraints, decisions và source traceability: 10 điểm.

Ngưỡng mặc định để chuyển sang SRS Generator là `85/100`, đồng thời không còn contradiction nghiêm trọng và không còn open question chặn phạm vi, luồng chính, dữ liệu, bảo mật hoặc nghiệm thu. Nếu dự án quy định ngưỡng khác, ghi rõ ngưỡng đó trong kết quả.

Với landing page, nếu thiếu conversion goal/CTA, claim source/approval, form-data decision hoặc public SEO requirement thì `ready_for_srs` mặc định là `false`, dù tổng điểm đạt ngưỡng.

## Output bắt buộc

Trả về một analysis report bằng tiếng Việt gồm:

1. Tóm tắt trạng thái requirement.
2. Điểm completeness và ngưỡng áp dụng.
3. Các yêu cầu mơ hồ hoặc chưa test được.
4. Các yêu cầu thiếu hoặc thiếu exception flow.
5. Các mâu thuẫn và mức độ nghiêm trọng.
6. Các NFR còn thiếu.
7. Các yêu cầu không có nguồn.
8. Các câu hỏi cần quay lại stakeholder, ưu tiên theo giá trị.
9. Danh sách đề xuất chuẩn hóa, không biến thành quyết định.
10. Kết luận `ready_for_srs: true|false`.

Chỉ đặt `ready_for_srs: true` khi đạt ngưỡng completeness, các blocker đã xử lý và requirement state đủ rõ để người viết SRS không phải suy đoán.

Khi được yêu cầu review một file `.docx`, áp dụng các tiêu chí tại [document-output-standards.md](../aibos-ba-srs-generator/references/document-output-standards.md) cùng các kiểm tra nội dung ở trên.
