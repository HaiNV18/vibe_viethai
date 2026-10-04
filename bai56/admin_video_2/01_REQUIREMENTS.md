# Functional Requirements

## 1. Login

Route/page: `login.html`

Form:

- Email hoặc username
- Password
- Remember me
- Login button
- Link Register
- Link Forgot Password

Demo accounts:

### ADMIN

- username: admin1
- email: admin1@gmail.com
- password: 123456
- role: ADMIN

### USER

- username: user1
- email: user1@gmail.com
- password: 123456
- role: USER

Sau khi login:

- ADMIN -> dashboard.html
- USER -> dashboard.html hoặc user-dashboard.html nếu triển khai phân quyền riêng.

## 2. Register

Route/page: `register.html`

Fields:

- Username
- Email
- Password
- Confirm password
- Register button

Validation:

- Username bắt buộc.
- Email hợp lệ.
- Password tối thiểu 6 ký tự.
- Confirm password phải giống password.
- Username/email không được trùng.

Role mặc định khi register: USER.

## 3. Forgot Password

Route/page: `forgot-password.html`

Fields:

- Email
- Submit button

Vì không có backend/email server, chức năng chỉ mô phỏng:

- Kiểm tra email có tồn tại trong users hay không.
- Hiển thị thông báo phù hợp.
- Không gửi email thật.

## 4. Dashboard

Route/page: `dashboard.html`

KPI cards:

1. Total Videos
2. Total Views
3. Storage Used

Chart 1:

- Bar chart
- Top 10 videos by views

Chart 2:

- Line chart
- Views by date/month

Có thể dùng Chart.js qua CDN nếu cần biểu đồ đẹp.

## 5. Video List

Route/page: `videos.html`

Columns:

- ID
- Thumbnail
- Title
- Category
- Views
- Duration
- File Size
- Status
- Actions

Actions:

- Edit
- Delete

Có:

- Search
- Category filter
- Pagination hoặc client-side pagination
- Empty state
- Delete confirmation

## 6. Add/Edit Video

Fields:

- Title
- Description
- Category
- Thumbnail URL
- Video URL
- Duration
- File size
- Status

Status:

- PUBLISHED
- DRAFT
- ARCHIVED

## 7. User Management

Route/page: `users.html`

Columns:

- ID
- Username
- Email
- Role
- Status
- Created At
- Actions

Roles:

- ADMIN
- USER

## 8. Category Management

Route/page: `categories.html`

Columns:

- ID
- Name
- Slug
- Description
- Status
- Actions

## 9. Navigation

Sidebar:

- Dashboard
- Videos
- Categories
- Users
- Logout

Admin pages phải kiểm tra role ADMIN trước khi hiển thị các module quản trị.

## 10. Notifications

Sử dụng toast notification cho:

- Login thành công/thất bại
- Register thành công/thất bại
- Save thành công
- Delete thành công
- Validation error
