// CategoryRepository — Raw SQL access for categories table

import { DatabaseManager } from '../db/database-manager.js';

export class CategoryRepository {
  static findAll() {
    return DatabaseManager.query('SELECT * FROM categories ORDER BY name ASC');
  }

  static findById(id) {
    const rows = DatabaseManager.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
}
