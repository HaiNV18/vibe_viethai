# Supabase SQL Setup Guide

Tài liệu hướng dẫn khởi tạo Database và cấu hình Supabase cho dự án **Video Admin Management**.

---

## 📁 Danh sách các file SQL

| File | Mô tả |
|---|---|
| [`setup.sql`](file:///d:/vibe_hainv18/vibe_hainv18/admin_video_2/sql/setup.sql) | **Tất cả trong 1**: Khuyến nghị dùng file này để chạy 1 lần duy nhất trong Supabase SQL Editor. |
| [`01_schema.sql`](file:///d:/vibe_hainv18/vibe_hainv18/admin_video_2/sql/01_schema.sql) | Tạo các bảng (`users`, `categories`, `videos`, `video_categories`, `video_views`), khóa chính, khóa ngoại, chỉ mục (indexes), và trigger tự động cập nhật `updated_at`. |
| [`02_rls_policies.sql`](file:///d:/vibe_hainv18/vibe_hainv18/admin_video_2/sql/02_rls_policies.sql) | Kích hoạt Row Level Security (RLS) và cấp quyền truy cập CRUD cho client-side (thông qua anon key). |
| [`03_seed_data.sql`](file:///d:/vibe_hainv18/vibe_hainv18/admin_video_2/sql/03_seed_data.sql) | Nạp toàn bộ dữ liệu mẫu (2 users, 4 categories, 10 videos, 30 lượt xem) và cập nhật lại sequence ID. |

---

## 🚀 Các bước thực hiện trên Supabase Dashboard

### Bước 1: Tạo dự án mới (nếu chưa có)
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard).
2. Nhấn **"New project"**, chọn Organization và đặt tên dự án (ví dụ: `video-admin`).
3. Chọn database password và region gần bạn nhất (ví dụ: Singapore - `ap-southeast-1`).
4. Nhấn **"Create new project"** và đợi khoảng 1-2 phút để Supabase chuẩn bị cơ sở dữ liệu.

### Bước 2: Chạy script SQL
1. Tại menu thanh bên trái của Supabase Dashboard, chọn biểu tượng **SQL Editor** (hoặc nhấn `S` rồi `Q`).
2. Nhấn nút **"+ New query"** ở góc trên.
3. Mở file [`sql/setup.sql`](file:///d:/vibe_hainv18/vibe_hainv18/admin_video_2/sql/setup.sql), copy toàn bộ nội dung và dán vào cửa sổ soạn thảo query của Supabase.
4. Nhấn nút **"Run"** (hoặc phím tắt `Ctrl + Enter` / `Cmd + Enter`).
5. Kết quả hiển thị **"Success. No rows returned"** là bạn đã thiết lập hoàn tất!

### Bước 3: Kiểm tra bảng dữ liệu đã tạo
1. Vào mục **Table Editor** ở thanh bên trái.
2. Bạn sẽ thấy 5 bảng đã có đầy đủ dữ liệu mẫu:
   - `users`: 2 bản ghi (`admin1`, `user1`).
   - `categories`: 4 danh mục.
   - `videos`: 10 video đầy đủ thumbnail, category_id, file_size_bytes, views...
   - `video_categories`: 10 liên kết.
   - `video_views`: 30 bản ghi dữ liệu lịch sử lượt xem.

---

## 🔑 Lấy thông tin kết nối Supabase (để dùng ở bước tiếp theo)

Để kết nối frontend website trực tiếp với Supabase, bạn sẽ cần 2 thông tin sau:
1. Vào mục **Project Settings** (biểu tượng bánh răng ở góc dưới bên trái).
2. Chọn **API** trong phần Configuration.
3. Tìm và lưu lại:
   - **Project URL**: Có dạng `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
   - **Project API Keys** -> `anon` (public): Có dạng chuỗi JWT dài bắt đầu bằng `eyJhbGciOi...`
