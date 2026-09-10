# Observed Next.js patterns từ codebase mẫu

Tài liệu này chỉ là evidence tham khảo, không phải dependency của skill và không biến implementation cụ thể thành tiêu chuẩn bắt buộc.

## Đã quan sát

- TypeScript 5.9, React 19 và Next.js 16 với App Router.
- `src/app` dùng route groups, dynamic routes, `layout.tsx`, Route Handlers và route cho file/proxy.
- `src/features` chứa nhiều feature slice; `src/components` chứa UI cross-feature; `src/hooks`, `src/lib`, `src/types` chứa shared logic.
- Data access được tách thành `src/api/client.ts`, `src/api/endpoints.ts`, `src/repositories` và `src/services`.
- API client tập trung timeout 10 giây, `AbortController`, auth header, parse envelope, `ApiError`, network mapping và relogin policy.
- `middleware.ts` phân biệt public/protected route, SSO callback, public AI/file route và giữ return path sau login.
- Session client có helper đọc token/user; feature repository dùng `fetch`, `FormData`, visitor/session header và typed generic ở một số boundary.
- `next.config.ts` dùng `output: standalone`, rewrites/redirects cho backend/file proxy; Docker multi-stage build chạy standalone server.
- UI có màn hình nghiệp vụ lớn, document editor/preview, dashboard/chart, AI chat và feature-specific components.

## Khi áp dụng sang project khác

- Giữ pattern `feature + api client + repository/service`, thay domain và contract theo project mới.
- Không copy cookie key, URL, SSO client ID, header name hoặc route allowlist nếu chưa được xác nhận.
- Nếu project dùng data library như TanStack Query, Redux hoặc Zustand thì tích hợp theo lifecycle của library; không tạo thêm repository/service chỉ để đủ folder.
- Xác nhận Next.js version, runtime Node, SSR/CSR/streaming requirement, auth model và deployment target trước khi chốt.
