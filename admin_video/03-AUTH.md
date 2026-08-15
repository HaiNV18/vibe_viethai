# Authentication Specification

## 1. Login

Flow:

```text
Login form
  -> validate email/password
  -> AuthService.login()
  -> query users.db
  -> verify password hash
  -> create local session
  -> redirect dashboard
```

Session có thể lưu trong `sessionStorage` để tự hết khi tab/session đóng.

Nếu cần duy trì đăng nhập, có thể dùng `localStorage`, nhưng phải hiểu đây không phải secure server session.

## 2. Register

Flow:

```text
Register form
  -> validate
  -> check duplicate email
  -> generate password hash
  -> INSERT users
  -> save users.db
  -> redirect login
```

Validation:

- Email hợp lệ.
- Password tối thiểu 8 ký tự.
- Confirm password giống password.
- Email chưa tồn tại.

## 3. Password hashing

Dùng Web Crypto API:

- `crypto.subtle.digest("SHA-256", ...)` cho demo tối thiểu.
- Tốt hơn: dùng PBKDF2 với salt và nhiều iterations nếu triển khai hoàn toàn client-side.

Không lưu password plain text.

Ví dụ dữ liệu:

```text
password_hash = PBKDF2(password + salt)
salt = random bytes
```

Salt nên được lưu cùng record dưới dạng encoded value.

## 4. Forgot password

Frontend-only có giới hạn quan trọng:

Không thể tự gửi email reset password mà không có mail server/backend.

Vì vậy bản demo nên implement một trong hai cách:

### Cách A — Demo local

- Nhập email.
- Tạo reset token.
- Lưu token hash vào `users.db`.
- Hiển thị thông báo demo.
- Điều hướng đến form reset password.

Không hiển thị flow này như email production.

### Cách B — Admin recovery

Cho phép một user có quyền admin tạo recovery code.

## 5. Route guard

Mỗi admin page phải kiểm tra:

```text
if (!AuthService.isAuthenticated()) {
    redirect login.html
}
```

Các trang public:

- login
- register
- forgot-password

Các trang protected:

- dashboard
- videos
- video-edit

## 6. Logout

Logout phải:

1. Xóa session.
2. Xóa state user hiện tại khỏi memory.
3. Redirect về login.

## 7. Security limitations

Frontend-only authentication không thể bảo vệ database khỏi người dùng có quyền truy cập DevTools.

Không nên dùng kiến trúc này cho:

- Dữ liệu cá nhân nhạy cảm.
- Thanh toán.
- Hệ thống nhiều tenant.
- Phân quyền bảo mật nghiêm ngặt.
- Secret/API key.
- Production authentication yêu cầu chống giả mạo mạnh.

Đây là kiến trúc phù hợp cho demo, prototype, local tool hoặc ứng dụng nội bộ với yêu cầu bảo mật thấp.
