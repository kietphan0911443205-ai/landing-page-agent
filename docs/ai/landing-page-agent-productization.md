# Product hóa Landing Page Agent

## Mục tiêu

`landing-page` là agent/dịch vụ tạo landing page tự động cho nhiều khách hàng. Sản phẩm được bán là quy trình và năng lực tự động hóa; landing page được tạo ra chỉ là output riêng của từng customer job.

Agent phải biến brief của một khách hàng thành một deployment độc lập theo chuỗi:

```text
BA hỏi khách hàng
  → khách hàng duyệt requirement
  → UI/UX dùng Google Stitch
  → khách hàng duyệt thiết kế
  → Frontend/Backend build local
  → QA kiểm thử
  → khách hàng xác nhận production
  → Vercel deploy riêng
```

## Ranh giới sản phẩm

### Agent chịu trách nhiệm

- Hỏi và ghi nhận requirement theo BA contract.
- Điều phối đúng domain agent và handoff có evidence.
- Tạo hoặc cập nhật Stitch project/screen sau khi customer xác thực và cho phép.
- Tạo code/config riêng cho customer job.
- Chạy build, test, accessibility, responsive và smoke test.
- Tạo deployment Vercel riêng sau approval production.
- Báo blocker bằng ngôn ngữ nghiệp vụ và đề xuất lựa chọn tiếp theo.

### Agent không được tự làm

- Tự chốt giá, claim, testimonial, logo, privacy/legal copy hoặc analytics vendor.
- Dùng lại tên, email, địa chỉ, Stitch project, Vercel project, database hoặc secret của customer khác.
- Thu hoặc đưa secret vào prompt, source code, log, artifact public hoặc `.env.example`.
- Deploy production khi chưa có approval cuối của đúng khách hàng.
- Coi Stitch artifact hoặc local build là bằng chứng production.

## Customer job và isolation

Mỗi lần khách hàng yêu cầu tạo landing page phải tạo một `customer_job` độc lập với các định danh sau:

| Trường | Ý nghĩa | Quy tắc |
|---|---|---|
| `customer_job_id` | ID không chứa PII | Dùng để trace toàn bộ workflow |
| `customer_display_name` | Tên hiển thị của khách hàng | Chỉ dùng sau khi BA xác nhận |
| `source_workspace` | Workspace/source riêng | Không trộn với job khác |
| `stitch_project_id` | Project Stitch của job | Customer xác thực Google/Stitch |
| `vercel_project_id` | Project Vercel của job | Customer xác thực Vercel |
| `database_target` | Neon/database target | Tách Preview và Production |
| `secret_scope` | Nơi lưu secret | Chỉ reference, không ghi giá trị vào artifact |
| `release_version` | Phiên bản immutable | Dùng cho rollback và audit |

`customer_job_id` phải xuất hiện trong handoff, test report và deployment record. Không dùng email hoặc tên thật làm ID.

## Các nhóm dữ liệu BA phải hỏi

BA không được tự điền thay khách hàng. Tối thiểu phải hỏi và ghi rõ `confirmed`, `open` hoặc `blocked` cho:

- Tên sản phẩm/brand và người sở hữu nội dung.
- Audience, ngôn ngữ, locale, định dạng ngày/số/tiền tệ.
- Value proposition, CTA chính và destination.
- Sections bắt buộc, pricing, testimonial/logo/metric và nguồn chứng minh.
- Form lead, field, consent, privacy contact, retention và nơi nhận dữ liệu.
- SEO metadata, indexing, analytics vendor, event và consent dependency.
- Môi trường `local`, `staging` hoặc `production`.
- Tài khoản Google/Stitch, Vercel và database mà khách hàng cho phép kết nối.

Nếu khách hàng chưa có legal/privacy copy, BA chỉ tạo draft và mở gate; không biến draft thành nội dung phát hành.

## Trạng thái chuẩn

```text
queued
  → ba_in_progress
  → requirement_pending_customer
  → requirement_approved
  → stitch_auth_pending
  → design_pending_customer
  → design_approved
  → implementation_in_progress
  → ready_for_qa
  → ready_for_deploy
  → production_approval_pending
  → deployed
```

Các trạng thái chặn có thể xuất hiện ở bất kỳ bước nào:

```text
blocked_missing_customer_input
blocked_oauth
blocked_external_service
blocked_security
blocked_legal
blocked_qa
blocked_deployment
```

Chỉ khách hàng hoặc domain owner có thẩm quyền mới đóng được blocker tương ứng. Orchestrator không được tự đổi `open` thành `confirmed`.

## OAuth và external write

- Stitch OAuth thuộc customer account/project của customer; agent không xin hoặc lưu mật khẩu/OTP.
- Vercel OAuth thuộc team/personal scope mà customer chọn; agent chỉ được thao tác project đã xác nhận.
- Mọi create/update/export/deploy là external write, cần approval action cụ thể.
- Nếu OAuth thất bại, job chuyển `blocked_oauth`, giữ nguyên artifact local và hướng dẫn customer xác thực lại.
- Secret được inject theo environment manager. Log chỉ được ghi tên biến, scope và trạng thái pass/fail.

## Definition of Done cho agent có thể bán

- Có customer intake contract và BA question flow.
- Có task graph/handoff cho BA, UI/UX, Architecture, Backend, Frontend, Security, QA và Deployment.
- Có tenant/customer isolation record cho Stitch, Vercel, DB và secret.
- Có approval gate trước design export và production deploy.
- Có regression matrix cho happy path, ambiguity, OAuth failure, Stitch failure, Vercel failure, legal/privacy thiếu và cross-customer isolation.
- Có recovery/rollback contract khi dịch vụ ngoài timeout hoặc deployment fail.
- Có tài liệu onboarding: khách hàng cần cung cấp gì, xác thực ở đâu và khi nào phải duyệt.
- Có evidence không dùng PII production trong evaluation.

## Runtime guard đã triển khai

Project có state-machine guard tại `scripts/landing-page-agent.mjs`. Guard tạo job độc lập, báo next action/blocker, chỉ cho chuyển trạng thái theo dependency và giới hạn actor cho từng approval gate. `scripts/render-landing-page-public-env.mjs` biến các giá trị public đã được duyệt thành env cho output riêng của job; script không đọc hoặc sinh secret. Các test hồi quy nằm tại `scripts/landing-page-agent.test.mjs` và `scripts/render-landing-page-public-env.test.mjs`; job runtime mặc định được lưu ngoài Git trong `.landing-page/jobs/`.

Guard này là lớp an toàn và traceability cho agent, không giả vờ thay thế OAuth connector của Stitch/Vercel hoặc hệ thống secret manager. Những integration đó vẫn phải chạy qua MCP/credential store theo approval boundary.

## Trạng thái của project hiện tại

Vertical slice `LingoViệt` đã chứng minh được một output landing page chạy trên Vercel/Neon. Intake contract, questionnaire, isolation guard, OAuth boundary, recovery contract và evaluation matrix đã có. Việc còn thiếu trước khi bán đại trà là chạy evaluation candidate trong môi trường cô lập và tích hợp connector OAuth/automation thật cho từng customer job; không được dùng deployment mẫu để thay thế evidence đó.

Lưu ý implementation: template app hiện đã tham số hóa brand, CTA, SEO và privacy public values, nhưng copy section và lead fields vẫn mang domain của output mẫu. Landing Page Agent phải tạo/kiểm tra các phần này từ requirement của từng job trước khi mở gate `ready_for_qa`; không được dùng nguyên template LingoViệt cho một ngành khác.
