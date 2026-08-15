// Forgot Password Page Controller

import { App } from '../app.js';
import { AuthService } from '../services/auth-service.js';
import { ToastUtil } from '../utils/toast.js';
import { ValidationUtil } from '../utils/validation.js';

document.addEventListener('DOMContentLoaded', async () => {
  await App.init({ requireGuest: true });

  const form = document.getElementById('forgot-form');
  const emailInput = document.getElementById('email');
  const resultBox = document.getElementById('result-box');
  const tokenCode = document.getElementById('token-code');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();

      if (!ValidationUtil.isValidEmail(email)) {
        ToastUtil.error('Vui lòng nhập email hợp lệ.');
        return;
      }

      try {
        const res = await AuthService.forgotPasswordDemo(email);
        resultBox.style.display = 'block';
        tokenCode.textContent = res.token;
        ToastUtil.success('Đã tạo mã khôi phục Demo!');
      } catch (err) {
        ToastUtil.error(err.message || 'Không tìm thấy tài khoản.');
      }
    });
  }
});
