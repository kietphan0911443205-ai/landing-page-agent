# Customer questionnaire — Landing Page Agent

## Cách agent hỏi

BA hỏi từng nhóm, chờ khách hàng trả lời rồi mới chuyển nhóm tiếp theo. Câu trả lời được ghi vào `customer_job`; không tự điền phần chưa được xác nhận.

Khách hàng không cần chạy command. Các bước kỹ thuật chỉ được trình bày dưới dạng trạng thái, link xác thực hoặc nút duyệt.

## Nhóm 1 — Mục tiêu kinh doanh

1. Landing page dùng để làm gì?
   - Giới thiệu sản phẩm/dịch vụ
   - Thu lead/đăng ký tư vấn
   - Bán hàng hoặc nhận thanh toán
   - Khác
2. Hành động chính sau khi xem trang là gì và dẫn tới đâu?
3. Ai là người duyệt nội dung và phát hành?

## Nhóm 2 — Khách hàng mục tiêu và ngôn ngữ

1. Audience chính là ai?
2. Mức độ hiểu biết/vấn đề họ đang gặp là gì?
3. Ngôn ngữ:
   - Chỉ tiếng Việt
   - Việt + English
   - Đa ngôn ngữ (liệt kê)
4. Locale mặc định, định dạng ngày, số và tiền tệ là gì? Ai sở hữu bản dịch?

## Nhóm 3 — Nội dung và nhận diện

1. Tên sản phẩm/brand hiển thị là gì?
2. Value proposition một câu là gì?
3. Sections bắt buộc gồm những gì?
4. Có logo, hình ảnh, testimonial, claim hoặc số liệu không? Với mỗi mục cần nguồn và người duyệt.
5. Có nội dung nào tuyệt đối không được dùng không?

## Nhóm 4 — Giá và chuyển đổi

1. Pricing:
   - Hiển thị giá cụ thể
   - Hiển thị gói nhưng liên hệ để báo giá
   - Không hiển thị pricing
2. Có checkout/booking trực tuyến không?
3. Chính sách hoàn tiền, điều khoản cung cấp và kênh hỗ trợ đã có chưa?

## Nhóm 5 — Form và dữ liệu

1. Có thu email/lead không?
2. Field nào bắt buộc và mục đích của từng field là gì?
3. Có consent checkbox không? Wording do ai duyệt?
4. Privacy contact, nơi nhận dữ liệu và retention là gì?
5. Có thu dữ liệu trẻ em, dữ liệu nhạy cảm hoặc dữ liệu thanh toán không?

Nếu dữ liệu pháp lý/privacy chưa được cung cấp, BA tạo draft và chuyển `blocked_legal`; không dùng draft như copy phát hành.

## Nhóm 6 — SEO và analytics

1. Search intent và SEO title/description là gì?
2. Cho phép index công khai không?
3. Analytics:
   - Chưa dùng
   - Dùng vendor đã có (ghi tên)
   - Cần agent đề xuất để khách hàng duyệt
4. Event cần đo là gì: view, CTA click, form start, submit, success hay event khác?
5. Analytics có phụ thuộc consent không?

## Nhóm 7 — Kết nối và phát hành

1. Môi trường:
   - Local để xem trước
   - Staging để nghiệm thu
   - Production để phát hành
2. Google/Stitch:
   - Khách hàng xác thực tài khoản của mình
   - Chưa kết nối, cần hướng dẫn
3. Vercel:
   - Khách hàng chọn personal scope
   - Khách hàng chọn team scope
   - Chưa có tài khoản
4. Domain, database và nơi lưu secret do ai sở hữu?

Agent chỉ mở Stitch/Vercel write hoặc deploy sau khi customer job có đúng resource ID và approval tương ứng.

## Xác nhận cuối của khách hàng

Trước UI/UX: “Tôi xác nhận requirement và cho phép tạo thiết kế Stitch cho customer job này.”

Trước production: “Tôi xác nhận nội dung, privacy/legal, analytics, domain, môi trường và cho phép phát hành deployment này lên production.”

Hai câu xác nhận trên là hai gate khác nhau; không gộp thành một approval duy nhất.

