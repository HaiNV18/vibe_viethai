/**
 * Dashboard Logic & KPI Metrics Calculation
 */

const Dashboard = {
  async init() {
    const currentUser = Guard.requireAuth();
    if (!currentUser) return;

    Components.renderSidebar('dashboard');
    Components.renderTopbar('Dashboard Overview');

    await this.renderKPIs();
    await this.renderCharts();
    await this.renderRecentVideos();
  },

  async renderKPIs() {
    const videos = await Storage.getVideos();

    // 1. Total Videos
    const totalVideos = videos.length;
    const totalVideosEl = document.getElementById('kpi-total-videos');
    if (totalVideosEl) totalVideosEl.textContent = Utils.formatNumber(totalVideos);

    // 2. Total Views
    const totalViews = videos.reduce((acc, v) => acc + (Number(v.views) || 0), 0);
    const totalViewsEl = document.getElementById('kpi-total-views');
    if (totalViewsEl) totalViewsEl.textContent = Utils.formatNumber(totalViews);

    // 3. Storage Used
    const totalBytes = videos.reduce((acc, v) => acc + (Number(v.file_size_bytes) || 0), 0);
    const totalStorageEl = document.getElementById('kpi-total-storage');
    if (totalStorageEl) totalStorageEl.textContent = Utils.formatBytes(totalBytes);
  },

  async renderCharts() {
    const videos = await Storage.getVideos();
    const views = await Storage.getVideoViews();

    Charts.renderTopVideosChart('top-videos-chart', videos);
    Charts.renderViewsOverTimeChart('views-time-chart', views);
  },

  async renderRecentVideos() {
    const tbody = document.getElementById('recent-videos-tbody');
    if (!tbody) return;

    const videos = await Storage.getVideos();
    const categories = await Storage.getCategories();
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = c.name; });

    const recent = [...videos].slice(0, 5);

    if (!recent.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state" style="padding: 2rem;">No videos found.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = recent.map(v => {
      const catName = catMap[v.category_id] || 'Uncategorized';
      const statusClass = v.status === 'PUBLISHED' ? 'badge-published' : 
                         v.status === 'DRAFT' ? 'badge-draft' : 'badge-archived';

      return `
        <tr>
          <td style="width: 70px;">
            <img src="${Utils.escapeHtml(v.thumbnail_url)}" 
                 alt="${Utils.escapeHtml(v.title)}" 
                 class="table-thumbnail" 
                 onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100';">
          </td>
          <td>
            <div class="table-video-title">${Utils.escapeHtml(v.title)}</div>
            <div class="table-video-desc">${Utils.escapeHtml(v.description || '')}</div>
          </td>
          <td><span class="badge" style="background:#f1f5f9; color:#475569;">${Utils.escapeHtml(catName)}</span></td>
          <td><strong>${Utils.formatNumber(v.views)}</strong></td>
          <td><span class="badge ${statusClass}">${Utils.escapeHtml(v.status || 'PUBLISHED')}</span></td>
        </tr>
      `;
    }).join('');
  }
};

window.Dashboard = Dashboard;
