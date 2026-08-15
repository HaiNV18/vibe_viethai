// Videos List Page Controller

import { App } from '../app.js';
import { VideoService } from '../services/video-service.js';
import { CategoryService } from '../services/category-service.js';
import { FormatUtil } from '../utils/format.js';
import { ToastUtil } from '../utils/toast.js';

let currentPage = 1;
const limitPerPage = 5;
let videoToDeleteId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await App.init({ requireAuth: true });

  loadCategories();
  loadVideos();

  setupFiltersAndSearch();
  setupDeleteModal();
  setupPagination();
});

function loadCategories() {
  const categoryFilter = document.getElementById('category-filter');
  if (!categoryFilter) return;

  const categories = CategoryService.getCategories();
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = FormatUtil.escapeHtml(cat.name);
    categoryFilter.appendChild(opt);
  });
}

function loadVideos() {
  const search = document.getElementById('search-input')?.value || '';
  const categoryId = document.getElementById('category-filter')?.value || '';
  const status = document.getElementById('status-filter')?.value || '';

  const res = VideoService.getVideos({
    search,
    categoryId,
    status,
    page: currentPage,
    limit: limitPerPage
  });

  renderTable(res.items);
  renderPagination(res);
}

function renderTable(videos) {
  const tbody = document.getElementById('video-table-body');
  const emptyState = document.getElementById('empty-state');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (videos.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  videos.forEach(v => {
    const tr = document.createElement('tr');
    
    const fallbackThumb = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80';
    const thumbUrl = v.thumbnail_url ? FormatUtil.escapeHtml(v.thumbnail_url) : fallbackThumb;
    const categoryLabel = v.category_name ? FormatUtil.escapeHtml(v.category_name) : '—';
    const badgeClass = v.status === 'published' ? 'badge-published' : 'badge-draft';

    tr.innerHTML = `
      <td style="font-weight: 600; color: var(--text-primary);">${v.id}</td>
      <td>
        <img src="${thumbUrl}" alt="${FormatUtil.escapeHtml(v.title)}" class="table-thumbnail" onerror="this.src='${fallbackThumb}'">
      </td>
      <td style="font-weight: 600; color: var(--text-primary); max-width: 260px;">
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${FormatUtil.escapeHtml(v.title)}</div>
        <div style="font-size: var(--font-size-xs); color: var(--text-muted); font-weight: normal;">${FormatUtil.formatDate(v.created_at)}</div>
      </td>
      <td><span class="badge" style="background-color: var(--bg-surface-elevated); color: var(--text-secondary);">${categoryLabel}</span></td>
      <td style="text-align: right; font-weight: 600;">${FormatUtil.formatViews(v.views)}</td>
      <td>
        <div>${FormatUtil.formatDuration(v.duration_seconds)}</div>
        <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${FormatUtil.formatBytes(v.file_size_bytes)}</div>
      </td>
      <td><span class="badge ${badgeClass}">${FormatUtil.escapeHtml(v.status)}</span></td>
      <td style="text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.25rem;">
          <a href="video-edit.html?id=${v.id}" class="btn btn-secondary btn-icon" title="Chỉnh sửa">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </a>
          <button class="btn btn-secondary btn-icon delete-btn" data-id="${v.id}" data-title="${FormatUtil.escapeHtml(v.title)}" style="color: var(--danger);" title="Xóa video">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Attach event listeners to delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      videoToDeleteId = btn.getAttribute('data-id');
      const title = btn.getAttribute('data-title');
      openDeleteModal(title);
    });
  });
}

function renderPagination({ totalItems, totalPages, currentPage: page, limit }) {
  const infoEl = document.getElementById('pagination-info');
  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');

  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  if (infoEl) {
    infoEl.textContent = `Hiển thị ${startItem} - ${endItem} trong số ${totalItems} video (Trang ${page}/${totalPages})`;
  }

  if (prevBtn) prevBtn.disabled = page <= 1;
  if (nextBtn) nextBtn.disabled = page >= totalPages;
}

function setupFiltersAndSearch() {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const statusFilter = document.getElementById('status-filter');

  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentPage = 1;
        loadVideos();
      }, 300);
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      currentPage = 1;
      loadVideos();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      currentPage = 1;
      loadVideos();
    });
  }
}

function setupPagination() {
  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        loadVideos();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentPage++;
      loadVideos();
    });
  }
}

function openDeleteModal(title) {
  const modal = document.getElementById('delete-modal');
  const titleEl = document.getElementById('delete-video-title');
  if (titleEl) titleEl.textContent = title;
  if (modal) modal.classList.add('active');
}

function closeDeleteModal() {
  const modal = document.getElementById('delete-modal');
  if (modal) modal.classList.remove('active');
  videoToDeleteId = null;
}

function setupDeleteModal() {
  const cancelBtn = document.getElementById('cancel-delete-btn');
  const confirmBtn = document.getElementById('confirm-delete-btn');

  if (cancelBtn) cancelBtn.addEventListener('click', closeDeleteModal);
  
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (videoToDeleteId) {
        try {
          VideoService.deleteVideo(videoToDeleteId);
          ToastUtil.success('Đã xóa video thành công!');
          closeDeleteModal();
          loadVideos();
        } catch (err) {
          ToastUtil.error('Xóa video thất bại: ' + err.message);
        }
      }
    });
  }
}
