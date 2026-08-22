import { AuthService } from '../services/AuthService.js';
import { Toast } from '../components/Toast.js';
import { router } from '../router.js';

export const LoginPage = {
  async render() {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <div style="text-align:center; margin-bottom:var(--spacing-6);">
            <div class="logo-brand" style="justify-content:center; font-size:var(--font-2xl); margin-bottom:var(--spacing-2);">
              <i class="fa-solid fa-plane-departure"></i> TravelViet
            </div>
            <h2>Đăng Nhập Tài Khoản</h2>
            <p>Chào mừng bạn quay trở lại với TravelViet</p>
          </div>

          <form id="login-form">
            <div class="form-group">
              <label for="login-account">Email hoặc Tên đăng nhập *</label>
              <input type="text" class="form-control" id="login-account" placeholder="admin@travel.com hoặc userdemo" required>
            </div>

            <div class="form-group">
              <label for="login-password">Mật khẩu *</label>
              <input type="password" class="form-control" id="login-password" placeholder="••••••••" required>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--spacing-6);">
              <label class="checkbox-label">
                <input type="checkbox" checked> Ghi nhớ đăng nhập
              </label>
              <a href="/forgot-password" class="nav-link" data-link style="font-size:var(--font-xs);">Quên mật khẩu?</a>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">
              <i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập
            </button>
          </form>

          <div style="text-align:center; margin-top:var(--spacing-6); font-size:var(--font-sm);">
            Chưa có tài khoản? <a href="/register" data-link style="color:var(--primary-color); font-weight:600;">Đăng ký ngay</a>
          </div>

          <!-- Demo Accounts Box -->
          <div style="margin-top:var(--spacing-6); background:var(--bg-color); padding:var(--spacing-4); border-radius:var(--radius-md); border:1px dashed var(--border-color); font-size:var(--font-xs);">
            <div style="font-weight:700; margin-bottom:4px; color:var(--primary-color);"><i class="fa-solid fa-key"></i> Tài khoản Demo thử nghiệm:</div>
            <div><strong>Admin:</strong> admin@travel.com / Admin123!</div>
            <div><strong>User:</strong> user@travel.com / User123!</div>
          </div>
        </div>
      </div>
    `;
  },

  initEvents() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const account = document.getElementById('login-account').value.trim();
      const pass = document.getElementById('login-password').value;

      try {
        const user = await AuthService.login(account, pass);
        Toast.success(`Xin chào, ${user.full_name || user.username}!`);
        
        if (user.role === 'admin') {
          router.navigate('/dashboard');
        } else {
          router.navigate('/profile');
        }
      } catch (err) {
        Toast.error(err.message || 'Đăng nhập thất bại.');
      }
    });
  }
};
