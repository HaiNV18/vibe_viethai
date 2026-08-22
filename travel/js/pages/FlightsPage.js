import { FlightService } from '../services/FlightService.js';
import { FilterSidebar } from '../components/FilterSidebar.js';
import { FlightCard } from '../components/FlightCard.js';
import { router } from '../router.js';

export const FlightsPage = {
  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParams = {
      origin: urlParams.get('origin') || '',
      destination: urlParams.get('destination') || '',
      departureDate: urlParams.get('departureDate') || '',
      tripType: urlParams.get('tripType') || '',
      stops: urlParams.get('stops') !== null ? urlParams.get('stops') : '',
      timeRange: urlParams.get('timeRange') || '',
      sortBy: urlParams.get('sortBy') || 'price-asc',
      airlineIds: urlParams.getAll('airlineIds')
    };

    if (urlParams.get('airlineId') && filterParams.airlineIds.length === 0) {
      filterParams.airlineIds.push(urlParams.get('airlineId'));
    }

    const flights = FlightService.searchFlights(filterParams);

    return `
      <div class="container">
        <div style="padding: var(--spacing-6) 0 var(--spacing-2);">
          <h2><i class="fa-solid fa-plane"></i> Danh Sách Chuyến Bay</h2>
          <p>Tìm thấy <strong>${flights.length}</strong> chuyến bay phù hợp với yêu cầu của bạn</p>
        </div>

        <div class="page-layout">
          <aside id="filter-sidebar-container">
            ${FilterSidebar.renderFlightsFilter(filterParams)}
          </aside>

          <main id="flights-list-container">
            ${flights.length > 0 ? `
              ${flights.map(flight => FlightCard.render(flight)).join('')}
            ` : `
              <div class="empty-state">
                <i class="fa-solid fa-plane-slash"></i>
                <h3>Không tìm thấy chuyến bay phù hợp</h3>
                <p>Vui lòng thử điều chỉnh lại bộ lọc hoặc tìm kiếm theo ngày đi/điểm đến khác.</p>
              </div>
            `}
          </main>
        </div>
      </div>
    `;
  },

  initEvents() {
    // Attach change listeners to filter inputs
    const sidebar = document.getElementById('filter-sidebar-container');
    if (!sidebar) return;

    const applyFilters = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sortBy = sidebar.querySelector('input[name="sortBy"]:checked')?.value || 'price-asc';
      const tripType = sidebar.querySelector('input[name="tripType"]:checked')?.value || '';
      const stops = sidebar.querySelector('input[name="stops"]:checked')?.value ?? '';
      const timeRange = sidebar.querySelector('input[name="timeRange"]:checked')?.value || '';

      const selectedAirlines = Array.from(sidebar.querySelectorAll('input[name="airlineIds"]:checked')).map(cb => cb.value);

      const searchParams = new URLSearchParams();
      if (urlParams.get('origin')) searchParams.set('origin', urlParams.get('origin'));
      if (urlParams.get('destination')) searchParams.set('destination', urlParams.get('destination'));
      if (urlParams.get('departureDate')) searchParams.set('departureDate', urlParams.get('departureDate'));

      if (sortBy) searchParams.set('sortBy', sortBy);
      if (tripType) searchParams.set('tripType', tripType);
      if (stops !== '') searchParams.set('stops', stops);
      if (timeRange) searchParams.set('timeRange', timeRange);

      selectedAirlines.forEach(id => searchParams.append('airlineIds', id));

      router.navigate(`/flights?${searchParams.toString()}`);
    };

    sidebar.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', applyFilters);
    });

    const resetBtn = document.getElementById('reset-filter-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        router.navigate('/flights');
      });
    }
  }
};
