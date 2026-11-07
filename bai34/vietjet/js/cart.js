/**
 * FILE: js/cart.js
 * MÔ TẢ: Xử lý trang Giỏ Hàng (cart.html):
 * - Xem các chuyến bay, tour đã chọn từ bảng cart_items trong SQLite.
 * - Có thể xóa từng mục hoặc xóa toàn bộ giỏ hàng.
 * - Nhập thông tin cá nhân -> Nhấn Đăng ký -> Thông báo hoàn thành.
 * - Hiển thị Email gửi từ nvhai061993@gmail.com đến email của khách hàng.
 */

document.addEventListener('DOMContentLoaded', async () => {
  VietjetApp.renderHeader('cart');
  VietjetApp.renderFooter();

  try {
    await VietjetDB.init();
    VietjetApp.updateCartBadge();

    renderCartPage();
    bindRegistrationForm();
  } catch (err) {
    console.error('Lỗi tải trang giỏ hàng:', err);
  }
});

/**
 * Hiển thị danh sách Chuyến bay & Tour trong Giỏ Hàng
 */
function renderCartPage() {
  const items = VietjetDB.getCartItems();
  const container = document.getElementById('cart-items-container');
  const countSpan = document.getElementById('cart-items-count');
  const summaryQty = document.getElementById('summary-item-qty');
  const summaryTotal = document.getElementById('summary-grand-total');
  const clearBtn = document.getElementById('btn-clear-cart');
  const submitBtn = document.getElementById('btn-submit-booking');

  const totalCount = items.reduce((sum, i) => sum + Number(i.quantity || 1), 0);
  const grandTotal = items.reduce((sum, i) => sum + Number(i.unit_price) * Number(i.quantity || 1), 0);

  if (countSpan) countSpan.textContent = totalCount;
  if (summaryQty) summaryQty.textContent = `${totalCount} dịch vụ`;
  if (summaryTotal) summaryTotal.textContent = VietjetApp.formatCurrency(grandTotal);

  if (clearBtn) clearBtn.style.display = items.length > 0 ? 'inline-block' : 'none';
  if (submitBtn) submitBtn.disabled = items.length === 0;

  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="detail-card" style="text-align:center;padding:48px 24px;">
        <div style="font-size:3.2rem;margin-bottom:10px;">🛒</div>
        <h3 style="margin-bottom:8px;">Giỏ hàng của bạn đang trống</h3>
        <p style="color:var(--text-muted);margin-bottom:22px;">
          Hãy chọn thêm Chuyến bay hoặc Tour du lịch nổi bật để tiến hành đăng ký đặt chỗ.
        </p>
        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
          <a href="flights.html" class="btn-primary-red">✈️ Chọn Chuyến Bay</a>
          <a href="tours.html" class="btn-outline-red">🌴 Chọn Tour Du Lịch</a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const isFlight = item.item_type === 'flight';
      const badgeLabel = isFlight ? '✈️ CHUYẾN BAY' : '🌴 TOUR DU LỊCH';
      const lineTotal = Number(item.unit_price) * Number(item.quantity || 1);

      return `
        <div class="cart-item-card">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <span class="cart-item-type-badge">${badgeLabel}</span>
              <span class="badge-tag">${item.service_class}</span>
              ${item.aircraft ? `<span class="badge-tag">🛩 ${item.aircraft}</span>` : ''}
            </div>

            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-meta">
              <strong>Hãng:</strong> ${item.airline_name} &nbsp;|&nbsp; <strong>Lịch trình:</strong> ${item.departure_info}
            </div>
            <div class="cart-item-meta" style="margin-top:4px;">
              Đơn giá: <strong>${VietjetApp.formatCurrency(item.unit_price)}</strong> × Số lượng: <strong>${item.quantity}</strong>
            </div>
          </div>

          <div class="cart-item-actions">
            <div style="font-size:1.25rem;font-weight:800;color:var(--primary-red);">
              ${VietjetApp.formatCurrency(lineTotal)}
            </div>
            <button type="button" class="btn-remove-item" onclick="handleRemoveItem(${item.id})">
              ✕ Xóa mục này
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

/**
 * Xóa 1 mục khỏi giỏ hàng
 */
function handleRemoveItem(cartId) {
  VietjetDB.removeCartItem(cartId);
  VietjetApp.updateCartBadge();
  renderCartPage();
}

/**
 * Xóa toàn bộ giỏ hàng
 */
function handleClearAllCart() {
  const items = VietjetDB.getCartItems();
  if (items.length === 0) return;
  VietjetDB.clearCart();
  VietjetApp.updateCartBadge();
  renderCartPage();
}

/**
 * Xử lý sự kiện nhấn nút "Đăng ký"
 */
function bindRegistrationForm() {
  const form = document.getElementById('checkout-registration-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const items = VietjetDB.getCartItems();
    if (items.length === 0) {
      alert('Giỏ hàng của bạn đang trống. Vui lòng chọn ít nhất 1 chuyến bay hoặc tour trước khi đăng ký!');
      return;
    }

    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const note = document.getElementById('customer-note').value.trim();

    if (!name || !email || !phone) {
      alert('Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại!');
      return;
    }

    // Lưu vào bảng bookings trong SQLite và xóa giỏ hàng
    const bookingResult = VietjetDB.createBooking({
      name,
      email,
      phone,
      note
    });

    VietjetApp.updateCartBadge();
    renderCartPage();
    form.reset();

    // Hiển thị thông báo hoàn thành ngay trên trang
    const successBanner = document.getElementById('booking-success-banner');
    if (successBanner) {
      successBanner.style.display = 'block';
      successBanner.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <h3 style="font-size:1.15rem;font-weight:800;margin-bottom:4px;">
              ✅ Thông báo: Đăng ký đặt chỗ hoàn thành! (Mã đơn: ${bookingResult.bookingCode})
            </h3>
            <p style="font-size:0.92rem;">
              Hệ thống đã gửi email xác nhận từ <strong>${bookingResult.senderEmail}</strong> đến địa chỉ <strong>${bookingResult.customerEmail}</strong>.
            </p>
          </div>
          <button type="button" class="btn-primary-red" onclick="openEmailModal()">
            📧 Xem lại nội dung Email
          </button>
        </div>
      `;
    }

    // Hiển thị Modal Email gửi từ nvhai061993@gmail.com đến email khách hàng
    renderEmailConfirmationModal(bookingResult);
    openEmailModal();
  });
}

