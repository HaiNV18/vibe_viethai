# Functional Specification

## F01 — Dynamic Menu
Khi trang load:
1. Fetch `data/menu.csv`.
2. Parse CSV.
3. Filter `visible=true`.
4. Sort theo `order`.
5. Render menu desktop.
6. Render cùng data cho mobile menu.
7. Nếu CSV lỗi, hiển thị menu fallback tối thiểu hoặc thông báo thân thiện; không làm crash toàn trang.

## F02 — SPA-like anchor navigation
Không cần SPA framework.
- Link `#courses`, `#benefits`, `#contact` scroll tới section.
- Link `about.html` mở trang About Us.
- Smooth scroll khi phù hợp.
- Khi dùng keyboard, vẫn hoạt động bình thường.

## F03 — Contact Modal
Trigger:
- Header CTA
- Hero CTA
- Final CTA

Behavior:
- Mở modal.
- Khóa scroll nền nếu phù hợp.
- Focus field đầu tiên.
- Escape đóng modal.
- Click overlay đóng modal.
- Click trong modal không đóng.
- Trả focus về nút trigger sau khi đóng.

## F04 — Form Validation
Fields:
- `name`: required, tối thiểu 2 ký tự.
- `birth_year`: required, số 4 chữ số; không lớn hơn năm hiện tại.
- `phone`: required, kiểm tra định dạng số điện thoại tương đối linh hoạt.
- `email`: required, định dạng email hợp lệ.
- Consent checkbox: required.

Không gửi nếu validation fail.
Hiển thị lỗi ngay gần field.

## F05 — Save Contact
Khi submit hợp lệ:
1. Chuẩn hóa dữ liệu.
2. Tạo record.
3. Đọc `contacts.csv`.
4. Append record.
5. Ghi file bằng File System Access API.
6. Hiển thị success state.
7. Reset form.
8. Đóng modal sau một khoảng ngắn hoặc theo hành vi UX hợp lý.

Nếu ghi file không thành công:
- Không báo “đã lưu thành công”.
- Hiển thị lỗi rõ ràng.
- Cho phép thử lại.
- Nếu API không hỗ trợ, dùng fallback download CSV.

## F06 — CSV Parser
Tự viết parser JS đủ khả năng xử lý:
- comma
- quoted field
- escaped quote `""`
- newline trong quoted field

Không dùng thư viện ngoài.

## F07 — CSV Serializer
Tạo hàm:
- `escapeCsvField(value)`
- `serializeCsv(rows)`
- `parseCsv(text)`

Có unit-like test thủ công trong code comments hoặc test page nếu cần.

## F08 — About Us
`about.html` phải:
- Dùng chung CSS.
- Dùng chung JS menu.
- Có CTA mở contact modal.
- Có cùng header/footer với home.
- Nội dung giới thiệu trung tâm có thể chỉnh sửa dễ dàng.

## F09 — Error Handling
Các lỗi cần xử lý:
- `menu.csv` không tồn tại.
- CSV sai format.
- Không thể chọn thư mục.
- Permission bị từ chối.
- File contacts không tồn tại.
- Browser không hỗ trợ File System Access API.
- Ghi file thất bại.

## F10 — No Backend
Không tạo endpoint.
Không gọi `fetch` POST tới server.
Không dùng database.
Tất cả xử lý ở browser.
