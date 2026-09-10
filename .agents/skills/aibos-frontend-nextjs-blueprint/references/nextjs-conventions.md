# Next.js conventions

## App Router

Giữ `app/` cho route composition: `layout`, `page`, `loading`, `error`, `not-found` và `route`. Dùng route groups để tách shell mà không đổi URL; dùng dynamic segment cho resource và validate params trước khi gọi backend.

## Server và client

Đặt fetch/data access ở server khi không cần browser interaction. Client component nhận dữ liệu qua props hoặc gọi facade/client API có chủ đích. Với browser-only library, dùng dynamic import hoặc boundary phù hợp và kiểm tra hydration mismatch.

## API layers

`api/client.ts` là nơi thống nhất fetch policy. `endpoints.ts` tạo path/contract. Repository gọi endpoint và parse DTO. Service map DTO sang view/use-case model. Route Handler chỉ là boundary server/BFF, không phải nơi nhồi domain logic.

## Auth

Middleware chỉ là lớp điều hướng sớm. Session source of truth phải nhất quán; tránh vừa cookie vừa localStorage mà không có precedence/expiry rule. Login redirect phải normalize allowlist. UI menu guard chỉ cải thiện UX, không thay thế backend authorization.

## Data lifecycle

Mỗi query cần nêu loading/error/empty, timeout, retry, stale policy và invalidation. Với polling/notification, có backoff, visibility/unmount cancellation và giới hạn tài nguyên. Với mutation, chống double submit và làm rõ optimistic/refresh behavior.

## File và streaming

File proxy cần xác định method (`GET`, `HEAD`, `OPTIONS`), auth, content type, cache, expiry và audit boundary. Streaming client phải parse chunk an toàn, xử lý `[DONE]`/terminal event, malformed event và unsubscribe.

## Testing

- Server/client rendering boundary và hydration.
- Middleware: public route, protected route, login redirect, return URL và trailing slash.
- API client: timeout, network failure, invalid JSON, error envelope, 401/403.
- Repository/service: endpoint, params, mapping, mutation và cache invalidation.
- Route Handler/proxy: method, headers, CORS, auth, content type và upstream failure.
- Component/hook: form, permission-aware UI, loading/error/empty, upload và cancellation.
- E2E: login, deep-link refresh, protected route, upload/file preview và critical feature flow.
