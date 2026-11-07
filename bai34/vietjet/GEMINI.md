# GEMINI.md - Quy tắc & Ngữ cảnh Dự án Website Du lịch Vietjet

Tài liệu này định nghĩa các quy tắc cốt lõi, kiến trúc và tiêu chuẩn thiết kế mà Antigravity phải tuân thủ khi xây dựng và chỉnh sửa mã nguồn cho dự án **Vietjet Travel & Flights**.

---

## 1. Tổng quan Dự án
- **Tên website**: Vietjet
- **Lĩnh vực**: Du lịch & Đặt vé máy bay (Flights & Travel Tours)
- **Ngôn ngữ & Công nghệ**: HTML5, CSS3, JavaScript thuần (Vanilla ES6+), **hoàn toàn không sử dụng Backend**.
- **Cơ sở dữ liệu (Database)**: **SQLite** chạy trực tiếp trên trình duyệt thông qua thư viện `sql.js` (WebAssembly), đồng bộ dữ liệu bền vững vào `localStorage`.
- **Phong cách giao diện**: Tông màu sáng (Light theme), nền trắng (`#FFFFFF`), màu chủ đạo là **Đỏ Vietjet (`#ee1d23`)**.

---

## 2. Tài nguyên Hình ảnh Có sẵn
Trong thư mục [`images/`](./images/) đã có sẵn các tài nguyên gốc của dự án, ưu tiên sử dụng cho Logo, Banner Hero và hình minh họa hãng bay:
- `images/vietjet-logo.jpg` — Logo chính thức trên Header, Footer và danh sách hãng bay.
- `images/vietjet-may-bay.jpg` — Hình ảnh máy bay Vietjet dùng cho trang Chuyến bay, Chi tiết chuyến bay hoặc thẻ giới thiệu.
- `images/vietjet-tiep-viet-1.jpg` — Hình ảnh tiếp viên Vietjet dùng làm Hero Banner trang chủ.
- Đối với ảnh Thumbnail của 8 Tour du lịch nổi bật: sử dụng ảnh kích thước chuẩn **`600x400`** (tỷ lệ 3:2).

---

## 3. Quy tắc Kỹ thuật Bắt buộc (Strict Constraints)
1. **Không dùng Backend / Framework**:
   - Không tạo server Node.js, PHP, Python hay dùng React/Vue/Angular.
   - Mọi trang web là các file `.html` tĩnh kết nối với các module `.js` và `.css` thuần.
2. **Sử dụng SQLite trên trình duyệt (`sql.js`)**:
   - Tải `sql.js` từ CDN (`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js`).
   - Khi khởi chạy ứng dụng lần đầu, tự động chạy script khởi tạo bảng (`airlines`, `flights`, `tours`, `cart_items`, `bookings`) và nạp dữ liệu mẫu (Seed Data).
   - Mọi thao tác Thêm/Sửa/Xóa giỏ hàng hoặc Đặt vé đều thực thi bằng câu lệnh SQL (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) và lưu snapshot database vào `localStorage` để giữ trạng thái giữa các trang.
3. **Tính năng Gửi Email Giả lập**:
   - Khi khách hàng nhấn **"Đăng ký"** ở trang Giỏ hàng, hệ thống lưu thông tin vào bảng `bookings`, làm trống giỏ hàng, hiển thị thông báo hoàn thành và mở một **Modal xác nhận Email** mô phỏng bức thư gửi trực tiếp từ **`nvhai061993@gmail.com`** đến địa chỉ email mà khách hàng đã nhập.
4. **Chuẩn Responsive & UX**:
   - Giao diện tương thích tốt trên Desktop và Mobile.
   - Định dạng tiền tệ theo chuẩn Việt Nam Đồng (ví dụ: `1.590.000 ₫`).
   - Điều hướng giữa các trang truyền tham số rõ ràng qua URL Query Parameters (ví dụ: `flights.html?from=SGN&to=HAN`, `flight-detail.html?id=1`, `tour-detail.html?id=1`).

---

## 4. Danh mục Tài liệu Đặc tả Dự án
Trước khi viết code cho bất kỳ tính năng nào, hãy tham khảo các file `.md` tương ứng trong thư mục gốc:
- [`PRD.md`](./PRD.md): Đặc tả chi tiết yêu cầu nghiệp vụ của 6 trang (Trang chủ, Chuyến bay, Chi tiết chuyến bay, Tour, Chi tiết Tour, Giỏ hàng).
- [`ARCHITECTURE.md`](./ARCHITECTURE.md): Cấu trúc thư mục, thiết kế bảng SQLite (`sql.js`), luồng dữ liệu và dữ liệu mẫu.
- [`UI_DESIGN.md`](./UI_DESIGN.md): Hệ thống màu sắc (`#ee1d23`), font chữ, bố cục từng trang và thiết kế component.
- [`TASKS.md`](./TASKS.md): Danh sách công việc (Checklist) theo từng giai đoạn để triển khai dự án từ đầu đến cuối.
