import { AuthService } from '../services/AuthService.js';
import { FlightService } from '../services/FlightService.js';
import { AirlineRepository } from '../repositories/AirlineRepository.js';
import { AdminSidebar } from '../components/AdminSidebar.js';
import { Toast } from '../components/Toast.js';
import { router } from '../router.js';

export const AdminCreateFlightPage = {
  async render() {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.navigate('/login');
      return '';
    }

    const airlines = AirlineRepository.getAllActive();

    return `
      <div class="container admin-layout">
        ${AdminSidebar.render('/admin/flights/create')}

        <main>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--spacing-6);">
            <div>
              <h2><i class="fa-solid fa-plus-circle"></i> Tạo Chuyến Bay Mới</h2>
              <p>Thêm thông tin chuyến bay mới vào cơ sở dữ liệu hệ thống</p>
            </div>
            <a href="/admin/flights" class="btn btn-outline btn-sm" data-link><i class="fa-solid fa-arrow-left"></i> Danh sách Chuyến Bay</a>
          </div>

          <div class="card" style="padding:var(--spacing-6);">
            <form id="create-flight-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="fl-number">Mã Chuyến Bay *</label>
                  <input type="text" class="form-control" id="fl-number" placeholder="Ví dụ: VN208 hoặc VJ123" required>
                </div>
                <div class="form-group">
                  <label for="fl-airline">Hãng Hàng Không *</label>
                  <select class="form-control" id="fl-airline" required>
                    <option value="">-- Chọn hãng bay --</option>
                    ${airlines.map(a => `<option value="${a.id}">${a.name} (${a.code})</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="fl-origin">Sân Bay Đi *</label>
                  <select class="form-control" id="fl-origin" required>
                    <option value="1">SGN — Hồ Chí Minh (Tân Sơn Nhất)</option>
                    <option value="2">HAN — Hà Nội (Nội Bài)</option>
                    <option value="3">DAD — Đà Nẵng</option>
                    <option value="4">CXR — Khánh Hòa (Cam Ranh)</option>
                    <option value="5">PQC — Phú Quốc</option>
                    <option value="7">SIN — Singapore (Changi)</option>
                    <option value="8">BKK — Bangkok (Suvarnabhumi)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="fl-dest">Sân Bay Đến *</label>
                  <select class="form-control" id="fl-dest" required>
                    <option value="2">HAN — Hà Nội (Nội Bài)</option>
                    <option value="1">SGN — Hồ Chí Minh (Tân Sơn Nhất)</option>
                    <option value="3">DAD — Đà Nẵng</option>
                    <option value="4">CXR — Khánh Hòa (Cam Ranh)</option>
                    <option value="5">PQC — Phú Quốc</option>
                    <option value="7">SIN — Singapore (Changi)</option>
                    <option value="8">BKK — Bangkok (Suvarnabhumi)</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="fl-date">Ngày Khởi Hành *</label>
                  <input type="date" class="form-control" id="fl-date" value="2026-09-15" required>
                </div>
                <div class="form-group">
                  <label for="fl-dep-time">Giờ Cất Cánh *</label>
                  <input type="time" class="form-control" id="fl-dep-time" value="08:30" required>
                </div>
                <div class="form-group">
                  <label for="fl-arr-time">Giờ Hạ Cánh *</label>
                  <input type="time" class="form-control" id="fl-arr-time" value="10:40" required>
                </div>
                <div class="form-group">
                  <label for="fl-duration">Thời Gian Bay (Phút) *</label>
                  <input type="number" class="form-control" id="fl-duration" value="130" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="fl-triptype">Loại Chuyến Bay *</label>
                  <select class="form-control" id="fl-triptype" required>
                    <option value="one-way">Một chiều</option>
                    <option value="round-trip" selected>Khứ hồi</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="fl-stops">Số Điểm Dừng *</label>
                  <select class="form-control" id="fl-stops" required>
                    <option value="0">0 (Bay thẳng)</option>
                    <option value="1">1 điểm dừng</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="fl-aircraft">Loại Máy Bay</label>
                  <input type="text" class="form-control" id="fl-aircraft" value="Airbus A321">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="fl-eco-price">Giá Vé Phổ Thông (VND) *</label>
                  <input type="number" class="form-control" id="fl-eco-price" placeholder="2350000" required>
                </div>
                <div class="form-group">
                  <label for="fl-bus-price">Giá Vé Thương Gia (VND) *</label>
                  <input type="number" class="form-control" id="fl-bus-price" placeholder="5900000" required>
                </div>
              </div>

              <div class="form-group">
                <label for="fl-services">Dịch Vụ Đi Kèm</label>
                <input type="text" class="form-control" id="fl-services" value="Hành lý xách tay 7kg, Suất ăn nóng & nước uống">
              </div>

              <div style="text-align:right; margin-top:var(--spacing-6);">
                <button type="submit" class="btn btn-primary btn-lg">
                  <i class="fa-solid fa-floppy-disk"></i> Lưu Chuyến Bay Mới
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

    const form = document.getElementById('create-flight-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const flightData = {
        flight_number: document.getElementById('fl-number').value.trim(),
        airline_id: parseInt(document.getElementById('fl-airline').value),
        origin_airport_id: parseInt(document.getElementById('fl-origin').value),
        destination_airport_id: parseInt(document.getElementById('fl-dest').value),
        departure_date: document.getElementById('fl-date').value,
        departure_time: document.getElementById('fl-dep-time').value,
        arrival_time: document.getElementById('fl-arr-time').value,
        duration_minutes: parseInt(document.getElementById('fl-duration').value),
        trip_type: document.getElementById('fl-triptype').value,
        stops: parseInt(document.getElementById('fl-stops').value),
        aircraft: document.getElementById('fl-aircraft').value.trim(),
        economy_price: parseFloat(document.getElementById('fl-eco-price').value),
        business_price: parseFloat(document.getElementById('fl-bus-price').value),
        services: document.getElementById('fl-services').value.trim()
      };

      try {
        FlightService.createFlight(flightData);
        Toast.success('Tạo chuyến bay mới thành công!');
        router.navigate('/admin/flights');
      } catch (err) {
        Toast.error(err.message || 'Tạo chuyến bay thất bại.');
      }
    });
  }
};
