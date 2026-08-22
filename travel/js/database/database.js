import { CREATE_TABLES_SQL } from './schema.js';
import { seedDatabase } from './seed.js';

let dbInstance = null;

/**
 * Utility to hash password with Web Crypto API SHA-256
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Initializes sql.js SQLite database, creates tables & runs seed data
 */
export async function initDatabase() {
  if (dbInstance) return dbInstance;

  try {
    // Wait for initSqlJs from global window
    if (typeof window.initSqlJs !== 'function') {
      throw new Error('sql.js library not loaded');
    }

    const SQL = await window.initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    dbInstance = new SQL.Database();
    
    // Enable Foreign Keys
    dbInstance.run("PRAGMA foreign_keys = ON;");

    // Create Tables
    dbInstance.run(CREATE_TABLES_SQL);

    // Check if database needs seeding
    const res = dbInstance.exec("SELECT COUNT(*) as count FROM users;");
    const userCount = res.length > 0 ? res[0].values[0][0] : 0;

    if (userCount === 0) {
      console.log('Database empty. Running seed script...');
      await seedDatabase(dbInstance);
    }

    console.log('SQLite Database initialized successfully.');
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Helper to run SELECT queries and return array of objects
 */
export function query(sql, params = []) {
  if (!dbInstance) throw new Error('Database not initialized');
  try {
    const stmt = dbInstance.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error('SQL Query Error:', error, sql, params);
    return [];
  }
}

/**
 * Helper to run SELECT single row query
 */
export function queryOne(sql, params = []) {
  const results = query(sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Helper to run INSERT, UPDATE, DELETE queries
 */
export function execute(sql, params = []) {
  if (!dbInstance) throw new Error('Database not initialized');
  try {
    dbInstance.run(sql, params);
    const lastIdRes = dbInstance.exec("SELECT last_insert_rowid() as id;");
    const lastInsertId = lastIdRes.length > 0 ? lastIdRes[0].values[0][0] : null;
    return { success: true, lastInsertId };
  } catch (error) {
    console.error('SQL Execute Error:', error, sql, params);
    throw error;
  }
}

export function getDb() {
  return dbInstance;
}
