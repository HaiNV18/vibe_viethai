/**
 * FILE: js/app.js
 * MÔ TẢ: Các hàm tiện ích dùng chung cho toàn bộ website Vietjet
 * (Header, Footer, định dạng tiền tệ VNĐ, cập nhật số lượng Giỏ hàng).
 */

const VietjetApp = (() => {
  /**
   * Định dạng số tiền sang chuẩn Việt Nam Đồng (VD: 1.290.000 ₫)
   */
  function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return num.toLocaleString('vi-VN') + ' ₫';
  }

  /**
   * Định dạng ngày YYYY-MM-DD sang DD/MM/YYYY
   */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  /**
   * Lấy giá trị tham số từ URL Query String
   */
  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  /**
   * Cập nhật số lượng sản phẩm trên badge Giỏ hàng ở Header
   */
  function updateCartBadge() {
    try {
      const items = VietjetDB.getCartItems();
      const totalCount = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
      const badges = document.querySelectorAll('.cart-count-badge');
      badges.forEach((el) => {
        el.textContent = totalCount;
      });
    } catch (e) {
      // Bỏ qua nếu DB chưa sẵn sàng
    }
  }

  /**
   * Render Header dùng chung cho 6 trang
   */
  function renderHeader(activePage = 'home') {
    const headerPlaceholder = document.getElementById('app-header');
    if (!headerPlaceholder) return;

    headerPlaceholder.innerHTML = `
      <div class="top-strip">
        <div class="container top-strip-inner">
          <div>
            <span class="top-strip-badge">BAY LÀ THÍCH NGAY!</span>
            <span>Đặt vé máy bay & Tour du lịch trọn gói Vietjet – Giá tốt nhất mỗi ngày</span>
          </div>
          <div>
            <span>Hotline: <strong>1900 1886</strong> | Email: <strong>nvhai061993@gmail.com</strong></span>
          </div>
        </div>
      </div>

      <header class="site-header">
        <div class="container navbar">
          <a href="index.html" class="brand-logo">
            <img src="images/vietjet-logo.jpg" alt="Vietjet Logo" onerror="this.style.display='none'" />
            <div class="brand-text">
              <span class="brand-title">VIETJET TRAVEL</span>
              <span class="brand-subtitle">Chuyến bay & Tour Du lịch</span>
            </div>
          </a>

          <nav class="nav-menu">
            <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">
              <span>🏠</span> Trang chủ
            </a>
            <a href="flights.html" class="nav-link ${activePage === 'flights' ? 'active' : ''}">
              <span>✈️</span> Chuyến bay
            </a>
            <a href="tours.html" class="nav-link ${activePage === 'tours' ? 'active' : ''}">
              <span>🌴</span> Tour du lịch
            </a>
          </nav>

          <a href="cart.html" class="nav-cart-btn ${activePage === 'cart' ? 'active' : ''}">
            <span>🛒 Giỏ hàng</span>
            <span class="cart-count-badge">0</span>
          </a>
        </div>
      </header>
    `;

    updateCartBadge();
  }

  /**
   * Render Footer dùng chung cho 6 trang
   */
  function renderFooter() {
    const footerPlaceholder = document.getElementById('app-footer');
    if (!footerPlaceholder) return;

    footerPlaceholder.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
                <img src="images/vietjet-logo.jpg" alt="Vietjet" style="height:42px;border-radius:6px;background:#fff;padding:3px;" />
                <span style="font-size:1.3rem;font-weight:800;color:#ffffff;">VIETJET TRAVEL</span>
              </div>
              <p style="font-size:0.9rem;color:#9ca3af;margin-bottom:12px;">
                Hệ thống đặt vé máy bay và tour du lịch trực tuyến hàng đầu. Kết nối hàng trăm điểm đến trong nước và quốc tế với chi phí tiết kiệm nhất.
              </p>
              <p style="font-size:0.86rem;color:#fca5a5;">
                ✉️ Hỗ trợ đặt vé: <strong>nvhai061993@gmail.com</strong>
              </p>
            </div>

            <div>
              <h4 class="footer-title">Khám Phá</h4>
              <ul class="footer-links">
                <li><a href="index.html">Trang chủ Vietjet</a></li>
                <li><a href="flights.html">Tìm kiếm Chuyến bay</a></li>
                <li><a href="tours.html">Tour Du lịch Nổi bật</a></li>
                <li><a href="cart.html">Giỏ hàng & Đăng ký</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-title">Đối Tác Hàng Không</h4>
              <ul class="footer-links">
                <li><a href="flights.html?airline=VJ">VietJet Air</a></li>
                <li><a href="flights.html?airline=VN">Vietnam Airlines</a></li>
                <li><a href="flights.html?airline=SQ">Singapore Airlines</a></li>
                <li><a href="flights.html?airline=QH">Bamboo Airways</a></li>
                <li><a href="flights.html?airline=KE">Korean Air</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-title">Thông Tin Liên Hệ</h4>
              <ul class="footer-links">
                <li>📍 302 Kim Mã, Ba Đình, Hà Nội / Sân bay Tân Sơn Nhất, TP.HCM</li>
                <li>📞 Tổng đài 24/7: 1900 1886</li>
                <li>📧 Email xác nhận: nvhai061993@gmail.com</li>
                <li>🗄️ Cơ sở dữ liệu: SQLite (db.db)</li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            © 2026 Vietjet Travel & Flights. Xây dựng bằng HTML, CSS, JavaScript thuần & SQLite (db.db).
          </div>
        </div>
      </footer>
    `;
  }

  return {
    formatCurrency,
    formatDate,
    getQueryParam,
    updateCartBadge,
    renderHeader,
    renderFooter
  };
})();
