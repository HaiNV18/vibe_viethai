import { TourService } from '../services/TourService.js';
import { FilterSidebar } from '../components/FilterSidebar.js';
import { TourCard } from '../components/TourCard.js';
import { router } from '../router.js';

export const ToursPage = {
  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParams = {
      destination: urlParams.get('destination') || '',
      operator: urlParams.get('operator') || '',
      days: urlParams.get('days') || '',
      country: urlParams.get('country') || '',
      sortBy: urlParams.get('sortBy') || 'price-asc'
    };

    const tours = await TourService.searchTours(filterParams);

    return `
      <div class="container">
        <div style="padding: var(--spacing-6) 0 var(--spacing-2);">
          <h2><i class="fa-solid fa-map-location-dot"></i> Danh Sách Tour Du Lịch</h2>
          <p>Khám phá <strong>${tours.length}</strong> hành trình tour trọn gói tuyệt vời</p>
        </div>

        <div class="page-layout">
          <aside id="filter-sidebar-container">
            ${FilterSidebar.renderToursFilter(filterParams)}
          </aside>

          <main id="tours-list-container">
            ${tours.length > 0 ? `
              <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:var(--spacing-6);">
                ${tours.map(tour => TourCard.render(tour)).join('')}
              </div>
            ` : `
              <div class="empty-state">
                <i class="fa-solid fa-route"></i>
                <h3>Không tìm thấy tour phù hợp</h3>
                <p>Vui lòng thử điều chỉnh lại bộ lọc hoặc tìm kiếm tên điểm đến khác.</p>
              </div>
            `}
          </main>
        </div>
      </div>
    `;
  },

  initEvents() {
    const sidebar = document.getElementById('filter-sidebar-container');
    if (!sidebar) return;

    const applyFilters = () => {
      const sortBy = sidebar.querySelector('input[name="sortBy"]:checked')?.value || 'price-asc';
      const operator = sidebar.querySelector('input[name="operator"]:checked')?.value || '';
      const days = sidebar.querySelector('input[name="days"]:checked')?.value || '';

      const searchParams = new URLSearchParams();
      if (sortBy) searchParams.set('sortBy', sortBy);
      if (operator) searchParams.set('operator', operator);
      if (days) searchParams.set('days', days);

      router.navigate(`/tours?${searchParams.toString()}`);
    };

    sidebar.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', applyFilters);
    });

    const resetBtn = document.getElementById('reset-filter-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        router.navigate('/tours');
      });
    }
  }
};
