import { AuthService } from './services/AuthService.js';
import { Toast } from './components/Toast.js';

import { HomePage } from './pages/HomePage.js';
import { FlightsPage } from './pages/FlightsPage.js';
import { FlightDetailPage } from './pages/FlightDetailPage.js';
import { ToursPage } from './pages/ToursPage.js';
import { TourDetailPage } from './pages/TourDetailPage.js';
import { CartPage } from './pages/CartPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { AdminToursPage } from './pages/AdminToursPage.js';
import { AdminCreateTourPage } from './pages/AdminCreateTourPage.js';
import { AdminFlightsPage } from './pages/AdminFlightsPage.js';
import { AdminCreateFlightPage } from './pages/AdminCreateFlightPage.js';

const routes = [
  { path: '/', page: HomePage, auth: false },
  { path: '/flights', page: FlightsPage, auth: false },
  { path: '/flight-detail', page: FlightDetailPage, auth: false },
  { path: '/tours', page: ToursPage, auth: false },
  { path: '/tour-detail', page: TourDetailPage, auth: false },
  { path: '/cart', page: CartPage, auth: false },
  { path: '/login', page: LoginPage, auth: false },
  { path: '/register', page: RegisterPage, auth: false },
  { path: '/forgot-password', page: ForgotPasswordPage, auth: false },
  { path: '/profile', page: ProfilePage, auth: true, role: 'user' },
  { path: '/dashboard', page: DashboardPage, auth: true, role: 'admin' },
  { path: '/admin/tours', page: AdminToursPage, auth: true, role: 'admin' },
  { path: '/admin/tours/create', page: AdminCreateTourPage, auth: true, role: 'admin' },
  { path: '/admin/flights', page: AdminFlightsPage, auth: true, role: 'admin' },
  { path: '/admin/flights/create', page: AdminCreateFlightPage, auth: true, role: 'admin' }
];

export const router = {
  async handleRoute() {
    const path = window.location.pathname;
    const match = routes.find(r => r.path === path);

    const contentEl = document.getElementById('app-content');
    if (!contentEl) return;

    // Check Auth & Admin permissions
    if (match && match.auth) {
      const user = AuthService.getCurrentUser();
      if (!user) {
        Toast.warning('Vui lòng đăng nhập để truy cập trang này.');
        this.navigate('/login');
        return;
      }

      if (match.role === 'admin' && user.role !== 'admin') {
        Toast.error('Bạn không có quyền truy cập trang quản trị Admin.');
        this.navigate('/login');
        return;
      }
    }

    if (match) {
      window.scrollTo(0, 0);
      contentEl.innerHTML = await match.page.render();
      if (typeof match.page.initEvents === 'function') {
        match.page.initEvents();
      }
    } else {
      // 404 Not Found Page
      contentEl.innerHTML = `
        <div class="container" style="padding:var(--spacing-12) 0; text-align:center;">
          <div class="empty-state">
            <i class="fa-solid fa-compass" style="font-size:4rem; color:var(--text-light); margin-bottom:var(--spacing-4);"></i>
            <h1 style="font-size:3rem; color:var(--primary-color);">404</h1>
            <h3>Trang bạn tìm kiếm không tồn tại</h3>
            <p style="margin:var(--spacing-3) 0 var(--spacing-6);">Đường dẫn này có thể đã bị thay đổi hoặc không khả dụng.</p>
            <a href="/" class="btn btn-primary" data-link><i class="fa-solid fa-house"></i> Quay về trang chủ</a>
          </div>
        </div>
      `;
    }
  },

  navigate(url) {
    history.pushState(null, '', url);
    this.handleRoute();
    // Refresh Header active state
    window.dispatchEvent(new CustomEvent('cart-updated'));
  },

  init() {
    window.addEventListener('popstate', () => this.handleRoute());

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-link]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          this.navigate(href);
        }
      }
    });

    this.handleRoute();
  }
};
