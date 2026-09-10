---
name: aibos-frontend-nextjs-blueprint
description: "Thiết kế, phân tích hoặc refactor frontend TypeScript/React với Next.js App Router theo kiến trúc feature, server/client boundary, API client, repository, services, route handlers, auth, testing và deployment. Dùng khi project dùng Next.js hoặc cần chuẩn hóa frontend React production-grade."
metadata:
  short-description: Blueprint Next.js TypeScript reusable
---

# AIBOS Frontend Next.js Blueprint

## Mục tiêu

Tạo frontend Next.js/TypeScript có boundary rõ giữa routing, UI, nghiệp vụ, data access và server integration. Có thể tham khảo pattern từ codebase mẫu, nhưng phải tách `observed`, `recommended` và `project decision`; không sao chép domain, URL, cookie key, role hoặc API name riêng của project mẫu.

## Khi dùng

- Scaffold hoặc review project Next.js dùng App Router.
- Thiết kế feature folder, page/layout, server/client component và data flow.
- Chuẩn hóa API client, repository/service, auth session, middleware, proxy và route handlers.
- Xử lý upload, file/document preview, streaming, polling, caching, form và permission-aware UI.
- Chọn CSR/SSR/SSG/ISR theo route, SEO metadata, canonical/sitemap, hydration và cache/revalidation.
- Không dùng thay cho `aibos-ui-ux` khi chỉ review visual; không dùng thay cho security skills khi quyết định credential/policy.

## Quy trình

1. Đọc `package.json`, `next.config.*`, `tsconfig*`, `middleware.*`, environment example và build scripts.
2. Lập bản đồ `app routes → layouts/pages → feature screens → hooks/components → services/repositories → API client/Route Handlers`.
3. Phân biệt Server Component, Client Component, server-only code và browser-only code trước khi sửa.
4. Xác định auth/session, public/protected routes, API error envelope, timeout, retry, upload và cache behavior.
5. Chọn boundary theo feature/use case; giữ shared UI và pure utilities độc lập với domain.
6. Viết implementation handoff gồm file boundary, public interfaces, tests, env variables và acceptance criteria.
7. Chạy lint, typecheck, unit test, build và smoke test deep-link/server route.

Đọc `aibos-frontend-rendering-seo` khi route public cần crawl/share preview hoặc khi trộn Server/Client Components.

Đọc [references/nextjs-conventions.md](references/nextjs-conventions.md) khi cần quy ước chi tiết. Đọc [references/observed-patterns.md](references/observed-patterns.md) khi cần đối chiếu pattern từ codebase Next.js thực tế.

## Blueprint folder

```text
src/
├── app/                         # App Router: layout, page, route handlers, route groups
│   ├── (public)/                # public route group
│   ├── (app)/                   # authenticated shell/route group
│   └── api/                     # BFF/proxy handlers only when boundary is justified
├── components/                  # shared UI and cross-feature composition
├── features/
│   └── <feature>/
│       ├── components/          # feature UI
│       ├── screens/             # page-level orchestration
│       ├── hooks/               # feature client behavior
│       ├── services/            # use-case orchestration
│       ├── repositories/        # backend/API access and response parsing
│       ├── types.ts             # feature contracts
│       └── index.ts             # deliberate public exports
├── api/
│   ├── client.ts                # shared fetch/error/timeout/auth policy
│   └── endpoints.ts             # typed endpoint builders
├── lib/                         # pure utilities, session/config adapters
├── services/                    # cross-feature services only
├── repositories/                # cross-feature repositories only
├── hooks/                       # cross-feature hooks
├── config/                      # validated environment/config adapters
└── types/                       # shared contracts
```

Project nhỏ có thể dùng `src/services` và `src/repositories` ở cấp root như codebase hiện tại. Khi feature coupling tăng, chuyển logic về `features/<feature>` theo từng slice, không refactor toàn bộ chỉ vì folder đẹp hơn.

## Quy tắc quan trọng

