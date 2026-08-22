import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

export const TourCard = {
  render(tour) {
    return `
      <div class="card tour-card">
        <div class="tour-thumb-wrapper">
          <img src="${tour.thumbnail || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=400&q=80'}" alt="${tour.name}" class="tour-thumb-img" loading="lazy">
          ${tour.featured ? `<span class="tour-badge-featured"><i class="fa-solid fa-star"></i> Nổi bật</span>` : ''}
        </div>
        <div class="tour-content">
          <h3 class="tour-title">${tour.name}</h3>
          <div class="tour-operator">
            <i class="fa-solid fa-building"></i> ${tour.operator}
          </div>
          <div class="tour-meta">
            <span><i class="fa-solid fa-clock"></i> ${tour.days} ngày / ${tour.nights} đêm</span>
            <span><i class="fa-solid fa-calendar-days"></i> Khởi hành: ${formatDate(tour.departure_date)}</span>
          </div>
          <div class="tour-footer">
            <div>
              <span style="font-size:var(--font-xs); color:var(--text-muted); display:block;">Giá trọn gói từ</span>
              <span class="price-tag">${formatCurrency(tour.price)}</span>
            </div>
            <a href="/tour-detail?id=${tour.id}" class="btn btn-primary btn-sm" data-link>Xem tour</a>
          </div>
        </div>
      </div>
    `;
  }
};
