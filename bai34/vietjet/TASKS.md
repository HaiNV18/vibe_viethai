# TASKS.md - Kế hoạch Triển khai Dự án cho Antigravity

Tài liệu này chia nhỏ dự án thành các bước thực thi tuần tự. Toàn bộ các công việc đã được hoàn thành.

---

## Giai đoạn 1: Khởi tạo Cơ sở dữ liệu SQLite & Tiện ích dùng chung
- [x] **Task 1.1**: Tạo các file `.SQL` trong thư mục `sqlite/` và file database `sqlite/db.db` + tích hợp `js/db.js` (`sql.js` WebAssembly).
  - Đọc trực tiếp dữ liệu từ file `sqlite/db.db` (`db.db`) và đồng bộ `cart_items`, `bookings` vào `localStorage`.
- [x] **Task 1.2**: Dữ liệu mẫu (Seed Data) trong `sqlite/db.db`:
  - 6 hãng hàng không (VietJet Air dùng `images/vietjet-logo.jpg`, Vietnam Airlines, Singapore Airlines, Bamboo Airways, Korean Air, Thai Airways).
  - 16 chuyến bay đa dạng giờ cất cánh, loại vé (khứ hồi/một chiều), đường bay (bay thẳng/nhiều thành phố), loại máy bay (Airbus A320/A321/A350, Boeing 787/777) và giá 2 hạng vé (Phổ thông, Thương gia).
  - Đúng **8 tour du lịch nổi bật** với hình ảnh thumbnail kích thước chuẩn `600x400`, thông tin hãng du lịch, hãng bay, ngày/giờ cất cánh, số ngày/đêm, loại máy bay, giá tour và lịch trình chi tiết từng ngày.
- [x] **Task 1.3**: Tạo file `js/app.js` chứa các hàm dùng chung:
  - Render Header/Footer đồng nhất, cập nhật số lượng sản phẩm trên icon Giỏ hàng.
  - Hàm định dạng tiền tệ VNĐ (`formatCurrency`), định dạng ngày (`formatDate`), đọc tham số URL (`getQueryParam`).

---

## Giai đoạn 2: Xây dựng Hệ thống Giao diện (`css/style.css`)
- [x] **Task 2.1**: Thiết kế `css/style.css` với tông màu sáng, nền trắng (`#FFFFFF`) và màu chủ đạo đỏ Vietjet (`#ee1d23`).
- [x] **Task 2.2**: Định nghĩa CSS cho Header, Hero Search Box, Grid 8 Tour (thumbnail `600x400`), Logo Hãng hàng không, Bố cục 2 cột (Sidebar Filter bên trái + Danh sách bên phải), Thẻ chọn hạng vé Phổ thông/Thương gia và Modal giả lập gửi Email.

---

## Giai đoạn 3: Xây dựng các Trang Chức năng
- [x] **Task 3.1 - Trang Chủ (`index.html` & `js/home.js`)**:
  - Khung tìm kiếm chuyến bay (chọn ngày, điểm xuất phát, điểm đến, vé khứ hồi, vé một chiều) -> Click **"Tìm Kiếm"** dẫn đến `flights.html` kèm query params.
  - Hiển thị 8 tour du lịch nổi bật (thumbnail `600x400`, hãng du lịch, số ngày/đêm, giá tour) -> Click dẫn đến trang Tour (`tours.html`).
  - Hiển thị các logo hãng hàng không (VietJet Air, Vietnam Airlines, Singapore Airlines...) -> Click vào logo dẫn đến `flights.html` lọc theo hãng.
- [x] **Task 3.2 - Trang Chuyến Bay (`flights.html` & `js/flights.js`)**:
  - Cột trái: Bộ lọc giá vé tăng/giảm dần, loại vé (khứ hồi, một chiều, bay thẳng, nhiều thành phố), các hãng hàng không, thời gian cất cánh (giờ), hạng dịch vụ (phổ thông, thương gia).
  - Cột phải: Danh sách các chuyến bay từ SQLite (`db.db`) (hãng bay, ngày cất cánh, thời gian bay, giá tiền, dịch vụ).
  - Click chọn chuyến bay dẫn đến `flight-detail.html?id=...`.
- [x] **Task 3.3 - Trang Chi Tiết Chuyến Bay (`flight-detail.html` & `js/flight-detail.js`)**:
  - Hiển thị điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Boeing, Airbus...).
  - Khối chọn giá vé trực quan: **Hạng Phổ Thông** và **Hạng Thương Gia**.
  - Nút chọn chuyến bay lưu trực tiếp vào bảng `cart_items` trong SQLite và dẫn tới Giỏ hàng.
- [x] **Task 3.4 - Trang Tour (`tours.html` & `js/tours.js`)**:
  - Cột trái: Bộ lọc giá vé tăng/giảm dần, các hãng hàng không, thời gian cất cánh (giờ).
  - Cột phải: Danh sách các tour du lịch (thumbnail `600x400`, hãng bay, ngày cất cánh, thời gian bay, giá tiền, dịch vụ).
  - Click chọn tour dẫn đến `tour-detail.html?id=...`.
- [x] **Task 3.5 - Trang Chi Tiết Tour (`tour-detail.html` & `js/tour-detail.js`)**:
  - Hiển thị điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Boeing, Airbus...).
  - Hiển thị lịch trình chuyến đi chi tiết theo từng ngày.
  - Nút chọn tour lưu vào bảng `cart_items` trong SQLite.
- [x] **Task 3.6 - Trang Giỏ Hàng (`cart.html` & `js/cart.js`)**:
  - Xem danh sách các chuyến bay và tour đã chọn từ SQLite.
  - Hỗ trợ xóa từng mục hoặc xóa toàn bộ giỏ hàng.
  - Form nhập thông tin cá nhân (Họ tên, Email, Số điện thoại, Ghi chú).
  - Nút **"Đăng ký"**: Lưu đơn vào bảng `bookings`, xóa giỏ hàng, hiện thông báo hoàn thành kèm **Modal xác nhận Email gửi từ `nvhai061993@gmail.com` đến email của khách hàng**.

---

## Giai đoạn 4: Kiểm thử & Nghiệm thu (Verification)
- [x] **Task 4.1**: Kiểm tra luồng tìm kiếm từ Trang chủ -> Chuyến bay -> Chi tiết chuyến bay -> Chọn Hạng vé -> Thêm vào Giỏ hàng.
- [x] **Task 4.2**: Kiểm tra luồng chọn Tour từ Trang chủ -> Trang Tour -> Bộ lọc Tour -> Chi tiết Tour -> Thêm vào Giỏ hàng.
- [x] **Task 4.3**: Kiểm tra trang Giỏ hàng: xóa sản phẩm, điền form đăng ký và xác nhận hiển thị đúng email gửi từ `nvhai061993@gmail.com` tới email người nhận.