- Dùng Server Components mặc định; thêm `"use client"` chỉ cho state/effect/event/browser API. Không import server-only module vào client bundle.
- Route public/indexable phải render được SEO-critical HTML và metadata ở server/build; route authenticated/personalized có thể CSR khi SEO không phải mục tiêu.
- Dùng SSG/ISR cho public data ổn định hoặc thay đổi theo TTL; SSR cho data request-dependent; khai báo cache key, revalidation và invalidation tag/path.
- Không cache response chứa user/tenant/role data bằng shared cache; phân biệt cache route, fetch và browser cache.
- Kiểm tra hydration mismatch do `window`, `localStorage`, `Date`, `Math.random`, timezone/locale và client-only library.
- Tạo `sitemap`, `robots`, canonical và Open Graph metadata theo route; chặn index route riêng tư, admin, search nội bộ và URL chứa PII.
- `layout.tsx` định nghĩa shell và shared loading/error boundary; page chỉ compose screen và route params.
- Middleware xử lý routing/session coarse-grained; authorization thực tế phải được kiểm tra ở backend và server boundary tương ứng.
- API client trung tâm phải có typed generic, base URL từ validated environment, timeout bằng `AbortController`, parse response envelope, `ApiError`, network error mapping và relogin policy.
- Repository chịu trách nhiệm HTTP/API contract; service chịu trách nhiệm use case, mapping và orchestration; component chịu trách nhiệm hiển thị và interaction.
- Endpoint builder giữ path/params/body contract tập trung; không rải URL literal khắp component.
- Cookie session ưu tiên `HttpOnly`, `Secure`, `SameSite` phù hợp. Không đưa secret, private API key hoặc token server-only vào `NEXT_PUBLIC_*`.
- `localStorage` chỉ dành cho dữ liệu client phù hợp; phải xử lý SSR guard, stale session, logout và XSS risk.
- Route Handler chỉ dùng làm BFF/proxy, secret-bearing integration hoặc method/CORS boundary có lý do; không tạo proxy mù cho mọi request.
- Rewrites/redirects cần kiểm tra method, header, CORS, cache và behavior khi deep-link; document/file URL phải có authorization và expiry.
- FormData không tự set `Content-Type` boundary; upload cần size/type validation, progress, cancellation, timeout và retry policy.
- Streaming/SSE phải có typed event union, chunk boundary parser, terminal event, cancellation, timeout và recovery; tránh `Record<string, unknown>` ở public boundary nếu có thể.
- Cache/prefetch/revalidation phải có freshness và invalidation rule; không dùng `useMemo`/`share` để che giấu data lifecycle.
- Component dùng chung không được phụ thuộc ngược vào feature; tránh barrel export tạo import cycle.
- URL return sau login phải allowlist/normalize để chống open redirect.

## Output bắt buộc

Khi phân tích hoặc thiết kế, trả về:

- Stack/runtime và server/client boundary hiện trạng có bằng chứng.
- Route tree, layout, auth/middleware và API flow.
- Feature/folder boundary cùng dependency direction.
- Data fetching, cache, form, upload/streaming và error behavior.
- File cần tạo/sửa, env contract, migration steps và test matrix.
- Trade-off, risk, `confirmed`, `proposed`, `assumption`, `open question`.

Output và tài liệu phải bằng tiếng Việt; giữ nguyên keyword/code/TypeScript/TSX/React/Next.js/JSON, tên file và identifier. Không bịa dữ liệu, quyết định hoặc nguồn; nêu evidence và blocker khi có. Nếu project có output contract riêng, đọc contract đó trước khi thực hiện.

## Definition of done

- [ ] Server/client boundary và route ownership được xác định.
- [ ] API client, repository/service và component không trộn trách nhiệm.
- [ ] Auth, return URL, public/protected route và secret boundary được kiểm tra.
- [ ] Loading, error, empty, retry, timeout, cancellation và cache behavior có quy định.
- [ ] Typecheck, lint, unit test, build và deep-link smoke test chạy được.
- [ ] Không hard-code production URL/secret hoặc tạo proxy không có boundary rõ.

## Chế độ Landing Page Agent theo customer job

Khi frontend là output của agent phục vụ nhiều khách hàng, mỗi build phải nhận một `customer_job` độc lập và chỉ lấy các public values đã được duyệt của job đó (brand, copy, CTA label/destination, locale và SEO metadata). Không dùng lại giá trị từ build/job trước và không đưa `DATABASE_URL`, `CRON_SECRET`, OAuth token hoặc private key vào `NEXT_PUBLIC_*`.

CTA phải được render từ contract đã xác nhận; nếu destination còn `open` thì giữ job ở trạng thái chờ BA/customer, không tự chọn `/setup`, `/login` hay URL ngoài. Form phải mô tả rõ field, validation, consent version và API contract của đúng job; không giữ field domain riêng của template mẫu nếu BA chưa xác nhận.

Mỗi output cần có build fingerprint/customer-job trace trong artifact nội bộ, nhưng không hiển thị PII hoặc secret trong HTML, bundle, source map, log và screenshot. Visual baseline phải được tạo riêng theo job/template version; không cập nhật snapshot chỉ để che một khác biệt chưa được duyệt.
