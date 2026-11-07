/**
 * FILE: js/home.js
 * MÔ TẢ: Xử lý dữ liệu và tương tác trên Trang Chủ (index.html):
 * 1. Khung tìm kiếm chuyến bay (chọn ngày, điểm xuất phát, điểm đến, vé khứ hồi, vé một chiều) -> dẫn tới flights.html
 * 2. Hiển thị 8 tour du lịch nổi bật (thumbnail 600x400, hãng du lịch, số ngày/đêm, giá tour) -> dẫn tới tours.html
 * 3. Hiển thị logo các hãng hàng không (VietJet Air, Vietnam Airlines, Singapore Airlines...) -> dẫn tới flights.html
 */

document.addEventListener('DOMContentLoaded', async () => {
  VietjetApp.renderHeader('home');
  VietjetApp.renderFooter();

  try {
    await VietjetDB.init();
    VietjetApp.updateCartBadge();

    initSearchWidget();
    renderFeaturedTours();
    renderAirlinesSection();
  } catch (err) {
    console.error('Lỗi khởi tạo trang chủ:', err);
  }
});

/**
 * 1. Khởi tạo Khung Tìm Kiếm Chuyến Bay
 */
function initSearchWidget() {
  const { fromList, toList } = VietjetDB.getDistinctLocations();
  const fromSelect = document.getElementById('search-from');
  const toSelect = document.getElementById('search-to');
  const depDateInput = document.getElementById('search-dep-date');
  const retDateInput = document.getElementById('search-ret-date');
  const tripRadios = document.querySelectorAll('input[name="tripType"]');
  const radioLabels = document.querySelectorAll('.trip-radio-label');
  const searchForm = document.getElementById('flight-search-form');

  // Đổ danh sách điểm xuất phát từ SQLite db.db
  if (fromSelect) {
    fromSelect.innerHTML = '<option value="">-- Tất cả điểm đi --</option>' +
      fromList.map((loc) => `<option value="${loc.code}">${loc.city} (${loc.code})</option>`).join('');
  }

  // Đổ danh sách điểm đến từ SQLite db.db
  if (toSelect) {
    toSelect.innerHTML = '<option value="">-- Tất cả điểm đến --</option>' +
      toList.map((loc) => `<option value="${loc.code}">${loc.city} (${loc.code})</option>`).join('');
  }

  // Xử lý bật/tắt ô Ngày về khi chọn Vé khứ hồi / Vé một chiều
  tripRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      radioLabels.forEach((lbl) => lbl.classList.remove('selected'));
      radio.closest('.trip-radio-label').classList.add('selected');

      if (radio.value === 'one-way') {
        retDateInput.disabled = true;
        retDateInput.value = '';
      } else {
        retDateInput.disabled = false;
      }
    });
  });

  // Khi nhấn nút Tìm Kiếm -> chuyển sang trang Chuyến Bay (flights.html)
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedTrip = document.querySelector('input[name="tripType"]:checked')?.value || '';
      const fromCode = fromSelect.value;
      const toCode = toSelect.value;
      const depDate = depDateInput.value;
      const retDate = retDateInput.value;

      const params = new URLSearchParams();
      if (selectedTrip) params.set('tripType', selectedTrip);
      if (fromCode) params.set('from', fromCode);
      if (toCode) params.set('to', toCode);
      if (depDate) params.set('date', depDate);
      if (retDate && selectedTrip === 'round-trip') params.set('returnDate', retDate);

      const queryString = params.toString();
      window.location.href = queryString ? `flights.html?${queryString}` : 'flights.html';
    });
  }
}

/**
 * 2. Hiển thị 8 Tour Du Lịch Nổi Bật từ bảng tours trong db.db
 * Hình thumbnail 600x400, hãng du lịch, số ngày/đêm, giá tour. Click vào dẫn đến trang Tour (tours.html)
 */
function renderFeaturedTours() {
  const container = document.getElementById('featured-tours-grid');
  if (!container) return;

  const tours = VietjetDB.getFeaturedTours(8);

  if (tours.length === 0) {
    container.innerHTML = '<p>Chưa có dữ liệu tour du lịch.</p>';
    return;
  }

  container.innerHTML = tours
    .map(
      (tour) => `
      <article class="tour-card" onclick="window.location.href='tours.html?highlight=${tour.id}'">
        <div class="tour-thumb-wrapper">
          <img
            src="${tour.thumbnail}"
            alt="${tour.title}"
            width="600"
            height="400"
            loading="lazy"
            onerror="this.src='images/vietjet-may-bay.jpg'"
          />
          <span class="tour-duration-badge">⏱ ${tour.duration_days}</span>
          <span class="tour-airline-badge">✈ ${tour.airline_name}</span>
        </div>

        <div class="tour-card-body">
          <div class="tour-agency-meta">
            <span class="tour-agency-name">🏢 ${tour.travel_agency}</span>
            <span>📍 ${tour.from_city} → ${tour.to_city}</span>
          </div>

          <h3 class="tour-card-title">${tour.title}</h3>

          <div class="tour-card-footer">
            <div>
              <span class="tour-price-label">Giá trọn gói / khách</span>
              <span class="tour-price-value">${VietjetApp.formatCurrency(tour.price)}</span>
            </div>
            <span class="tour-view-btn">Xem Tour →</span>
          </div>
        </div>
      </article>
    `
    )
    .join('');
}

/**
 * 3. Hiển thị danh sách Logo các Hãng Hàng Không từ bảng airlines trong db.db
 * Click vào logo sẽ dẫn đến trang Chuyến Bay (flights.html?airline=...)
 */
function renderAirlinesSection() {
  const container = document.getElementById('airlines-logos-grid');
  if (!container) return;

  const airlines = VietjetDB.getAirlines();

  container.innerHTML = airlines
    .map(
      (airline) => `
      <div class="airline-logo-card" onclick="window.location.href='flights.html?airline=${airline.code}'" title="Xem các chuyến bay của ${airline.name}">
        <div class="airline-logo-img-box">
          <img
            src="${airline.logo}"
            alt="${airline.name}"
            onerror="this.src='images/vietjet-logo.jpg'"
          />
        </div>
        <div>
          <div class="airline-card-name">${airline.name}</div>
          <div class="airline-card-country">${airline.country} (${airline.code})</div>
        </div>
      </div>
    `
    )
    .join('');
}
