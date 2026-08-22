import { AuthService } from '../services/AuthService.js';
import { DashboardService } from '../services/DashboardService.js';
import { AdminSidebar } from '../components/AdminSidebar.js';
import { router } from '../router.js';

export const DashboardPage = {
  async render() {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.navigate('/login');
      return '';
    }

    const data = DashboardService.getDashboardData();
    const { kpis, topCountries } = data;

    return `
      <div class="container admin-layout">
        ${AdminSidebar.render('/dashboard')}

        <main>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--spacing-6);">
            <div>
              <h2><i class="fa-solid fa-chart-line"></i> Admin Dashboard</h2>
              <p>Tổng quan chỉ số hoạt động & thống kê hệ thống TravelViet</p>
            </div>
          </div>

          <!-- 4 KPI Cards -->
          <div class="dashboard-kpi-grid">
            <div class="kpi-card">
              <div class="kpi-icon"><i class="fa-solid fa-route"></i></div>
              <div>
                <div class="kpi-value">${kpis.monthlyTourCount}</div>
                <div class="kpi-label">Lượt tour trong tháng</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon"><i class="fa-solid fa-plane-departure"></i></div>
              <div>
                <div class="kpi-value">${kpis.flightCount}</div>
                <div class="kpi-label">Số chuyến bay hệ thống</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon" style="background:#d1e7dd; color:var(--success-color);"><i class="fa-solid fa-users"></i></div>
              <div>
                <div class="kpi-value">${kpis.tourCustomerCount}</div>
                <div class="kpi-label">Số khách đặt tour</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon" style="background:#fff3cd; color:#b28200;"><i class="fa-solid fa-user-check"></i></div>
              <div>
                <div class="kpi-value">${kpis.flightCustomerCount}</div>
                <div class="kpi-label">Số khách đặt chuyến bay</div>
              </div>
            </div>
          </div>

          <!-- Charts Grid -->
          <div class="charts-grid">
            <!-- Bar Chart -->
            <div class="chart-card">
              <h3 style="margin-bottom:var(--spacing-4); font-size:var(--font-base);"><i class="fa-solid fa-chart-column"></i> Top 10 Hãng Bay Đặt Nhiều Nhất</h3>
              <div style="position:relative; height:300px;">
                <canvas id="bar-chart-airlines"></canvas>
              </div>
            </div>

            <!-- Pie Chart -->
            <div class="chart-card">
              <h3 style="margin-bottom:var(--spacing-4); font-size:var(--font-base);"><i class="fa-solid fa-chart-pie"></i> Tỷ Lệ Quốc Gia Có Khách Đặt Tour</h3>
              <div style="position:relative; height:300px;">
                <canvas id="pie-chart-countries"></canvas>
              </div>
            </div>
          </div>

          <!-- Top 10 Countries Table -->
          <div class="chart-card">
            <h3 style="margin-bottom:var(--spacing-4); font-size:var(--font-base);"><i class="fa-solid fa-globe"></i> Top 10 Quốc Gia Có Lượng Đặt Tour Nhiều Nhất</h3>
            
            <div class="data-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Đất Nước (Quốc gia)</th>
                    <th>Số Tour Đã Đặt</th>
                    <th>Số Khách Đặt Vé</th>
                    <th>Thứ Hạng</th>
                  </tr>
                </thead>
                <tbody>
                  ${topCountries.map((c, i) => `
                    <tr>
                      <td><strong>#${i + 1}</strong></td>
                      <td><strong>${c.country}</strong></td>
                      <td><span class="badge badge-primary">${c.tour_count} tour</span></td>
                      <td>${c.customer_count} khách</td>
                      <td><span class="badge badge-success">Top ${i + 1}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    `;
  },

  initEvents() {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') return;

    const data = DashboardService.getDashboardData();
    const { topAirlines, topCountries } = data;

    // Render Bar Chart
    const barCanvas = document.getElementById('bar-chart-airlines');
    if (barCanvas && window.Chart) {
      new window.Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: topAirlines.map(a => a.airline_name),
          datasets: [{
            label: 'Số lượt đặt vé',
            data: topAirlines.map(a => a.booking_count),
            backgroundColor: '#0B5ED7',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
          }
        }
      });
    }

    // Render Pie Chart
    const pieCanvas = document.getElementById('pie-chart-countries');
    if (pieCanvas && window.Chart) {
      new window.Chart(pieCanvas, {
        type: 'pie',
        data: {
          labels: topCountries.map(c => c.country),
          datasets: [{
            data: topCountries.map(c => c.total_bookings),
            backgroundColor: [
              '#0B5ED7', '#00A8E8', '#FFB703', '#198754', '#DC3545',
              '#6f42c1', '#fd7e14', '#20c997', '#d63384', '#0dcaf0'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  }
};
