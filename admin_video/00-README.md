# Video Admin — Vibe Coding Specification

## 1. Mục tiêu

Xây dựng một website admin quản lý video bằng:

- HTML5
- CSS3
- JavaScript thuần (ES6+)
- SQLite
- Không sử dụng backend/server API riêng.

Ứng dụng gồm Dashboard, quản lý Video và xác thực người dùng.

## 2. Nguyên tắc kiến trúc

Đây là ứng dụng **frontend-only**. Trình duyệt không thể dùng SQLite `.db` trực tiếp bằng JavaScript thuần, vì vậy lớp SQLite phải chạy trong browser bằng WebAssembly, ví dụ `sql.js` hoặc một thư viện SQLite WASM tương đương.

Hai database logic chính:

- `users.db`: người dùng và dữ liệu xác thực.
- `videos.db`: video, thống kê và dữ liệu liên quan.

Database phụ chỉ tạo khi thật sự cần, ví dụ `video_categories.db`.

> Lưu ý quan trọng: frontend-only không thể cung cấp bảo mật xác thực tương đương backend. Không lưu password dạng plain text. Mật khẩu nên được hash ở client bằng Web Crypto API; tuy nhiên đây vẫn không phải mô hình production an toàn cho hệ thống có dữ liệu nhạy cảm.

## 3. Các trang

### Authentication

- `/login.html`
- `/register.html`
- `/forgot-password.html`

### Admin

- `/dashboard.html`
- `/videos.html`
- `/video-edit.html`

Có thể dùng query string cho trang edit, ví dụ `video-edit.html?id=123`.

## 4. Chức năng Dashboard

Hiển thị:

- Tổng số video
- Tổng lượt xem
- Tổng dung lượng storage
- Top 10 video có nhiều lượt xem nhất — biểu đồ cột
- Lượt xem theo ngày/tháng — biểu đồ line

## 5. Chức năng List Video

Bảng gồm:

- ID
- Title
- Thumbnail
- Views
- Action: Edit, Delete

Nên bổ sung:

- Search
- Pagination
- Sort
- Empty state
- Loading state
- Confirm dialog trước Delete

## 6. Yêu cầu UX

- Responsive desktop/tablet/mobile.
- Sidebar admin.
- Header có user hiện tại và Logout.
- Trạng thái active cho menu.
- Toast cho thao tác thành công/thất bại.
- Form validation phía client.
- Không reload trang khi thao tác CRUD nếu không cần.

## 7. Nguyên tắc Vibe Coding

Mỗi feature nên được chia thành task nhỏ:

1. Tạo layout.
2. Tạo database schema.
3. Tạo database service.
4. Tạo auth service.
5. Tạo video service.
6. Tạo dashboard service.
7. Kết nối UI với service.
8. Test từng flow.
9. Refactor và chuẩn hóa code.

Không viết toàn bộ ứng dụng trong một prompt duy nhất.

## 8. Definition of Done

Ứng dụng được xem là hoàn thành khi:

- Có thể register user.
- Có thể login/logout.
- Có thể xử lý forgot-password theo cơ chế client-side đã định nghĩa.
- Dashboard đọc được dữ liệu từ SQLite.
- Video list đọc được dữ liệu.
- Edit video hoạt động.
- Delete video hoạt động.
- Dashboard tự tính KPI và biểu đồ từ database.
- Có dữ liệu seed để demo.
- Không có password plain text.
- Không có logic database rải rác trong HTML.
