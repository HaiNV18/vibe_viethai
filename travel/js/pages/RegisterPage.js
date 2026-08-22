import { AuthService } from '../services/AuthService.js';
import { Toast } from '../components/Toast.js';
import { router } from '../router.js';

export const RegisterPage = {
  async render() {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <div style="text-align:center; margin-bottom:var(--spacing-6);">
            <div class="logo-brand" style="justify-content:center; font-size:var(--font-2xl); margin-bottom:var(--spacing-2);">
              <i class="fa-solid fa-plane-departure"></i> TravelViet
            </div>
            <h2>Đăng Ký Tài Khoản Mới</h2>
            <p>Tạo tài khoản để trải nghiệm đặt vé & nhận nhiều ưu đãi</p>
          </div>

          <form id="register-form">
            <div class="form-group">
              <label for="reg-username">Tên đăng nhập (Username) *</label>
              <input type="text" class="form-control" id="reg-username" placeholder="Ví dụ: myusername123" required>
              <span class="form-error" id="err-username" style="display:none;"></span>
            </div>

            <div class="form-group">
              <label for="reg-email">Địa chỉ Email *</label>
              <input type="email" class="form-control" id="reg-email" placeholder="example@domain.com" required>
              <span class="form-error" id="err-email" style="display:none;"></span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="reg-fullname">Họ và tên</label>
                <input type="text" class="form-control" id="reg-fullname" placeholder="Nguyễn Văn A">
              </div>
              <div class="form-group">
                <label for="reg-phone">Số điện thoại</label>
                <input type="tel" class="form-control" id="reg-phone" placeholder="0901234567">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="reg-password">Mật khẩu *</label>
                <input type="password" class="form-control" id="reg-password" placeholder="Từ 5-15 ký tự" required>
              </div>
              <div class="form-group">
                <label for="reg-confirm">Xác nhận mật khẩu *</label>
                <input type="password" class="form-control" id="reg-confirm" placeholder="Nhập lại mật khẩu" required>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg" style="margin-top:var(--spacing-4);">
              <i class="fa-solid fa-user-plus"></i> Đăng Ký Tài Khoản
            </button>
          </form>

          <div style="text-align:center; margin-top:var(--spacing-6); font-size:var(--font-sm);">
            Đã có tài khoản? <a href="/login" data-link style="color:var(--primary-color); font-weight:600;">Đăng nhập tại đây</a>
          </div>
        </div>
      </div>
    `;
  },

  initEvents() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userData = {
        username: document.getElementById('reg-username').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        full_name: document.getElementById('reg-fullname').value.trim(),
        phone: document.getElementById('reg-phone').value.trim(),
        password: document.getElementById('reg-password').value,
        confirmPassword: document.getElementById('reg-confirm').value
      };

      try {
        const user = await AuthService.register(userData);
        Toast.success('Đăng ký tài khoản thành công!');
        router.navigate('/profile');
      } catch (err) {
        Toast.error(err.message || 'Đăng ký thất bại.');
      }
    });
  }
};
