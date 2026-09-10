---
name: aibos-ba-product-identity
description: "Chốt product identity trước khi viết SRS hoặc thiết kế UI: tên sản phẩm/brand, category, audience, value proposition, vision, mission, product philosophy, brand promise, tone of voice và slogan."
---

# AIBOS BA Product Identity

## Mục tiêu

Biến ý tưởng rời rạc thành một product identity có thể dùng nhất quán trong requirement, UX copy, UI, marketing và quyết định roadmap. Không tự đặt tên/slogan như một quyết định đã được duyệt; phân biệt `confirmed`, `proposed`, `assumption` và `open question`.

## Khi dùng

- Bắt đầu sản phẩm hoặc brand mới.
- Tên sản phẩm, slogan, audience hoặc value proposition còn mơ hồ.
- Đổi định vị, mở rộng thị trường hoặc cần thống nhất cách gọi trong SRS/UI.
- Review tài liệu thấy dùng nhiều tên, thông điệp hoặc thuật ngữ cạnh tranh nhau.

## Quy trình

1. Thu thập context: problem, target audience, job-to-be-done, category, differentiation, market/context, constraints và tên đang được dùng.
2. Tách identity khỏi implementation: brand/product name là decision; framework, database hoặc vendor không thuộc identity trừ khi là product promise.
3. Đề xuất 3–5 hướng name/positioning nếu chưa có tên; mỗi hướng có meaning, pronunciation, memorability, risk, domain/trademark check cần làm và lý do phù hợp.
4. Viết value proposition một câu, product promise, vision, mission và 3–5 nguyên tắc triết lý sản phẩm.
5. Đề xuất slogan/tagline theo nhóm: functional, emotional, outcome-focused; kiểm tra ngắn, dễ nhớ, không overclaim và không mâu thuẫn với product promise.
6. Xác định tone of voice, từ nên dùng, từ cần tránh, cách gọi user/entity/feature và ví dụ copy cho CTA, empty state, error và onboarding.
7. Chốt decision log: option được chọn, người duyệt, ngày hiệu lực, lý do, trade-off, phạm vi áp dụng và điều kiện xem xét lại.
8. Chuyển identity đã xác nhận vào SRS glossary, UI/UX design contract, metadata/SEO, docs và acceptance criteria; không rải bản copy tạm như confirmed brand.

Khi cần người dùng chọn hướng định vị, trình bày 2–4 naming/positioning options dạng choose, đặt hướng khuyến nghị đầu tiên, kèm trade-off và `Khác/Bổ sung ý kiến`; không yêu cầu viết lại brief.

Trước khi chốt verbal identity, phải hỏi phạm vi ngôn ngữ bằng choose: `chỉ tiếng Việt (MVP)`, `Việt + English`, `đa ngôn ngữ có danh sách cụ thể`, hoặc `Khác/Bổ sung ý kiến`. Ghi riêng ngôn ngữ mặc định, tone/copy theo locale và người duyệt bản dịch.

## Kiểm tra bắt buộc

- Tên không trùng/khó nhầm với product khác trong phạm vi thị trường mục tiêu; việc legal/trademark/domain là open task nếu chưa được xác minh.
- Slogan mô tả đúng giá trị có thể cung cấp, không hứa về tính năng chưa có.
- Vision/mission khác nhau: vision là trạng thái muốn tạo ra; mission là cách sản phẩm hành động hiện tại.
- Triết lý phải chuyển được thành quyết định UX/feature, không chỉ là câu khẩu hiệu.
- Identity không chứa tên project mẫu, tên khách hàng, credential hoặc dữ liệu riêng tư.

## Đầu ra

Product identity brief, naming options, decision matrix, confirmed identity, philosophy principles, slogan candidates, voice/copy guide, open questions và handoff cho BA/Architecture/UI/UX/Frontend.

## Landing page application

Khi identity được dùng cho landing page, brief phải cung cấp thêm:

- primary audience và awareness stage;
- one-line value proposition và proof boundary;
- headline/subheadline/CTA direction ở mức thông điệp, không phải visual design;
- tone of voice, claim được phép và claim cần owner/legal duyệt;
- SEO title/description direction nếu đã xác nhận;
- localization theo từng locale và owner duyệt copy.

Không coi slogan candidate, marketing claim hoặc SEO copy đề xuất là `confirmed` nếu chưa có decision log.

Đọc [references/product-identity-brief.md](references/product-identity-brief.md) khi cần tạo artifact đầy đủ.
