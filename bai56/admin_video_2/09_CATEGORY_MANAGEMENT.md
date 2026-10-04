# Category Management Specification

## Page

`categories.html`

ADMIN only.

## Fields

- ID
- Name
- Slug
- Description
- Status

## Actions

- Add
- Edit
- Delete

## Slug

Tự động tạo slug từ name.

Ví dụ:

```text
Web Development
```

thành:

```text
web-development
```

## Delete rule

Nếu category đang được video sử dụng:

- Cảnh báo trước khi xóa.
- Không xóa nếu muốn giữ referential integrity.
- Hoặc yêu cầu chuyển video sang category khác.

Đối với demo đơn giản, hiển thị confirmation và cho phép xóa.
