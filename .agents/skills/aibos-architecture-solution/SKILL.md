---
name: aibos-architecture-solution
description: Điều phối thiết kế solution architecture cho AIBOS từ SRS/NFR đến system boundary, alternatives, C4, data/API, security, infrastructure và ADR. Không tự áp đặt microservices; output tài liệu kiến trúc bằng tiếng Việt.
---

# AIBOS Solution Architecture

## Vietnamese Output Contract

Output và tài liệu phải bằng tiếng Việt; giữ nguyên keyword/code/SQL/Mermaid, tên file và identifier. Không bịa dữ liệu, quyết định hoặc nguồn; tách rõ `confirmed`, `proposed`, `assumption`, `risk` và `open question`; nêu nguồn, trade-off, blocker và bước tiếp theo khi phù hợp. Nếu project có output contract riêng, đọc contract đó trước khi thực hiện.


Danh mục và tier của bộ skill nằm tại [references/skill-bundle.md](references/skill-bundle.md). Chỉ nạp skill theo nhu cầu dự án.

## Vai trò

Đây là skill điều phối của Design Architecture Agent. Nó biến SRS, BRD và NFR đã được xác nhận thành một bộ hồ sơ kiến trúc có thể triển khai, review và truy xuất nguồn. Không thay stakeholder quyết định nghiệp vụ; không biến giả định thành quyết định.

## Luồng bắt buộc

```text
SRS/BRD
  ↓
NFR analysis
  ↓
Domain và system boundary
  ↓
Architecture alternatives
  ↓
Trade-off analysis
  ↓
C4 Context + Container
  ↓
Component khi cần
  ↓
Database / API / Event design
  ↓
Security architecture
  ↓
Deployment / reliability
  ↓
ADR
  ↓
Architecture review
```

## Guardrail kiến trúc

- Luôn so sánh modular monolith trước microservices.
- Chỉ chọn microservices khi có bounded context ổn định, ownership rõ, nhu cầu scale/deploy độc lập hoặc isolation cần thiết; phải ghi lý do và chi phí vận hành.
- Không dùng “best practice” làm lý do duy nhất.
- Mọi công nghệ phải gắn với constraint, quality attribute hoặc access pattern.
- Mỗi quyết định lớn phải có alternative bị loại, trade-off, rủi ro, điều kiện đảo ngược và ADR.
- Dùng `aibos-architecture-patterns` cho boundary/pattern, `aibos-architecture-c4` cho diagram, `aibos-database-design` cho data và `aibos-architecture-adr` cho quyết định.

## Hồ sơ đầu ra mặc định

Tạo dưới `architecture/`:

```text
ARCHITECTURE.md
C4-CONTEXT.md
C4-CONTAINER.md
C4-COMPONENT.md       # chỉ khi cần
DATA-MODEL.md
API-DESIGN.md
SECURITY.md
DEPLOYMENT.md
NFR.md
RISKS.md
adr/
  ADR-001-*.md
```

Mọi tài liệu phải bằng tiếng Việt, có metadata gồm trạng thái, phiên bản, ngày cập nhật, owner, nguồn đầu vào và danh sách open questions. Sơ đồ Mermaid đặt trong Markdown và phải có chú thích ngắn giải thích boundary, quan hệ và technology.

## Kiểm tra sẵn sàng

Chỉ kết luận `architecture_ready: true` khi:

- SRS/NFR đã được xác nhận và có source traceability;
- boundary và ownership không còn mơ hồ nghiêm trọng;
- đã so sánh ít nhất modular monolith với phương án phân tán khi phù hợp;
- C4 Context và Container nhất quán với data/API/deployment;
- security threats và controls đã được ghi hoặc có owner;
- rủi ro, giả định, open questions và ADR đã được nêu rõ;
- reviewer có thể truy từ mỗi quyết định về requirement và từ diagram về quyết định.

Nếu chưa đạt, xuất architecture gap report bằng tiếng Việt thay vì khẳng định kiến trúc hoàn chỉnh.
