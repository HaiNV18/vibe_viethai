/**
 * FILE: js/flight-detail.js
 * MÔ TẢ: Xử lý trang Chi Tiết Chuyến Bay (flight-detail.html):
 * - Hiển thị điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Boeing, Airbus...)
 * - Chọn giá vé: Hạng Phổ Thông, Hạng Thương Gia (thiết kế trực quan 2 cột hạng vé)
 * - Chọn chuyến bay sẽ được lưu vào Giỏ Hàng (cart_items trong SQLite)
 */

let currentFlight = null;
let selectedClass = 'economy'; // 'economy' | 'business'

document.addEventListener('DOMContentLoaded', async () => {
  VietjetApp.renderHeader('flights');
  VietjetApp.renderFooter();

  try {
    await VietjetDB.init();
    VietjetApp.updateCartBadge();

    const flightId = VietjetApp.getQueryParam('id') || 1;
    const initialClass = VietjetApp.getQueryParam('class');
    if (initialClass === 'business' || initialClass === 'economy') {
      selectedClass = initialClass;
    }

    currentFlight = VietjetDB.getFlightById(flightId);
    if (!currentFlight) {
      // Nếu không truyền id hoặc id không tồn tại, lấy chuyến bay đầu tiên
      const all = VietjetDB.filterFlights({});
      currentFlight = all[0];
    }

    renderFlightDetail();
  } catch (err) {
    console.error('Lỗi tải chi tiết chuyến bay:', err);
  }
});

