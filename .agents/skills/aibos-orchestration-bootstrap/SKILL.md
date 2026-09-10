---
name: aibos-orchestration-bootstrap
description: "Khởi tạo Orchestrator Agent và task graph trước khi xử lý request cross-lane, feature lớn, thay đổi code hoặc release; dùng để route đúng domain agent, giữ dependency/handoff và ngăn bypass workflow. Không dùng cho câu hỏi đơn giản, read-only và chỉ thuộc một lane."
license: MIT
metadata:
  owner: AIBOS Orchestrator
  version: 1.0.0
  status: active
  role: orchestration-bootstrap
  dependencies:
    - aibos-context-engineering
    - aibos-agent-evaluation
---

# Orchestration Bootstrap

## Mục tiêu

Biến role contract của `Orchestrator Agent` thành bước entry có thể thực thi. Skill này phải được áp dụng trước khi route task tới domain agent trong mọi workflow cross-lane hoặc có thay đổi artifact/code.

## Khi bắt buộc kích hoạt

Kích hoạt bootstrap nếu request có một trong các dấu hiệu:

- chạm từ hai lane trở lên (BA, Architecture, Database, UI/UX, Frontend, Backend, Security, QA hoặc Deployment);
- tạo, sửa, refactor hoặc migrate code/artifact;
- feature lớn, bug có impact nhiều module, hoặc task cần nhiều handoff;
- review/gate/release/deploy;
- requirement mơ hồ, có dependency hoặc có security/data boundary.

Không bootstrap subagent cho câu hỏi đơn giản, read-only và chỉ có một lane. Agent chính vẫn phải tự phân loại scope trước khi bỏ qua bootstrap.

## Quy trình bắt buộc

1. Đọc `AGENTS.md`, xác định project và đọc registry canonical tại `docs/ai/agents/agent-registry.yaml` cùng artifact/plan hiện có.
2. Phân loại request thành `simple-single-lane` hoặc `orchestrated`.
3. Với `orchestrated`, tạo hoặc kích hoạt một Orchestrator Agent trước các domain agent. Nếu có khả năng spawn, giao cho agent đó role contract tại `docs/ai/agents/orchestrator-agent.md`; nếu không, agent chính tạm giữ vai trò Orchestrator và phải ghi rõ trong plan.
4. Orchestrator tạo task graph trước khi giao việc: owner, dependency, scope, output, acceptance, verify, status và blocker.
5. Chỉ route các task độc lập tới domain agent; không giao cùng một request mơ hồ cho nhiều agent.
6. Kiểm tra handoff output và evidence trước khi mở task phụ thuộc.
7. Giữ pipeline `blocked` khi có BLOCK từ Security, QA hoặc owner; không tự bỏ qua gate.

## Cách dùng registry

- Chọn agent theo `activation`, không theo tên file hoặc phỏng đoán.
- Nạp `role_contract` và `primary_skills` của agent được route; không nạp toàn bộ registry vào mọi domain task.
- Nếu hai agent phù hợp, chọn một `owner` và ghi agent còn lại là reviewer/dependency; không tạo hai owner cho cùng một output.
- Kiểm tra `authority` trước khi giao task có security, credential, production hoặc gate impact.
- Khi task cần nhiều lane, ghi danh sách agent và dependency trong task graph theo thứ tự contract → implementation → verification.

## Bootstrap record tối thiểu

Ghi vào execution plan hoặc orchestration log:

```text
Orchestration: required | skipped
Reason: <scope classification>
Orchestrator: <agent id/name or main-agent acting as orchestrator>
Goal: <outcome>
Task graph: <path or section>
Domain agents: <owners>
Loaded contracts/skills: <registry ids>
Initial blockers: <none or explicit list>
```

## Quyền hạn và giới hạn

- Bootstrap được phép điều phối, không tự phê duyệt quyết định nghiệp vụ, security exception, credential, production access hoặc release gate.
- Orchestrator sở hữu workflow và handoff; domain agent sở hữu chuyên môn và artifact trong scope được giao.
- Không coi việc tạo task graph là bằng chứng feature đã hoàn thành.

## Definition of done

- Request đã được phân loại và có lý do bootstrap hoặc skip.
- Với request orchestrated, có đúng một Orchestrator owner.
- Task graph có dependency, owner, acceptance và verification cho từng task.
- Domain agents nhận bounded scope, không nhận request tổng quát.
- Có đường escalation khi task bị BLOCK.

## Verification

- Kiểm tra bootstrap contract trong `AGENTS.md` và `docs/ai/agents/orchestrator-agent.md`.
- Chạy `bash scripts/validate-aibos-skills.sh`.
- Dùng regression cases: cross-lane feature, single-lane question, ambiguous request, security-sensitive change và task không hỗ trợ spawn.
