/**
 * FILE: js/flights.js
 * MÔ TẢ: Xử lý trang Danh sách Chuyến Bay (flights.html)
 * - Bên trái: Filter giá vé tăng/giảm dần, vé khứ hồi, vé một chiều, bay thẳng, nhiều thành phố,
 *   các hãng hàng không, thời gian cất cánh (giờ), hạng dịch vụ (phổ thông, thương gia).
 * - Bên phải: Các chuyến bay của các hãng, ngày cất cánh, thời gian bay, giá tiền, dịch vụ.
 * - Click chọn chuyến bay sẽ dẫn đến trang Chi tiết chuyến bay (flight-detail.html).
 */

document.addEventListener('DOMContentLoaded', async () => {
  VietjetApp.renderHeader('flights');
  VietjetApp.renderFooter();

  try {
    await VietjetDB.init();
    VietjetApp.updateCartBadge();

    renderAirlineCheckboxes();
    renderLocationFilters();
    applyUrlParametersToFilters();
    bindFilterEvents();
    executeFlightSearch();
  } catch (err) {
    console.error('Lỗi tải danh sách chuyến bay:', err);
  }
});

/**
 * Render danh sách checkbox Hãng hàng không từ bảng airlines trong db.db
 */
function renderAirlineCheckboxes() {
  const container = document.getElementById('filter-airlines-list');
  if (!container) return;

  const airlines = VietjetDB.getAirlines();
  container.innerHTML = airlines
    .map(
      (a) => `
      <label class="filter-check-label">
        <input type="checkbox" name="airline" value="${a.code}" />
        <span>${a.name} (${a.code})</span>
      </label>
    `
    )
    .join('');
}

/**
 * Render bộ lọc Điểm đi & Điểm đến nhanh để đồng bộ với trang chủ
 */
function renderLocationFilters() {
  const { fromList, toList } = VietjetDB.getDistinctLocations();
  const fromSelect = document.getElementById('filter-from-code');
  const toSelect = document.getElementById('filter-to-code');

  if (fromSelect) {
    fromSelect.innerHTML =
      '<option value="">Tất cả điểm xuất phát</option>' +
      fromList.map((item) => `<option value="${item.code}">${item.city} (${item.code})</option>`).join('');
  }

  if (toSelect) {
    toSelect.innerHTML =
      '<option value="">Tất cả điểm đến</option>' +
      toList.map((item) => `<option value="${item.code}">${item.city} (${item.code})</option>`).join('');
  }
}

/**
 * Đọc tham số từ URL (khi chuyển từ Trang chủ sang) và gán vào bộ lọc
 */
function applyUrlParametersToFilters() {
  const airlineParam = VietjetApp.getQueryParam('airline');
  const tripTypeParam = VietjetApp.getQueryParam('tripType');
  const fromParam = VietjetApp.getQueryParam('from');
  const toParam = VietjetApp.getQueryParam('to');
  const dateParam = VietjetApp.getQueryParam('date');

  if (airlineParam) {
    const cb = document.querySelector(`input[name="airline"][value="${airlineParam}"]`);
    if (cb) cb.checked = true;
  }

  if (tripTypeParam) {
    const tripCb = document.querySelector(`input[name="tripType"][value="${tripTypeParam}"]`);
    if (tripCb) tripCb.checked = true;
  }

  if (fromParam) {
    const fromSelect = document.getElementById('filter-from-code');
    if (fromSelect) fromSelect.value = fromParam;
  }

  if (toParam) {
    const toSelect = document.getElementById('filter-to-code');
    if (toSelect) toSelect.value = toParam;
  }

  if (dateParam) {
    const dateInput = document.getElementById('filter-dep-date');
    if (dateInput) dateInput.value = dateParam;
  }
}

/**
 * Lắng nghe sự kiện thay đổi trên toàn bộ Sidebar Filter bên trái
 */
function bindFilterEvents() {
  const sidebar = document.getElementById('flights-filter-sidebar');
  if (sidebar) {
    sidebar.addEventListener('change', () => {
      executeFlightSearch();
    });
  }

  const resetBtn = document.getElementById('btn-reset-flights');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('#flights-filter-sidebar input[type="checkbox"]').forEach((cb) => {
        cb.checked = false;
      });
      const sortAsc = document.querySelector('input[name="sortPrice"][value="asc"]');
      if (sortAsc) sortAsc.checked = true;

      const classEco = document.querySelector('input[name="serviceClass"][value="economy"]');
      if (classEco) classEco.checked = true;

      const fromSelect = document.getElementById('filter-from-code');
      const toSelect = document.getElementById('filter-to-code');
      const dateInput = document.getElementById('filter-dep-date');
      if (fromSelect) fromSelect.value = '';
      if (toSelect) toSelect.value = '';
      if (dateInput) dateInput.value = '';

      window.history.replaceState({}, '', 'flights.html');
      executeFlightSearch();
    });
  }
}

/**
 * Thu thập giá trị bộ lọc và truy vấn SQLite
 */
