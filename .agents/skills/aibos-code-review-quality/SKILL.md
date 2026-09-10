---
name: aibos-code-review-quality
description: "Review code và change set theo correctness, security, maintainability, performance, testability và regression risk; dùng trước merge, release hoặc sau một thay đổi quan trọng."
---

# AIBOS Code Review Quality

## Cách review

1. Xác nhận mục tiêu, acceptance criteria và phạm vi diff; không review theo cảm tính hoặc chỉ theo style.
2. Đọc code cùng test, caller/consumer, migration, config và API contract liên quan.
3. Kiểm tra theo thứ tự: correctness → security/data loss → compatibility → error handling → performance → maintainability → tests/docs.
4. Với mỗi finding, nêu file/line, impact, điều kiện xảy ra, bằng chứng và cách sửa đề xuất.
5. Phân loại: `P0` blocker nghiêm trọng, `P1` cần sửa trước merge/release, `P2` nên sửa, `P3` polish.
6. Kết luận riêng: blocking findings, non-blocking findings, coverage gap và recommendation.

## Quy tắc

- Không báo finding mơ hồ hoặc yêu cầu refactor chỉ vì sở thích.
- Không bỏ qua đường đi lỗi, quyền truy cập, input không tin cậy, concurrency, retry và rollback.
- Nếu không đủ context, ghi rõ limitation thay vì khẳng định an toàn.
- Review phải kiểm tra test có chứng minh behavior hay chỉ tăng coverage giả tạo.
