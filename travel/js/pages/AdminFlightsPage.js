import { AuthService } from '../services/AuthService.js';
import { FlightService } from '../services/FlightService.js';
import { AdminSidebar } from '../components/AdminSidebar.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate, formatDuration } from '../utils/formatDate.js';
import { router } from '../router.js';

export const AdminFlightsPage = {
  async render() {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.navigate('/login');
      return '';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;
    const pageSize = 20;

    const data = await FlightService.getPaginatedFlights(currentPage, pageSize);
    const { items, totalCount, totalPages } = data;

    return `
      <div class="container admin-layout">
        ${AdminSidebar.render('/admin/flights')}

        <main>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--spacing-6);">
            <div>
              <h2><i class="fa-solid fa-plane"></i> Quản Lý Chuyến Bay (Supabase Cloud)</h2>
              <p>Tổng số <strong>${totalCount}</strong> chuyến bay trong cơ sở dữ liệu Supabase</p>
            </div>
            <a href="/admin/flights/create" class="btn btn-primary" data-link><i class="fa-solid fa-plus"></i> Tạo Chuyến Bay Mới</a>
          </div>

          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hãng Bay</th>
                  <th>Mã Chuyến</th>
                  <th>Điểm Đi</th>
                  <th>Điểm Đến</th>
                  <th>Giờ Bay</th>
                  <th>Thời Gian</th>
                  <th>Máy Bay</th>
                  <th>Giá Phổ Thông</th>
                  <th>Giá Thương Gia</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(f => `
                  <tr>
                    <td><strong>#${f.id}</strong></td>
                    <td><strong>${f.airline_name}</strong></td>
                    <td><span class="badge badge-primary">${f.flight_number}</span></td>
                    <td>${f.origin_code}</td>
                    <td>${f.destination_code}</td>
                    <td>${f.departure_time} - ${f.arrival_time}</td>
                    <td>${formatDuration(f.duration_minutes)}</td>
                    <td>${f.aircraft || 'A320'}</td>
                    <td>${formatCurrency(f.economy_price)}</td>
                    <td><strong style="color:var(--accent-hover);">${formatCurrency(f.business_price)}</strong></td>
                    <td><span class="badge badge-success">${f.status}</span></td>
                    <td>
                      <a href="/flight-detail?id=${f.id}" class="btn btn-outline btn-sm" data-link title="Xem chi tiết"><i class="fa-solid fa-eye"></i></a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- SQL Pagination Controls -->
            <div class="pagination">
              <div style="font-size:var(--font-xs); color:var(--text-muted);">
                Hiển thị trang ${currentPage} / ${totalPages || 1} (${totalCount} bản ghi)
              </div>

              <div class="page-numbers">
                <button class="page-num-btn ${currentPage <= 1 ? 'disabled' : ''}" id="prev-page-btn" ${currentPage <= 1 ? 'disabled' : ''}>
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
                
                ${Array.from({ length: totalPages || 1 }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 3), Math.min(totalPages || 1, currentPage + 2))
                  .map(num => `
                    <button class="page-num-btn ${num === currentPage ? 'active' : ''}" data-page="${num}">${num}</button>
                  `).join('')}

                <button class="page-num-btn ${currentPage >= totalPages ? 'disabled' : ''}" id="next-page-btn" ${currentPage >= totalPages ? 'disabled' : ''}>
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  },

  initEvents() {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') return;

    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;

    document.querySelectorAll('.page-num-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-page');
        router.navigate(`/admin/flights?page=${p}`);
      });
    });

    const prevBtn = document.getElementById('prev-page-btn');
    if (prevBtn && currentPage > 1) {
      prevBtn.addEventListener('click', () => {
        router.navigate(`/admin/flights?page=${currentPage - 1}`);
      });
    }

    const nextBtn = document.getElementById('next-page-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        router.navigate(`/admin/flights?page=${currentPage + 1}`);
      });
    }
  }
};
