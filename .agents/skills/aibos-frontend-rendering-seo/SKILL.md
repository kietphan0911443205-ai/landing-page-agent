---
name: aibos-frontend-rendering-seo
description: "Chọn và triển khai CSR, SSR, SSG hoặc ISR cho frontend theo SEO, dữ liệu động, cache, auth, hydration và Core Web Vitals; dùng khi thiết kế rendering strategy hoặc review khả năng index/share của web app."
---

# AIBOS Frontend Rendering & SEO

## Mục tiêu

Chọn rendering strategy theo từng route/surface, không áp dụng SSR hoặc CSR cho toàn bộ app một cách máy móc. Cân bằng SEO, freshness, personalization, latency, hosting cost, JavaScript và hydration risk.

## Decision matrix

| Strategy | Dùng khi | SEO | Lưu ý |
|---|---|---|---|
| CSR | App sau login, dữ liệu cá nhân, tương tác dày | Không phải mục tiêu chính | Skeleton, loading/error và client performance phải tốt |
| SSR | Nội dung cần crawl nhưng phụ thuộc request/locale/auth nhẹ | Tốt | TTFB, cacheability và server load cần đo |
| SSG | Nội dung public ít thay đổi | Rất tốt | Build time và invalidation phải kiểm soát |
| ISR/revalidation | Public content cần SEO nhưng thay đổi định kỳ | Rất tốt | TTL/tag invalidation và stale behavior phải rõ |
| Streaming SSR | Page có shell nhanh nhưng data nặng/độc lập | Tốt | Suspense boundary, error state và SEO-critical content phải đúng |

## Quy trình

1. Phân loại route: public/indexable, authenticated/personalized, transactional, realtime hoặc hybrid.
2. Ghi freshness, personalization, data sensitivity, crawl requirement, share preview và performance budget.
3. Chọn strategy theo route; tách phần SEO-critical render server khỏi widget interactive render client.
4. Kiểm tra hydration: server/client output deterministic, không đọc `window`, time/random hoặc locale khác nhau trong render.
5. Thiết kế cache key theo route/locale/role và invalidation; không cache response chứa dữ liệu riêng tư.
6. Kiểm tra HTML thực tế không chỉ DOM sau JavaScript: title, description, canonical, heading, structured data, links và content.
7. Đo TTFB, FCP, LCP, INP, CLS, JS transfer, cache hit và crawl/index result; ghi baseline và threshold.

## SEO checklist

- Unique title/description theo route; metadata không bị client-only nếu cần crawl.
- Canonical, `robots.txt`, sitemap và `hreflang` (nếu đa ngôn ngữ) nhất quán.
- Open Graph/Twitter metadata cho share preview.
- Semantic HTML, heading hierarchy, alt text, accessible links và structured data hợp lệ khi phù hợp.
- Không index route login, account, admin, search result nội bộ hoặc URL chứa secret/PII.
- Redirect canonical, trailing slash, query parameter và 404/410 behavior rõ.
- Preview/auth page không làm lộ private content trong HTML, cache hoặc source.

## Output

Rendering decision per route, data/cache boundary, hydration risk list, SEO checklist, performance budget, test plan và migration/rollback steps. Đọc [references/rendering-seo-checklist.md](references/rendering-seo-checklist.md) khi cần review chi tiết.