function renderFlightDetail() {
  const container = document.getElementById('flight-detail-content');
  if (!container || !currentFlight) return;

  const tripLabel = currentFlight.trip_type === 'round-trip' ? 'Vé khứ hồi' : 'Vé một chiều';
  const routeLabel = currentFlight.route_type === 'direct' ? 'Bay thẳng' : 'Nhiều thành phố';

  container.innerHTML = `
    <!-- Khối Thông Tin Chuyến Bay -->
    <div class="detail-card">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;padding-bottom:20px;border-bottom:2px solid var(--border-color);">
        <div style="display:flex;align-items:center;gap:16px;">
          <img
            src="${currentFlight.airline_logo || 'images/vietjet-logo.jpg'}"
            alt="${currentFlight.airline_name}"
            style="height:52px;max-width:140px;object-fit:contain;padding:6px;border:1px solid var(--border-color);border-radius:10px;background:#fff;"
            onerror="this.src='images/vietjet-logo.jpg'"
          />
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="flight-code-pill" style="font-size:0.9rem;">${currentFlight.flight_code}</span>
              <span class="badge-tag red">${tripLabel}</span>
              <span class="badge-tag">${routeLabel}</span>
            </div>
            <h2 style="font-size:1.5rem;font-weight:800;margin-top:4px;">
              ${currentFlight.from_city} (${currentFlight.from_code}) ✈ ${currentFlight.to_city} (${currentFlight.to_code})
            </h2>
          </div>
        </div>

        <div style="text-align:right;">
          <span style="font-size:0.82rem;color:var(--text-muted);display:block;">Loại tàu bay khai thác</span>
          <strong style="font-size:1.15rem;color:var(--primary-red);">🛩 ${currentFlight.aircraft}</strong>
        </div>
      </div>

      <!-- Lịch bay trực quan -->
      <div class="flight-schedule-col" style="margin-top:22px;padding:22px 28px;">
        <div class="flight-time-point">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;">ĐIỂM ĐI</div>
          <div class="flight-hour" style="font-size:1.85rem;">${currentFlight.departure_time}</div>
          <div class="flight-city-code" style="font-size:1rem;">${currentFlight.from_city} (${currentFlight.from_code})</div>
          <div class="flight-city-name">Ngày cất cánh: ${VietjetApp.formatDate(currentFlight.departure_date)}</div>
        </div>

        <div class="flight-duration-visual">
          <div class="flight-duration-text" style="font-size:0.95rem;">Tổng thời gian bay: <strong>${currentFlight.duration}</strong></div>
          <div class="flight-line-bar" style="margin:12px 0;"></div>
          <div style="font-size:0.84rem;color:var(--text-muted);">
            Hãng khai thác: <strong>${currentFlight.airline_name}</strong> | Máy bay: <strong>${currentFlight.aircraft}</strong>
          </div>
        </div>

        <div class="flight-time-point">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700;">ĐIỂM ĐẾN</div>
          <div class="flight-hour" style="font-size:1.85rem;">${currentFlight.arrival_time}</div>
          <div class="flight-city-code" style="font-size:1rem;">${currentFlight.to_city} (${currentFlight.to_code})</div>
          <div class="flight-city-name">
            ${currentFlight.return_date ? `Ngày về: ${VietjetApp.formatDate(currentFlight.return_date)}` : 'Hành trình một chiều'}
          </div>
        </div>
      </div>

      <!-- 4 Ô Thông tin Tóm tắt -->
      <div class="detail-summary-grid">
        <div class="detail-info-box">
          <div class="detail-info-label">Hãng Hàng Không</div>
          <div class="detail-info-value">🏢 ${currentFlight.airline_name}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-label">Loại Máy Bay</div>
          <div class="detail-info-value">🛩 ${currentFlight.aircraft}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-label">Thời Gian Bay</div>
          <div class="detail-info-value">⏱ ${currentFlight.duration}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-label">Ngày Khởi Hành</div>
          <div class="detail-info-value">📅 ${VietjetApp.formatDate(currentFlight.departure_date)}</div>
        </div>
      </div>

      <div style="margin-top:18px;padding:14px 18px;background:var(--primary-red-light);border-radius:10px;border:1px solid var(--primary-red-border);">
        <strong>🎁 Dịch vụ chuyến bay:</strong> ${currentFlight.services}
      </div>
    </div>

    <!-- KHỐI CHỌN GIÁ VÉ: HẠNG PHỔ THÔNG VS HẠNG THƯƠNG GIA -->
    <div class="detail-card">
      <div class="section-title-wrap" style="margin-bottom:8px;">
        <span class="section-tag">LỰA CHỌN HẠNG VÉ</span>
        <h2 class="section-title">Chọn Giá Vé Phù Hợp Với Bạn</h2>
      </div>
      <p style="color:var(--text-muted);font-size:0.94rem;">
        Nhấn chọn <strong>Hạng Phổ Thông</strong> hoặc <strong>Hạng Thương Gia</strong> bên dưới trước khi lưu chuyến bay vào Giỏ Hàng:
      </p>

      <div class="fare-class-grid">
        <!-- Thẻ 1: Hạng Phổ Thông -->
        <div
          id="fare-card-economy"
          class="fare-option-card ${selectedClass === 'economy' ? 'selected' : ''}"
          onclick="selectFareClass('economy')"
        >
          <div class="fare-option-header">
            <span class="fare-class-name">💺 HẠNG PHỔ THÔNG (ECONOMY)</span>
            <span class="fare-class-badge">TIẾT KIỆM</span>
          </div>
          <div class="fare-option-body">
            <div>
              <div style="font-size:0.84rem;color:var(--text-muted);">Giá vé 1 chiều / 1 hành khách</div>
              <div class="fare-price-display">${VietjetApp.formatCurrency(currentFlight.price_economy)}</div>

              <ul class="fare-perks-list">
                <li><span class="perk-check">✓</span> <span>07kg – 10kg hành lý xách tay tiêu chuẩn</span></li>
                <li><span class="perk-check">✓</span> <span>Ghế ngồi tiêu chuẩn thoải mái trên tàu bay <strong>${currentFlight.aircraft}</strong></span></li>
                <li><span class="perk-check">✓</span> <span>Miễn phí làm thủ tục check-in trực tuyến</span></li>
                <li><span class="perk-check">✓</span> <span>Hỗ trợ đổi ngày/giờ bay linh hoạt (có tính phí chênh lệch)</span></li>
              </ul>
            </div>

            <div style="padding-top:12px;border-top:1px dashed var(--border-color);display:flex;align-items:center;justify-content:space-between;">
              <span style="font-weight:700;color:var(--primary-red);" id="status-text-economy">
                ${selectedClass === 'economy' ? '● Đang được chọn' : '○ Nhấn để chọn hạng vé này'}
              </span>
              <span class="badge-tag red">Phổ Thông</span>
            </div>
          </div>
        </div>

        <!-- Thẻ 2: Hạng Thương Gia -->
        <div
          id="fare-card-business"
          class="fare-option-card ${selectedClass === 'business' ? 'selected' : ''}"
          onclick="selectFareClass('business')"
        >
          <div class="fare-option-header">
            <span class="fare-class-name">👑 HẠNG THƯƠNG GIA (BUSINESS)</span>
            <span class="fare-class-badge">ĐẲNG CẤP VIP</span>
          </div>
          <div class="fare-option-body">
            <div>
              <div style="font-size:0.84rem;color:var(--text-muted);">Trải nghiệm đặc quyền thương gia trọn gói</div>
              <div class="fare-price-display">${VietjetApp.formatCurrency(currentFlight.price_business)}</div>

              <ul class="fare-perks-list">
                <li><span class="perk-check">✓</span> <span><strong>14kg hành lý xách tay + 30kg hành lý ký gửi</strong> miễn phí</span></li>
                <li><span class="perk-check">✓</span> <span><strong>Phòng chờ Thương gia (VIP Lounge)</strong> sang trọng tại sân bay</span></li>
                <li><span class="perk-check">✓</span> <span><strong>Suất ăn nóng cao cấp & đồ uống miễn phí</strong> suốt chuyến bay</span></li>
                <li><span class="perk-check">✓</span> <span>Ưu tiên quầy làm thủ tục, lối đi riêng & ghế ngồi khoang đầu tàu bay <strong>${currentFlight.aircraft}</strong></span></li>
              </ul>
            </div>

            <div style="padding-top:12px;border-top:1px dashed var(--border-color);display:flex;align-items:center;justify-content:space-between;">
              <span style="font-weight:700;color:var(--primary-red);" id="status-text-business">
                ${selectedClass === 'business' ? '● Đang được chọn' : '○ Nhấn để chọn hạng vé này'}
              </span>
              <span class="badge-tag red">Thương Gia</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Thanh xác nhận chọn chuyến bay -->
      <div style="background:var(--bg-light);padding:22px 26px;border-radius:var(--radius-lg);border:1.5px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;">
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
          <div>
            <label for="passenger-qty" style="font-size:0.82rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">
              SỐ HÀNH KHÁCH
            </label>
            <input
              type="number"
              id="passenger-qty"
              class="form-control"
              value="1"
              min="1"
              max="10"
              style="width:100px;height:42px;"
              onchange="updateSelectedSummary()"
            />
          </div>

          <div>
            <div style="font-size:0.84rem;color:var(--text-muted);">
              Hạng vé đã chọn: <strong id="summary-class-label" style="color:var(--primary-red);">
                ${selectedClass === 'business' ? 'Hạng Thương Gia' : 'Hạng Phổ Thông'}
              </strong>
            </div>
            <div style="font-size:1.5rem;font-weight:800;color:var(--primary-red);" id="summary-total-price">
              ${VietjetApp.formatCurrency(
                selectedClass === 'business' ? currentFlight.price_business : currentFlight.price_economy
              )}
            </div>
          </div>
        </div>

        <button type="button" class="btn-primary-red" style="height:52px;padding:0 32px;font-size:1.05rem;" onclick="handleAddFlightToCart()">
          🛒 Chọn Chuyến Bay (Lưu vào Giỏ Hàng)
        </button>
      </div>
    </div>
  `;
}

