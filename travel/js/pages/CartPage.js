import { CartService } from '../services/CartService.js';
import { BookingService } from '../services/BookingService.js';
import { AuthService } from '../services/AuthService.js';
import { CartItem } from '../components/CartItem.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { Toast } from '../components/Toast.js';

export const CartPage = {
  async render() {
    const cart = CartService.getCart();
    const currentUser = AuthService.getCurrentUser();
    const totalAmount = CartService.getTotal();
    const isEmpty = cart.flights.length === 0 && cart.tours.length === 0;

    if (isEmpty) {
      return `
        <div class="container" style="padding:var(--spacing-12) 0;">
          <div class="empty-state">
            <i class="fa-solid fa-cart-shopping"></i>
            <h3>Giỏ hàng của bạn đang trống</h3>
            <p>Hãy khám phá các chuyến bay giá tốt và tour du lịch tuyệt vời cùng TravelViet ngay hôm nay!</p>
            <div style="display:flex; gap:var(--spacing-4); justify-content:center; margin-top:var(--spacing-6);">
              <a href="/flights" class="btn btn-primary" data-link><i class="fa-solid fa-plane"></i> Tìm chuyến bay</a>
              <a href="/tours" class="btn btn-secondary" data-link><i class="fa-solid fa-map-location-dot"></i> Khám phá tour</a>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="container" style="padding:var(--spacing-8) 0 var(--spacing-12);" id="cart-page-wrapper">
        <h2><i class="fa-solid fa-cart-shopping"></i> Giỏ Hàng & Đăng Ký Đặt Dịch Vụ</h2>
        
        <div class="cart-layout" style="margin-top:var(--spacing-6);">
          <!-- Left Column: Cart Items List -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--spacing-4);">
              <h3>Danh sách dịch vụ đã chọn</h3>
              <button class="btn btn-outline btn-sm" id="clear-all-cart-btn" style="color:var(--danger-color); border-color:#f8d7da;">
                <i class="fa-solid fa-trash-can"></i> Xóa toàn bộ
              </button>
            </div>

            <!-- Flights Group -->
            ${cart.flights.length > 0 ? `
              <div style="margin-bottom:var(--spacing-6);">
                <h4 style="margin-bottom:var(--spacing-3); color:var(--primary-color);"><i class="fa-solid fa-plane"></i> Chuyến bay (${cart.flights.length})</h4>
                ${cart.flights.map(item => CartItem.renderFlightItem(item)).join('')}
              </div>
            ` : ''}

            <!-- Tours Group -->
            ${cart.tours.length > 0 ? `
              <div style="margin-bottom:var(--spacing-6);">
                <h4 style="margin-bottom:var(--spacing-3); color:var(--secondary-color);"><i class="fa-solid fa-map-location-dot"></i> Tour du lịch (${cart.tours.length})</h4>
                ${cart.tours.map(item => CartItem.renderTourItem(item)).join('')}
              </div>
            ` : ''}

            <!-- Customer Booking Form -->
            <div class="card" style="padding:var(--spacing-6); margin-top:var(--spacing-8);">
              <h3 style="margin-bottom:var(--spacing-4);"><i class="fa-solid fa-user-pen"></i> Thông tin người đặt dịch vụ</h3>
              <form id="booking-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="cust-name">Họ và tên *</label>
                    <input type="text" class="form-control" id="cust-name" value="${currentUser?.full_name || ''}" placeholder="Nhập họ và tên đầy đủ" required>
                  </div>
                  <div class="form-group">
                    <label for="cust-email">Email *</label>
                    <input type="email" class="form-control" id="cust-email" value="${currentUser?.email || ''}" placeholder="example@email.com" required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="cust-phone">Số điện thoại *</label>
                    <input type="tel" class="form-control" id="cust-phone" value="${currentUser?.phone || ''}" placeholder="0901234567" required>
                  </div>
                  <div class="form-group">
                    <label for="cust-country">Quốc gia *</label>
                    <input type="text" class="form-control" id="cust-country" value="${currentUser?.country || 'Vietnam'}" required>
                  </div>
                </div>

                <div class="form-group">
                  <label for="cust-address">Địa chỉ liên hệ</label>
                  <input type="text" class="form-control" id="cust-address" value="${currentUser?.address || ''}" placeholder="Nhập địa chỉ nhận vé/xác nhận">
                </div>

                <div class="form-group">
                  <label for="cust-note">Ghi chú bổ sung</label>
                  <textarea class="form-control" id="cust-note" rows="2" placeholder="Yêu cầu đặc biệt về suất ăn, ghế ngồi..."></textarea>
                </div>

                <button type="submit" class="btn btn-accent btn-full btn-lg" style="margin-top:var(--spacing-4); font-weight:700;">
                  <i class="fa-solid fa-check-circle"></i> Hoàn Tất Đăng Ký Đặt Dịch Vụ
                </button>
              </form>
            </div>
          </div>

          <!-- Right Column: Order Summary -->
          <div>
            <div class="summary-card">
              <h3 style="margin-bottom:var(--spacing-4);">Tóm tắt đơn hàng</h3>

              <div class="summary-row">
                <span>Số lượng sản phẩm:</span>
                <strong>${CartService.getItemCount()} dịch vụ</strong>
              </div>

              <div class="summary-row">
                <span>Tạm tính:</span>
                <strong>${formatCurrency(totalAmount)}</strong>
              </div>

              <div class="summary-row">
                <span>Thuế & Phí dịch vụ:</span>
                <span class="badge badge-success">Đã bao gồm</span>
              </div>

              <div class="summary-row total">
                <span>Tổng tiền thanh toán:</span>
                <span>${formatCurrency(totalAmount)}</span>
              </div>

              <div style="margin-top:var(--spacing-6); font-size:var(--font-xs); color:var(--text-muted); text-align:center;">
                <p><i class="fa-solid fa-shield-halved"></i> Giao dịch bảo mật 100%</p>
                <p>Email xác nhận sẽ được gửi sau khi hoàn tất đặt dịch vụ.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initEvents() {
    // Remove single item button listeners
    document.querySelectorAll('.remove-cart-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        CartService.removeItem(id);
        Toast.success('Đã xóa dịch vụ khỏi giỏ hàng.');
        window.location.reload();
      });
    });

    // Clear all button listener
    const clearBtn = document.getElementById('clear-all-cart-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dịch vụ trong giỏ hàng?')) {
          CartService.clearCart();
          Toast.success('Đã xóa toàn bộ giỏ hàng.');
          window.location.reload();
        }
      });
    }

    // Submit booking form
    const form = document.getElementById('booking-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const customerInfo = {
          customer_name: document.getElementById('cust-name').value.trim(),
          customer_email: document.getElementById('cust-email').value.trim(),
          customer_phone: document.getElementById('cust-phone').value.trim(),
          country: document.getElementById('cust-country').value.trim(),
          address: document.getElementById('cust-address').value.trim(),
          note: document.getElementById('cust-note').value.trim()
        };

        try {
          const res = await BookingService.processBooking(customerInfo);

          // Render Success Screen
          const wrapper = document.getElementById('cart-page-wrapper');
          if (wrapper) {
            wrapper.innerHTML = `
              <div class="card" style="padding:var(--spacing-8); text-align:center; max-width:640px; margin:var(--spacing-8) auto;">
                <div style="width:72px; height:72px; border-radius:50%; background:#d1e7dd; color:var(--success-color); display:flex; align-items:center; justify-content:center; font-size:36px; margin:0 auto var(--spacing-4);">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <h2>Đặt Dịch Vụ Thành Công!</h2>
                <p style="font-size:var(--font-base); margin:var(--spacing-3) 0;">Cảm ơn quý khách <strong>${res.customerName}</strong> đã tin tưởng chọn TravelViet.</p>

                <div style="background:var(--bg-color); padding:var(--spacing-5); border-radius:var(--radius-md); text-align:left; margin:var(--spacing-6) 0;">
                  <div class="summary-row">
                    <span>Mã Đơn Hàng (Booking Code):</span>
                    <strong style="color:var(--primary-color); font-size:var(--font-lg);">${res.bookingCode}</strong>
                  </div>
                  <div class="summary-row">
                    <span>Email xác nhận:</span>
                    <strong>${res.customerEmail}</strong>
                  </div>
                  <div class="summary-row total">
                    <span>Tổng tiền thanh toán:</span>
                    <span>${formatCurrency(res.totalAmount)}</span>
                  </div>
                </div>

                <p style="font-size:var(--font-xs); color:var(--text-muted); margin-bottom:var(--spacing-6);">
                  Chúng tôi đã gửi email thông báo chi tiết đơn hàng tới địa chỉ <strong>${res.customerEmail}</strong>. Nhân viên tư vấn của TravelViet sẽ liên hệ xác nhận trong thời gian sớm nhất.
                </p>

                <div style="display:flex; gap:var(--spacing-4); justify-content:center;">
                  <a href="/" class="btn btn-primary" data-link><i class="fa-solid fa-house"></i> Về trang chủ</a>
                  <a href="/tours" class="btn btn-outline" data-link>Tiếp tục khám phá</a>
                </div>
              </div>
            `;
          }
        } catch (err) {
          Toast.error(err.message || 'Có lỗi xảy ra khi đặt dịch vụ.');
        }
      });
    }
  }
};