function executeFlightSearch() {
  const sortPrice = document.querySelector('input[name="sortPrice"]:checked')?.value || 'asc';
  const serviceClass = document.querySelector('input[name="serviceClass"]:checked')?.value || 'economy';

  const tripTypes = Array.from(document.querySelectorAll('input[name="tripType"]:checked')).map((el) => el.value);
  const routeTypes = Array.from(document.querySelectorAll('input[name="routeType"]:checked')).map((el) => el.value);
  const airlines = Array.from(document.querySelectorAll('input[name="airline"]:checked')).map((el) => el.value);
  const timeSlots = Array.from(document.querySelectorAll('input[name="timeSlot"]:checked')).map((el) => el.value);

  const fromCode = document.getElementById('filter-from-code')?.value || '';
  const toCode = document.getElementById('filter-to-code')?.value || '';
  const departureDate = document.getElementById('filter-dep-date')?.value || '';

  const flights = VietjetDB.filterFlights({
    sortPrice,
    serviceClass,
    tripTypes,
    routeTypes,
    airlines,
    timeSlots,
    fromCode,
    toCode,
    departureDate
  });

  renderFlightResults(flights, serviceClass);
}

/**
 * Render danh sách chuyến bay ở cột bên phải
 */
function renderFlightResults(flights, serviceClass) {
  const listContainer = document.getElementById('flights-results-list');
  const countEl = document.getElementById('flights-count-number');

  if (countEl) countEl.textContent = flights.length;
  if (!listContainer) return;

  if (flights.length === 0) {
    listContainer.innerHTML = `
      <div class="detail-card" style="text-align:center;padding:48px 24px;">
        <div style="font-size:3rem;margin-bottom:12px;">✈️</div>
        <h3 style="margin-bottom:8px;">Không tìm thấy chuyến bay phù hợp với bộ lọc</h3>
        <p style="color:var(--text-muted);margin-bottom:20px;">
          Bạn hãy thử bỏ bớt điều kiện lọc hoặc nhấn nút "Đặt lại bộ lọc" để xem toàn bộ 16 chuyến bay trong cơ sở dữ liệu.
        </p>
        <button class="btn-primary-red" onclick="document.getElementById('btn-reset-flights').click()">
          Hiển thị tất cả chuyến bay
        </button>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = flights
    .map((f) => {
      const displayPrice = serviceClass === 'business' ? f.price_business : f.price_economy;
      const classLabel = serviceClass === 'business' ? 'Hạng Thương Gia' : 'Hạng Phổ Thông';
      const tripLabel = f.trip_type === 'round-trip' ? 'Vé khứ hồi' : 'Vé một chiều';
      const routeLabel = f.route_type === 'direct' ? 'Bay thẳng' : 'Nhiều thành phố';

      return `
        <article class="flight-card" onclick="window.location.href='flight-detail.html?id=${f.id}&class=${serviceClass}'">
          <div class="flight-card-main">
            <div class="flight-airline-col">
              <img
                src="${f.airline_logo || 'images/vietjet-logo.jpg'}"
                alt="${f.airline_name}"
                class="flight-airline-logo"
                onerror="this.src='images/vietjet-logo.jpg'"
              />
              <div class="flight-airline-name">${f.airline_name}</div>
              <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                <span class="flight-code-pill">${f.flight_code}</span>
                <span style="font-size:0.78rem;color:var(--text-muted);">🛩 ${f.aircraft}</span>
              </div>
            </div>

            <div class="flight-schedule-col">
              <div class="flight-time-point">
                <div class="flight-hour">${f.departure_time}</div>
                <div class="flight-city-code">${f.from_code}</div>
                <div class="flight-city-name">${f.from_city}</div>
              </div>

              <div class="flight-duration-visual">
                <div class="flight-duration-text">⏱ ${f.duration}</div>
                <div class="flight-line-bar"></div>
                <div class="flight-badges-row">
                  <span class="badge-tag red">${tripLabel}</span>
                  <span class="badge-tag">${routeLabel}</span>
                </div>
              </div>

              <div class="flight-time-point">
                <div class="flight-hour">${f.arrival_time}</div>
                <div class="flight-city-code">${f.to_code}</div>
                <div class="flight-city-name">${f.to_city}</div>
              </div>
            </div>

            <div class="flight-price-col">
              <span class="flight-price-class">${classLabel} / khách</span>
              <div class="flight-price-amount">${VietjetApp.formatCurrency(displayPrice)}</div>
              <button type="button" class="btn-primary-red" style="height:40px;padding:0 18px;font-size:0.9rem;">
                Chọn chuyến bay →
              </button>
            </div>
          </div>

          <div class="flight-card-bottom">
            <div>
              <strong>📅 Ngày cất cánh:</strong> ${VietjetApp.formatDate(f.departure_date)}
              ${f.return_date ? ` &nbsp;|&nbsp; <strong>🔄 Ngày về:</strong> ${VietjetApp.formatDate(f.return_date)}` : ''}
            </div>
            <div>
              <strong>🎁 Dịch vụ:</strong> ${f.services}
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}
