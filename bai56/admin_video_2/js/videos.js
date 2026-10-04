/**
 * Video Management Module (List, Search, Filter, Sort, Pagination, Add, Edit, Delete)
 */

const Videos = {
  currentPage: 1,
  pageSize: 6,
  searchQuery: '',
  categoryFilter: 'ALL',
  statusFilter: 'ALL',
  sortBy: 'NEWEST',

  async initList() {
    const user = Guard.requireAuth();
    if (!user) return;

    Components.renderSidebar('videos');
    Components.renderTopbar('Video Management');

    await this.populateCategoryFilterDropdown();
    this.bindListEvents();
    await this.render();
  },

  async populateCategoryFilterDropdown() {
    const select = document.getElementById('filter-category');
    if (!select) return;

    const categories = await Storage.getCategories();
    select.innerHTML = '<option value="ALL">All Categories</option>' + 
      categories.map(c => `<option value="${c.id}">${Utils.escapeHtml(c.name)}</option>`).join('');
  },

  bindListEvents() {
    const searchInput = document.getElementById('video-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce(async (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.currentPage = 1;
        await this.render();
      }, 250));
    }

    const catFilter = document.getElementById('filter-category');
    if (catFilter) {
      catFilter.addEventListener('change', async (e) => {
        this.categoryFilter = e.target.value;
        this.currentPage = 1;
        await this.render();
      });
    }

    const statusFilter = document.getElementById('filter-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', async (e) => {
        this.statusFilter = e.target.value;
        this.currentPage = 1;
        await this.render();
      });
    }

    const sortSelect = document.getElementById('video-sort-by');
    if (sortSelect) {
      sortSelect.addEventListener('change', async (e) => {
        this.sortBy = e.target.value;
        await this.render();
      });
    }
  },

  async getFilteredVideos() {
    let videos = await Storage.getVideos();

    if (this.searchQuery) {
      videos = videos.filter(v => 
        (v.title && v.title.toLowerCase().includes(this.searchQuery)) ||
        (v.description && v.description.toLowerCase().includes(this.searchQuery))
      );
    }

    if (this.categoryFilter !== 'ALL') {
      videos = videos.filter(v => String(v.category_id) === String(this.categoryFilter));
    }

    if (this.statusFilter !== 'ALL') {
      videos = videos.filter(v => v.status === this.statusFilter);
    }

    videos.sort((a, b) => {
      switch (this.sortBy) {
        case 'VIEWS_DESC':
          return (Number(b.views) || 0) - (Number(a.views) || 0);
        case 'VIEWS_ASC':
          return (Number(a.views) || 0) - (Number(b.views) || 0);
        case 'TITLE_ASC':
          return (a.title || '').localeCompare(b.title || '');
        case 'OLDEST':
          return (Number(a.id) || 0) - (Number(b.id) || 0);
        case 'NEWEST':
        default:
          return (Number(b.id) || 0) - (Number(a.id) || 0);
      }
    });

    return videos;
  },

  async render() {
    const tbody = document.getElementById('videos-tbody');
    const paginationEl = document.getElementById('videos-pagination');
    const totalCountEl = document.getElementById('videos-total-count');

    if (!tbody) return;

    const filtered = await this.getFilteredVideos();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / this.pageSize) || 1;

    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }

    if (totalCountEl) {
      totalCountEl.textContent = `${totalItems} video${totalItems === 1 ? '' : 's'}`;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const pageVideos = filtered.slice(startIndex, startIndex + this.pageSize);

    if (pageVideos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="empty-state">
              <i class="fa-solid fa-film empty-state-icon"></i>
              <div class="empty-state-title">No Videos Found</div>
              <div class="empty-state-desc">Try adjusting your search criteria or add a new video.</div>
              <a href="video-form.html" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-plus"></i> Add Video
              </a>
            </div>
          </td>
        </tr>
      `;
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    const categories = await Storage.getCategories();
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = c.name; });

    tbody.innerHTML = pageVideos.map(v => {
      const catName = catMap[v.category_id] || 'Uncategorized';
      const statusClass = v.status === 'PUBLISHED' ? 'badge-published' : 
                         v.status === 'DRAFT' ? 'badge-draft' : 'badge-archived';
      const formattedSize = Utils.formatBytes(v.file_size_bytes);

      return `
        <tr>
          <td><span style="font-weight:600; color:var(--text-muted); font-size:0.8rem;">#${Utils.escapeHtml(v.id)}</span></td>
          <td style="width: 75px;">
            <img src="${Utils.escapeHtml(v.thumbnail_url)}" 
                 alt="${Utils.escapeHtml(v.title)}" 
                 class="table-thumbnail" 
                 onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100';">
          </td>
          <td>
            <div class="table-video-title" title="${Utils.escapeHtml(v.title)}">${Utils.escapeHtml(v.title)}</div>
            <div class="table-video-desc" title="${Utils.escapeHtml(v.description || '')}">${Utils.escapeHtml(v.description || '')}</div>
          </td>
          <td><span class="badge" style="background:#f1f5f9; color:#334155;">${Utils.escapeHtml(catName)}</span></td>
          <td><strong>${Utils.formatNumber(v.views)}</strong></td>
          <td><span style="font-family:var(--font-mono); font-size:0.825rem;">${Utils.escapeHtml(v.duration || '00:00')}</span></td>
          <td><span style="font-size:0.825rem; color:var(--text-muted);">${formattedSize}</span></td>
          <td><span class="badge ${statusClass}">${Utils.escapeHtml(v.status || 'PUBLISHED')}</span></td>
          <td>
            <div class="table-actions">
              <a href="video-form.html?id=${v.id}" class="action-btn edit-btn" title="Edit Video">
                <i class="fa-solid fa-pen-to-square"></i>
              </a>
              <button type="button" class="action-btn delete-btn" onclick="Videos.confirmDelete('${v.id}')" title="Delete Video">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (paginationEl) {
      this.renderPagination(paginationEl, totalPages, totalItems, startIndex, pageVideos.length);
    }
  },

  renderPagination(container, totalPages, totalItems, startIndex, currentCount) {
    if (totalPages <= 1) {
      container.innerHTML = `
        <div>Showing ${totalItems} of ${totalItems} entries</div>
        <div></div>
      `;
      return;
    }

    let pagesHtml = '';
    for (let p = 1; p <= totalPages; p++) {
      pagesHtml += `
        <button type="button" class="pagination-btn ${p === this.currentPage ? 'active' : ''}" 
                onclick="Videos.goToPage(${p})">${p}</button>
      `;
    }

    container.innerHTML = `
      <div>Showing ${startIndex + 1} to ${startIndex + currentCount} of ${totalItems} entries</div>
      <div class="pagination-pages">
        <button type="button" class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                onclick="Videos.goToPage(${this.currentPage - 1})">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        ${pagesHtml}
        <button type="button" class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                onclick="Videos.goToPage(${this.currentPage + 1})">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    `;
  },

  async goToPage(page) {
    this.currentPage = page;
    await this.render();
  },

  async confirmDelete(id) {
    const video = await Storage.getVideoById(id);
    const videoTitle = video ? `"${video.title}"` : 'this video';

    Components.showConfirmModal({
      title: 'Delete Video',
      message: `Are you sure you want to delete ${videoTitle}? This action will permanently remove the video from the records.`,
      confirmText: 'Yes, Delete',
      confirmClass: 'btn-danger',
      onConfirm: async () => {
        try {
          await Storage.deleteVideo(id);
          Components.showToast('Video Deleted', 'The video has been removed successfully.', 'success');
          await this.render();
        } catch (err) {
          Components.showToast('Error', err.message || 'Failed to delete video', 'danger');
        }
      }
    });
  },

  /* =========================================================================
     Video Form Handling (Add / Edit)
     ========================================================================= */
  async initForm() {
    const user = Guard.requireAuth();
    if (!user) return;

    const videoId = Utils.getUrlParam('id');
    const isEdit = Boolean(videoId);

    Components.renderSidebar('videos');
    Components.renderTopbar(isEdit ? 'Edit Video' : 'Add New Video');

    const catSelect = document.getElementById('video-category');
    if (catSelect) {
      const categories = await Storage.getCategories();
      catSelect.innerHTML = '<option value="">-- Select Category --</option>' + 
        categories.map(c => `<option value="${c.id}">${Utils.escapeHtml(c.name)}</option>`).join('');
    }

    const formTitleEl = document.getElementById('form-header-title');
    if (formTitleEl) formTitleEl.textContent = isEdit ? 'Edit Video Details' : 'Add New Video';

    if (isEdit) {
      const existingVideo = await Storage.getVideoById(videoId);
      if (!existingVideo) {
        Components.showToast('Error', 'Video not found.', 'danger');
        setTimeout(() => { window.location.href = 'videos.html'; }, 1000);
        return;
      }
      this.populateFormFields(existingVideo);
    }

    this.bindFormPreviews();

    const form = document.getElementById('video-edit-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleFormSubmit(isEdit, videoId);
      });
    }
  },

  populateFormFields(v) {
    document.getElementById('video-title').value = v.title || '';
    document.getElementById('video-description').value = v.description || '';
    document.getElementById('video-category').value = v.category_id || '';
    document.getElementById('video-thumbnail').value = v.thumbnail_url || '';
    document.getElementById('video-url').value = v.video_url || '';
    document.getElementById('video-duration').value = v.duration || '';
    
    const mb = v.file_size_bytes ? (Number(v.file_size_bytes) / (1024 * 1024)).toFixed(1) : '';
    document.getElementById('video-filesize-mb').value = mb;
    document.getElementById('video-status').value = v.status || 'PUBLISHED';

    this.updateThumbnailPreview(v.thumbnail_url);
    this.updateVideoPreview(v.video_url);
  },

  bindFormPreviews() {
    const thumbInput = document.getElementById('video-thumbnail');
    if (thumbInput) {
      thumbInput.addEventListener('input', Utils.debounce((e) => {
        this.updateThumbnailPreview(e.target.value.trim());
      }, 300));
    }

    const videoInput = document.getElementById('video-url');
    if (videoInput) {
      videoInput.addEventListener('input', Utils.debounce((e) => {
        this.updateVideoPreview(e.target.value.trim());
      }, 300));
    }
  },

  updateThumbnailPreview(url) {
    const box = document.getElementById('thumb-preview-box');
    if (!box) return;
    if (url) {
      box.innerHTML = `<img src="${Utils.escapeHtml(url)}" alt="Thumbnail Preview" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'preview-placeholder\\'>Failed to load image</div>';">`;
    } else {
      box.innerHTML = `<div class="preview-placeholder">Thumbnail preview will appear here</div>`;
    }
  },

  updateVideoPreview(url) {
    const box = document.getElementById('video-preview-box');
    if (!box) return;
    if (url) {
      box.innerHTML = `
        <video controls style="width:100%; height:100%; object-fit:cover;">
          <source src="${Utils.escapeHtml(url)}" type="video/mp4">
          Your browser does not support HTML video preview.
        </video>
      `;
    } else {
      box.innerHTML = `<div class="preview-placeholder">Video player preview will appear here</div>`;
    }
  },

  async handleFormSubmit(isEdit, id) {
    const title = document.getElementById('video-title').value.trim();
    const description = document.getElementById('video-description').value.trim();
    const category_id = document.getElementById('video-category').value;
    const thumbnail_url = document.getElementById('video-thumbnail').value.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400';
    const video_url = document.getElementById('video-url').value.trim() || 'https://www.w3schools.com/html/mov_bbb.mp4';
    const duration = document.getElementById('video-duration').value.trim() || '10:00';
    const fileSizeMB = parseFloat(document.getElementById('video-filesize-mb').value) || 50;
    const status = document.getElementById('video-status').value || 'PUBLISHED';

    if (!title) {
      Components.showToast('Validation Error', 'Video title is required.', 'danger');
      return;
    }

    if (!category_id) {
      Components.showToast('Validation Error', 'Please select a category.', 'danger');
      return;
    }

    const file_size_bytes = Math.round(fileSizeMB * 1024 * 1024);

    const videoData = {
      title,
      description,
      category_id,
      thumbnail_url,
      video_url,
      duration,
      file_size_bytes,
      status
    };

    try {
      if (isEdit) {
        await Storage.updateVideo(id, videoData);
        Components.showToast('Success', 'Video updated successfully!', 'success');
      } else {
        await Storage.addVideo(videoData);
        Components.showToast('Success', 'Video added successfully!', 'success');
      }

      setTimeout(() => {
        window.location.href = 'videos.html';
      }, 700);
    } catch (err) {
      Components.showToast('Save Failed', err.message || 'Error saving video', 'danger');
    }
  }
};

window.Videos = Videos;
