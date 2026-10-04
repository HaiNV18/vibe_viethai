# UI Design Specification

## Theme

Light mode only.

Primary:

- White background
- Dark text
- Neutral gray borders
- Blue/indigo accent có thể dùng cho primary action
- Green cho success
- Red cho danger
- Yellow/orange cho warning

Không triển khai dark mode.

## Layout

Desktop:

```text
+------------------------------------------------------+
| Sidebar              | Topbar                         |
|                      +--------------------------------|
| Dashboard            |                                |
| Videos               | Main Content                   |
| Categories           |                                |
| Users                |                                |
| Logout               |                                |
+------------------------------------------------------+
```

Sidebar:

- Logo
- Navigation menu
- User profile mini card
- Logout

Topbar:

- Page title
- Search nếu cần
- Current user
- Avatar

## Dashboard cards

Mỗi card gồm:

- Icon
- Label
- Large number
- Optional trend percentage

Ví dụ:

```text
Total Videos
128
+12 this month
```

## Table

Table cần:

- Border radius
- Header background nhẹ
- Row hover
- Thumbnail nhỏ
- Status badge
- Action buttons

## Buttons

Primary:

- Add
- Save
- Login
- Register

Secondary:

- Cancel
- Filter

Danger:

- Delete

## Responsive

Mobile:

- Sidebar chuyển thành mobile menu.
- Table có horizontal scrolling.
- Dashboard cards xếp dọc.
- Charts responsive.
