import { UserRepository } from '../repositories/UserRepository.js';
import { hashPassword } from '../database/database.js';
import { storage } from '../utils/storage.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import { isValidEmail, isValidUsername, isValidPassword } from '../utils/validation.js';

export const AuthService = {
  getCurrentUser() {
    return storage.get(STORAGE_KEYS.AUTH_USER, null);
  },

  async login(emailOrUsername, password) {
    if (!emailOrUsername || !password) {
      throw new Error('Vui lòng nhập đầy đủ thông tin đăng nhập.');
    }

    let user = await UserRepository.findByEmail(emailOrUsername);
    if (!user) {
      user = await UserRepository.findByUsername(emailOrUsername);
    }

    if (!user) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    const hashedInput = await hashPassword(password);
    if (user.password_hash !== hashedInput) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    // Sanitize user object
    const { password_hash, ...safeUser } = user;
    storage.set(STORAGE_KEYS.AUTH_USER, safeUser);
    return safeUser;
  },

  async register(userData) {
    const { username, email, password, confirmPassword, full_name, phone } = userData;

    if (!isValidUsername(username)) {
      throw new Error('Tên đăng nhập phải từ 5-15 ký tự và chỉ chứa chữ cái, chữ số.');
    }

    if (!isValidEmail(email)) {
      throw new Error('Định dạng email không hợp lệ.');
    }

    if (!isValidPassword(password)) {
      throw new Error('Mật khẩu phải từ 5-15 ký tự.');
    }

    if (password !== confirmPassword) {
      throw new Error('Mật khẩu xác nhận không trùng khớp.');
    }

    if (await UserRepository.findByEmail(email)) {
      throw new Error('Email này đã được đăng ký.');
    }

    if (await UserRepository.findByUsername(username)) {
      throw new Error('Tên đăng nhập này đã được sử dụng.');
    }

    const password_hash = await hashPassword(password);
    const createdUser = await UserRepository.create({
      username,
      email,
      password_hash,
      role: 'user',
      full_name: full_name || '',
      phone: phone || ''
    });

    const { password_hash: _, ...safeUser } = createdUser;
    storage.set(STORAGE_KEYS.AUTH_USER, safeUser);
    return safeUser;
  },

  logout() {
    storage.remove(STORAGE_KEYS.AUTH_USER);
  },

  async updateProfile(data) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Chưa đăng nhập.');

    const updatedUser = await UserRepository.update(currentUser.id, data);
    const { password_hash, ...safeUser } = updatedUser;
    storage.set(STORAGE_KEYS.AUTH_USER, safeUser);
    return safeUser;
  }
};