function renderEmailConfirmationModal(booking) {
  const modalBody = document.getElementById('email-modal-content');
  if (!modalBody) return;

  const itemsHtml = booking.items
    .map(
      (item, idx) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;">${idx + 1}</td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;">
          <strong>${item.title}</strong><br/>
          <span style="font-size:0.8rem;color:#64748b;">${item.airline_name} | ${item.service_class} ${item.aircraft ? `| ${item.aircraft}` : ''}</span>
        </td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;">${item.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;color:#ee1d23;">
          ${VietjetApp.formatCurrency(item.unit_price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('');

  modalBody.innerHTML = `
    <div class="email-envelope-box">
      <div class="email-meta-line">
        <strong>Từ (From):</strong>
        <span style="font-weight:800;color:var(--primary-red);">Vietjet Travel &lt;${booking.senderEmail}&gt;</span>
      </div>
      <div class="email-meta-line">
        <strong>Đến (To):</strong>
        <span style="font-weight:700;color:var(--text-dark);">${booking.customerName} &lt;${booking.customerEmail}&gt;</span>
      </div>
      <div class="email-meta-line">
        <strong>Tiêu đề:</strong>
        <span style="font-weight:700;">[Vietjet] Xác nhận đăng ký Chuyến bay & Tour thành công – Mã đơn #${booking.bookingCode}</span>
      </div>
      <div class="email-meta-line" style="margin-bottom:0;">
        <strong>Thời gian:</strong>
        <span>${booking.createdAt}</span>
      </div>
    </div>

    <div style="font-size:0.94rem;color:var(--text-body);">
      <p style="margin-bottom:12px;">
        Xin chào <strong>${booking.customerName}</strong>,
      </p>
      <p style="margin-bottom:14px;">
        Cảm ơn quý khách đã tin tưởng lựa chọn dịch vụ của <strong>Vietjet</strong>. Đơn đăng ký đặt vé máy bay / tour du lịch của quý khách đã được ghi nhận hoàn tất với thông tin chi tiết dưới đây:
      </p>

      <div style="background:#f8fafc;padding:12px 16px;border-radius:8px;margin-bottom:16px;border:1px solid #e2e8f0;">
        <div><strong>👤 Hành khách:</strong> ${booking.customerName}</div>
        <div><strong>📞 Điện thoại:</strong> ${booking.customerPhone}</div>
        <div><strong>📧 Email nhận vé:</strong> ${booking.customerEmail}</div>
        ${booking.customerNote ? `<div><strong>📝 Ghi chú:</strong> ${booking.customerNote}</div>` : ''}
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:0.88rem;margin-bottom:18px;">
        <thead>
          <tr style="background:#fee2e2;color:#ee1d23;text-align:left;">
            <th style="padding:10px;">#</th>
            <th style="padding:10px;">Chuyến bay / Tour đã đặt</th>
            <th style="padding:10px;text-align:center;">SL</th>
            <th style="padding:10px;text-align:right;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:12px 10px;text-align:right;font-weight:800;font-size:1rem;">TỔNG CỘNG THANH TOÁN:</td>
            <td style="padding:12px 10px;text-align:right;font-weight:800;font-size:1.15rem;color:#ee1d23;">
              ${VietjetApp.formatCurrency(booking.totalAmount)}
            </td>
          </tr>
        </tfoot>
      </table>

      <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:20px;">
        Mọi thắc mắc xin vui lòng phản hồi trực tiếp về địa chỉ email <strong>${booking.senderEmail}</strong> hoặc gọi tổng đài 1900 1886. Chúc quý khách có một chuyến bay và kỳ nghỉ tuyệt vời cùng Vietjet!
      </p>

      <div style="display:flex;justify-content:flex-end;gap:12px;flex-wrap:wrap;">
        <a
          href="mailto:${encodeURIComponent(booking.customerEmail)}?cc=${encodeURIComponent(booking.senderEmail)}&subject=${encodeURIComponent('[Vietjet] Xác nhận đặt chỗ #' + booking.bookingCode)}&body=${encodeURIComponent('Người gửi: nvhai061993@gmail.com\nKhách hàng: ' + booking.customerName + '\nMã đặt chỗ: ' + booking.bookingCode + '\nTổng thanh toán: ' + VietjetApp.formatCurrency(booking.totalAmount))}"
          class="btn-outline-red"
        >
          ✉️ Mở ứng dụng Mail
        </a>
        <button type="button" class="btn-primary-red" onclick="closeEmailModal()">
          Đóng thông báo
        </button>
      </div>
    </div>
  `;
}

function openEmailModal() {
  const modal = document.getElementById('email-confirmation-modal');
  if (modal) modal.classList.add('open');
}

function closeEmailModal() {
  const modal = document.getElementById('email-confirmation-modal');
  if (modal) modal.classList.remove('open');
}
