// Dashboard Page Controller & Chart Renderer

import { App } from '../app.js';
import { DashboardService } from '../services/dashboard-service.js';
import { ToastUtil } from '../utils/toast.js';

let topVideosChartInstance = null;
let viewsTimeChartInstance = null;
let currentViewTimeMode = 'day';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize App and verify login guard
  await App.init({ requireAuth: true });

  try {
    renderKPIs();
    renderTopVideosChart();
    renderViewsTimeChart(currentViewTimeMode);
    setupChartToggleButtons();
  } catch (err) {
    console.error('Error rendering dashboard:', err);
    ToastUtil.error('Không thể tải dữ liệu dashboard: ' + err.message);
  }
});

function renderKPIs() {
  const summary = DashboardService.getSummary();
  
  const totalVideosEl = document.getElementById('kpi-total-videos');
  const totalViewsEl = document.getElementById('kpi-total-views');
  const totalStorageEl = document.getElementById('kpi-total-storage');

  if (totalVideosEl) totalVideosEl.textContent = summary.totalVideos;
  if (totalViewsEl) totalViewsEl.textContent = summary.totalViews;
  if (totalStorageEl) totalStorageEl.textContent = summary.totalStorageFormatted;
}

function renderTopVideosChart() {
  const chartData = DashboardService.getTopVideosChartData(10);
  const ctx = document.getElementById('top-videos-chart');
  if (!ctx) return;

  if (topVideosChartInstance) {
    topVideosChartInstance.destroy();
  }

  // Check if Chart.js library is loaded
  if (window.Chart) {
    topVideosChartInstance = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Lượt xem',
          data: chartData.data,
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: '#6366f1',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => chartData.fullTitles[items[0].dataIndex] || items[0].label
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#9ca3af', font: { size: 11 } }
          },
          y: {
            grid: { color: '#1f2937' },
            ticks: { color: '#9ca3af' }
          }
        }
      }
    });
  } else {
    // Custom Fallback Canvas Renderer if Chart.js is offline
    renderCanvasBarChartFallback(ctx, chartData);
  }
}

function renderViewsTimeChart(mode = 'day') {
  const chartData = DashboardService.getViewsOverTimeChartData(mode);
  const ctx = document.getElementById('views-time-chart');
  if (!ctx) return;

  if (viewsTimeChartInstance) {
    viewsTimeChartInstance.destroy();
  }

  if (window.Chart) {
    viewsTimeChartInstance = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: mode === 'month' ? 'Lượt xem theo Tháng' : 'Lượt xem theo Ngày',
          data: chartData.data,
          fill: true,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderColor: '#10b981',
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: '#1f2937' },
            ticks: { color: '#9ca3af', font: { size: 11 } }
          },
          y: {
            grid: { color: '#1f2937' },
            ticks: { color: '#9ca3af' }
          }
        }
      }
    });
  } else {
    renderCanvasLineChartFallback(ctx, chartData);
  }
}

function setupChartToggleButtons() {
  const dayBtn = document.getElementById('toggle-day-btn');
  const monthBtn = document.getElementById('toggle-month-btn');

  if (dayBtn && monthBtn) {
    dayBtn.addEventListener('click', () => {
      if (currentViewTimeMode === 'day') return;
      currentViewTimeMode = 'day';
      dayBtn.classList.add('active');
      monthBtn.classList.remove('active');
      renderViewsTimeChart('day');
    });

    monthBtn.addEventListener('click', () => {
      if (currentViewTimeMode === 'month') return;
      currentViewTimeMode = 'month';
      monthBtn.classList.add('active');
      dayBtn.classList.remove('active');
      renderViewsTimeChart('month');
    });
  }
}

/* Fallback pure Canvas chart renderers when offline without CDN */
function renderCanvasBarChartFallback(canvas, chartData) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.parentElement.clientWidth;
  const height = canvas.height = canvas.parentElement.clientHeight;
  ctx.clearRect(0, 0, width, height);

  const maxVal = Math.max(...chartData.data, 100);
  const padding = 40;
  const barWidth = (width - padding * 2) / chartData.data.length - 10;

  chartData.data.forEach((val, i) => {
    const barHeight = (val / maxVal) * (height - padding * 2);
    const x = padding + i * (barWidth + 10);
    const y = height - padding - barHeight;

    ctx.fillStyle = '#6366f1';
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px sans-serif';
    ctx.fillText(chartData.labels[i].substring(0, 8), x, height - 10);
  });
}

function renderCanvasLineChartFallback(canvas, chartData) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.parentElement.clientWidth;
  const height = canvas.height = canvas.parentElement.clientHeight;
  ctx.clearRect(0, 0, width, height);

  const maxVal = Math.max(...chartData.data, 100);
  const padding = 40;
  const stepX = (width - padding * 2) / (chartData.data.length - 1 || 1);

  ctx.beginPath();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;

  chartData.data.forEach((val, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (val / maxVal) * (height - padding * 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}
