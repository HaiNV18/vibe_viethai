import { initDatabase } from './database/database.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { router } from './router.js';

async function bootstrap() {
  const contentEl = document.getElementById('app-content');
  if (contentEl) {
    contentEl.innerHTML = `
      <div class="loading-spinner" style="min-height:60vh;">
        <div class="spinner"></div>
        <p style="font-weight:600;">Đang khởi tạo cơ sở dữ liệu SQLite & ứng dụng...</p>
      </div>
    `;
  }

  try {
    // 1. Initialize SQLite Database & Seed Data
    await initDatabase();

    // 2. Render Header & Footer Shell
    const headerEl = document.getElementById('app-header');
    if (headerEl) {
      headerEl.innerHTML = Header.render();
      Header.initEvents();
    }

    const footerEl = document.getElementById('app-footer');
    if (footerEl) {
      footerEl.innerHTML = Footer.render();
    }

    // 3. Start Single Page Application Router
    router.init();

  } catch (error) {
    console.error('Bootstrap Error:', error);
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="container" style="padding:var(--spacing-12) 0;">
          <div class="empty-state">
            <i class="fa-solid fa-triangle-exclamation" style="color:var(--danger-color);"></i>
            <h3>Không thể tải ứng dụng</h3>
            <p>Vui lòng mở trang web thông qua Web Server (CORS/WASM requirement) hoặc làm mới trình duyệt.</p>
          </div>
        </div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);
