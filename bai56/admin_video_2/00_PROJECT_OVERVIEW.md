# Video Admin Management - Project Overview

## 1. Mục tiêu

Xây dựng một website Admin quản lý video phục vụ mục đích học Vibe Coding / Antigravity.

Website chỉ sử dụng:

- HTML5
- CSS3
- JavaScript thuần (Vanilla JavaScript)
- CSV làm nguồn dữ liệu mô phỏng database
- Không sử dụng backend
- Không sử dụng framework frontend bắt buộc
- Không sử dụng database server

## 2. Giao diện

- Light mode duy nhất.
- Nền chính màu trắng.
- Giao diện admin hiện đại, sạch, dễ đọc.
- Responsive cho desktop, tablet và mobile.
- Sidebar navigation bên trái trên desktop.
- Header/topbar ở phía trên.
- Nội dung chính nằm bên phải sidebar.

## 3. Các module

### Authentication

- Login
- Register
- Forgot Password

### Dashboard

- Tổng số video
- Tổng lượt xem
- Dung lượng storage
- Top 10 video nhiều lượt xem nhất dạng bar chart
- Lượt xem theo ngày/tháng dạng line chart

### Video Management

- Danh sách video
- Tìm kiếm
- Lọc theo category
- Edit video
- Delete video
- Add video

### User Management

- Danh sách users
- Role ADMIN / USER
- Add/Edit/Delete user

### Category Management

- Danh sách category
- Add/Edit/Delete category

## 4. Lưu ý quan trọng về CSV

CSV chỉ đóng vai trò database giả lập phía client.

Browser không thể an toàn ghi trực tiếp vào file CSV trong project bằng JavaScript thông thường. Vì vậy:

- Khi load dữ liệu: đọc CSV nếu môi trường cho phép.
- Khi demo CRUD: sử dụng localStorage để mô phỏng việc lưu thay đổi.
- CSV là dữ liệu seed ban đầu.
- Không được giả vờ rằng password trong CSV là bảo mật.
- Đây là project học tập/demo, không phải hệ thống production.

## 5. Nguyên tắc code

- Vanilla JavaScript.
- Tách HTML, CSS, JS.
- Không viết toàn bộ ứng dụng trong một file.
- Tái sử dụng component UI bằng JavaScript khi hợp lý.
- Code dễ đọc đối với người mới học Vibe Coding.
- Comment các phần quan trọng.
- Không tạo backend giả.
