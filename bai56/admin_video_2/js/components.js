/**
 * UI Components renderer: Sidebar, Topbar, Modals, and Toasts
 */

const Components = {
  /**
   * Render Sidebar dynamically
   * @param {string} activePage - e.g. 'dashboard', 'videos', 'categories', 'users'
   */
  renderSidebar(activePage = '') {
    const sidebarEl = document.getElementById('app-sidebar');
    if (!sidebarEl) return;

    const currentUser = Storage.getCurrentUser() || { username: 'Guest', role: 'USER' };
    const isAdmin = currentUser.role === 'ADMIN';

    sidebarEl.innerHTML = `
      <div class="sidebar-header">
        <a href="dashboard.html" class="brand-logo">
          <i class="fa-solid fa-circle-play"></i>
          <span>VideoAdmin</span>
        </a>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-title">Main Menu</div>
        
        <a href="dashboard.html" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}">
          <i class="fa-solid fa-chart-pie"></i>
          <span>Dashboard</span>
        </a>

        <a href="videos.html" class="nav-item ${activePage === 'videos' ? 'active' : ''}">
          <i class="fa-solid fa-video"></i>
          <span>Videos</span>
        </a>

        <div class="nav-section-title" style="margin-top: 1rem;">Administration</div>

        <a href="categories.html" class="nav-item ${activePage === 'categories' ? 'active' : ''} ${!isAdmin ? 'disabled' : ''}" 
           ${!isAdmin ? 'title="Administrator access only"' : ''}>
          <i class="fa-solid fa-folder-tree"></i>
          <span>Categories</span>
          ${!isAdmin ? '<span class="badge" style="margin-left:auto; font-size:0.65rem;">Admin</span>' : ''}
        </a>

        <a href="users.html" class="nav-item ${activePage === 'users' ? 'active' : ''} ${!isAdmin ? 'disabled' : ''}" 
           ${!isAdmin ? 'title="Administrator access only"' : ''}>
          <i class="fa-solid fa-users"></i>
          <span>Users</span>
          ${!isAdmin ? '<span class="badge" style="margin-left:auto; font-size:0.65rem;">Admin</span>' : ''}
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile-mini">
          <div class="user-avatar-mini">${Utils.escapeHtml(currentUser.username.charAt(0).toUpperCase())}</div>
          <div class="user-meta-mini">
            <div class="user-name-mini" title="${Utils.escapeHtml(currentUser.username)}">${Utils.escapeHtml(currentUser.username)}</div>
            <span class="badge ${currentUser.role === 'ADMIN' ? 'badge-admin' : 'badge-user'} user-role-badge-mini">${currentUser.role}</span>
          </div>
        </div>

        <button type="button" class="logout-btn-sidebar" id="sidebar-logout-btn">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    `;

    // Logout click binding
    const logoutBtn = document.getElementById('sidebar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Auth.logout();
      });
    }
  },

  /**
   * Render Topbar dynamically
   * @param {string} title 
   */
  renderTopbar(title = '') {
    const topbarEl = document.getElementById('app-topbar');
    if (!topbarEl) return;

    const currentUser = Storage.getCurrentUser() || { username: 'Guest', role: 'USER' };

    topbarEl.innerHTML = `
      <div class="topbar-left">
        <button type="button" class="menu-toggle-btn" id="mobile-menu-toggle" aria-label="Toggle navigation">
          <i class="fa-solid fa-bars"></i>
        </button>
        <h2 class="page-title">${Utils.escapeHtml(title)}</h2>
      </div>

      <div class="topbar-right">
        <button type="button" class="btn btn-secondary btn-sm" id="reset-demo-btn" title="Reset all data back to CSV seeds">
          <i class="fa-solid fa-rotate-right"></i>
          <span>Reset Demo Data</span>
        </button>

        <div class="topbar-user">
          <div class="user-avatar">${Utils.escapeHtml(currentUser.username.charAt(0).toUpperCase())}</div>
          <div class="user-info">
            <span class="user-name">${Utils.escapeHtml(currentUser.username)}</span>
            <span class="user-role">${currentUser.role}</span>
          </div>
        </div>
      </div>
    `;

    // Mobile toggle binding
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (toggleBtn && sidebar && overlay) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
      });
    }

    // Reset Demo Data binding
    const resetBtn = document.getElementById('reset-demo-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        Components.showConfirmModal({
          title: 'Reset Demo Data',
          message: 'Are you sure you want to reset all videos, categories, and users back to the original CSV seed data? Any changes will be cleared.',
          confirmText: 'Yes, Reset',
          confirmClass: 'btn-danger',
          onConfirm: async () => {
            await Storage.resetDemoData();
            Components.showToast('Reset Complete', 'Demo data has been restored from CSV seeds.', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 700);
          }
        });
      });
    }
  },

  /**
   * Floating Toast notifications
   * @param {string} title 
   * @param {string} message 
   * @param {'success'|'danger'|'error'|'warning'|'info'} type 
   * @param {number} duration 
   */
  showToast(title, message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const safeType = type === 'error' ? 'danger' : type;
    toast.className = `toast toast-${safeType}`;

    const iconMap = {
      success: 'fa-solid fa-circle-check',
      danger: 'fa-solid fa-circle-xmark',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info'
    };

    toast.innerHTML = `
      <i class="${iconMap[safeType] || iconMap.info} toast-icon"></i>
      <div class="toast-body">
        <div class="toast-title">${Utils.escapeHtml(title)}</div>
        <div class="toast-message">${Utils.escapeHtml(message)}</div>
      </div>
      <button type="button" class="toast-close" aria-label="Close">&times;</button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    };

    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
  },

  /**
   * Show confirmation modal dialog
   */
  showConfirmModal({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmClass = 'btn-danger',
    onConfirm = () => {}
  }) {
    let modalEl = document.getElementById('confirm-modal-wrapper');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'confirm-modal-wrapper';
      modalEl.className = 'modal-backdrop';
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">${Utils.escapeHtml(title)}</h3>
          <button type="button" class="action-btn" id="modal-cancel-x">&times;</button>
        </div>
        <div class="modal-body">
          <p style="color: var(--text-muted); font-size: 0.925rem; line-height: 1.5;">${Utils.escapeHtml(message)}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${Utils.escapeHtml(cancelText)}</button>
          <button type="button" class="btn ${confirmClass}" id="modal-confirm-btn">${Utils.escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;

    modalEl.classList.add('active');

    const closeModal = () => {
      modalEl.classList.remove('active');
    };

    modalEl.querySelector('#modal-cancel-x').addEventListener('click', closeModal);
    modalEl.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);
    modalEl.querySelector('#modal-confirm-btn').addEventListener('click', () => {
      closeModal();
      onConfirm();
    });
  }
};

window.Components = Components;
