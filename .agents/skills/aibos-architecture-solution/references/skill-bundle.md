# Bộ skill Design Architecture Agent của AIBOS

## Tier 1 — luôn có

- `solution-architecture`: điều phối end-to-end.
- `aibos-architecture-patterns`: Clean/Hexagonal/DDD và bounded context.
- `aibos-architecture-c4`: Context, Container, Component, Deployment, Dynamic.
- `aibos-architecture-adr`: alternatives, trade-off, lifecycle và implementation plan.

## Tier 2 — nạp theo project

- `aibos-database-design`: khi có yêu cầu data model, persistence, query hoặc migration.
- `api-design`: khi có API contract, versioning hoặc integration boundary.
- `security-architecture`: khi có threat, auth, trust boundary hoặc compliance.
- `cloud-architecture`: khi có cloud, HA, DR, scale, multi-region hoặc cost.

## Tier 3 — roadmap, chỉ nạp khi cần

- `microservices-patterns`.
- `event-driven-architecture`.
- `workflow-orchestration`.
- `multi-tenant-architecture`.
- `high-availability`.
- `disaster-recovery`.

Tier 2/3 chưa được tạo trong lần này nếu chưa có nguồn hoặc yêu cầu cụ thể; không tạo skill giả để lấp danh sách.
