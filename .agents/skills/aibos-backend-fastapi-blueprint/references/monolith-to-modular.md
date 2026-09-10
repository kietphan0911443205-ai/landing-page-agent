# Monolith to Modular Migration

Dùng reference này khi backend đang có `main.py` lớn hoặc style `controllers/`, `services/`, `models/`, `db/connection_manager.py`.

## Mục tiêu

Tách boundary theo hành vi mà không làm mất API contract. Refactor được xem là đạt khi route chỉ là adapter, application không phụ thuộc framework/persistence, domain chạy độc lập và tất cả concrete dependency được wire ở composition root.

## Migration map

| Monolith hiện tại | Đích đến | Quy tắc |
|---|---|---|
| Pydantic request/response trong `main.py` | `api` schemas | Không truyền API schema vào use case |
| Route có business workflow | `application` use case | Route chỉ map input/output và exception |
| ORM model dùng khắp nơi | `infrastructure` persistence model | Map ORM ↔ domain/result tại adapter |
| Service tự mở session | port + infrastructure adapter | Session/transaction có owner rõ |
| Provider client trong service/route | gateway port + adapter | Timeout/retry/idempotency ở adapter |
| Global `DBConnectionManager` | composition-root factory + scoped gateway/UoW | Không dùng service locator |
| `threading`/scheduler trong request | worker/task entry point | Có task idempotency và retry decision |

## Safe sequence

1. Inventory endpoint, response shape, status code, auth/ownership rule và external side effects.
2. Viết characterization tests cho contract hiện tại; thêm test cho các negative path quan trọng.
3. Chọn một bounded context nhỏ và tạo dependency matrix trước khi di chuyển code.
4. Tách domain policy thuần và application use case; định nghĩa port inward.
5. Di chuyển ORM/query/provider code sang adapter, map output và wire tại composition root.
6. Chuyển từng route sang một use case duy nhất; không thay đổi URL/JSON ngoài phạm vi contract đã duyệt.
7. Thêm architecture regression test và chạy toàn bộ unit/integration/contract tests.

## Gate failures

Đánh dấu `not ready` nếu còn một trong các trường hợp sau trong slice đã claim hoàn tất:

- route import ORM/session/repository implementation hoặc gọi `.query()`, `.execute()`, `.commit()`;
- application/domain import FastAPI, SQLAlchemy, provider SDK hoặc API-facing Pydantic model;
- use case tự tạo session/repository/client;
- ORM object hoặc provider DTO đi ra ngoài infrastructure;
- compatibility export được dùng để bypass boundary;
- endpoint contract bị mất nhưng test cũ không phát hiện vì thiếu contract coverage.

Các module chưa migrate phải được ghi rõ là legacy scope; không được gọi toàn bộ backend là clean architecture chỉ vì đã tạo thư mục `api/application/domain/infrastructure`.
