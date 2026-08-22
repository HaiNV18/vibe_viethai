import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDuration } from '../utils/formatDate.js';

export const FlightCard = {
  render(flight) {
    const stopsText = flight.stops === 0 ? 'Bay thẳng' : `${flight.stops} điểm dừng`;

    return `
      <div class="card flight-card">
        <div class="airline-info">
          <img src="${flight.airline_logo || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80'}" alt="${flight.airline_name}" class="airline-logo-img">
          <div class="airline-details">
            <h4>${flight.airline_name}</h4>
            <span class="flight-code">${flight.flight_number} • ${flight.aircraft || 'Airbus'}</span>
          </div>
        </div>

        <div class="flight-schedule">
          <div class="time-box">
            <div class="time">${flight.departure_time}</div>
            <div class="airport-code">${flight.origin_code || 'SGN'}</div>
          </div>

          <div class="flight-path">
            <span class="duration-text">${formatDuration(flight.duration_minutes)}</span>
            <div class="path-line">
              <i class="fa-solid fa-plane"></i>
            </div>
            <span class="stops-text">${stopsText}</span>
          </div>

          <div class="time-box">
            <div class="time">${flight.arrival_time}</div>
            <div class="airport-code">${flight.destination_code || 'HAN'}</div>
          </div>
        </div>

        <div class="flight-price-action">
          <span class="badge badge-primary">Phổ thông</span>
          <div class="price-tag">${formatCurrency(flight.economy_price)}</div>
          <span class="price-unit">/ hành khách</span>
          <a href="/flight-detail?id=${flight.id}" class="btn btn-primary btn-sm" data-link>Xem chi tiết</a>
        </div>
      </div>
    `;
  }
};
