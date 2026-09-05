import { WeatherService } from '../services/WeatherService.js';

export const WeatherWidget = {
  renderWidgetHtml() {
    return `
      <div class="card weather-widget-card">
        <div class="weather-widget-header">
          <h3><i class="fa-solid fa-cloud-sun" style="color:var(--accent-color);"></i> Tra Cứu Thời Tiết Điểm Đến</h3>
          <p style="font-size:var(--font-xs); color:var(--text-muted);">Cập nhật nhiệt độ & thời tiết hiện tại qua Open-Meteo API</p>
        </div>

        <form id="weather-search-form" class="weather-search-form">
          <div style="display:flex; gap:var(--spacing-2);">
            <input type="text" id="weather-city-input" class="form-control" placeholder="Nhập tên thành phố (Vd: Hà Nội, Đà Nẵng, Tokyo...)" required>
            <button type="submit" class="btn btn-primary" id="weather-search-btn">
              <i class="fa-solid fa-magnifying-glass"></i> Xem
            </button>
          </div>
        </form>

        <div class="weather-quick-cities" id="weather-quick-cities">
          <span style="font-size:var(--font-xs); color:var(--text-muted); font-weight:600;">Gợi ý nhanh:</span>
          <button type="button" class="btn-quick-city" data-city="Hà Nội">Hà Nội</button>
          <button type="button" class="btn-quick-city" data-city="Đà Nẵng">Đà Nẵng</button>
          <button type="button" class="btn-quick-city" data-city="Hồ Chí Minh">TP.HCM</button>
          <button type="button" class="btn-quick-city" data-city="Phú Quốc">Phú Quốc</button>
          <button type="button" class="btn-quick-city" data-city="Nha Trang">Nha Trang</button>
          <button type="button" class="btn-quick-city" data-city="Sapa">Sapa</button>
          <button type="button" class="btn-quick-city" data-city="Đà Lạt">Đà Lạt</button>
        </div>

        <div id="weather-result-box" class="weather-result-box">
          <div class="weather-display-card">
            <div class="weather-temp-info">
              <i class="fa-solid fa-sun weather-main-icon" id="w-icon"></i>
              <div>
                <div class="weather-temp" id="w-temp">--°C</div>
                <div class="weather-city-name" id="w-city">Vui lòng nhập tên thành phố</div>
              </div>
            </div>
            <div class="weather-meta-info">
              <div class="weather-desc" id="w-desc">--</div>
              <div class="weather-wind" id="w-wind"><i class="fa-solid fa-wind"></i> Sức gió: -- km/h</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderBadgeHtml(weather) {
    if (!weather) return '';
    return `
      <div class="weather-badge" title="Thời tiết hiện tại tại ${weather.city}">
        <i class="fa-solid ${weather.iconClass} weather-badge-icon"></i>
        <span><strong>${weather.city}:</strong> ${weather.temp}°C • ${weather.description}</span>
      </div>
    `;
  },

  async loadWeatherForCity(cityName) {
    const resultBox = document.getElementById('weather-result-box');
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div style="text-align:center; padding:var(--spacing-4); color:var(--text-muted);">
        <i class="fa-solid fa-spinner fa-spin" style="font-size:24px; color:var(--primary-color);"></i>
        <p style="font-size:var(--font-xs); margin-top:var(--spacing-2);">Đang nạp dữ liệu thời tiết...</p>
      </div>
    `;

    try {
      const data = await WeatherService.getWeatherByCity(cityName);
      resultBox.innerHTML = `
        <div class="weather-display-card">
          <div class="weather-temp-info">
            <i class="fa-solid ${data.iconClass} weather-main-icon" style="color:var(--accent-hover);"></i>
            <div>
              <div class="weather-temp">${data.temp}°C</div>
              <div class="weather-city-name">${data.city}, ${data.country}</div>
            </div>
          </div>
          <div class="weather-meta-info">
            <div class="weather-desc"><i class="fa-solid fa-circle-info"></i> ${data.description}</div>
            <div class="weather-wind"><i class="fa-solid fa-wind"></i> Tốc độ gió: ${data.windspeed} km/h</div>
          </div>
        </div>
      `;
    } catch (err) {
      resultBox.innerHTML = `
        <div style="background:#f8d7da; color:var(--danger-color); padding:var(--spacing-3); border-radius:var(--radius-sm); font-size:var(--font-xs); text-align:center;">
          <i class="fa-solid fa-circle-exclamation"></i> ${err.message || 'Không thể lấy dữ liệu thời tiết.'}
        </div>
      `;
    }
  },

  initEvents() {
    const form = document.getElementById('weather-search-form');
    const input = document.getElementById('weather-city-input');

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = input.value.trim();
        if (city) {
          this.loadWeatherForCity(city);
        }
      });
    }

    document.querySelectorAll('.btn-quick-city').forEach(btn => {
      btn.addEventListener('click', () => {
        const city = btn.getAttribute('data-city');
        if (input) input.value = city;
        this.loadWeatherForCity(city);
      });
    });

    // Default load Hà Nội
    this.loadWeatherForCity('Hà Nội');
  }
};
