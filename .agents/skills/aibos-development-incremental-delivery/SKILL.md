---
name: aibos-development-incremental-delivery
description: "Triển khai thay đổi theo vertical slice nhỏ, có kiểm chứng từng bước, feature flag và rollback-friendly design; dùng khi feature chạm nhiều layer hoặc cần giảm rủi ro release."
---

# AIBOS Incremental Delivery

## Nguyên tắc

- Mỗi increment phải tạo ra giá trị có thể chạy hoặc kiểm chứng được.
- Ưu tiên thay đổi nhỏ, reversible, dễ review; tránh big-bang rewrite.
- Giữ backward compatibility khi contract hoặc schema cần triển khai nhiều bước.
- Test và verification đi cùng increment, không dồn đến cuối.

## Workflow

1. Chọn một vertical slice nhỏ nhất qua các boundary cần thiết.
2. Xác định precondition, risk, migration/compatibility strategy và rollback.
3. Implement theo RED-GREEN-REFACTOR hoặc test phù hợp với layer.
4. Chạy targeted checks, smoke test và kiểm tra diff/scope.
5. Dùng feature flag, dark launch hoặc expand-contract khi thay đổi có rủi ro.
6. Sau mỗi slice, cập nhật acceptance criteria, evidence và next slice.

## Không được bỏ qua

- Không gọi code “xong” nếu chưa có test hoặc bằng chứng runtime phù hợp.
- Không trộn refactor không liên quan vào feature.
- Không xóa compatibility path trước khi consumer đã chuyển đổi.
- Không bật rollout rộng nếu health check, rollback và observability chưa rõ.
