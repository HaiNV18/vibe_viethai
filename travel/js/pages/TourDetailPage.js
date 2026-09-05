import { TourService } from '../services/TourService.js';
import { WeatherService } from '../services/WeatherService.js';
import { WeatherWidget } from '../components/WeatherWidget.js';
import { CartService } from '../services/CartService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';
import { Toast } from '../components/Toast.js';
import { router } from '../router.js';

export const TourDetailPage = {
  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');

    const tour = await TourService.getTourById(tourId);

    if (!tour) {
      return `
        <div class="container" style="padding:var(--spacing-12) 0;">
          <div class="empty-state">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h3>Không tìm thấy thông tin tour du lịch</h3>
            <a href="/tours" class="btn btn-primary" data-link style="margin-top:var(--spacing-4);">Quay lại danh sách tour</a>
          </div>
        </div>
      `;
    }

    // Attempt to load weather for destination
    let weatherBadgeHtml = '';
    try {
      const weather = await WeatherService.getWeatherByCity(tour.destination);
      weatherBadgeHtml = WeatherWidget.renderBadgeHtml(weather);
    } catch (e) {
      console.warn('Destination weather load error:', e.message);
    }

    return `
      <div style="background-color:var(--surface-color); border-bottom:1px solid var(--border-color); padding:var(--spacing-6) 0;">
        <div class="container">
          <a href="/tours" class="btn btn-outline btn-sm" data-link style="margin-bottom:var(--spacing-4);">
            <i class="fa-solid fa-arrow-left"></i> Quay lại danh sách tour
          </a>
          
          <div style="display:grid; grid-template-columns: 1fr 380px; gap:var(--spacing-8); align-items:center;">
            <div>
              <div style="display:flex; align-items:center; gap:var(--spacing-3); flex-wrap:wrap; margin-bottom:var(--spacing-2);">
                <span class="badge badge-success">${tour.operator}</span>
                ${weatherBadgeHtml}
              </div>
              <h2>${tour.name}</h2>
              <p style="font-size:var(--font-base); color:var(--text-muted); margin-top:var(--spacing-2);">
                <i class="fa-solid fa-location-dot"></i> Điểm đi: ${tour.origin} — Điểm đến: ${tour.destination} (${tour.country})
              </p>
            </div>

            <div class="card" style="padding:var(--spacing-6); text-align:center; background:var(--bg-color);">
              <span style="font-size:var(--font-xs); color:var(--text-muted);">Giá trọn gói / khách</span>
              <div class="price-tag" style="font-size:var(--font-3xl); margin:var(--spacing-1) 0;">${formatCurrency(tour.price)}</div>
              <button class="btn btn-accent btn-full btn-lg" id="btn-select-tour" style="font-weight:700;">
                <i class="fa-solid fa-cart-plus"></i> Chọn Đặt Tour Này
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="padding:var(--spacing-8) 0 var(--spacing-12);">
        <div style="display:grid; grid-template-columns: 1fr 380px; gap:var(--spacing-8);">
          <div>
            <!-- Banner Image -->
            <div style="border-radius:var(--radius-lg); overflow:hidden; aspect-ratio:16/9; margin-bottom:var(--spacing-8);">
              <img src="${tour.thumbnail || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=675&q=80'}" style="width:100%; height:100%; object-fit:cover;">
            </div>

            <!-- Description -->
            <div class="card" style="padding:var(--spacing-6); margin-bottom:var(--spacing-8);">
              <h3 style="margin-bottom:var(--spacing-3);"><i class="fa-solid fa-align-left"></i> Giới thiệu hành trình</h3>
              <p style="line-height:1.7;">${tour.description || 'Hành trình tour hấp dẫn được thiết kế tối ưu mang đến trải nghiệm tuyệt vời cho du khách.'}</p>
            </div>

            <!-- Timeline Itinerary -->
            <div style="margin-bottom:var(--spacing-8);">
              <h3><i class="fa-solid fa-timeline"></i> Lịch trình chi tiết theo ngày</h3>
              <div class="itinerary-timeline">
                ${tour.itinerary && tour.itinerary.length > 0 ? tour.itinerary.map(item => `
                  <div class="itinerary-day">
                    <div class="day-number">
                      <span>NGÀY</span>
                      <span class="num">${item.day_number}</span>
                    </div>
                    <div class="day-content">
                      <h4 style="margin-bottom:var(--spacing-2);">${item.title}</h4>
                      <p style="margin-bottom:var(--spacing-3);">${item.description}</p>
                      <div style="font-size:var(--font-xs); color:var(--text-muted); display:flex; gap:var(--spacing-4);">
                        ${item.meals ? `<span><i class="fa-solid fa-utensils"></i> Bữa ăn: ${item.meals}</span>` : ''}
                        ${item.accommodation ? `<span><i class="fa-solid fa-hotel"></i> Lưu trú: ${item.accommodation}</span>` : ''}
                      </div>
                    </div>
                  </div>
                `).join('') : '<p>Chưa có lịch trình chi tiết.</p>'}
              </div>
            </div>
          </div>

          <!-- Sidebar Info -->
          <div>
            <div class="card" style="padding:var(--spacing-6); position:sticky; top:calc(var(--header-height) + var(--spacing-4));">
              <h3 style="margin-bottom:var(--spacing-4); border-bottom:1px solid var(--border-color); padding-bottom:var(--spacing-3);">Chi tiết chuyến đi</h3>
              
              <div style="display:flex; flex-direction:column; gap:var(--spacing-4); font-size:var(--font-sm);">
                <div style="display:flex; align-items:center; gap:var(--spacing-3);">
                  <i class="fa-solid fa-calendar-days" style="color:var(--primary-color); font-size:18px;"></i>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:var(--font-xs);">Ngày khởi hành</span>
                    <strong>${formatDate(tour.departure_date)}</strong>
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap:var(--spacing-3);">
                  <i class="fa-solid fa-clock" style="color:var(--primary-color); font-size:18px;"></i>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:var(--font-xs);">Thời lượng</span>
                    <strong>${tour.days} Ngày / ${tour.nights} Đêm</strong>
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap:var(--spacing-3);">
                  <i class="fa-solid fa-plane" style="color:var(--primary-color); font-size:18px;"></i>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:var(--font-xs);">Phương tiện / Hãng bay</span>
                    <strong>${tour.airline_name || 'Xe du lịch cao cấp'} ${tour.aircraft ? `(${tour.aircraft})` : ''}</strong>
                  </div>
                </div>
              </div>

              <hr style="margin:var(--spacing-6) 0; border:none; border-top:1px solid var(--border-color);">

              <div>
                <h4 style="font-size:var(--font-sm); margin-bottom:var(--spacing-2); color:var(--success-color);"><i class="fa-solid fa-circle-check"></i> Dịch vụ bao gồm:</h4>
                <p style="font-size:var(--font-xs);">${tour.included_services || 'Vé máy bay, khách sạn 4 sao, các bữa ăn theo chương trình, HDV.'}</p>
              </div>

              <div style="margin-top:var(--spacing-4);">
                <h4 style="font-size:var(--font-sm); margin-bottom:var(--spacing-2); color:var(--danger-color);"><i class="fa-solid fa-circle-xmark"></i> Không bao gồm:</h4>
                <p style="font-size:var(--font-xs);">${tour.excluded_services || 'Chi phí cá nhân, tiền tip hướng dẫn viên.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async initEvents() {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');
    const tour = await TourService.getTourById(tourId);

    if (!tour) return;

    const btnSelect = document.getElementById('btn-select-tour');
    if (btnSelect) {
      btnSelect.addEventListener('click', () => {
        CartService.addTour(tour);
        Toast.success('Đã thêm tour du lịch vào giỏ hàng!');
        router.navigate('/cart');
      });
    }
  }
};
