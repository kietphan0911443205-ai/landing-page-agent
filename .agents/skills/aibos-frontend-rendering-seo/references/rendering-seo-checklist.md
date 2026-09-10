# Rendering & SEO Review Checklist

## Route review table

Mỗi route nên ghi: `route`, `audience`, `indexable`, `freshness`, `personalized`, `data sensitivity`, `render strategy`, `cache key`, `invalidation`, `metadata owner`, `performance budget` và `verification`.

## Verification

- Fetch HTML trực tiếp không chạy JavaScript và kiểm tra nội dung/metadata SEO-critical.
- Chạy browser test cho navigation, auth boundary, loading/error/empty và responsive states.
- Kiểm tra hydration warning trong console và khác biệt server/client markup.
- Kiểm tra cache không trả nhầm dữ liệu giữa user, role, tenant, locale hoặc environment.
- Chạy Lighthouse/Web Vitals trên cold cache và warm cache; không chỉ đo máy local mạnh.
- Kiểm tra sitemap chỉ chứa URL canonical, public, indexable và trả status hợp lệ.
