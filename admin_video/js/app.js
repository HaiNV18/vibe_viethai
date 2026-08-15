// App Initialization & Shared Layout Controller

import { DatabaseManager } from './db/database-manager.js';
import { AuthService } from './services/auth-service.js';
import { ToastUtil } from './utils/toast.js';
import { FormatUtil } from './utils/format.js';

export class App {
  static async init(options = { requireAuth: true }) {
    try {
      // 1. Initialize SQLite WASM & Storage
      await DatabaseManager.init();

      // 2. Check Auth Route Guards
      if (options.requireAuth) {
        AuthService.requireAuth();
        this.renderUserInfo();
      } else if (options.requireGuest) {
        AuthService.requireGuest();
      }

      // 3. Setup Shared UI Event Listeners
      this.setupNavigation();
      this.setupDatabaseActions();
    } catch (err) {
      console.error('App init failed:', err);
      ToastUtil.error('Không thể khởi tạo ứng dụng: ' + err.message);
    }
  }

  static renderUserInfo() {
    const user = AuthService.getCurrentUser();
    if (!user) return;

    const userAvatarEl = document.getElementById('user-avatar');
    const userNameEl = document.getElementById('user-name');
    const userRoleEl = document.getElementById('user-role');

    if (userAvatarEl) {
      userAvatarEl.textContent = user.fullName.charAt(0).toUpperCase();
    }
    if (userNameEl) {
      userNameEl.textContent = FormatUtil.escapeHtml(user.fullName);
    }
    if (userRoleEl) {
      userRoleEl.textContent = FormatUtil.escapeHtml(user.role.toUpperCase());
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        AuthService.logout();
      });
    }
  }

  static setupNavigation() {
    // Mobile Sidebar Drawer Toggle
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (toggleBtn && sidebar && overlay) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    // Active Navigation Highlight
    const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navLinks = document.querySelectorAll('.nav-item');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'dashboard.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  static setupDatabaseActions() {
    // Export DB File
    const exportBtn = document.getElementById('export-db-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        DatabaseManager.exportDatabase();
        ToastUtil.success('Đã tải xuống file database (.db) thành công.');
      });
    }

    // Import DB File
    const importInput = document.getElementById('import-db-input');
    const importBtn = document.getElementById('import-db-btn');
    if (importBtn && importInput) {
      importBtn.addEventListener('click', () => importInput.click());

      importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          await DatabaseManager.importDatabase(file);
          ToastUtil.success('Khôi phục database từ file thành công! Đang tải lại trang...');
          setTimeout(() => window.location.reload(), 1200);
        } catch (err) {
          ToastUtil.error('Khôi phục file database thất bại: ' + err.message);
        }
      });
    }

    // Reset DB to Seed Data
    const resetBtn = document.getElementById('reset-db-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (confirm('Bạn có chắc chắn muốn reset toàn bộ database về dữ liệu mẫu (Seed Data)?')) {
          await DatabaseManager.resetDatabase();
          ToastUtil.success('Đã reset database về Seed Data! Đang tải lại trang...');
          setTimeout(() => window.location.reload(), 1200);
        }
      });
    }
  }
}