function selectFareClass(cls) {
  selectedClass = cls;
  const ecoCard = document.getElementById('fare-card-economy');
  const bizCard = document.getElementById('fare-card-business');
  const ecoStatus = document.getElementById('status-text-economy');
  const bizStatus = document.getElementById('status-text-business');

  if (cls === 'economy') {
    ecoCard?.classList.add('selected');
    bizCard?.classList.remove('selected');
    if (ecoStatus) ecoStatus.textContent = '● Đang được chọn';
    if (bizStatus) bizStatus.textContent = '○ Nhấn để chọn hạng vé này';
  } else {
    bizCard?.classList.add('selected');
    ecoCard?.classList.remove('selected');
    if (bizStatus) bizStatus.textContent = '● Đang được chọn';
    if (ecoStatus) ecoStatus.textContent = '○ Nhấn để chọn hạng vé này';
  }

  updateSelectedSummary();
}

function updateSelectedSummary() {
  if (!currentFlight) return;
  const qty = Math.max(1, parseInt(document.getElementById('passenger-qty')?.value || '1', 10));
  const unitPrice = selectedClass === 'business' ? currentFlight.price_business : currentFlight.price_economy;
  const classLabel = selectedClass === 'business' ? 'Hạng Thương Gia' : 'Hạng Phổ Thông';

  const labelEl = document.getElementById('summary-class-label');
  const priceEl = document.getElementById('summary-total-price');

  if (labelEl) labelEl.textContent = `${classLabel} (x${qty} khách)`;
  if (priceEl) priceEl.textContent = VietjetApp.formatCurrency(unitPrice * qty);
}

function handleAddFlightToCart() {
  if (!currentFlight) return;

  const qty = Math.max(1, parseInt(document.getElementById('passenger-qty')?.value || '1', 10));
  const unitPrice = selectedClass === 'business' ? currentFlight.price_business : currentFlight.price_economy;
  const classLabel = selectedClass === 'business' ? 'Hạng Thương Gia' : 'Hạng Phổ Thông';

  VietjetDB.addToCart({
    item_type: 'flight',
    item_id: currentFlight.id,
    title: `Chuyến bay ${currentFlight.flight_code}: ${currentFlight.from_city} (${currentFlight.from_code}) → ${currentFlight.to_city} (${currentFlight.to_code})`,
    airline_name: currentFlight.airline_name,
    departure_info: `Ngày ${VietjetApp.formatDate(currentFlight.departure_date)} | ${currentFlight.departure_time} - ${currentFlight.arrival_time} (${currentFlight.duration})`,
    aircraft: currentFlight.aircraft,
    service_class: classLabel,
    quantity: qty,
    unit_price: unitPrice
  });

  VietjetApp.updateCartBadge();
  window.location.href = 'cart.html';
}
