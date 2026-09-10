# Public Landing Page Agent Package

- Mặc định giao tiếp bằng tiếng Việt; giữ nguyên identifier và tên API.
- Orchestrator phải tạo task graph trước request cross-lane, code change, security, QA gate hoặc deploy.
- Không biến assumption thành confirmed decision.
- Mỗi khách hàng là một `customer_job` độc lập; không dùng lại PII, Stitch project, Vercel project, database hoặc secret.
- Với Stitch, mặc định khách hàng chỉ OAuth; agent tự tạo project/screen mới sau requirement approval. Chỉ dùng project có sẵn khi khách hàng chủ động chọn.
- Nếu request yêu cầu Stitch, agent phải đi qua `stitch_auth_pending`, yêu cầu khách hàng xác thực OAuth và gọi Stitch MCP sau khi kết nối. Không được fallback âm thầm sang HTML/CSS/JavaScript hoặc tuyên bố không dùng Stitch; nếu MCP chưa có thì báo blocker rõ ràng.
- Không ghi secret vào source, log, artifact hoặc `.env.example`.
- Production chỉ deploy sau Security, QA, rollback và customer approval.
- Handoff phải nêu mục tiêu, input, output, scope, skill, acceptance criteria, evidence và blocker.
