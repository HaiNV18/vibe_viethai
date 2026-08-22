import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate, formatDuration } from '../utils/formatDate.js';

export const CartItem = {
  renderFlightItem(item) {
    const { flight, fare_class, price, quantity, cart_item_id } = item;
    return `
      <div class="card" style="padding: var(--spacing-4); margin-bottom: var(--spacing-4);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="display:flex; gap:var(--spacing-3);">
            <img src="${flight.airline_logo || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80'}" style="width:40px; height:40px; object-fit:contain; border-radius:4px; border:1px solid var(--border-color); padding:2px;">
            <div>
              <h4 style="font-size:var(--font-base);">${flight.airline_name} — ${flight.flight_number}</h4>
              <div style="font-size:var(--font-xs); color:var(--text-muted); margin-top:2px;">
                <span><i class="fa-solid fa-plane-departure"></i> ${flight.origin_code} (${flight.departure_time})</span>
                <i class="fa-solid fa-arrow-right" style="margin:0 4px;"></i>
                <span><i class="fa-solid fa-plane-arrival"></i> ${flight.destination_code} (${flight.arrival_time})</span>
              </div>
              <div style="margin-top:var(--spacing-2);">
                <span class="badge badge-primary">Hạng: ${fare_class}</span>
                <span class="badge badge-warning" style="margin-left:4px;">Ngày: ${formatDate(flight.departure_date)}</span>
              </div>
            </div>
          </div>
          <div style="text-align:right;">
            <div class="price-tag" style="font-size:var(--font-lg);">${formatCurrency(price * quantity)}</div>
            ${quantity > 1 ? `<div style="font-size:var(--font-xs); color:var(--text-muted);">${formatCurrency(price)} x ${quantity}</div>` : ''}
            <button class="btn btn-outline btn-sm remove-cart-item-btn" data-id="${cart_item_id}" style="margin-top:var(--spacing-3); color:var(--danger-color); border-color:#f8d7da;">
              <i class="fa-solid fa-trash"></i> Xóa
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderTourItem(item) {
    const { tour, price, quantity, cart_item_id } = item;
    return `
      <div class="card" style="padding: var(--spacing-4); margin-bottom: var(--spacing-4);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="display:flex; gap:var(--spacing-3);">
            <img src="${tour.thumbnail || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=400&q=80'}" style="width:80px; height:60px; object-fit:cover; border-radius:6px;">
            <div>
              <h4 style="font-size:var(--font-base);">${tour.name}</h4>
              <div style="font-size:var(--font-xs); color:var(--text-muted); margin-top:2px;">
                <span><i class="fa-solid fa-clock"></i> ${tour.days}N${tour.nights}Đ</span> •
                <span><i class="fa-solid fa-calendar-days"></i> Khởi hành: ${formatDate(tour.departure_date)}</span>
              </div>
              <div style="margin-top:var(--spacing-2);">
                <span class="badge badge-success">Tour Operator: ${tour.operator}</span>
              </div>
            </div>
          </div>
          <div style="text-align:right;">
            <div class="price-tag" style="font-size:var(--font-lg);">${formatCurrency(price * quantity)}</div>
            ${quantity > 1 ? `<div style="font-size:var(--font-xs); color:var(--text-muted);">${formatCurrency(price)} x ${quantity}</div>` : ''}
            <button class="btn btn-outline btn-sm remove-cart-item-btn" data-id="${cart_item_id}" style="margin-top:var(--spacing-3); color:var(--danger-color); border-color:#f8d7da;">
              <i class="fa-solid fa-trash"></i> Xóa
            </button>
          </div>
        </div>
      </div>
    `;
  }
};
