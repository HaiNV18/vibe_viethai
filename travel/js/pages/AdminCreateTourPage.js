import { AuthService } from '../services/AuthService.js';
import { TourService } from '../services/TourService.js';
import { AdminSidebar } from '../components/AdminSidebar.js';
import { Toast } from '../components/Toast.js';
import { router } from '../router.js';

export const AdminCreateTourPage = {
  async render() {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.navigate('/login');
      return '';
    }

    return `
      <div class="container admin-layout">
        ${AdminSidebar.render('/admin/tours/create')}

        <main>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--spacing-6);">
            <div>
              <h2><i class="fa-solid fa-plus-circle"></i> Tạo Tour Du Lịch Mới</h2>
              <p>Thêm thông tin tour du lịch mới vào cơ sở dữ liệu hệ thống</p>
            </div>
            <a href="/admin/tours" class="btn btn-outline btn-sm" data-link><i class="fa-solid fa-arrow-left"></i> Danh sách Tour</a>
          </div>

          <div class="card" style="padding:var(--spacing-6);">
            <form id="create-tour-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="tour-name">Tên Tour *</label>
                  <input type="text" class="form-control" id="tour-name" placeholder="Ví dụ: Tour Hà Nội — SaPa 3N2Đ" required>
                </div>
                <div class="form-group">
                  <label for="tour-operator">Nhà Tổ Chức (Operator) *</label>
                  <input type="text" class="form-control" id="tour-operator" placeholder="TravelViet Heritage" value="TravelViet Heritage" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="tour-origin">Điểm Đi *</label>
                  <input type="text" class="form-control" id="tour-origin" placeholder="TP. Hồ Chí Minh" value="TP. Hồ Chí Minh" required>
                </div>
                <div class="form-group">
                  <label for="tour-dest">Điểm Đến *</label>
                  <input type="text" class="form-control" id="tour-dest" placeholder="Đà Nẵng" required>
                </div>
                <div class="form-group">
                  <label for="tour-country">Quốc Gia *</label>
                  <input type="text" class="form-control" id="tour-country" value="Vietnam" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="tour-date">Ngày Khởi Hành *</label>
                  <input type="date" class="form-control" id="tour-date" value="2026-10-01" required>
                </div>
                <div class="form-group">
                  <label for="tour-days">Số Ngày *</label>
                  <input type="number" class="form-control" id="tour-days" value="4" min="1" required>
                </div>
                <div class="form-group">
                  <label for="tour-nights">Số Đêm *</label>
                  <input type="number" class="form-control" id="tour-nights" value="3" min="0" required>
                </div>
                <div class="form-group">
                  <label for="tour-price">Giá Tour (VND) *</label>
                  <input type="number" class="form-control" id="tour-price" placeholder="5990000" required>
                </div>
              </div>

              <div class="form-group">
                <label for="tour-thumb">URL Hình Ảnh (Thumbnail 600x400)</label>
                <input type="url" class="form-control" id="tour-thumb" placeholder="https://images.unsplash.com/..." value="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=400&q=80">
              </div>

              <div class="form-group">
                <label for="tour-desc">Mô Tả Chi Tiết</label>
                <textarea class="form-control" id="tour-desc" rows="3" placeholder="Giới thiệu điểm nổi bật của tour..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="tour-included">Dịch Vụ Bao Gồm</label>
                  <input type="text" class="form-control" id="tour-included" value="Vé máy bay khứ hồi, Khách sạn 4 sao, Các bữa ăn theo chương trình, Xe đưa đón, HDV">
                </div>
                <div class="form-group">
                  <label for="tour-excluded">Dịch Vụ Không Bao Gồm</label>
                  <input type="text" class="form-control" id="tour-excluded" value="Chi phí cá nhân, Tiền tip HDV">
                </div>
              </div>

              <div style="margin-top:var(--spacing-6); border-top:1px solid var(--border-color); padding-top:var(--spacing-4);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--spacing-4);">
                  <h3><i class="fa-solid fa-timeline"></i> Lịch Trình Tour Theo Ngày</h3>
                  <button type="button" class="btn btn-outline btn-sm" id="add-itinerary-day-btn"><i class="fa-solid fa-plus"></i> Thêm Ngày</button>
                </div>

                <div id="itinerary-list-container">
                  <div class="itinerary-input-row" style="background:var(--bg-color); padding:var(--spacing-4); border-radius:var(--radius-md); margin-bottom:var(--spacing-3);">
                    <div style="font-weight:700; margin-bottom:var(--spacing-2);">Ngày 1</div>
                    <div class="form-group">
                      <input type="text" class="form-control it-title" placeholder="Tiêu đề ngày 1 (Vd: TP.HCM -> Đà Nẵng)" value="TP.HCM → Điểm Đến - Nhận phòng" required>
                    </div>
                    <div class="form-group">
                      <textarea class="form-control it-desc" rows="2" placeholder="Nội dung hoạt động ngày 1..." required>Xe đưa đón đoàn tại sân bay, di chuyển về khách sạn nhận phòng nghỉ ngơi và tự do khám phá.</textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div style="text-align:right; margin-top:var(--spacing-6);">
                <button type="submit" class="btn btn-primary btn-lg">
                  <i class="fa-solid fa-floppy-disk"></i> Lưu Tour Mới
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    `;
  },

  initEvents() {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') return;

    let dayCount = 1;
    const addDayBtn = document.getElementById('add-itinerary-day-btn');
    const itinContainer = document.getElementById('itinerary-list-container');

    if (addDayBtn && itinContainer) {
      addDayBtn.addEventListener('click', () => {
        dayCount++;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'itinerary-input-row';
        dayDiv.style.cssText = 'background:var(--bg-color); padding:var(--spacing-4); border-radius:var(--radius-md); margin-bottom:var(--spacing-3);';
        dayDiv.innerHTML = `
          <div style="font-weight:700; margin-bottom:var(--spacing-2);">Ngày ${dayCount}</div>
          <div class="form-group">
            <input type="text" class="form-control it-title" placeholder="Tiêu đề ngày ${dayCount}" required>
          </div>
          <div class="form-group">
            <textarea class="form-control it-desc" rows="2" placeholder="Nội dung hoạt động ngày ${dayCount}..." required></textarea>
          </div>
        `;
        itinContainer.appendChild(dayDiv);
      });
    }

    const form = document.getElementById('create-tour-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const tourData = {
        name: document.getElementById('tour-name').value.trim(),
        operator: document.getElementById('tour-operator').value.trim(),
        origin: document.getElementById('tour-origin').value.trim(),
        destination: document.getElementById('tour-dest').value.trim(),
        country: document.getElementById('tour-country').value.trim(),
        departure_date: document.getElementById('tour-date').value,
        days: parseInt(document.getElementById('tour-days').value),
        nights: parseInt(document.getElementById('tour-nights').value),
        price: parseFloat(document.getElementById('tour-price').value),
        thumbnail: document.getElementById('tour-thumb').value.trim(),
        description: document.getElementById('tour-desc').value.trim(),
        included_services: document.getElementById('tour-included').value.trim(),
        excluded_services: document.getElementById('tour-excluded').value.trim(),
        featured: 0
      };

      const itineraryRows = document.querySelectorAll('.itinerary-input-row');
      const itineraries = [];
      itineraryRows.forEach((row, idx) => {
        const title = row.querySelector('.it-title').value.trim();
        const desc = row.querySelector('.it-desc').value.trim();
        if (title && desc) {
          itineraries.push({
            day_number: idx + 1,
            title,
            description: desc,
            meals: 'Sáng, Trưa',
            accommodation: 'Khách sạn 4 sao'
          });
        }
      });

      try {
        TourService.createTour(tourData, itineraries);
        Toast.success('Tạo tour du lịch mới thành công!');
        router.navigate('/admin/tours');
      } catch (err) {
        Toast.error(err.message || 'Tạo tour thất bại.');
      }
    });
  }
};
