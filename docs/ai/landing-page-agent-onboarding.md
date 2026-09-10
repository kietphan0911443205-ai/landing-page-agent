# Hướng dẫn khách hàng dùng Landing Page Agent

## Bạn cần làm gì

Bạn chỉ cần:

1. Trả lời câu hỏi BA về sản phẩm, khách hàng mục tiêu, nội dung, CTA, form, privacy, analytics và ngôn ngữ.
2. Duyệt bản requirement và design handoff.
3. Xác thực Google/Stitch khi agent yêu cầu.
4. Xác thực Vercel và chọn đúng personal account/team/project khi agent yêu cầu.
5. Duyệt lần cuối trước khi phát hành production.

Bạn không cần chạy command nội bộ, tự viết code hoặc gửi mật khẩu, OTP, token hay secret vào hội thoại.

## Agent tự thực hiện

- Tạo `customer_job` độc lập và mã trace không chứa PII.
- Điều phối BA → UI/UX → Architecture → Database → Backend/Frontend → Security → QA → Deployment.
- Tạo landing page theo nội dung đã được duyệt, chạy build/test/accessibility/responsive và chuẩn bị release.
- Báo rõ blocker nếu Stitch, Vercel, database, QA hoặc policy chưa đủ điều kiện.
- Chỉ deploy production sau khi có đúng approval của khách hàng.

## Thông tin không được dùng lại

Mỗi khách hàng có resource scope riêng: Stitch project, Vercel project/scope, database target, secret reference, domain và release version. Agent không được lấy lại những giá trị này từ job trước.

## Khi nào cần dừng để hỏi bạn

Agent phải hỏi lại thay vì tự đoán khi còn thiếu hoặc chưa duyệt:

- CTA hoặc nơi dẫn đến CTA.
- Claim, testimonial, logo, số liệu và giá.
- Người kiểm soát dữ liệu, địa chỉ liên hệ, privacy notice, retention.
- Ngôn ngữ, format ngày/số/tiền tệ và analytics.
- Vercel scope/project, database target hoặc môi trường staging/production.
- Approval thiết kế, QA và production.

## Trạng thái kết thúc

`deployed` chỉ có nghĩa job đã có deployment evidence, health check và rollback target. Không đồng nghĩa nội dung pháp lý, claim marketing hoặc quyền sử dụng tài sản đã được cơ quan chuyên môn thẩm định; các phần đó vẫn cần khách hàng/đơn vị có thẩm quyền duyệt.

## Kiểm tra job nội bộ

Job được kiểm tra bằng contract và state machine:

```powershell
node scripts/landing-page-agent.mjs status .landing-page/jobs/<job>.json
node scripts/validate-landing-page-customer-job.mjs docs/ai/contracts/landing-page-customer-job.example.json
node scripts/render-landing-page-public-env.mjs <job.json> <output.env>
```

Thư mục `.landing-page/jobs/` là dữ liệu runtime cục bộ và đã được loại khỏi Git để tránh đưa dữ liệu khách hàng vào source repository.
