// Login Page Controller

import { App } from '../app.js';
import { AuthService } from '../services/auth-service.js';
import { ToastUtil } from '../utils/toast.js';
import { ValidationUtil } from '../utils/validation.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize SQLite & ensure guest user
  await App.init({ requireGuest: true });

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitBtn = document.getElementById('submit-btn');
  const autofillBtn = document.getElementById('autofill-btn');

  // Autofill button helper
  if (autofillBtn) {
    autofillBtn.addEventListener('click', () => {
      emailInput.value = 'admin@video.com';
      passwordInput.value = 'admin123';
      ToastUtil.info('Đã tự động điền tài khoản mẫu!');
    });
  }

  // Handle Form Submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!ValidationUtil.isValidEmail(email)) {
        ToastUtil.error('Vui lòng nhập định dạng email hợp lệ.');
        return;
      }

      if (!password) {
        ToastUtil.error('Vui lòng nhập mật khẩu.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Đang đăng nhập...</span>`;

      try {
        await AuthService.login(email, password);
        ToastUtil.success('Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } catch (err) {
        ToastUtil.error(err.message || 'Đăng nhập thất bại.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Đăng nhập</span>`;
      }
    });
  }
});
