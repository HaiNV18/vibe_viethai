/**
 * Route Guard for Page Access Control & Role Authorization
 */

const Guard = {
  /**
   * Determine relative path to login/dashboard based on current directory
   */
  getRelativePage(target) {
    const isPagesDir = window.location.pathname.includes('/pages/') || 
                       window.location.href.includes('/pages/');
    if (isPagesDir) {
      return target;
    }
    return `pages/${target}`;
  },

  /**
   * Protect private routes. Redirects to login if not authenticated.
   * If adminOnly is true, verifies currentUser.role === 'ADMIN'.
   * @param {boolean} adminOnly 
   * @returns {Object|null} Returns currentUser if allowed, otherwise null
   */
  requireAuth(adminOnly = false) {
    const user = Storage.getCurrentUser();

    if (!user) {
      console.warn('[Guard] Not authenticated. Redirecting to login...');
      window.location.replace(this.getRelativePage('login.html'));
      return null;
    }

    if (adminOnly && user.role !== 'ADMIN') {
      console.warn('[Guard] Admin access required. User role is not ADMIN.');
      alert('Access Denied: You do not have administrator permissions to view this page.');
      window.location.replace(this.getRelativePage('dashboard.html'));
      return null;
    }

    return user;
  },

  /**
   * Redirect logged-in users away from auth pages (login, register, forgot-password)
   */
  requireGuest() {
    const user = Storage.getCurrentUser();
    if (user) {
      console.log('[Guard] Already logged in. Redirecting to dashboard...');
      window.location.replace(this.getRelativePage('dashboard.html'));
      return false;
    }
    return true;
  }
};

window.Guard = Guard;
