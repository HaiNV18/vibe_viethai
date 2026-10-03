// DatabaseManager — In-browser WASM SQLite Engine & Repository Interface

import { CONFIG } from '../config.js';
import { StorageUtil } from '../utils/storage.js';

export class DatabaseManager {
  static SQL = null;
  static db = null;
  static initialized = false;

  static async loadScript(url) {
    return new Promise((resolve, reject) => {
      if (window.initSqlJs) return resolve();
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.head.appendChild(script);
    });
  }

  static async init() {
    if (this.initialized && this.db) return this.db;

    try {
      await this.loadScript(CONFIG.SQL_WASM_URL);
      
      this.SQL = await window.initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });

      // Load saved binary DB from IndexedDB
      const savedBinary = await StorageUtil.loadBinary(CONFIG.VIDEOS_DB_KEY);
      
      if (savedBinary) {
        this.db = new this.SQL.Database(new Uint8Array(savedBinary));
        console.log('Loaded SQLite database from persistent storage.');
      } else {
        this.db = new this.SQL.Database();
        console.log('Created new empty SQLite database. Initializing schemas...');
        await this.initializeSchemasAndSeed();
      }

      this.initialized = true;
      return this.db;
    } catch (err) {
      console.error('DatabaseManager init failed:', err);
      throw err;
    }
  }

  static async initializeSchemasAndSeed() {
    try {
      const [usersSchema, videosSchema, seedSql] = await Promise.all([
        fetch('./database/schema-users.sql').then(r => r.text()),
        fetch('./database/schema-videos.sql').then(r => r.text()),
        fetch('./database/seed.sql').then(r => r.text())
      ]);

      this.db.run(usersSchema);
      this.db.run(videosSchema);
      this.db.run(seedSql);

      await this.save();
      console.log('Database schemas & seed data initialized successfully.');
    } catch (err) {
      console.error('Error seeding database:', err);
    }
  }

  static query(sql, params = []) {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');

    const stmt = this.db.prepare(sql);
    if (params && params.length) {
      stmt.bind(params);
    }

    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  static execute(sql, params = []) {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');

    this.db.run(sql, params);
    this.save(); // Persist changes automatically after execution
  }

  static async save() {
    if (!this.db) return;
    try {
      const binary = this.db.export();
      await StorageUtil.saveBinary(CONFIG.VIDEOS_DB_KEY, binary.buffer);
    } catch (err) {
      console.error('Failed to save SQLite binary:', err);
    }
  }

  static exportDatabase(filename = 'video_admin.db') {
    if (!this.db) return;
    const binary = this.db.export();
    const blob = new Blob([binary], { type: 'application/x-sqlite3' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  static async importDatabase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const uInt8Array = new Uint8Array(arrayBuffer);
          this.db = new this.SQL.Database(uInt8Array);
          await this.save();
          this.initialized = true;
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  }

  static async resetDatabase() {
    await StorageUtil.clearAll();
    this.db = new this.SQL.Database();
    await this.initializeSchemasAndSeed();
  }
}
