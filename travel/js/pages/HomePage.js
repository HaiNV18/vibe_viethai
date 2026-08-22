import { TourService } from '../services/TourService.js';
import { AirlineRepository } from '../repositories/AirlineRepository.js';
import { TourCard } from '../components/TourCard.js';
import { router } from '../router.js';
import { Toast } from '../components/Toast.js';

export const HomePage = {
  async render() {
    const featuredTours = await TourService.getFeaturedTours();
    const airlines = await AirlineRepository.getAllActive();

    return `
      <section class="hero-section">
        <div class="container">
          <div class="hero-text">
            <h1>Khám Phá Việt Nam Cùng TravelViet</h1>
            <p>Tìm chuyến bay giá tốt và tour du lịch hoàn hảo cho hành trình của bạn</p>
          </div>

          <div class="hero-search-card">
            <form id="hero-search-form">
              <div class="trip-type-tabs">
                <label class="trip-type-label">
                  <input type="radio" name="tripType" value="round-trip" checked id="trip-round">
                  <span><i class="fa-solid fa-arrows-left-right"></i> Vé Khứ Hồi</span>
                </label>
                <label class="trip-type-label">
                  <input type="radio" name="tripType" value="one-way" id="trip-one-way">
                  <span><i class="fa-solid fa-arrow-right"></i> Vé Một Chiều</span>
                </label>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="origin-select"><i class="fa-solid fa-plane-departure"></i> Điểm xuất phát</label>
                  <select class="form-control" id="origin-select" required>
                    <option value="">-- Chọn điểm đi --</option>
                    <option value="SGN" selected>SGN — Hồ Chí Minh (Tân Sơn Nhất)</option>
                    <option value="HAN">HAN — Hà Nội (Nội Bài)</option>
                    <option value="DAD">DAD — Đà Nẵng</option>
                    <option value="CXR">CXR — Nha Trang (Cam Ranh)</option>
                    <option value="PQC">PQC — Phú Quốc</option>
                    <option value="SIN">SIN — Singapore (Changi)</option>
                    <option value="BKK">BKK — Bangkok (Suvarnabhumi)</option>
                    <option value="ICN">ICN — Seoul (Incheon)</option>
                    <option value="NRT">NRT — Tokyo (Narita)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="dest-select"><i class="fa-solid fa-plane-arrival"></i> Điểm đến</label>
                  <select class="form-control" id="dest-select" required>
                    <option value="">-- Chọn điểm đến --</option>
                    <option value="SGN">SGN — Hồ Chí Minh (Tân Sơn Nhất)</option>
                    <option value="HAN" selected>HAN — Hà Nội (Nội Bài)</option>
                    <option value="DAD">DAD — Đà Nẵng</option>
                    <option value="CXR">CXR — Nha Trang (Cam Ranh)</option>
                    <option value="PQC">PQC — Phú Quốc</option>
                    <option value="SIN">SIN — Singapore (Changi)</option>
                    <option value="BKK">BKK — Bangkok (Suvarnabhumi)</option>
                    <option value="ICN">ICN — Seoul (Incheon)</option>
                    <option value="NRT">NRT — Tokyo (Narita)</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="dep-date"><i class="fa-solid fa-calendar"></i> Ngày đi</label>
                  <input type="date" class="form-control" id="dep-date" value="2026-09-01" required>
                </div>

                <div class="form-group" id="return-date-group">
                  <label for="ret-date"><i class="fa-solid fa-calendar-check"></i> Ngày về</label>
                  <input type="date" class="form-control" id="ret-date" value="2026-09-05">
                </div>

                <div class="form-group">
                  <label for="passengers"><i class="fa-solid fa-user-group"></i> Hành khách</label>
                  <select class="form-control" id="passengers">
                    <option value="1">1 Người lớn</option>
                    <option value="2">2 Người lớn</option>
                    <option value="3">3 Người lớn</option>
                    <option value="4">4 Người lớn</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="class-type"><i class="fa-solid fa-chair"></i> Hạng dịch vụ</label>
                  <select class="form-control" id="class-type">
                    <option value="Economy">Phổ thông (Economy)</option>
                    <option value="Business">Thương gia (Business)</option>
                  </select>
                </div>
              </div>

              <div style="text-align:right; margin-top:var(--spacing-4);">
                <button type="submit" class="btn btn-accent btn-lg" style="font-weight:700;">
                  <i class="fa-solid fa-magnifying-glass"></i> Tìm Kiếm Chuyến Bay
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- Featured Tours Section -->
      <section class="container" style="padding: var(--spacing-12) var(--spacing-4);">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:var(--spacing-6);">
          <div>
            <h2>Tour Du Lịch Nổi Bật</h2>
            <p>Những hành trình được yêu thích nhất do TravelViet tuyển chọn</p>
          </div>
          <a href="/tours" class="btn btn-outline" data-link>Xem tất cả tour <i class="fa-solid fa-arrow-right"></i></a>
        </div>

        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:var(--spacing-6);" id="featured-tours-grid">
          ${featuredTours.map(tour => TourCard.render(tour)).join('')}
        </div>
      </section>

      <!-- Airlines Partners Section -->
      <section style="background-color:var(--surface-color); padding: var(--spacing-12) 0; border-top:1px solid var(--border-color);">
        <div class="container">
          <div style="text-align:center; margin-bottom:var(--spacing-6);">
            <h2>Đối Tác Hàng Không Đồng Hành</h2>
            <p>Liên kết cùng 10 hãng hàng không hàng đầu thế giới & Việt Nam</p>
          </div>

          <div class="airlines-grid">
            ${airlines.map(airline => `
              <div class="airline-item" data-airline-id="${airline.id}">
                <img src="${airline.logo || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80'}" alt="${airline.name}">
                <span>${airline.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  initEvents() {
    const roundRadio = document.getElementById('trip-round');
    const oneWayRadio = document.getElementById('trip-one-way');
    const returnGroup = document.getElementById('return-date-group');
    const returnInput = document.getElementById('ret-date');
    const searchForm = document.getElementById('hero-search-form');

    if (roundRadio && oneWayRadio && returnGroup) {
      oneWayRadio.addEventListener('change', () => {
        returnInput.disabled = true;
        returnGroup.style.opacity = '0.4';
      });
      roundRadio.addEventListener('change', () => {
        returnInput.disabled = false;
        returnGroup.style.opacity = '1';
      });
    }

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const origin = document.getElementById('origin-select').value;
        const destination = document.getElementById('dest-select').value;
        const depDate = document.getElementById('dep-date').value;
        const tripType = document.querySelector('input[name="tripType"]:checked').value;

        if (origin === destination) {
          Toast.warning('Điểm xuất phát và điểm đến không thể trùng nhau!');
          return;
        }

        const queryParams = new URLSearchParams({
          origin,
          destination,
          departureDate: depDate,
          tripType
        }).toString();

        router.navigate(`/flights?${queryParams}`);
      });
    }

    // Airline item clicks
    document.querySelectorAll('.airline-item').forEach(item => {
      item.addEventListener('click', () => {
        const airlineId = item.getAttribute('data-airline-id');
        router.navigate(`/flights?airlineId=${airlineId}`);
      });
    });
  }
};
