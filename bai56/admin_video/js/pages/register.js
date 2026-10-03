// Register Page Controller

import { App } from '../app.js';
import { AuthService } from '../services/auth-service.js';
import { ToastUtil } from '../utils/toast.js';
import { ValidationUtil } from '../utils/validation.js';

document.addEventListener('DOMContentLoaded', async () => {
  await App.init({ requireGuest: true });

  const form = document.getElementById('register-form');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = fullNameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (!ValidationUtil.isNotEmpty(fullName)) {
        ToastUtil.error('Vui lòng nhập họ và tên.');
        return;
      }

      if (!ValidationUtil.isValidEmail(email)) {
        ToastUtil.error('Định dạng email không hợp lệ.');
        return;
      }

      if (!ValidationUtil.isValidPassword(password)) {
        ToastUtil.error('Mật khẩu phải có ít nhất 8 ký tự.');
        return;
      }

      if (password !== confirmPassword) {
        ToastUtil.error('Xác nhận mật khẩu không khớp.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Đang đăng ký...</span>`;

      try {
        await AuthService.register({ fullName, email, password });
        ToastUtil.success('Đăng ký tài khoản thành công! Hãy đăng nhập.');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
      } catch (err) {
        ToastUtil.error(err.message || 'Đăng ký thất bại.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Tạo tài khoản</span>`;
      }
    });
  }
});
