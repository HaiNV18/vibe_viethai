export const AdminSidebar = {
  render(activeRoute = '') {
    return `
      <aside class="admin-sidebar">
        <div class="admin-sidebar-header">
          <i class="fa-solid fa-user-shield"></i>
          <span>Admin Portal</span>
        </div>

        <nav class="admin-menu">
          <a href="/dashboard" class="admin-menu-item ${activeRoute === '/dashboard' ? 'active' : ''}" data-link>
            <i class="fa-solid fa-chart-line"></i> Dashboard
          </a>

          <div class="admin-menu-group">
            <div class="admin-menu-title">
              <i class="fa-solid fa-suitcase"></i> Tour Du Lịch
            </div>
            <div class="admin-submenu">
              <a href="/admin/tours" class="admin-submenu-item ${activeRoute === '/admin/tours' ? 'active' : ''}" data-link>
                <i class="fa-solid fa-list"></i> Quản lý Tour
              </a>
              <a href="/admin/tours/create" class="admin-submenu-item ${activeRoute === '/admin/tours/create' ? 'active' : ''}" data-link>
                <i class="fa-solid fa-plus-circle"></i> Tạo Tour Mới
              </a>
            </div>
          </div>

          <div class="admin-menu-group">
            <div class="admin-menu-title">
              <i class="fa-solid fa-plane"></i> Chuyến Bay
            </div>
            <div class="admin-submenu">
              <a href="/admin/flights" class="admin-submenu-item ${activeRoute === '/admin/flights' ? 'active' : ''}" data-link>
                <i class="fa-solid fa-list"></i> Quản lý Chuyến Bay
              </a>
              <a href="/admin/flights/create" class="admin-submenu-item ${activeRoute === '/admin/flights/create' ? 'active' : ''}" data-link>
                <i class="fa-solid fa-plus-circle"></i> Tạo Chuyến Bay Mới
              </a>
            </div>
          </div>

          <div style="margin-top:auto; padding-top:var(--spacing-6); border-top:1px solid var(--border-color);">
            <a href="/" class="admin-menu-item" data-link>
              <i class="fa-solid fa-house"></i> Về Trang Chủ Client
            </a>
          </div>
        </nav>
      </aside>
    `;
  }
};
