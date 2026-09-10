# Landing Page Agent

Landing Page Agent là bộ agent và công cụ điều phối để tạo landing page theo từng khách hàng:

```text
BA hỏi khách hàng
  → duyệt requirement
  → UI/UX thiết kế với Stitch
  → Frontend/Backend triển khai local
  → QA kiểm thử
  → khách hàng duyệt production
  → deploy Vercel riêng cho customer job
```

## Phạm vi

Gói này chứa workflow, skill, contract, state-machine guard và công cụ đánh giá. Nó không chứa landing page mẫu, database local, lead thật, credential, secret, Stitch project, Vercel project hoặc thông tin cá nhân.

Agent không tự nhận mật khẩu, OTP, API key hay secret trong chat. Khách hàng phải tự xác thực OAuth trong giao diện của provider và duyệt các external write trước khi Stitch/Vercel được sử dụng.

## Bắt đầu nhanh

Yêu cầu Node.js 20 trở lên.

```bash
npm test
node scripts/landing-page-agent.mjs create .landing-page/jobs/customer-job.json
node scripts/landing-page-agent.mjs status .landing-page/jobs/customer-job.json
```

Job mới bắt đầu ở trạng thái `queued`. Agent BA phải thu thập và ghi nhận dữ liệu khách hàng trước khi chuyển sang UI/UX. Không dùng `customer_job.id` chứa email, tên thật hoặc PII.

## Các cổng bắt buộc

- Requirement: khách hàng duyệt CTA, audience, locale, sections, form và privacy.
- Design: khách hàng xác thực OAuth; agent tự tạo Stitch project mới rồi trình thiết kế để khách hàng duyệt.
- Security: credential, database target, retention và scope được kiểm tra.
- QA: build, E2E, accessibility, responsive và visual test đạt.
- Production: khách hàng duyệt cuối; release có version immutable và rollback target.

Production không được bỏ qua Security, QA, privacy/legal hoặc rollback gate.

## Cấu trúc

- `.agents/skills/`: skill của các lane BA, Architecture, UI/UX, Frontend, Backend, Security, QA và Deployment.
- `docs/ai/agents/landing-page-agent.md`: contract của Landing Page Agent.
- `docs/ai/contracts/`: contract customer job và ví dụ an toàn.
- `docs/ai/evaluations/`: regression/evaluation matrix.
- `scripts/`: state-machine guard, validator, public config renderer và evaluation runner.

## OAuth và triển khai

Gói này không chứa connector credential. Mỗi customer job phải có resource riêng hoặc scope/tenant isolation đã được kiểm chứng cho Stitch, Vercel và database. Với Stitch, khách hàng không cần tạo hoặc gửi project link; agent tạo project mới sau OAuth và requirement approval. `DATABASE_URL`, `CRON_SECRET` và mọi secret chỉ được inject tại environment manager của môi trường tương ứng.

## Trạng thái phát hành

Đây là bản mã nguồn agent cần được owner chọn license, review bảo mật và kết nối provider riêng trước khi công khai chính thức. Không dùng dữ liệu hoặc deployment của bản demo để làm evidence cho khách hàng mới.
