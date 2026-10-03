// VideoRepository — Raw SQL access for videos & video_view_stats tables

import { DatabaseManager } from '../db/database-manager.js';

export class VideoRepository {
  static findAll({ search = '', categoryId = '', status = '', limit = 10, offset = 0 } = {}) {
    let sql = `
      SELECT v.*, c.name AS category_name
      FROM videos v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.status != 'deleted'
    `;
    const params = [];

    if (search) {
      sql += ` AND (v.title LIKE ? OR v.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (categoryId) {
      sql += ` AND v.category_id = ?`;
      params.push(categoryId);
    }

    if (status) {
      sql += ` AND v.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY v.id DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    return DatabaseManager.query(sql, params);
  }

  static countAll({ search = '', categoryId = '', status = '' } = {}) {
    let sql = `SELECT COUNT(*) AS total FROM videos v WHERE v.status != 'deleted'`;
    const params = [];

    if (search) {
      sql += ` AND (v.title LIKE ? OR v.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (categoryId) {
      sql += ` AND v.category_id = ?`;
      params.push(categoryId);
    }

    if (status) {
      sql += ` AND v.status = ?`;
      params.push(status);
    }

    const res = DatabaseManager.query(sql, params);
    return res[0] ? res[0].total : 0;
  }

  static findById(id) {
    const rows = DatabaseManager.query(
      `SELECT v.*, c.name AS category_name 
       FROM videos v 
       LEFT JOIN categories c ON v.category_id = c.id 
       WHERE v.id = ? AND v.status != 'deleted' LIMIT 1`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static create(data) {
    const now = new Date().toISOString();
    DatabaseManager.execute(
      `INSERT INTO videos (title, description, thumbnail_url, video_url, file_size_bytes, duration_seconds, views, status, category_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.description || '',
        data.thumbnailUrl || '',
        data.videoUrl || '',
        data.fileSizeBytes || 0,
        data.durationSeconds || 0,
        data.views || 0,
        data.status || 'published',
        data.categoryId || null,
        now,
        now
      ]
    );

    const lastIdRes = DatabaseManager.query('SELECT last_insert_rowid() AS id');
    const newId = lastIdRes[0].id;
    return this.findById(newId);
  }

  static update(id, data) {
    const now = new Date().toISOString();
    DatabaseManager.execute(
      `UPDATE videos 
       SET title = ?, description = ?, thumbnail_url = ?, video_url = ?, file_size_bytes = ?, duration_seconds = ?, views = ?, status = ?, category_id = ?, updated_at = ?
       WHERE id = ?`,
      [
        data.title,
        data.description || '',
        data.thumbnailUrl || '',
        data.videoUrl || '',
        data.fileSizeBytes || 0,
        data.durationSeconds || 0,
        data.views || 0,
        data.status || 'published',
        data.categoryId || null,
        now,
        id
      ]
    );
    return this.findById(id);
  }

  static delete(id) {
    const now = new Date().toISOString();
    // Soft delete
    DatabaseManager.execute(
      `UPDATE videos SET status = 'deleted', updated_at = ? WHERE id = ?`,
      [now, id]
    );
  }

  // Dashboard Aggregations
  static getSummary() {
    const res = DatabaseManager.query(`
      SELECT 
        COUNT(*) AS totalVideos,
        COALESCE(SUM(views), 0) AS totalViews,
        COALESCE(SUM(file_size_bytes), 0) AS totalStorageBytes
      FROM videos
      WHERE status != 'deleted'
    `);
    return res[0] || { totalVideos: 0, totalViews: 0, totalStorageBytes: 0 };
  }

  static getTopByViews(limit = 10) {
    return DatabaseManager.query(`
      SELECT id, title, views, thumbnail_url
      FROM videos
      WHERE status != 'deleted'
      ORDER BY views DESC
      LIMIT ?
    `, [limit]);
  }

  static getViewsByDay() {
    return DatabaseManager.query(`
      SELECT view_date, SUM(view_count) AS views
      FROM video_view_stats
      GROUP BY view_date
      ORDER BY view_date ASC
    `);
  }

  static getViewsByMonth() {
    return DatabaseManager.query(`
      SELECT substr(view_date, 1, 7) AS month, SUM(view_count) AS views
      FROM video_view_stats
      GROUP BY substr(view_date, 1, 7)
      ORDER BY month ASC
    `);
  }
}
