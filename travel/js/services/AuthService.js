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

    let user = UserRepository.findByEmail(emailOrUsername);
    if (!user) {
      user = UserRepository.findByUsername(emailOrUsername);
    }

    if (!user) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    const hashedInput = await hashPassword(password);
    if (user.password_hash !== hashedInput) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    // Sanitize user object (remove password hash)
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

    if (UserRepository.findByEmail(email)) {
      throw new Error('Email này đã được đăng ký.');
    }

    if (UserRepository.findByUsername(username)) {
      throw new Error('Tên đăng nhập này đã được sử dụng.');
    }

    const password_hash = await hashPassword(password);
    const result = UserRepository.create({
      username,
      email,
      password_hash,
      role: 'user',
      full_name: full_name || '',
      phone: phone || ''
    });

    const newUser = UserRepository.findById(result.lastInsertId);
    const { password_hash: _, ...safeUser } = newUser;
    storage.set(STORAGE_KEYS.AUTH_USER, safeUser);
    return safeUser;
  },

  logout() {
    storage.remove(STORAGE_KEYS.AUTH_USER);
  },

  async updateProfile(data) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Chưa đăng nhập.');

    UserRepository.update(currentUser.id, data);
    const updatedUser = UserRepository.findById(currentUser.id);
    const { password_hash, ...safeUser } = updatedUser;
    storage.set(STORAGE_KEYS.AUTH_USER, safeUser);
    return safeUser;
  }
};
