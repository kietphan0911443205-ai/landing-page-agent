---
name: aibos-agent-evaluation
description: "Đánh giá agent, subagent và skill bằng task thực tế, rubric, evidence và regression cases; dùng khi kiểm tra routing, handoff, tool safety, chất lượng output hoặc thay đổi skill."
---

# AIBOS Agent Evaluation

## Thiết kế evaluation

1. Chọn task đại diện và cung cấp artifact tối thiểu cần thiết; không đưa đáp án dự kiến hoặc suspected bug vào prompt đánh giá.
2. Xác định rubric: task success, requirement coverage, correctness, evidence quality, scope discipline, safety và output format.
3. Chạy baseline và candidate trong điều kiện tương đương; ghi model/config, skill version, input, tool calls và thời gian.
4. Đánh giá cả kết quả và hành vi: có đọc đúng skill không, có handoff đúng không, có vượt quyền hoặc bỏ verification không.
5. Lưu raw output, diff, test result và failure classification; không đánh giá chỉ bằng cảm nhận.
6. Tạo regression case cho failure quan trọng và chỉ kết luận pass khi đạt ngưỡng đã định.

## Đầu ra

- Evaluation plan và rubric.
- Case matrix gồm happy path, ambiguous input, failure path, security boundary và regression.
- Evidence/raw artifacts.
- Scorecard, limitation, failure taxonomy và recommendation.

Không dùng dữ liệu production hoặc credential thật trong evaluation; task có side effect phải chạy trong môi trường cô lập và phạm vi được phép.
