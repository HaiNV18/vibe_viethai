import { FlightService } from '../services/FlightService.js';
import { WeatherService } from '../services/WeatherService.js';
import { WeatherWidget } from '../components/WeatherWidget.js';
import { CartService } from '../services/CartService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate, formatDuration } from '../utils/formatDate.js';
import { Toast } from '../components/Toast.js';
import { router } from '../router.js';

export const FlightDetailPage = {
  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const flightId = urlParams.get('id');

    const flight = await FlightService.getFlightById(flightId);

    if (!flight) {
      return `
        <div class="container" style="padding:var(--spacing-12) 0;">
          <div class="empty-state">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h3>Không tìm thấy thông tin chuyến bay</h3>
            <a href="/flights" class="btn btn-primary" data-link style="margin-top:var(--spacing-4);">Quay lại danh sách chuyến bay</a>
          </div>
        </div>
      `;
    }

    // Load weather for destination city
    let weatherBadgeHtml = '';
    try {
      const destCity = flight.destination_city || flight.destination_name;
      const weather = await WeatherService.getWeatherByCity(destCity);
      weatherBadgeHtml = WeatherWidget.renderBadgeHtml(weather);
    } catch (e) {
      console.warn('Flight destination weather load error:', e.message);
    }

    return `
      <div class="detail-hero">
        <div class="container">
          <a href="/flights" class="btn btn-outline btn-sm" data-link style="margin-bottom:var(--spacing-4);">
            <i class="fa-solid fa-arrow-left"></i> Quay lại tìm kiếm
          </a>
          
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="display:flex; align-items:center; gap:var(--spacing-3); flex-wrap:wrap; margin-bottom:var(--spacing-2);">
                <span class="badge badge-primary" style="font-size:var(--font-xs);">${flight.aircraft || 'Airbus'}</span>
                ${weatherBadgeHtml}
              </div>
              <h2>${flight.airline_name} — Chuyến Bay ${flight.flight_number}</h2>
              <p style="font-size:var(--font-base); font-weight:600; color:var(--primary-color);">
                ${flight.origin_name} (${flight.origin_code}) <i class="fa-solid fa-arrow-right"></i> ${flight.destination_name} (${flight.destination_code})
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="margin-bottom:var(--spacing-12);">
        <!-- Flight Info Overview Card -->
        <div class="card" style="padding:var(--spacing-6); margin-bottom:var(--spacing-8);">
          <h3 style="margin-bottom:var(--spacing-4);"><i class="fa-solid fa-circle-info"></i> Thông tin hành trình</h3>
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:var(--spacing-4); background:var(--bg-color); padding:var(--spacing-4); border-radius:var(--radius-md);">
            <div>
              <span style="font-size:var(--font-xs); color:var(--text-muted); display:block;">Ngày khởi hành</span>
              <strong>${formatDate(flight.departure_date)}</strong>
            </div>
            <div>
              <span style="font-size:var(--font-xs); color:var(--text-muted); display:block;">Giờ cất cánh / hạ cánh</span>
              <strong>${flight.departure_time} - ${flight.arrival_time}</strong>
            </div>
            <div>
              <span style="font-size:var(--font-xs); color:var(--text-muted); display:block;">Thời gian bay</span>
              <strong>${formatDuration(flight.duration_minutes)}</strong>
            </div>
            <div>
              <span style="font-size:var(--font-xs); color:var(--text-muted); display:block;">Điểm dừng</span>
              <strong>${flight.stops === 0 ? 'Bay thẳng' : `${flight.stops} điểm dừng`}</strong>
            </div>
          </div>
        </div>

        <!-- Fare Selection -->
        <h3 style="margin-bottom:var(--spacing-4);"><i class="fa-solid fa-ticket"></i> Chọn hạng vé chuyến bay</h3>
        <div class="fare-selection-grid">
          <!-- Economy Fare Card -->
          <div class="fare-card" id="fare-economy-card">
            <div class="fare-header">
              <span class="badge badge-primary" style="margin-bottom:var(--spacing-2);">Tiết kiệm</span>
              <h3>Hạng Phổ Thông (Economy)</h3>
              <div class="fare-price">${formatCurrency(flight.economy_price)}</div>
              <span style="font-size:var(--font-xs); color:var(--text-muted);">/ 01 hành khách</span>
            </div>

            <div class="fare-features">
              <div class="fare-feature-item"><i class="fa-solid fa-check"></i> Hành lý xách tay: 7kg</div>
              <div class="fare-feature-item"><i class="fa-solid fa-check"></i> Hành lý ký gửi: 20kg</div>
              <div class="fare-feature-item"><i class="fa-solid fa-check"></i> Phục vụ suất ăn nhẹ & nước uống</div>
              <div class="fare-feature-item"><i class="fa-solid fa-check"></i> Được phép đổi ngày bay (có phí)</div>
            </div>

            <button class="btn btn-primary btn-full btn-select-fare" data-fare="Economy">
              <i class="fa-solid fa-cart-plus"></i> Chọn Vé Phổ Thông
            </button>
          </div>

          <!-- Business Fare Card -->
          <div class="fare-card" id="fare-business-card" style="border-color:var(--accent-color);">
            <div class="fare-header">
              <span class="badge badge-accent" style="margin-bottom:var(--spacing-2);">Cao cấp</span>
              <h3>Hạng Thương Gia (Business)</h3>
              <div class="fare-price" style="color:var(--accent-hover);">${formatCurrency(flight.business_price)}</div>
              <span style="font-size:var(--font-xs); color:var(--text-muted);">/ 01 hành khách</span>
            </div>

            <div class="fare-features">
              <div class="fare-feature-item"><i class="fa-solid fa-check"></i> Hành lý xách tay: 10kg</div>
              <div class="fare-feature-item"><i class="fa-solid fa-check"></i> Hành lý ký gửi: 32kg + Cần câu/Golf</div>
              <div class="fare-feature-item"><i class="fa-solid fa-check"></i> Ưu tiên Check-in & Quầy thủ tục riêng</div>
              <div class="fare-feature-item"><i class="fa-solid fa-check"></i> Phòng chờ Thương gia (Lounge 5 sao)</div>
              <div class="fare-feature-item"><i class="fa-solid fa-check"></i> Miễn phí chọn chỗ ngồi ưu tiên</div>
            </div>

            <button class="btn btn-accent btn-full btn-select-fare" data-fare="Business">
              <i class="fa-solid fa-cart-plus"></i> Chọn Vé Thương Gia
            </button>
          </div>
        </div>
      </div>
    `;
  },

  async initEvents() {
    const urlParams = new URLSearchParams(window.location.search);
    const flightId = urlParams.get('id');
    const flight = await FlightService.getFlightById(flightId);

    if (!flight) return;

    document.querySelectorAll('.btn-select-fare').forEach(btn => {
      btn.addEventListener('click', () => {
        const fareClass = btn.getAttribute('data-fare');
        CartService.addFlight(flight, fareClass);
        Toast.success(`Đã thêm vé chuyến bay (${fareClass}) vào giỏ hàng!`);
        router.navigate('/cart');
      });
    });
  }
};
