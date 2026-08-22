import { Toast } from '../components/Toast.js';
import { isValidEmail } from '../utils/validation.js';

export const ForgotPasswordPage = {
  async render() {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <div style="text-align:center; margin-bottom:var(--spacing-6);">
            <h2>Quên Mật Khẩu?</h2>
            <p>Nhập địa chỉ email đăng ký để nhận liên kết khôi phục mật khẩu</p>
          </div>

          <form id="forgot-form">
            <div class="form-group">
              <label for="forgot-email">Địa chỉ Email *</label>
              <input type="email" class="form-control" id="forgot-email" placeholder="example@domain.com" required>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">
              <i class="fa-solid fa-paper-plane"></i> Gửi Yêu Cầu Khôi Phục
            </button>
          </form>

          <div style="text-align:center; margin-top:var(--spacing-6); font-size:var(--font-sm);">
            <a href="/login" data-link style="color:var(--text-muted);"><i class="fa-solid fa-arrow-left"></i> Quay lại trang Đăng nhập</a>
          </div>
        </div>
      </div>
    `;
  },

  initEvents() {
    const form = document.getElementById('forgot-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value.trim();

      if (!isValidEmail(email)) {
        Toast.error('Vui lòng nhập định dạng email hợp lệ.');
        return;
      }

      Toast.success('Yêu cầu khôi phục đã được gửi! Vui lòng kiểm tra hộp thư email của bạn.');
    });
  }
};
