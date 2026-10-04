# Dashboard Specification

## KPI 1 - Total Videos

Nguồn:

`videos.csv`

Công thức:

```text
COUNT(videos)
```

## KPI 2 - Total Views

Công thức:

```text
SUM(videos.views)
```

## KPI 3 - Storage Used

Nếu có `file_size_bytes`:

```text
SUM(videos.file_size_bytes)
```

Hiển thị:

- B
- KB
- MB
- GB

Tự động format.

## Bar Chart

Title:

`Top 10 Videos by Views`

Data:

- Sort videos theo views giảm dần.
- Lấy 10 video đầu tiên.

X axis:

- Video title

Y axis:

- Views

Nếu sử dụng Chart.js, có thể load từ CDN.

## Line Chart

Title:

`Views Over Time`

Nguồn:

`video_views.csv`

Group theo `view_date`.

Ví dụ:

```text
2026-10-01 -> 730
2026-10-02 -> 960
2026-10-03 -> 1240
```

Có thể hỗ trợ:

- Daily
- Monthly

## Empty state

Nếu chưa có data:

- Không để chart lỗi.
- Hiển thị message:
  `No view data available.`
