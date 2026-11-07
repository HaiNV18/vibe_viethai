/**
 * FILE: js/tour-detail.js
 * MÔ TẢ: Xử lý trang Chi Tiết Tour (tour-detail.html)
 * - Hiển thị điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Boeing, Airbus...)
 * - Hiển thị lịch trình chuyến đi chi tiết từng ngày
 * - Chọn tour sẽ được lưu vào Giỏ Hàng (cart_items trong SQLite)
 */

let currentTour = null;

document.addEventListener('DOMContentLoaded', async () => {
  VietjetApp.renderHeader('tours');
  VietjetApp.renderFooter();

  try {
    await VietjetDB.init();
    VietjetApp.updateCartBadge();

    const tourId = VietjetApp.getQueryParam('id') || 1;
    currentTour = VietjetDB.getTourById(tourId);

    if (!currentTour) {
      const allTours = VietjetDB.getFeaturedTours(8);
      currentTour = allTours[0];
    }

    renderTourDetail();
  } catch (err) {
    console.error('Lỗi tải chi tiết tour:', err);
  }
});

function renderTourDetail() {
  const container = document.getElementById('tour-detail-content');
  if (!container || !currentTour) return;

  let itineraryDays = [];
  try {
    itineraryDays = JSON.parse(currentTour.itinerary || '[]');
  } catch (e) {
    itineraryDays = [];
  }

  container.innerHTML = `
    <!-- Khối Tổng Quan Tour & Thông Tin Hàng Không -->
    <div class="detail-card">
      <div style="display:grid;grid-template-columns:1fr 1.25fr;gap:28px;align-items:center;" class="tour-detail-top-grid">
        <div style="border-radius:var(--radius-lg);overflow:hidden;border:2px solid var(--border-color);aspect-ratio:3/2;">
          <img
            src="${currentTour.thumbnail}"
            alt="${currentTour.title}"
            width="600"
            height="400"
            style="width:100%;height:100%;object-fit:cover;"
            onerror="this.src='images/vietjet-may-bay.jpg'"
          />
        </div>

        <div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
            <span class="badge-tag red">🏢 Hãng lữ hành: ${currentTour.travel_agency}</span>
            <span class="badge-tag">⏱ ${currentTour.duration_days}</span>
          </div>

          <h2 style="font-size:1.6rem;font-weight:800;line-height:1.3;margin-bottom:14px;">
            ${currentTour.title}
          </h2>

          <div style="padding:14px 18px;background:var(--primary-red-light);border:1px solid var(--primary-red-border);border-radius:var(--radius-md);margin-bottom:18px;">
            <div style="font-size:0.84rem;color:var(--text-muted);">Giá trọn gói (Bao gồm vé máy bay khứ hồi)</div>
            <div style="font-size:1.95rem;font-weight:800;color:var(--primary-red);">
              ${VietjetApp.formatCurrency(currentTour.price)} <span style="font-size:0.9rem;font-weight:600;color:var(--text-body);">/ khách</span>
            </div>
          </div>

          <p style="font-size:0.92rem;color:var(--text-body);margin-bottom:18px;">
            <strong>🎁 Dịch vụ trọn gói:</strong> ${currentTour.services}
          </p>

          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
            <div>
              <label for="tour-guest-qty" style="font-size:0.78rem;font-weight:700;color:var(--text-muted);display:block;">SỐ LƯỢNG KHÁCH</label>
              <input type="number" id="tour-guest-qty" class="form-control" value="1" min="1" max="20" style="width:95px;height:46px;" />
            </div>

            <button type="button" class="btn-primary-red" style="height:48px;padding:0 28px;margin-top:16px;" onclick="handleAddTourToCart()">
              🛒 Chọn Tour (Lưu vào Giỏ Hàng)
            </button>
          </div>
        </div>
      </div>

      <!-- 6 Ô Thông Tin Điểm Đi, Điểm Đến, Thời Gian Bay, Hãng Bay, Loại Máy Bay -->
      <div class="detail-summary-grid" style="grid-template-columns:repeat(3, 1fr);margin-top:26px;">
        <div class="detail-info-box">
          <div class="detail-info-label">Điểm Đi → Điểm Đến</div>
          <div class="detail-info-value">📍 ${currentTour.from_city} → ${currentTour.to_city}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-label">Hãng Bay Khai Thác</div>
          <div class="detail-info-value">✈️ ${currentTour.airline_name} (${currentTour.airline_code})</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-label">Loại Máy Bay (Boeing / Airbus)</div>
          <div class="detail-info-value" style="color:var(--primary-red);">🛩 ${currentTour.aircraft}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-label">Ngày Cất Cánh & Giờ Bay</div>
          <div class="detail-info-value">📅 ${VietjetApp.formatDate(currentTour.departure_date)} – ${currentTour.departure_time}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-label">Thời Gian Bay Dự Kiến</div>
          <div class="detail-info-value">⏱ ${currentTour.flight_duration}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-label">Thời Lượng Chuyến Đi</div>
          <div class="detail-info-value">🌴 ${currentTour.duration_days}</div>
        </div>
      </div>
    </div>

    <!-- KHỐI LỊCH TRÌNH CHUYẾN ĐI CHI TIẾT -->
    <div class="detail-card">
      <div class="section-title-wrap" style="margin-bottom:10px;">
        <span class="section-tag">CHƯƠNG TRÌNH THAM QUAN</span>
        <h2 class="section-title">Lịch Trình Chuyến Đi Chi Tiết</h2>
      </div>
      <p style="color:var(--text-muted);font-size:0.92rem;">
        Hành trình khởi hành từ <strong>${currentTour.from_city}</strong> đến <strong>${currentTour.to_city}</strong> trên tàu bay <strong>${currentTour.aircraft}</strong> của hãng <strong>${currentTour.airline_name}</strong>:
      </p>

      <div class="itinerary-timeline">
        ${itineraryDays
          .map(
            (item) => `
            <div class="itinerary-day-card">
              <span class="itinerary-day-badge">${item.day}</span>
              <h3 class="itinerary-day-title">${item.title}</h3>
              <p class="itinerary-day-detail">${item.detail}</p>
            </div>
          `
          )
          .join('')}
      </div>

      <div style="margin-top:26px;text-align:right;">
        <button type="button" class="btn-primary-red" style="height:50px;padding:0 32px;" onclick="handleAddTourToCart()">
          🛒 Chọn Tour Này & Đi Tới Giỏ Hàng →
        </button>
      </div>
    </div>
  `;
}

function handleAddTourToCart() {
  if (!currentTour) return;

  const qty = Math.max(1, parseInt(document.getElementById('tour-guest-qty')?.value || '1', 10));

  VietjetDB.addToCart({
    item_type: 'tour',
    item_id: currentTour.id,
    title: `Tour: ${currentTour.title}`,
    airline_name: `${currentTour.airline_name} (${currentTour.travel_agency})`,
    departure_info: `Khởi hành ${VietjetApp.formatDate(currentTour.departure_date)} lúc ${currentTour.departure_time} | Thời gian bay: ${currentTour.flight_duration} | ${currentTour.duration_days}`,
    aircraft: currentTour.aircraft,
    service_class: `Trọn gói Tour (${currentTour.duration_days})`,
    quantity: qty,
    unit_price: currentTour.price
  });

  VietjetApp.updateCartBadge();
  window.location.href = 'cart.html';
}
