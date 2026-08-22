import { AuthService } from '../services/AuthService.js';
import { TourService } from '../services/TourService.js';
import { AdminSidebar } from '../components/AdminSidebar.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';
import { router } from '../router.js';

export const AdminToursPage = {
  async render() {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.navigate('/login');
      return '';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;
    const pageSize = 20;

    const data = await TourService.getPaginatedTours(currentPage, pageSize);
    const { items, totalCount, totalPages } = data;

    return `
      <div class="container admin-layout">
        ${AdminSidebar.render('/admin/tours')}

        <main>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--spacing-6);">
            <div>
              <h2><i class="fa-solid fa-suitcase"></i> Quản Lý Tour Du Lịch (Supabase Cloud)</h2>
              <p>Tổng số <strong>${totalCount}</strong> tour du lịch trong cơ sở dữ liệu Supabase</p>
            </div>
            <a href="/admin/tours/create" class="btn btn-primary" data-link><i class="fa-solid fa-plus"></i> Tạo Tour Mới</a>
          </div>

          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Tour</th>
                  <th>Điểm Đi</th>
                  <th>Điểm Đến</th>
                  <th>Khởi Hành</th>
                  <th>Số Ngày</th>
                  <th>Giá Trọn Gói</th>
                  <th>Nhà Tổ Chức</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(t => `
                  <tr>
                    <td><strong>#${t.id}</strong></td>
                    <td style="max-width:240px; font-weight:600; color:var(--text-main);">${t.name}</td>
                    <td>${t.origin}</td>
                    <td>${t.destination}</td>
                    <td>${formatDate(t.departure_date)}</td>
                    <td>${t.days} ngày ${t.nights} đêm</td>
                    <td><strong style="color:var(--primary-color);">${formatCurrency(t.price)}</strong></td>
                    <td>${t.operator}</td>
                    <td><span class="badge badge-success">${t.status}</span></td>
                    <td>
                      <a href="/tour-detail?id=${t.id}" class="btn btn-outline btn-sm" data-link title="Xem chi tiết"><i class="fa-solid fa-eye"></i></a>
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
        router.navigate(`/admin/tours?page=${p}`);
      });
    });

    const prevBtn = document.getElementById('prev-page-btn');
    if (prevBtn && currentPage > 1) {
      prevBtn.addEventListener('click', () => {
        router.navigate(`/admin/tours?page=${currentPage - 1}`);
      });
    }

    const nextBtn = document.getElementById('next-page-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        router.navigate(`/admin/tours?page=${currentPage + 1}`);
      });
    }
  }
};
