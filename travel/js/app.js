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
        <p style="font-weight:600;">Đang kết nối cơ sở dữ liệu Supabase Cloud...</p>
      </div>
    `;
  }

  try {
    // 1. Initialize Supabase Database & Seed Data
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
      if (error.message === 'TABLES_NOT_FOUND') {
        contentEl.innerHTML = `
          <div class="container" style="padding:var(--spacing-8) 0;">
            <div class="card" style="padding:var(--spacing-8); max-width:800px; margin:0 auto; border-left:6px solid var(--warning-color);">
              <h2 style="color:var(--warning-color);"><i class="fa-solid fa-database"></i> Cần Tạo Bảng Cơ Sở Dữ Liệu Trên Supabase</h2>
              <p style="margin:var(--spacing-3) 0;">Vì lý do bảo mật của Supabase, các bảng dữ liệu (Tables) không thể được tạo tự động bằng Client API mà cần chạy 1 lần duy nhất trong <strong>SQL Editor</strong> của Supabase.</p>
              
              <div style="background:var(--bg-color); padding:var(--spacing-4); border-radius:var(--radius-md); margin:var(--spacing-4) 0;">
                <h4 style="margin-bottom:var(--spacing-2);">Hướng dẫn 3 bước thực hiện (mất 1 phút):</h4>
                <ol style="margin-left:var(--spacing-5); line-height:1.8; font-size:var(--font-sm);">
                  <li>Bấm vào đây để mở SQL Editor: <a href="https://supabase.com/dashboard/project/eacgavjbnhjdgnivkomo/sql/new" target="_blank" style="color:var(--primary-color); font-weight:700; text-decoration:underline;">Mở Supabase SQL Editor <i class="fa-solid fa-up-right-from-square"></i></a></li>
                  <li>Mở file <code style="background:#e2e8f0; padding:2px 6px; border-radius:4px;">js/database/supabase_schema.sql</code> trong project, sao chép (Copy) toàn bộ nội dung.</li>
                  <li>Dán (Paste) vào ô SQL Editor trên Supabase và bấm nút <strong>Run</strong>.</li>
                </ol>
              </div>

              <p style="font-size:var(--font-xs); color:var(--text-muted);">Sau khi bấm <strong>Run</strong> thành công trên Supabase, hãy làm mới lại trang web này (F5). Hệ thống sẽ tự động seed dữ liệu mẫu 105 chuyến bay, 103 tour du lịch và tài khoản admin!</p>
              
              <button class="btn btn-primary" onclick="window.location.reload();" style="margin-top:var(--spacing-4);">
                <i class="fa-solid fa-rotate-right"></i> Tôi Đã Tạo Bảng — Làm Mới Trang (F5)
              </button>
            </div>
          </div>
        `;
      } else {
        contentEl.innerHTML = `
          <div class="container" style="padding:var(--spacing-12) 0;">
            <div class="empty-state">
              <i class="fa-solid fa-triangle-exclamation" style="color:var(--danger-color);"></i>
              <h3>Không thể kết nối Supabase Cloud</h3>
              <p>Vui lòng kiểm tra lại kết nối mạng hoặc đảm bảo đã thực thi DDL SQL trên Supabase SQL Editor.</p>
            </div>
          </div>
        `;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);
