export const Footer = {
  render() {
    return `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <h3>Du Lịch Việt — TravelViet</h3>
            <p>Nền tảng tìm kiếm và đặt chuyến bay, tour du lịch uy tín hàng đầu Việt Nam. Mang lại trải nghiệm tuyệt vời cho mọi hành trình của bạn.</p>
          </div>
          <div class="footer-col">
            <h4>Khám phá</h4>
            <div class="footer-links">
              <a href="/flights" data-link>Vé máy bay nội địa</a>
              <a href="/flights" data-link>Vé máy bay quốc tế</a>
              <a href="/tours" data-link>Tour nổi bật</a>
              <a href="/tours" data-link>Tour giá tốt</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Tài khoản</h4>
            <div class="footer-links">
              <a href="/login" data-link>Đăng nhập</a>
              <a href="/register" data-link>Đăng ký</a>
              <a href="/cart" data-link>Giỏ hàng</a>
              <a href="/profile" data-link>Trang cá nhân</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Liên hệ</h4>
            <p><i class="fa-solid fa-location-dot"></i> Tầng 8, Tòa nhà TravelViet, Hà Nội</p>
            <p><i class="fa-solid fa-phone"></i> Hotline: 1900 6868</p>
            <p><i class="fa-solid fa-envelope"></i> Email: nvhai061993@gmail.com</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Du Lịch Việt — TravelViet. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    `;
  }
};
