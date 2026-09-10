---
name: aibos-backend-fastapi-blueprint
description: "Thiết kế, triển khai hoặc chuyển đổi backend Python sang FastAPI theo modular clean architecture của AIBOS: API adapter, application use case, domain, ports, infrastructure adapters, database, OpenAPI, JWT/RBAC, worker và external integrations. Dùng khi scaffold FastAPI, review kiến trúc hoặc convert từ Flask backend hiện hữu."
license: MIT
metadata:
  tags: [aibos, backend, python, fastapi, architecture, api, conversion, connection]
  related_skills: [aibos-backend-clean-architecture, aibos-backend-secure-coding, aibos-database-design, aibos-security-database-access, aibos-deployment-local-run]
---

# AIBOS FastAPI Backend Blueprint

## Architecture posture (mandatory)

Đây là skill **modular clean architecture**, không phải hướng dẫn đổi tên `controllers/` thành `api/` hay `services/` thành `application/`. Mọi implementation phải chứng minh dependency direction trước khi viết code:

```text
api (FastAPI) ───────┐
worker/CLI ──────────┼─→ application ─→ domain
infrastructure ─────┘       ↑             ↑
                             ports/interfaces
```

`domain` và `application` là policy; `api`, ORM, database driver, queue, filesystem và provider SDK là details. Dependency chỉ được trỏ vào trong. Nếu project chọn pragmatic exception, phải ghi rõ force, phạm vi, thời hạn và ADR; không được coi exception là blueprint mặc định.

## Mục tiêu

Tạo backend FastAPI dễ hiểu với flow quen thuộc của team:

```text
API Route / Worker Entry Point
  → Application Use Case
    → Domain Entity/Policy
    → Port (repository/gateway)
      ← Infrastructure Adapter
        → Database hoặc External Service
```

Giữ app factory, module theo domain, service orchestration, background worker và integration adapter; chỉ thêm boundary cần thiết để test, thay database và vận hành an toàn.

## Khi bắt đầu project mới

Đọc `references/folder-structure.md` và tạo cấu trúc theo domain. Đọc `references/fastapi-conventions.md` khi wiring API, config, connection hoặc OpenAPI.

## Khi convert Flask

Đọc `references/flask-to-fastapi.md`. Không rewrite toàn bộ một lần: khóa API contract, thêm characterization tests, migrate theo từng bounded context/endpoint và chạy song song trong giai đoạn chuyển tiếp.

Khi backend hiện tại là một file monolith kiểu `main.py` hoặc cấu trúc `controllers/services/models`, đọc thêm `references/monolith-to-modular.md`. Giữ contract và consumer compatibility ở composition boundary; không giữ compatibility bằng cách cho route tiếp tục import ORM hoặc gọi gateway trực tiếp.

## Quy tắc bắt buộc

- FastAPI route chỉ parse request, lấy actor/context từ dependency, gọi **một application use case**, map output thành response và trả response. Route không query DB, không gọi provider, không tạo service/client/session và không chứa business decision.
- Mỗi use case có một mục tiêu nghiệp vụ rõ ràng, nhận plain command/query DTO và trả plain result/error; không nhận `Request`, `Response`, `UploadFile`, ORM entity, SQLAlchemy `Session` hay provider response.
- `domain` không import FastAPI, Pydantic API schema, ORM, database driver, queue, filesystem, HTTP client hoặc provider SDK. `application` cũng không import framework/ORM/provider; chỉ phụ thuộc domain và ports do application/domain định nghĩa.
- Repository/gateway interfaces nằm ở inner layer; implementation nằm ở `infrastructure`. Không chấp nhận service tự gọi `DBConnectionManager`, tự mở/đóng session, viết SQL hoặc khởi tạo external client.
- ORM persistence models không được dùng làm domain entity, use-case DTO hoặc API response. Phải có mapper ở infrastructure/adapter boundary.
- Request/response dùng Pydantic schema ở API boundary; OpenAPI sinh từ code và được review như contract. Schema API không được chảy vào domain/application.
- Mỗi transaction có một owner rõ ràng (thường application unit-of-work); không commit rải rác trong repository và không để route quyết định transaction.
- Config dùng environment/Pydantic Settings; không có fallback credential hoặc remote production host.
- Connection tạo theo lifecycle/lifespan, đóng đúng cách và inject qua dependency.
- PostgreSQL là default; MySQL/MongoDB/Redis dùng adapter/profile riêng theo ADR và access pattern.
- JWT/RBAC/policy được centralize; route dependency chỉ dựng actor/context, còn resource authorization phải được kiểm tra trong use case/policy trước khi đọc/ghi.
- Celery/scanner/crawler/import chạy worker process/container riêng, không chạy loop vô hạn trong web process.
- Mọi external call đi qua gateway/adapter có timeout, retry policy, structured logging và redaction. Retry phải có idempotency/duplicate-effect decision.

## Forbidden shortcuts

Các dấu hiệu sau là **architecture gate failure**, không phải style finding:

