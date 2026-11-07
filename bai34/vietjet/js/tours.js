/**
 * FILE: js/tours.js
 * MÔ TẢ: Xử lý trang Tour Du Lịch (tours.html)
 * - Bên trái: Filter giá vé tăng/giảm dần, các hãng hàng không, thời gian cất cánh (giờ)
 * - Bên phải: Các tour du lịch, hãng bay, ngày cất cánh, thời gian bay, giá tiền, dịch vụ
 * - Click chọn tour sẽ đến trang Chi tiết Tour (tour-detail.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  VietjetApp.renderHeader('tours');
  VietjetApp.renderFooter();

  try {
    await VietjetDB.init();
    VietjetApp.updateCartBadge();

    renderTourAirlineFilters();
    bindTourFilterEvents();
    executeTourSearch();
  } catch (err) {
    console.error('Lỗi tải danh sách tour:', err);
  }
});

function renderTourAirlineFilters() {
  const container = document.getElementById('tour-filter-airlines-list');
  if (!container) return;

  const airlines = VietjetDB.getAirlines();
  container.innerHTML = airlines
    .map(
      (a) => `
      <label class="filter-check-label">
        <input type="checkbox" name="tourAirline" value="${a.code}" />
        <span>${a.name} (${a.code})</span>
      </label>
    `
    )
    .join('');
}

function bindTourFilterEvents() {
  const sidebar = document.getElementById('tours-filter-sidebar');
  if (sidebar) {
    sidebar.addEventListener('change', () => {
      executeTourSearch();
    });
  }

  const resetBtn = document.getElementById('btn-reset-tours');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('#tours-filter-sidebar input[type="checkbox"]').forEach((cb) => {
        cb.checked = false;
      });
      const sortAsc = document.querySelector('input[name="tourSortPrice"][value="asc"]');
      if (sortAsc) sortAsc.checked = true;
      executeTourSearch();
    });
  }
}

function executeTourSearch() {
  const sortPrice = document.querySelector('input[name="tourSortPrice"]:checked')?.value || 'asc';
  const airlines = Array.from(document.querySelectorAll('input[name="tourAirline"]:checked')).map((el) => el.value);
  const timeSlots = Array.from(document.querySelectorAll('input[name="tourTimeSlot"]:checked')).map((el) => el.value);

  const tours = VietjetDB.filterTours({
    sortPrice,
    airlines,
    timeSlots
  });

  renderTourResults(tours);
}

function renderTourResults(tours) {
  const listContainer = document.getElementById('tours-results-list');
  const countEl = document.getElementById('tours-count-number');
  const highlightId = Number(VietjetApp.getQueryParam('highlight') || 0);

  if (countEl) countEl.textContent = tours.length;
  if (!listContainer) return;

  if (tours.length === 0) {
    listContainer.innerHTML = `
      <div class="detail-card" style="text-align:center;padding:48px 24px;">
        <div style="font-size:3rem;margin-bottom:12px;">🌴</div>
        <h3 style="margin-bottom:8px;">Không tìm thấy Tour phù hợp với bộ lọc</h3>
        <p style="color:var(--text-muted);margin-bottom:20px;">
          Hãy thử bỏ chọn một số điều kiện lọc hoặc nhấn nút bên dưới để xem tất cả Tour.
        </p>
        <button class="btn-primary-red" onclick="document.getElementById('btn-reset-tours').click()">
          Hiển thị tất cả Tour
        </button>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = tours
    .map((tour) => {
      const isHighlighted = tour.id === highlightId;
      return `
        <article
          id="tour-item-${tour.id}"
          class="tour-horizontal-card"
          style="${isHighlighted ? 'border:2.5px solid var(--primary-red);background:var(--primary-red-light);' : ''}"
          onclick="window.location.href='tour-detail.html?id=${tour.id}'"
        >
          <div class="tour-h-thumb">
            <img
              src="${tour.thumbnail}"
              alt="${tour.title}"
              width="600"
              height="400"
              onerror="this.src='images/vietjet-may-bay.jpg'"
            />
            <span class="tour-duration-badge">⏱ ${tour.duration_days}</span>
          </div>

          <div class="tour-h-content">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
                <span class="badge-tag red">🏢 Lữ hành: ${tour.travel_agency}</span>
                <span class="badge-tag">🛩 Tàu bay: ${tour.aircraft}</span>
              </div>

              <h3 class="tour-h-title">${tour.title}</h3>

              <div class="tour-h-meta-grid">
                <div><strong>✈️ Hãng bay:</strong> ${tour.airline_name}</div>
                <div><strong>📍 Hành trình:</strong> ${tour.from_city} → ${tour.to_city}</div>
                <div><strong>📅 Ngày cất cánh:</strong> ${VietjetApp.formatDate(tour.departure_date)} (${tour.departure_time})</div>
                <div><strong>⏱ Thời gian bay:</strong> ${tour.flight_duration} (${tour.duration_days})</div>
              </div>

              <div class="tour-h-services">
                <strong>🎁 Dịch vụ bao gồm:</strong> ${tour.services}
              </div>
            </div>

            <div class="tour-h-bottom">
              <div>
                <span style="font-size:0.78rem;color:var(--text-muted);display:block;">Giá trọn gói / khách</span>
                <span style="font-size:1.5rem;font-weight:800;color:var(--primary-red);">
                  ${VietjetApp.formatCurrency(tour.price)}
                </span>
              </div>

              <button type="button" class="btn-primary-red" style="height:42px;padding:0 22px;">
                Xem Chi Tiết Tour →
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  if (highlightId) {
    const targetEl = document.getElementById(`tour-item-${highlightId}`);
    if (targetEl) {
      setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    }
  }
}
