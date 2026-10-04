# Video Management Specification

## List Video

Page:

`videos.html`

Columns:

| Column | Description |
|---|---|
| ID | Video ID |
| Thumbnail | Image |
| Title | Video title |
| Category | Category name |
| Views | View count |
| Duration | Duration |
| File Size | File size |
| Status | PUBLISHED/DRAFT/ARCHIVED |
| Action | Edit/Delete |

## Search

Search theo:

- title
- description

Search realtime khi người dùng nhập.

## Filter

Filter theo:

- Category
- Status

## Sort

Cho phép sort:

- Views ascending
- Views descending
- Newest
- Oldest
- Title A-Z

## Add Video

Button:

`+ Add Video`

Form:

- Title
- Description
- Category
- Thumbnail URL
- Video URL
- Duration
- File size
- Status

## Edit

Click Edit:

- Load video data.
- Populate form.
- Save changes.

## Delete

Click Delete:

Hiển thị confirm:

```text
Are you sure you want to delete this video?
```

Nếu confirm:

- Remove video.
- Update localStorage.
- Refresh table.
- Show toast.

## Video preview

Có thể thêm:

- Thumbnail preview
- HTML5 video preview nếu video_url hợp lệ.

## CSV/localStorage strategy

Initial:

```text
CSV -> JavaScript -> localStorage
```

Sau khi có CRUD:

```text
localStorage -> UI
```

CSV giữ vai trò seed data.
