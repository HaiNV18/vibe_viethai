// AuthService — Authentication, Web Crypto hashing, session state, route guards

import { CONFIG } from '../config.js';
import { UserRepository } from '../repositories/user-repository.js';

export class AuthService {
  // Web Crypto API SHA-256 password hashing
  static async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async login(email, password) {
    const user = UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    if (user.status !== 'active') {
      throw new Error('Tài khoản của bạn đã bị khóa.');
    }

    const inputHash = await this.hashPassword(password);
    if (user.password_hash !== inputHash) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    // Update last login timestamp
    UserRepository.updateLastLogin(user.id);

    // Save user session in sessionStorage
    const sessionData = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      loggedInAt: new Date().toISOString()
    };
    sessionStorage.setItem(CONFIG.SESSION_STORAGE_KEY, JSON.stringify(sessionData));

    return sessionData;
  }

  static async register({ email, password, fullName }) {
    const existing = UserRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email này đã được sử dụng.');
    }

    const passwordHash = await this.hashPassword(password);
    const user = UserRepository.create({
      email,
      passwordHash,
      fullName,
      role: 'admin',
      status: 'active'
    });

    return user;
  }

  static logout() {
    sessionStorage.removeItem(CONFIG.SESSION_STORAGE_KEY);
    window.location.href = 'login.html';
  }

  static getCurrentUser() {
    const data = sessionStorage.getItem(CONFIG.SESSION_STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (_) {
      return null;
    }
  }

  static isAuthenticated() {
    return !!this.getCurrentUser();
  }

  static requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
    }
  }

  static requireGuest() {
    if (this.isAuthenticated()) {
      window.location.href = 'dashboard.html';
    }
  }

  static async forgotPasswordDemo(email) {
    const user = UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email không tồn tại trong hệ thống.');
    }
    // Client-side demo token simulation
    const resetToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      message: 'Mã phục hồi đã được tạo (mô phỏng Demo Client-side).',
      token: resetToken,
      email: user.email
    };
  }
}
