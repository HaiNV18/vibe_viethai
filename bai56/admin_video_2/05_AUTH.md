# Authentication Specification

## Mục tiêu

Mô phỏng authentication hoàn toàn ở frontend.

Không có backend.

## Demo account

ADMIN:

```text
username: admin1
email: admin1@gmail.com
password: 123456
role: ADMIN
```

USER:

```text
username: user1
email: user1@gmail.com
password: 123456
role: USER
```

## Session

Sau khi login thành công:

```javascript
localStorage.setItem('currentUser', JSON.stringify(user));
```

Khi logout:

```javascript
localStorage.removeItem('currentUser');
```

## Guard

Mỗi protected page phải kiểm tra:

```text
currentUser exists?
    |
    +-- NO  -> redirect login.html
    |
    +-- YES -> render page
```

Admin-only:

```text
currentUser.role === 'ADMIN'
```

Nếu không phải ADMIN:

- Không cho truy cập users.html.
- Không cho truy cập categories.html nếu quy định admin-only.
- Hiển thị access denied hoặc redirect dashboard.

## Login logic

1. Load users từ CSV/localStorage.
2. Tìm username hoặc email.
3. So sánh password.
4. Nếu đúng:
   - Save currentUser.
   - Redirect dashboard.
5. Nếu sai:
   - Hiển thị error.

## Register logic

1. Validate fields.
2. Kiểm tra username.
3. Kiểm tra email.
4. Tạo ID mới.
5. Role = USER.
6. Lưu user vào localStorage.
7. Thông báo thành công.
8. Redirect login.

## Forgot password

Không gửi email thật.

Demo behavior:

- User nhập email.
- Nếu tồn tại: "Password reset request simulated successfully."
- Nếu không tồn tại: "Email not found."

## Security warning

Đây là frontend-only demo.

Không được dùng cho:

- Authentication production
- Dữ liệu người dùng thật
- Thanh toán
- Dữ liệu bí mật

Password trong CSV/localStorage có thể bị xem bởi người dùng.
