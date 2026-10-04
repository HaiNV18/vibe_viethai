/**
 * User Management Module (ADMIN only)
 */

const Users = {
  searchQuery: '',
  roleFilter: 'ALL',
  statusFilter: 'ALL',
  editingUserId: null,

  async init() {
    const user = Guard.requireAuth(true);
    if (!user) return;

    Components.renderSidebar('users');
    Components.renderTopbar('User Management');

    this.bindEvents();
    await this.render();
  },

  bindEvents() {
    const searchInput = document.getElementById('user-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce(async (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        await this.render();
      }, 250));
    }

    const roleSelect = document.getElementById('filter-user-role');
    if (roleSelect) {
      roleSelect.addEventListener('change', async (e) => {
        this.roleFilter = e.target.value;
        await this.render();
      });
    }

    const statusSelect = document.getElementById('filter-user-status');
    if (statusSelect) {
      statusSelect.addEventListener('change', async (e) => {
        this.statusFilter = e.target.value;
        await this.render();
      });
    }

    const openAddBtn = document.getElementById('open-add-user-modal-btn');
    if (openAddBtn) {
      openAddBtn.addEventListener('click', () => {
        this.openUserModal();
      });
    }

    const userForm = document.getElementById('user-modal-form');
    if (userForm) {
      userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleUserSubmit();
      });
    }
  },

  async getFilteredUsers() {
    let users = await Storage.getUsers();

    if (this.searchQuery) {
      users = users.filter(u => 
        (u.username && u.username.toLowerCase().includes(this.searchQuery)) ||
        (u.email && u.email.toLowerCase().includes(this.searchQuery))
      );
    }

    if (this.roleFilter !== 'ALL') {
      users = users.filter(u => u.role === this.roleFilter);
    }

    if (this.statusFilter !== 'ALL') {
      users = users.filter(u => u.status === this.statusFilter);
    }

    return users;
  },

  async render() {
    const tbody = document.getElementById('users-tbody');
    const totalCountEl = document.getElementById('users-total-count');
    if (!tbody) return;

    const users = await this.getFilteredUsers();
    const currentLoggedUser = Storage.getCurrentUser();

    if (totalCountEl) {
      totalCountEl.textContent = `${users.length} user${users.length === 1 ? '' : 's'}`;
    }

    if (!users.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <i class="fa-solid fa-users-slash empty-state-icon"></i>
              <div class="empty-state-title">No Users Found</div>
              <div class="empty-state-desc">Try changing the search or filter settings.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = users.map(u => {
      const isSelf = currentLoggedUser && String(currentLoggedUser.id) === String(u.id);
      const roleBadge = u.role === 'ADMIN' ? 'badge-admin' : 'badge-user';
      const statusBadge = u.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive';

      return `
        <tr>
          <td><span style="font-weight:600; color:var(--text-muted); font-size:0.8rem;">#${Utils.escapeHtml(u.id)}</span></td>
          <td>
            <div style="font-weight:600; color:var(--text-main); display:flex; align-items:center; gap:0.5rem;">
              ${Utils.escapeHtml(u.username)}
              ${isSelf ? '<span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.65rem;">You</span>' : ''}
            </div>
          </td>
          <td><span style="color:var(--text-muted);">${Utils.escapeHtml(u.email)}</span></td>
          <td><span class="badge ${roleBadge}">${Utils.escapeHtml(u.role)}</span></td>
          <td><span class="badge ${statusBadge}">${Utils.escapeHtml(u.status || 'ACTIVE')}</span></td>
          <td><span style="font-size:0.825rem; color:var(--text-muted);">${Utils.escapeHtml(u.created_at ? u.created_at.split('T')[0] : '')}</span></td>
          <td>
            <div class="table-actions">
              <button type="button" class="action-btn edit-btn" onclick="Users.openUserModal('${u.id}')" title="Edit User">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="action-btn delete-btn" 
                      onclick="Users.confirmDelete('${u.id}')" 
                      ${isSelf ? 'disabled style="opacity:0.3; cursor:not-allowed;" title="You cannot delete yourself"' : 'title="Delete User"'}>
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  async openUserModal(id = null) {
    this.editingUserId = id;
    const modalEl = document.getElementById('user-modal');
    const modalTitle = document.getElementById('user-modal-title');
    const passHelp = document.getElementById('user-modal-password-help');
    const form = document.getElementById('user-modal-form');

    if (!modalEl || !form) return;

    form.reset();

    if (id) {
      const u = await Storage.getUserById(id);
      if (!u) {
        Components.showToast('Error', 'User not found.', 'danger');
        return;
      }
      modalTitle.textContent = 'Edit User';
      document.getElementById('user-modal-username').value = u.username || '';
      document.getElementById('user-modal-email').value = u.email || '';
      document.getElementById('user-modal-role').value = u.role || 'USER';
      document.getElementById('user-modal-status').value = u.status || 'ACTIVE';
      document.getElementById('user-modal-password').value = '';
      if (passHelp) passHelp.style.display = 'block';
    } else {
      modalTitle.textContent = 'Add New User';
      document.getElementById('user-modal-role').value = 'USER';
      document.getElementById('user-modal-status').value = 'ACTIVE';
      if (passHelp) passHelp.style.display = 'none';
    }

    modalEl.classList.add('active');
  },

  closeUserModal() {
    const modalEl = document.getElementById('user-modal');
    if (modalEl) modalEl.classList.remove('active');
    this.editingUserId = null;
  },

  async handleUserSubmit() {
    const username = document.getElementById('user-modal-username').value.trim();
    const email = document.getElementById('user-modal-email').value.trim();
    const role = document.getElementById('user-modal-role').value;
    const status = document.getElementById('user-modal-status').value;
    const password = document.getElementById('user-modal-password').value.trim();

    if (!username) {
      Components.showToast('Validation Error', 'Username is required.', 'danger');
      return;
    }

    if (!email || !Auth.isValidEmail(email)) {
      Components.showToast('Validation Error', 'A valid email is required.', 'danger');
      return;
    }

    const allUsers = await Storage.getUsers();

    const dupUser = allUsers.find(u => 
      u.username && u.username.toLowerCase() === username.toLowerCase() && 
      String(u.id) !== String(this.editingUserId)
    );
    if (dupUser) {
      Components.showToast('Validation Error', 'Username is already taken by another account.', 'danger');
      return;
    }

    const dupEmail = allUsers.find(u => 
      u.email && u.email.toLowerCase() === email.toLowerCase() && 
      String(u.id) !== String(this.editingUserId)
    );
    if (dupEmail) {
      Components.showToast('Validation Error', 'Email is already registered.', 'danger');
      return;
    }

    try {
      if (this.editingUserId) {
        const updateData = { username, email, role, status };
        if (password) {
          if (password.length < 6) {
            Components.showToast('Validation Error', 'New password must be at least 6 characters.', 'danger');
            return;
          }
          updateData.password = password;
        }
        await Storage.updateUser(this.editingUserId, updateData);

        const cur = Storage.getCurrentUser();
        if (cur && String(cur.id) === String(this.editingUserId)) {
          Storage.setCurrentUser({ ...cur, ...updateData });
          Components.renderSidebar('users');
        }

        Components.showToast('Success', 'User updated successfully!', 'success');
      } else {
        if (!password || password.length < 6) {
          Components.showToast('Validation Error', 'Password is required and must be at least 6 characters.', 'danger');
          return;
        }

        await Storage.addUser({
          username,
          email,
          password,
          role,
          status
        });
        Components.showToast('Success', 'User added successfully!', 'success');
      }

      this.closeUserModal();
      await this.render();
    } catch (err) {
      Components.showToast('Error', err.message || 'Error saving user', 'danger');
    }
  },

  async confirmDelete(id) {
    const currentLoggedUser = Storage.getCurrentUser();
    if (currentLoggedUser && String(currentLoggedUser.id) === String(id)) {
      Components.showToast('Operation Blocked', 'You cannot delete your own administrator account!', 'warning');
      return;
    }

    const targetUser = await Storage.getUserById(id);
    const name = targetUser ? `user "${targetUser.username}"` : 'this user';

    Components.showConfirmModal({
      title: 'Delete User Account',
      message: `Are you sure you want to delete ${name}? This account will lose all access.`,
      confirmText: 'Yes, Delete',
      confirmClass: 'btn-danger',
      onConfirm: async () => {
        try {
          await Storage.deleteUser(id);
          Components.showToast('User Deleted', 'The user account has been deleted.', 'success');
          await this.render();
        } catch (err) {
          Components.showToast('Error', err.message || 'Failed to delete user', 'danger');
        }
      }
    });
  }
};

window.Users = Users;
