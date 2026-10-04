# CSV Database Schema

## 1. users.csv

Columns:

```text
id,username,email,password,role,status,created_at
```

Seed data:

```csv
id,username,email,password,role,status,created_at
1,admin1,admin1@gmail.com,123456,ADMIN,ACTIVE,2026-10-01
2,user1,user1@gmail.com,123456,USER,ACTIVE,2026-10-01
```

> Password plain text chỉ phục vụ demo. Không sử dụng cách này cho production.

## 2. videos.csv

Columns:

```text
id,title,description,thumbnail_url,video_url,category_id,views,duration,file_size,status,created_at
```

Example:

```csv
id,title,description,thumbnail_url,video_url,category_id,views,duration,file_size,status,created_at
1,Introduction to JavaScript,JavaScript basic lesson,assets/images/js.jpg,assets/videos/js.mp4,1,12500,12:30,125MB,PUBLISHED,2026-09-01
2,HTML Basics,HTML introduction,assets/images/html.jpg,assets/videos/html.mp4,2,9800,08:45,80MB,PUBLISHED,2026-09-03
```

## 3. categories.csv

Columns:

```text
id,name,slug,description,status
```

Example:

```csv
id,name,slug,description,status
1,Programming,programming,Programming tutorials,ACTIVE
2,Web Development,web-development,Web development tutorials,ACTIVE
3,Design,design,Design tutorials,ACTIVE
```

## 4. video_categories.csv

Bảng liên kết many-to-many nếu một video có thể thuộc nhiều category.

Columns:

```text
video_id,category_id
```

Example:

```csv
video_id,category_id
1,1
1,2
2,2
```

Nếu muốn đơn giản hóa project, có thể chỉ sử dụng `category_id` trong videos.csv và không cần bảng này.

## 5. video_views.csv

Dùng để tạo line chart.

Columns:

```text
id,video_id,view_date,view_count
```

Example:

```csv
id,video_id,view_date,view_count
1,1,2026-10-01,420
2,1,2026-10-02,510
3,1,2026-10-03,620
4,2,2026-10-01,310
5,2,2026-10-02,450
```

## 6. Quan hệ

```text
users
  |
  | created_by / owner nếu cần mở rộng
  |
videos ---- categories
   |
   |
video_views
```

## 7. Dung lượng storage

Storage Used được tính từ tổng `file_size` của videos.

Để JavaScript dễ tính toán, nên lưu thêm một field số:

```text
file_size_bytes
```

Thay vì chỉ lưu chuỗi `125MB`.

Khuyến nghị videos.csv:

```text
id,title,description,thumbnail_url,video_url,category_id,views,duration,file_size_bytes,status,created_at
```
