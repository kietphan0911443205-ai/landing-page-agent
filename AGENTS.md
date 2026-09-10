# Public Landing Page Agent Package

- Mặc định giao tiếp bằng tiếng Việt; giữ nguyên identifier và tên API.
- Orchestrator phải tạo task graph trước request cross-lane, code change, security, QA gate hoặc deploy.
- Không biến assumption thành confirmed decision.
- Mỗi khách hàng là một `customer_job` độc lập; không dùng lại PII, Stitch project, Vercel project, database hoặc secret.
- Không ghi secret vào source, log, artifact hoặc `.env.example`.
- Production chỉ deploy sau Security, QA, rollback và customer approval.
- Handoff phải nêu mục tiêu, input, output, scope, skill, acceptance criteria, evidence và blocker.

