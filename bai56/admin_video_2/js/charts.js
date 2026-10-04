/**
 * Chart rendering module using Chart.js CDN
 */

const Charts = {
  barChartInstance: null,
  lineChartInstance: null,

  /**
   * Render Top 10 Videos by Views Bar Chart
   * @param {string} canvasId 
   * @param {Array<Object>} videos 
   */
  renderTopVideosChart(canvasId, videos = []) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (this.barChartInstance) {
      this.barChartInstance.destroy();
      this.barChartInstance = null;
    }

    if (!videos || !videos.length) {
      const container = canvas.parentElement;
      container.innerHTML = '<div class="empty-state"><p class="empty-state-desc">No video data available for chart.</p></div>';
      return;
    }

    // Sort descending by views & slice top 10
    const sorted = [...videos]
      .map(v => ({ ...v, views: Number(v.views) || 0 }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const labels = sorted.map(v => {
      const title = v.title || 'Untitled';
      return title.length > 18 ? title.slice(0, 18) + '...' : title;
    });
    const fullTitles = sorted.map(v => v.title || 'Untitled');
    const dataValues = sorted.map(v => v.views);

    const ctx = canvas.getContext('2d');
    this.barChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Views',
          data: dataValues,
          backgroundColor: '#3b82f6',
          hoverBackgroundColor: '#2563eb',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(items) {
                const idx = items[0].dataIndex;
                return fullTitles[idx];
              },
              label: function(item) {
                return `Views: ${Utils.formatNumber(item.raw)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9'
            },
            ticks: {
              color: '#64748b',
              callback: function(val) {
                return Utils.formatNumber(val);
              }
            }
          }
        }
      }
    });
  },

  /**
   * Render Views Over Time Line Chart
   * @param {string} canvasId 
   * @param {Array<Object>} viewLogs 
   */
  renderViewsOverTimeChart(canvasId, viewLogs = []) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
      this.lineChartInstance = null;
    }

    if (!viewLogs || !viewLogs.length) {
      const container = canvas.parentElement;
      container.innerHTML = '<div class="empty-state"><p class="empty-state-desc">No view history data available.</p></div>';
      return;
    }

    // Group views by view_date
    const dateMap = {};
    viewLogs.forEach(entry => {
      const date = entry.view_date;
      const count = Number(entry.view_count) || 0;
      if (date) {
        dateMap[date] = (dateMap[date] || 0) + count;
      }
    });

    const dates = Object.keys(dateMap).sort();
    if (!dates.length) {
      const container = canvas.parentElement;
      container.innerHTML = '<div class="empty-state"><p class="empty-state-desc">No view history data available.</p></div>';
      return;
    }

    const counts = dates.map(d => dateMap[d]);

    const ctx = canvas.getContext('2d');
    this.lineChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Total Views',
          data: counts,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#10b981',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(item) {
                return `Total Views: ${Utils.formatNumber(item.raw)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: '#f8fafc'
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9'
            },
            ticks: {
              color: '#64748b',
              callback: function(val) {
                return Utils.formatNumber(val);
              }
            }
          }
        }
      }
    });
  }
};

window.Charts = Charts;
