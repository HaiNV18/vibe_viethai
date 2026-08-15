# Database Specification

## 1. users.db

### users

| Column | Type | Constraint |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| email | TEXT | UNIQUE NOT NULL |
| password_hash | TEXT | NOT NULL |
| full_name | TEXT | NOT NULL |
| role | TEXT | NOT NULL DEFAULT 'admin' |
| status | TEXT | NOT NULL DEFAULT 'active' |
| created_at | TEXT | NOT NULL |
| updated_at | TEXT | NOT NULL |
| last_login_at | TEXT | NULL |

Không lưu `password` plain text.

### password_reset_tokens

| Column | Type | Constraint |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| user_id | INTEGER | NOT NULL |
| token_hash | TEXT | NOT NULL |
| expires_at | TEXT | NOT NULL |
| used_at | TEXT | NULL |
| created_at | TEXT | NOT NULL |

Do không có backend/email service, forgot password trong bản frontend-only chỉ nên mô phỏng reset flow hoặc cho phép admin/local recovery. Không giả vờ gửi email thật.

## 2. videos.db

### videos

| Column | Type | Constraint |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| title | TEXT | NOT NULL |
| description | TEXT | NULL |
| thumbnail_url | TEXT | NULL |
| video_url | TEXT | NULL |
| file_size_bytes | INTEGER | NOT NULL DEFAULT 0 |
| duration_seconds | INTEGER | NOT NULL DEFAULT 0 |
| views | INTEGER | NOT NULL DEFAULT 0 |
| status | TEXT | NOT NULL DEFAULT 'published' |
| category_id | INTEGER | NULL |
| created_at | TEXT | NOT NULL |
| updated_at | TEXT | NOT NULL |

### video_view_stats

Dùng cho biểu đồ line.

| Column | Type | Constraint |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| video_id | INTEGER | NOT NULL |
| view_date | TEXT | NOT NULL |
| view_count | INTEGER | NOT NULL DEFAULT 0 |

Nên tạo unique index:

```sql
CREATE UNIQUE INDEX idx_video_view_stats_unique
ON video_view_stats(video_id, view_date);
```

## 3. categories.db

Nếu muốn tách database:

### categories

| Column | Type | Constraint |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| name | TEXT | UNIQUE NOT NULL |
| slug | TEXT | UNIQUE NOT NULL |
| created_at | TEXT | NOT NULL |

Tuy nhiên với ứng dụng nhỏ, có thể đặt `categories` trong `videos.db` để tránh quản lý nhiều database.

## 4. Dashboard queries

### Tổng số video

```sql
SELECT COUNT(*) AS total_videos
FROM videos
WHERE status != 'deleted';
```

### Tổng lượt xem

```sql
SELECT COALESCE(SUM(views), 0) AS total_views
FROM videos
WHERE status != 'deleted';
```

### Tổng storage

```sql
SELECT COALESCE(SUM(file_size_bytes), 0) AS total_storage
FROM videos
WHERE status != 'deleted';
```

### Top 10 video

```sql
SELECT id, title, views
FROM videos
WHERE status != 'deleted'
ORDER BY views DESC
LIMIT 10;
```

### Views theo ngày

```sql
SELECT
  view_date,
  SUM(view_count) AS views
FROM video_view_stats
GROUP BY view_date
ORDER BY view_date ASC;
```

### Views theo tháng

```sql
SELECT
  substr(view_date, 1, 7) AS month,
  SUM(view_count) AS views
FROM video_view_stats
GROUP BY substr(view_date, 1, 7)
ORDER BY month ASC;
```

## 5. SQL conventions

- Tên bảng: snake_case.
- Tên column: snake_case.
- Timestamp: ISO 8601.
- ID: INTEGER.
- Tiền/size: lưu giá trị nguyên, không lưu formatted string.
- Dữ liệu hiển thị được format ở JavaScript.
