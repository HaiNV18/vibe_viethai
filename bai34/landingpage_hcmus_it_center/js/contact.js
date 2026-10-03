/**
 * Contact Modal & File System Access Manager
 * Handles validation, modal accessibility, and contacts.csv saving
 */
window.ContactManager = (function () {
  let modalElement = null;
  let formElement = null;
  let lastFocusedElement = null;
  let dirHandle = null; // Stored FileSystemDirectoryHandle if picked

  const CURRENT_YEAR = new Date().getFullYear();

  /**
   * Initialize Contact Modal & Form events
   */
  function init() {
    modalElement = document.getElementById('contact-modal');
    formElement = document.getElementById('contact-form');

    if (!modalElement || !formElement) return;

    // Close button & overlay click
    const closeBtns = modalElement.querySelectorAll('[data-close-modal]');
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    modalElement.addEventListener('click', function (e) {
      if (e.target === modalElement) {
        closeModal();
      }
    });

    // Keyboard navigation (Escape key)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalElement.classList.contains('is-active')) {
        closeModal();
      }
      if (e.key === 'Tab' && modalElement.classList.contains('is-active')) {
        handleTabTrap(e);
      }
    });

    // Form submit
    formElement.addEventListener('submit', handleFormSubmit);

    // Live validation clearance
    const inputs = formElement.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => clearFieldError(input.id));
      input.addEventListener('change', () => clearFieldError(input.id));
    });

    // Directory pick button if available
    const pickDirBtn = document.getElementById('btn-pick-dir');
    if (pickDirBtn) {
      if ('showDirectoryPicker' in window) {
        pickDirBtn.addEventListener('click', selectProjectDirectory);
      } else {
        pickDirBtn.style.display = 'none';
        const tipEl = document.getElementById('fs-api-tip');
        if (tipEl) {
          tipEl.textContent = 'Trình duyệt hiện tại sẽ dùng chế độ Tải file CSV khi đăng ký.';
        }
      }
    }
  }

  /**
   * Select project directory for File System Access API
   */
  async function selectProjectDirectory() {
    try {
      dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });
      showToast('Đã chọn thư mục project thành công! Các đăng ký mới sẽ ghi vào data/contacts.csv.', 'success');
      const statusEl = document.getElementById('fs-api-status');
      if (statusEl) {
        statusEl.textContent = '✓ Đã kết nối thư mục project: ' + dirHandle.name;
        statusEl.className = 'fs-status connected';
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Directory selection error:', err);
        showToast('Không thể chọn thư mục: ' + err.message, 'error');
      }
    }
  }

  /**
   * Open Modal
   * @param {string} courseName - Optional pre-selected course name
   */
  function openModal(courseName = '') {
    if (!modalElement) return;

    lastFocusedElement = document.activeElement;
    modalElement.classList.add('is-active');
    modalElement.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll

    // Set course note if passed
    const noteEl = document.getElementById('contact-course-note');
    if (noteEl) {
      if (courseName) {
        noteEl.textContent = `Đăng ký tư vấn khóa học: ${courseName}`;
        noteEl.style.display = 'block';
      } else {
        noteEl.style.display = 'none';
        noteEl.textContent = '';
      }
    }

    // Focus first input field
    const firstInput = document.getElementById('fullname');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  /**
   * Close Modal
   */
  function closeModal() {
    if (!modalElement) return;

    modalElement.classList.remove('is-active');
    modalElement.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scroll

    // Restore focus to trigger button
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  /**
   * Trap Tab key focus inside active modal
   */
  function handleTabTrap(e) {
    const focusables = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  /**
   * Show error for a field
   */
  function setFieldError(fieldId, message) {
    const errorEl = document.getElementById(`${fieldId}-error`);
    const inputEl = document.getElementById(fieldId);

    if (inputEl) inputEl.classList.add('is-invalid');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  /**
   * Clear error for a field
   */
  function clearFieldError(fieldId) {
    const errorEl = document.getElementById(`${fieldId}-error`);
    const inputEl = document.getElementById(fieldId);

    if (inputEl) inputEl.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  /**
   * Reset all form errors
   */
  function clearAllErrors() {
    const errorEls = formElement.querySelectorAll('.form-error');
    errorEls.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
    const inputs = formElement.querySelectorAll('.is-invalid');
    inputs.forEach(el => el.classList.remove('is-invalid'));
  }

  /**
   * Validate Form Fields
   */
  function validateForm(data) {
    clearAllErrors();
    let isValid = true;

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      setFieldError('fullname', 'Họ và tên phải có ít nhất 2 ký tự.');
      isValid = false;
    }

    // Birth year validation
    const yearNum = parseInt(data.birth_year, 10);
    if (!data.birth_year || isNaN(yearNum) || yearNum < 1930 || yearNum > CURRENT_YEAR) {
      setFieldError('birth_year', `Năm sinh không hợp lệ (phải từ 1930 đến ${CURRENT_YEAR}).`);
      isValid = false;
    }

    // Phone validation (flexible VN phone regex: 10-11 digits starting with 0 or +84)
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    const cleanPhone = data.phone ? data.phone.replace(/\s+/g, '') : '';
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      setFieldError('phone', 'Số điện thoại không hợp lệ (Ví dụ: 0912345678).');
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email.trim())) {
      setFieldError('email', 'Email không đúng định dạng (Ví dụ: user@domain.com).');
      isValid = false;
    }

    // Consent checkbox
    if (!data.consent) {
      setFieldError('consent', 'Bạn cần đồng ý điều khoản để trung tâm liên hệ.');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Handle Form Submit
   */
  async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(formElement);
    const data = {
      name: (formData.get('fullname') || '').toString().trim(),
      birth_year: (formData.get('birth_year') || '').toString().trim(),
      phone: (formData.get('phone') || '').toString().trim(),
      email: (formData.get('email') || '').toString().trim(),
      consent: formData.get('consent') === 'on',
      timestamp: new Date().toISOString()
    };

    if (!validateForm(data)) {
      return;
    }

    const submitBtn = formElement.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const savedSuccessfully = await saveContactToCsv(data);

      if (savedSuccessfully) {
        formElement.reset();
        setTimeout(() => closeModal(), 2000);
      }
    } catch (err) {
      console.error('Save contact error:', err);
      showToast('Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại.', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  /**
   * Save Contact entry to contacts.csv via File System Access API or Fallback
   */
  async function saveContactToCsv(record) {
    const recordRow = {
      name: record.name,
      birth_year: record.birth_year,
      phone: record.phone,
      email: record.email,
      timestamp: record.timestamp
    };

    // 1. Try File System Access API if handle is set or can be requested
    if ('showDirectoryPicker' in window) {
      if (!dirHandle) {
        // Offer directory selection
        const userWantsDir = confirm(
          'Trung tâm hỗ trợ ghi trực tiếp thông tin vào file data/contacts.csv trong ổ đĩa.\n\nBấm "OK" để chọn thư mục project và ghi file trực tiếp, hoặc "Cancel" để tải file CSV về máy.'
        );
        if (userWantsDir) {
          try {
            dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
            const statusEl = document.getElementById('fs-api-status');
            if (statusEl) {
              statusEl.textContent = '✓ Đã kết nối thư mục project: ' + dirHandle.name;
              statusEl.className = 'fs-status connected';
            }
          } catch (err) {
            console.log('User cancelled or failed directory selection:', err);
          }
        }
      }

      if (dirHandle) {
        try {
          // Get data folder handle
          const dataDirHandle = await dirHandle.getDirectoryHandle('data', { create: true });
          // Get contacts.csv file handle
          const fileHandle = await dataDirHandle.getFileHandle('contacts.csv', { create: true });
          
          // Read existing file content
          const file = await fileHandle.getFile();
          const existingText = await file.text();
          
          let updatedCsvText = '';
          if (!existingText || existingText.trim() === '') {
            // Header + new record
            updatedCsvText = window.CSVUtils.serializeCsv([recordRow], ['name', 'birth_year', 'phone', 'email', 'timestamp']);
          } else {
            // Parse existing, append new, re-serialize
            const existingRows = window.CSVUtils.parseCsv(existingText, true);
            existingRows.push(recordRow);
            updatedCsvText = window.CSVUtils.serializeCsv(existingRows, ['name', 'birth_year', 'phone', 'email', 'timestamp']);
          }

          // Write back to file
          const writable = await fileHandle.createWritable();
          await writable.write(updatedCsvText);
          await writable.close();

          showToast('✓ Đã lưu thông tin trực tiếp vào data/contacts.csv!', 'success');
          return true;
        } catch (fsErr) {
          console.error('File System write failed:', fsErr);
          showToast('Không thể ghi trực tiếp vào file. Hệ thống chuyển sang tải file CSV fallback.', 'warning');
        }
      }
    }

    // 2. Fallback: Generate and trigger download of CSV
    try {
      const fallbackCsvText = window.CSVUtils.serializeCsv(
        [recordRow],
        ['name', 'birth_year', 'phone', 'email', 'timestamp']
      );

      const blob = new Blob(['\uFEFF' + fallbackCsvText], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `contacts_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(
        '⚠ Trình duyệt không hỗ trợ ghi trực tiếp vào ổ đĩa. File contacts.csv đã được tải về máy của bạn!',
        'info'
      );
      return true;
    } catch (fallbackErr) {
      console.error('Fallback download failed:', fallbackErr);
      showToast('Thao tác ghi file thất bại. Vui lòng kiểm tra cài đặt trình duyệt.', 'error');
      return false;
    }
  }

  /**
   * Toast notification UI helper
   */
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Safely assign text content without innerHTML to prevent XSS
    const iconSpan = document.createElement('span');
    iconSpan.className = 'toast-icon';
    iconSpan.textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
    
    const msgSpan = document.createElement('span');
    msgSpan.className = 'toast-message';
    msgSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(msgSpan);
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('is-show');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  return {
    init,
    openModal,
    closeModal,
    showToast
  };
})();
