/**
 * Utility functions for Video Admin
 */

const Utils = {
  /**
   * Format file size in bytes to human-readable string (B, KB, MB, GB)
   * @param {number|string} bytes 
   * @returns {string}
   */
  formatBytes(bytes) {
    const num = Number(bytes);
    if (isNaN(num) || num <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(num) / Math.log(1024));
    const formatted = (num / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2);
    return `${formatted} ${units[i]}`;
  },

  /**
   * Format numbers with commas (e.g., 12500 -> 12,500)
   * @param {number|string} num 
   * @returns {string}
   */
  formatNumber(num) {
    const n = Number(num);
    if (isNaN(n)) return '0';
    return n.toLocaleString('en-US');
  },

  /**
   * Format date string to YYYY-MM-DD
   * @param {string|Date} date 
   * @returns {string}
   */
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toISOString().split('T')[0];
  },

  /**
   * Generate URL friendly slug from string
   * e.g., "Web Development" -> "web-development"
   * @param {string} text 
   * @returns {string}
   */
  slugify(text) {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} str 
   * @returns {string}
   */
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Debounce function execution
   * @param {Function} func 
   * @param {number} wait 
   * @returns {Function}
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Get query parameter from current URL
   * @param {string} name 
   * @returns {string|null}
   */
  getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  /**
   * Get today's date formatted as YYYY-MM-DD
   * @returns {string}
   */
  getTodayDateString() {
    return new Date().toISOString().split('T')[0];
  }
};

window.Utils = Utils;
