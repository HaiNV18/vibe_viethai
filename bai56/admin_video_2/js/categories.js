/**
 * Category Management Module (ADMIN only)
 */

const Categories = {
  searchQuery: '',
  statusFilter: 'ALL',
  editingCategoryId: null,

  async init() {
    const user = Guard.requireAuth(true);
    if (!user) return;

    Components.renderSidebar('categories');
    Components.renderTopbar('Category Management');

    this.bindEvents();
    await this.render();
  },

  bindEvents() {
    const searchInput = document.getElementById('category-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce(async (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        await this.render();
      }, 250));
    }

    const statusFilter = document.getElementById('filter-category-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', async (e) => {
        this.statusFilter = e.target.value;
        await this.render();
      });
    }

    const openAddBtn = document.getElementById('open-add-category-modal-btn');
    if (openAddBtn) {
      openAddBtn.addEventListener('click', () => {
        this.openCategoryModal();
      });
    }

    const nameInput = document.getElementById('cat-modal-name');
    const slugInput = document.getElementById('cat-modal-slug');
    if (nameInput && slugInput) {
      nameInput.addEventListener('input', (e) => {
        slugInput.value = Utils.slugify(e.target.value);
      });
    }

    const form = document.getElementById('category-modal-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleCategorySubmit();
      });
    }
  },

  async getFilteredCategories() {
    let categories = await Storage.getCategories();

    if (this.searchQuery) {
      categories = categories.filter(c => 
        (c.name && c.name.toLowerCase().includes(this.searchQuery)) ||
        (c.slug && c.slug.toLowerCase().includes(this.searchQuery)) ||
        (c.description && c.description.toLowerCase().includes(this.searchQuery))
      );
    }

    if (this.statusFilter !== 'ALL') {
      categories = categories.filter(c => c.status === this.statusFilter);
    }

    return categories;
  },

  async render() {
    const tbody = document.getElementById('categories-tbody');
    const totalCountEl = document.getElementById('categories-total-count');
    if (!tbody) return;

    const categories = await this.getFilteredCategories();
    const videos = await Storage.getVideos();

    const videoCountMap = {};
    videos.forEach(v => {
      if (v.category_id) {
        videoCountMap[v.category_id] = (videoCountMap[v.category_id] || 0) + 1;
      }
    });

    if (totalCountEl) {
      totalCountEl.textContent = `${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}`;
    }

    if (!categories.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <i class="fa-solid fa-folder-open empty-state-icon"></i>
              <div class="empty-state-title">No Categories Found</div>
              <div class="empty-state-desc">Try changing search query or add a new category.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = categories.map(c => {
      const vCount = videoCountMap[c.id] || 0;
      const statusBadge = c.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive';

      return `
        <tr>
          <td><span style="font-weight:600; color:var(--text-muted); font-size:0.8rem;">#${Utils.escapeHtml(c.id)}</span></td>
          <td>
            <div style="font-weight:600; color:var(--text-main); font-size:0.95rem;">${Utils.escapeHtml(c.name)}</div>
          </td>
          <td>
            <code style="font-family:var(--font-mono); font-size:0.8rem; background:#f1f5f9; padding:0.2rem 0.4rem; border-radius:4px; color:#475569;">
              ${Utils.escapeHtml(c.slug)}
            </code>
          </td>
          <td><span style="color:var(--text-muted); font-size:0.85rem;">${Utils.escapeHtml(c.description || '-')}</span></td>
          <td>
            <span class="badge" style="background:#f1f5f9; color:#334155;">
              <i class="fa-solid fa-video" style="font-size:0.75rem;"></i> ${vCount} video${vCount === 1 ? '' : 's'}
            </span>
          </td>
          <td><span class="badge ${statusBadge}">${Utils.escapeHtml(c.status || 'ACTIVE')}</span></td>
          <td>
            <div class="table-actions">
              <button type="button" class="action-btn edit-btn" onclick="Categories.openCategoryModal('${c.id}')" title="Edit Category">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="action-btn delete-btn" onclick="Categories.confirmDelete('${c.id}')" title="Delete Category">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  async openCategoryModal(id = null) {
    this.editingCategoryId = id;
    const modalEl = document.getElementById('category-modal');
    const modalTitle = document.getElementById('category-modal-title');
    const form = document.getElementById('category-modal-form');

    if (!modalEl || !form) return;

    form.reset();

    if (id) {
      const c = await Storage.getCategoryById(id);
      if (!c) {
        Components.showToast('Error', 'Category not found.', 'danger');
        return;
      }
      modalTitle.textContent = 'Edit Category';
      document.getElementById('cat-modal-name').value = c.name || '';
      document.getElementById('cat-modal-slug').value = c.slug || '';
      document.getElementById('cat-modal-description').value = c.description || '';
      document.getElementById('cat-modal-status').value = c.status || 'ACTIVE';
    } else {
      modalTitle.textContent = 'Add New Category';
      document.getElementById('cat-modal-status').value = 'ACTIVE';
    }

    modalEl.classList.add('active');
  },

  closeCategoryModal() {
    const modalEl = document.getElementById('category-modal');
    if (modalEl) modalEl.classList.remove('active');
    this.editingCategoryId = null;
  },

  async handleCategorySubmit() {
    const name = document.getElementById('cat-modal-name').value.trim();
    const slug = document.getElementById('cat-modal-slug').value.trim() || Utils.slugify(name);
    const description = document.getElementById('cat-modal-description').value.trim();
    const status = document.getElementById('cat-modal-status').value;

    if (!name) {
      Components.showToast('Validation Error', 'Category name is required.', 'danger');
      return;
    }

    const categories = await Storage.getCategories();
    const dup = categories.find(c => 
      (c.name.toLowerCase() === name.toLowerCase() || c.slug.toLowerCase() === slug.toLowerCase()) &&
      String(c.id) !== String(this.editingCategoryId)
    );
    if (dup) {
      Components.showToast('Validation Error', 'A category with this name or slug already exists.', 'danger');
      return;
    }

    try {
      if (this.editingCategoryId) {
        await Storage.updateCategory(this.editingCategoryId, { name, slug, description, status });
        Components.showToast('Success', 'Category updated successfully!', 'success');
      } else {
        await Storage.addCategory({ name, slug, description, status });
        Components.showToast('Success', 'Category created successfully!', 'success');
      }

      this.closeCategoryModal();
      await this.render();
    } catch (err) {
      Components.showToast('Error', err.message || 'Error saving category', 'danger');
    }
  },

  async confirmDelete(id) {
    const cat = await Storage.getCategoryById(id);
    if (!cat) return;

    const videos = await Storage.getVideos();
    const usedCount = videos.filter(v => String(v.category_id) === String(id)).length;

    let warningMsg = `Are you sure you want to delete category "${cat.name}"?`;
    if (usedCount > 0) {
      warningMsg = `Warning: There ${usedCount === 1 ? 'is 1 video' : `are ${usedCount} videos`} currently assigned to "${cat.name}". Deleting this category will leave these videos uncategorized. Are you sure you want to proceed?`;
    }

    Components.showConfirmModal({
      title: 'Delete Category',
      message: warningMsg,
      confirmText: 'Yes, Delete',
      confirmClass: 'btn-danger',
      onConfirm: async () => {
        try {
          await Storage.deleteCategory(id);
          Components.showToast('Category Deleted', 'The category has been removed.', 'success');
          await this.render();
        } catch (err) {
          Components.showToast('Error', err.message || 'Failed to delete category', 'danger');
        }
      }
    });
  }
};

window.Categories = Categories;
