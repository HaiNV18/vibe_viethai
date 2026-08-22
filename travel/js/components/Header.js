import { AuthService } from '../services/AuthService.js';
import { CartService } from '../services/CartService.js';
import { router } from '../router.js';

export const Header = {
  render() {
    const user = AuthService.getCurrentUser();
    const cartCount = CartService.getItemCount();
    const currentPath = window.location.pathname;

    const isAdmin = user && user.role === 'admin';

    return `
      <div class="container header-inner">
        <a href="/" class="logo-brand nav-item" data-link>
          <i class="fa-solid fa-plane-departure"></i> TravelViet
        </a>

        <button class="mobile-menu-btn" id="mobile-toggle">
          <i class="fa-solid fa-bars"></i>
        </button>

        <nav class="main-nav" id="main-nav">
          <a href="/" class="nav-link ${currentPath === '/' ? 'active' : ''}" data-link>Trang chủ</a>
          <a href="/flights" class="nav-link ${currentPath.startsWith('/flight') ? 'active' : ''}" data-link>Chuyến bay</a>
          <a href="/tours" class="nav-link ${currentPath.startsWith('/tour') ? 'active' : ''}" data-link>Tour du lịch</a>
          <a href="/cart" class="nav-link cart-link ${currentPath === '/cart' ? 'active' : ''}" data-link>
            Giỏ hàng
            ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
          </a>

          ${user ? `
            <div class="user-menu">
              <div class="user-avatar" id="user-avatar-btn" title="${user.full_name || user.username}">
                ${(user.full_name || user.username).charAt(0).toUpperCase()}
              </div>
              <div class="user-dropdown" id="user-dropdown">
                <div class="dropdown-item" style="font-weight:700; border-bottom:1px solid var(--border-color);">
                  ${user.full_name || user.username}
                </div>
                ${isAdmin ? `
                  <a href="/dashboard" class="dropdown-item" data-link><i class="fa-solid fa-chart-line"></i> Dashboard</a>
                  <a href="/admin/tours" class="dropdown-item" data-link><i class="fa-solid fa-suitcase"></i> Quản lý Tour</a>
                  <a href="/admin/flights" class="dropdown-item" data-link><i class="fa-solid fa-plane"></i> Quản lý Chuyến bay</a>
                ` : ''}
                <a href="/profile" class="dropdown-item" data-link><i class="fa-solid fa-user"></i> Trang cá nhân</a>
                <a href="#" class="dropdown-item" id="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</a>
              </div>
            </div>
          ` : `
            <a href="/login" class="btn btn-primary btn-sm" data-link>Đăng nhập</a>
          `}
        </nav>
      </div>
    `;
  },

  initEvents() {
    const avatarBtn = document.getElementById('user-avatar-btn');
    const dropdown = document.getElementById('user-dropdown');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');
    const logoutBtn = document.getElementById('logout-btn');

    if (avatarBtn && dropdown) {
      avatarBtn.onclick = (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      };

      document.onclick = (e) => {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      };

      dropdown.onclick = (e) => {
        e.stopPropagation();
      };
    }

    if (mobileToggle && mainNav) {
      mobileToggle.onclick = () => {
        mainNav.classList.toggle('show');
      };
    }

    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        AuthService.logout();
        router.navigate('/login');
      };
    }
  }
};
