# Page Specification

## 1. Login

File: `login.html`

### UI

- Logo / Brand.
- Email.
- Password.
- Remember me — optional.
- Login button.
- Link Register.
- Link Forgot Password.

### States

- Default.
- Loading.
- Invalid email.
- Wrong password.
- Account disabled.
- Success.

## 2. Register

File: `register.html`

Fields:

- Full name.
- Email.
- Password.
- Confirm password.
- Register button.
- Link Login.

## 3. Forgot Password

File: `forgot-password.html`

Fields:

- Email.
- Submit.

Demo flow có thể chuyển sang reset form nếu token hợp lệ.

## 4. Dashboard

File: `dashboard.html`

### KPI cards

- Total Videos.
- Total Views.
- Storage Used.

### Charts

Chart 1:

- Bar chart.
- Top 10 videos by views.
- X-axis: title.
- Y-axis: views.

Chart 2:

- Line chart.
- Views over time.
- Toggle: Day / Month.

Có thể dùng Chart.js nếu chấp nhận external frontend dependency. Nếu muốn strictly chỉ HTML/CSS/JS không dependency, tự vẽ chart bằng SVG hoặc Canvas.

## 5. Video List

File: `videos.html`

### Toolbar

- Search input.
- Category filter — optional.
- Status filter — optional.
- Add Video button.

### Table

| ID | Thumbnail | Title | Views | Action |
|---|---|---|---:|---|
| 1 | image | Demo Video | 12,450 | Edit / Delete |

### Actions

Edit:

```text
videos.html
 -> video-edit.html?id=123
```

Delete:

```text
Click Delete
 -> confirm
 -> DELETE/soft delete
 -> persist database
 -> refresh list
 -> show toast
```

Ưu tiên soft delete nếu cần khôi phục.

## 6. Video Edit

File: `video-edit.html`

Fields:

- Title.
- Description.
- Thumbnail URL.
- Video URL.
- File size.
- Duration.
- Category.
- Status.

Actions:

- Save.
- Cancel.

Sau Save:

- Validate.
- UPDATE database.
- Persist database.
- Redirect videos.html.

## 7. Responsive

Desktop:

- Sidebar cố định.
- Content area rộng.

Tablet:

- Sidebar thu gọn.

Mobile:

- Sidebar thành drawer.
- Table có horizontal scroll hoặc card layout.

## 8. Accessibility

- Label cho input.
- Button phải có text/aria-label rõ ràng.
- Focus state.
- Keyboard navigation.
- Contrast tốt.
- Không chỉ dùng màu để biểu thị trạng thái.
