export const Modal = {
  show({ title, body, confirmText = 'Xác nhận', cancelText = 'Đóng', onConfirm = null }) {
    const container = document.getElementById('modal-container');
    if (!container) return;

    container.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          ${body}
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="modal-cancel">${cancelText}</button>
          ${onConfirm ? `<button class="btn btn-primary" id="modal-confirm">${confirmText}</button>` : ''}
        </div>
      </div>
    `;

    container.classList.add('show');

    const closeModal = () => {
      container.classList.remove('show');
      container.innerHTML = '';
    };

    document.getElementById('modal-close').onclick = closeModal;
    document.getElementById('modal-cancel').onclick = closeModal;
    
    if (onConfirm) {
      document.getElementById('modal-confirm').onclick = () => {
        onConfirm();
        closeModal();
      };
    }
  }
};
