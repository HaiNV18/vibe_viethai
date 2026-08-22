export const FilterSidebar = {
  renderFlightsFilter(currentFilters = {}) {
    const airlinesList = [
      { id: 1, name: 'VietJet Air' },
      { id: 2, name: 'Vietnam Airlines' },
      { id: 3, name: 'Bamboo Airways' },
      { id: 4, name: 'Pacific Airlines' },
      { id: 5, name: 'Singapore Airlines' },
      { id: 6, name: 'Thai Airways' },
      { id: 7, name: 'AirAsia' },
      { id: 8, name: 'Korean Air' },
      { id: 9, name: 'Japan Airlines' },
      { id: 10, name: 'Emirates' }
    ];

    const selectedAirlines = currentFilters.airlineIds || [];

    return `
      <div class="filter-sidebar">
        <div class="filter-header">
          <h3><i class="fa-solid fa-filter"></i> Bộ lọc chuyến bay</h3>
          <button class="btn btn-outline btn-sm" id="reset-filter-btn">Xóa lọc</button>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">Sắp xếp giá</div>
          <div class="filter-options">
            <label class="checkbox-label">
              <input type="radio" name="sortBy" value="price-asc" ${currentFilters.sortBy !== 'price-desc' ? 'checked' : ''}>
              Giá thấp đến cao
            </label>
            <label class="checkbox-label">
              <input type="radio" name="sortBy" value="price-desc" ${currentFilters.sortBy === 'price-desc' ? 'checked' : ''}>
              Giá cao đến thấp
            </label>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">Loại vé</div>
          <div class="filter-options">
            <label class="checkbox-label">
              <input type="radio" name="tripType" value="" ${!currentFilters.tripType ? 'checked' : ''}> Tất cả
            </label>
            <label class="checkbox-label">
              <input type="radio" name="tripType" value="one-way" ${currentFilters.tripType === 'one-way' ? 'checked' : ''}> Một chiều
            </label>
            <label class="checkbox-label">
              <input type="radio" name="tripType" value="round-trip" ${currentFilters.tripType === 'round-trip' ? 'checked' : ''}> Khứ hồi
            </label>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">Số điểm dừng</div>
          <div class="filter-options">
            <label class="checkbox-label">
              <input type="radio" name="stops" value="" ${currentFilters.stops === undefined || currentFilters.stops === '' ? 'checked' : ''}> Tất cả
            </label>
            <label class="checkbox-label">
              <input type="radio" name="stops" value="0" ${currentFilters.stops === '0' ? 'checked' : ''}> Bay thẳng
            </label>
            <label class="checkbox-label">
              <input type="radio" name="stops" value="1" ${currentFilters.stops === '1' ? 'checked' : ''}> 1 điểm dừng
            </label>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">Giờ cất cánh</div>
          <div class="filter-options">
            <label class="checkbox-label">
              <input type="radio" name="timeRange" value="" ${!currentFilters.timeRange ? 'checked' : ''}> Tất cả khung giờ
            </label>
            <label class="checkbox-label">
              <input type="radio" name="timeRange" value="0-6" ${currentFilters.timeRange === '0-6' ? 'checked' : ''}> Đêm (00:00 – 06:00)
            </label>
            <label class="checkbox-label">
              <input type="radio" name="timeRange" value="6-12" ${currentFilters.timeRange === '6-12' ? 'checked' : ''}> Sáng (06:00 – 12:00)
            </label>
            <label class="checkbox-label">
              <input type="radio" name="timeRange" value="12-18" ${currentFilters.timeRange === '12-18' ? 'checked' : ''}> Chiều (12:00 – 18:00)
            </label>
            <label class="checkbox-label">
              <input type="radio" name="timeRange" value="18-24" ${currentFilters.timeRange === '18-24' ? 'checked' : ''}> Tối (18:00 – 24:00)
            </label>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">Hãng hàng không</div>
          <div class="filter-options">
            ${airlinesList.map(a => `
              <label class="checkbox-label">
                <input type="checkbox" name="airlineIds" value="${a.id}" ${selectedAirlines.includes(String(a.id)) ? 'checked' : ''}>
                ${a.name}
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderToursFilter(currentFilters = {}) {
    const operatorsList = ['TravelViet Heritage', 'Vietnam Travel', 'Island Escape', 'Highland Tour', 'Mekong Discovery', 'Global Explorer'];

    return `
      <div class="filter-sidebar">
        <div class="filter-header">
          <h3><i class="fa-solid fa-filter"></i> Bộ lọc tour</h3>
          <button class="btn btn-outline btn-sm" id="reset-filter-btn">Xóa lọc</button>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">Sắp xếp giá</div>
          <div class="filter-options">
            <label class="checkbox-label">
              <input type="radio" name="sortBy" value="price-asc" ${currentFilters.sortBy !== 'price-desc' ? 'checked' : ''}>
              Giá thấp đến cao
            </label>
            <label class="checkbox-label">
              <input type="radio" name="sortBy" value="price-desc" ${currentFilters.sortBy === 'price-desc' ? 'checked' : ''}>
              Giá cao đến thấp
            </label>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">Nhà tổ chức (Tour Operator)</div>
          <div class="filter-options">
            <label class="checkbox-label">
              <input type="radio" name="operator" value="" ${!currentFilters.operator ? 'checked' : ''}> Tất cả
            </label>
            ${operatorsList.map(op => `
              <label class="checkbox-label">
                <input type="radio" name="operator" value="${op}" ${currentFilters.operator === op ? 'checked' : ''}> ${op}
              </label>
            `).join('')}
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">Thời lượng</div>
          <div class="filter-options">
            <label class="checkbox-label">
              <input type="radio" name="days" value="" ${!currentFilters.days ? 'checked' : ''}> Tất cả
            </label>
            <label class="checkbox-label">
              <input type="radio" name="days" value="3" ${currentFilters.days === '3' ? 'checked' : ''}> 3 ngày
            </label>
            <label class="checkbox-label">
              <input type="radio" name="days" value="4" ${currentFilters.days === '4' ? 'checked' : ''}> 4 ngày
            </label>
            <label class="checkbox-label">
              <input type="radio" name="days" value="5" ${currentFilters.days === '5' ? 'checked' : ''}> 5 ngày trở lên
            </label>
          </div>
        </div>
      </div>
    `;
  }
};
