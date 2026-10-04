# CSV + LocalStorage Implementation

## Mục tiêu

CSV đóng vai trò seed database.

LocalStorage đóng vai trò persistence cho frontend demo.

## Loading

Khuyến nghị:

```javascript
fetch('../data/videos.csv')
```

Sau đó parse CSV.

Lưu ý:

`fetch()` có thể bị browser chặn nếu mở HTML trực tiếp bằng `file://`.

Vì vậy khi development nên chạy local server.

Ví dụ:

```text
VS Code Live Server
```

hoặc:

```text
python -m http.server
```

## LocalStorage keys

Khuyến nghị:

```text
video_admin_users
video_admin_videos
video_admin_categories
video_admin_video_views
video_admin_current_user
```

## First run

Pseudo flow:

```text
App starts
   |
   v
Check localStorage
   |
   +-- Has data --> use localStorage
   |
   +-- No data --> load CSV seed
                    |
                    v
                 save localStorage
```

## Reset demo data

Tạo chức năng:

`Reset Demo Data`

Chức năng:

- Xóa các key localStorage liên quan.
- Reload CSV seed.
- Không xóa dữ liệu ngoài phạm vi project.

## CSV parser

Không cần parser quá phức tạp nếu CSV seed không chứa comma trong quoted text.

Nếu cần hỗ trợ CSV chuẩn:

- Handle comma
- Handle quoted values
- Handle newline
- Handle escaped quote

Có thể sử dụng thư viện CSV nhỏ qua CDN, nhưng ưu tiên Vanilla JS nếu project phục vụ học tập.
