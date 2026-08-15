// UserRepository — Raw SQL access for users table

import { DatabaseManager } from '../db/database-manager.js';

export class UserRepository {
  static findByEmail(email) {
    const rows = DatabaseManager.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email.toLowerCase().trim()]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static findById(id) {
    const rows = DatabaseManager.query(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static create({ email, passwordHash, fullName, role = 'admin', status = 'active' }) {
    const now = new Date().toISOString();
    DatabaseManager.execute(
      `INSERT INTO users (email, password_hash, full_name, role, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email.toLowerCase().trim(), passwordHash, fullName, role, status, now, now]
    );
    return this.findByEmail(email);
  }

  static updateLastLogin(id) {
    const now = new Date().toISOString();
    DatabaseManager.execute(
      'UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?',
      [now, now, id]
    );
  }

  static updatePassword(id, newPasswordHash) {
    const now = new Date().toISOString();
    DatabaseManager.execute(
      'UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?',
      [newPasswordHash, now, id]
    );
  }
}
