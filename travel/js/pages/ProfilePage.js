import { AuthService } from '../services/AuthService.js';
import { formatDate } from '../utils/formatDate.js';
import { Toast } from '../components/Toast.js';
import { router } from '../router.js';

export const ProfilePage = {
  async render() {
    const user = AuthService.getCurrentUser();
    if (!user) {
      router.navigate('/login');
      return '';
    }

    return `
      <div class="container" style="padding:var(--spacing-8) 0 var(--spacing-12);">
        <div class="profile-card">
          <div style="display:flex; align-items:center; gap:var(--spacing-6); border-bottom:1px solid var(--border-color); padding-bottom:var(--spacing-6); margin-bottom:var(--spacing-6);">
            <div class="user-avatar" style="width:80px; height:80px; font-size:36px;">
              ${(user.full_name || user.username).charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>${user.full_name || user.username}</h2>
              <div style="font-size:var(--font-sm); color:var(--text-muted);">
                <span class="badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}">${user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Thành viên'}</span>
                • Ngày tạo: ${formatDate(user.created_at ? user.created_at.split('T')[0] : '')}
              </div>
            </div>
          </div>

          <form id="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label>Tên đăng nhập (Username)</label>
                <input type="text" class="form-control" value="${user.username}" disabled style="background:#e2e8f0;">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" value="${user.email}" disabled style="background:#e2e8f0;">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="prof-fullname">Họ và tên</label>
                <input type="text" class="form-control" id="prof-fullname" value="${user.full_name || ''}" placeholder="Nhập họ và tên">
              </div>
              <div class="form-group">
                <label for="prof-phone">Số điện thoại</label>
                <input type="tel" class="form-control" id="prof-phone" value="${user.phone || ''}" placeholder="Nhập số điện thoại">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="prof-country">Quốc gia</label>
                <input type="text" class="form-control" id="prof-country" value="${user.country || 'Vietnam'}">
              </div>
              <div class="form-group">
                <label for="prof-address">Địa chỉ liên hệ</label>
                <input type="text" class="form-control" id="prof-address" value="${user.address || ''}" placeholder="Nhập địa chỉ">
              </div>
            </div>

            <div style="text-align:right; margin-top:var(--spacing-6);">
              <button type="submit" class="btn btn-primary btn-lg">
                <i class="fa-solid fa-floppy-disk"></i> Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  initEvents() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const profileData = {
        full_name: document.getElementById('prof-fullname').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        country: document.getElementById('prof-country').value.trim(),
        address: document.getElementById('prof-address').value.trim()
      };

      try {
        await AuthService.updateProfile(profileData);
        Toast.success('Cập nhật thông tin cá nhân thành công!');
        window.location.reload();
      } catch (err) {
        Toast.error(err.message || 'Cập nhật thất bại.');
      }
    });
  }
};
