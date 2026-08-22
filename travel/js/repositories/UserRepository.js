import { query, queryOne, execute } from '../database/database.js';

export const UserRepository = {
  findByEmail(email) {
    return queryOne("SELECT * FROM users WHERE LOWER(email) = LOWER(?);", [email]);
  },

  findByUsername(username) {
    return queryOne("SELECT * FROM users WHERE LOWER(username) = LOWER(?);", [username]);
  },

  findById(id) {
    return queryOne("SELECT * FROM users WHERE id = ?;", [id]);
  },

  create(user) {
    const { username, email, password_hash, role = 'user', full_name = '', phone = '', country = 'Vietnam', address = '' } = user;
    const createdAt = new Date().toISOString();
    return execute(`
      INSERT INTO users (username, email, password_hash, role, full_name, phone, country, address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [username, email, password_hash, role, full_name, phone, country, address, createdAt]);
  },

  update(id, data) {
    const { full_name, phone, country, address, avatar } = data;
    const updatedAt = new Date().toISOString();
    return execute(`
      UPDATE users 
      SET full_name = ?, phone = ?, country = ?, address = ?, avatar = ?, updated_at = ?
      WHERE id = ?;
    `, [full_name, phone, country, address, avatar || null, updatedAt, id]);
  }
};