- `api`/route import ORM model, `Session`, database driver, provider SDK hoặc gọi `.query`, `.execute`, `.commit`.
- `domain`/`application` import `fastapi`, `sqlalchemy`, `pydantic` API schema, `requests/httpx`, Celery hoặc module provider.
- Một file `models.py` chứa cả domain entities và ORM mappings dùng xuyên toàn app.
- `BaseService`/`Manager`/`DBConnectionManager` global làm service locator hoặc shared mutable state.
- Application service tự new repository/client/session thay vì nhận dependency từ composition root.
- Một controller/route vừa authorization vừa business workflow vừa gửi email/SMS/Zalo vừa tạo file hoặc chạy thread.
- `threading`, infinite loop hoặc scheduler trong web request path; background work không có task idempotency.
- “Repository” chỉ là wrapper một dòng quanh ORM mà không có boundary/port, hoặc repository trả ORM object ra ngoài.

Khi review code hiện hữu, report từng vi phạm bằng file/line, dependency edge, impact và migration slice; không sửa bằng bulk rename.

## Required implementation sequence

1. Chốt module/bounded context, actor/resource ownership, API contract và transaction boundary.
2. Vẽ dependency matrix cho module (allowed imports và forbidden imports); nếu chưa có, chưa được scaffold.
3. Viết characterization/contract test cho endpoint hiện hữu hoặc unit test cho use case mới theo TDD.
4. Tạo domain types/policies và application command/query/use case trước adapter.
5. Định nghĩa ports inward; implement persistence/external adapters outward; map ORM ↔ domain.
6. Wiring tất cả concrete dependencies tại composition root (`main`/lifespan/container), rồi mới expose route/worker.
7. Chạy architecture checks (import direction, route thinness, no ORM leakage), unit/integration/contract tests và smoke test.

Không scaffold toàn bộ hệ thống theo chiều ngang. Mỗi increment phải là một vertical slice có route → use case → port → adapter → test, và chỉ mở thêm module khi có use case thực tế.

## Reference vertical slice

Với product có account, child profile, curriculum và progress, slice chuẩn là:

```text
POST /auth/register
  → RegisterAccount use case
    → Account credential port
      → SQLAlchemy adapter
```

Các slice profile/progress/migration phải giữ ownership chain `Account → ChildProfile → Progress`; `device_id` chỉ là migration source, không phải actor hoặc authorization key. Curriculum/lesson là public read use cases riêng, không đọc trực tiếp từ route và không trộn với auth/profile transaction.

Nếu phải export tên cũ cho test/consumer trong giai đoạn migration, chỉ export facade/model type từ composition boundary; không đưa import ngược vào inner layer và phải có kế hoạch xóa compatibility seam.

## Acceptance checklist

- [ ] Folder structure đúng blueprint và có dependency matrix cho từng module.
- [ ] Architecture gate đạt: không có forbidden import/ORM leak/implicit service locator; route chỉ là adapter.
- [ ] Mỗi endpoint/worker entry point trace được tới một use case và composition root wiring.
- [ ] Domain/application test chạy không cần web server, DB, ORM hoặc provider SDK.
- [ ] Mỗi use case có ownership/authorization, transaction owner và failure semantics rõ.
- [ ] API version, status code, error envelope và pagination thống nhất.
- [ ] OpenAPI/Swagger hiển thị request/response thực tế.
- [ ] DB session/transaction/rollback/connection pool và ORM↔domain mapping có test.
- [ ] Credential không xuất hiện trong code, log, docs hoặc output.
- [ ] Worker có command riêng và idempotency/retry decision.
- [ ] Local run có health check, smoke test và teardown.
- [ ] Có unit, integration và API contract tests.
- [ ] Có architecture regression test kiểm tra import direction, route không bypass application và API contract không bị mất khi refactor.

## Chế độ Landing Page Agent theo customer job

Lead capture của mỗi customer job phải có boundary rõ: `customer_job_id` hoặc resource scope được xác định ở server, field whitelist theo requirement đã duyệt, consent version, retention policy và destination database đúng environment. Không tin `customer_job_id` do browser tự gửi để quyết định quyền; server phải bind job scope từ deployment/config đã được ủy quyền.

Nếu template hỗ trợ field động, dùng DTO/schema có giới hạn key, kiểu, độ dài và số lượng; không dùng `dict` tùy ý để né validation. Dữ liệu lead phải có deletion/retention path và test isolation giữa job A/B. External connector, migration và retention worker phải đi qua port/adapter, có timeout, retry/idempotency và audit redaction; không đưa secret hoặc PII vào error/log.

## Review score

Chấm riêng kiến trúc theo 10 điểm: (1) dependency direction, (2) domain độc lập, (3) use case độc lập delivery, (4) inward ports/outward adapters, (5) ORM không leak, (6) composition root, (7) transaction ownership, (8) authorization ở đúng boundary, (9) worker/integration isolation, (10) automated architecture checks. Điểm dưới 8 hoặc bất kỳ architecture gate failure nào là **not ready**.
