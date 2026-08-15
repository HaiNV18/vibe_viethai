// IndexedDB storage manager for SQLite binary persistence

import { CONFIG } from '../config.js';

export class StorageUtil {
  static openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CONFIG.INDEXEDDB_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(CONFIG.INDEXEDDB_STORE)) {
          db.createObjectStore(CONFIG.INDEXEDDB_STORE);
        }
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  static async saveBinary(key, arrayBuffer) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(CONFIG.INDEXEDDB_STORE, 'readwrite');
        const store = tx.objectStore(CONFIG.INDEXEDDB_STORE);
        const req = store.put(arrayBuffer, key);
        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      console.error('IndexedDB save failed:', err);
      // Fallback to localStorage as base64 string if IndexedDB fails
      try {
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        localStorage.setItem(key, btoa(binary));
      } catch (e) {
        console.error('LocalStorage fallback save failed:', e);
      }
    }
  }

  static async loadBinary(key) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(CONFIG.INDEXEDDB_STORE, 'readonly');
        const store = tx.objectStore(CONFIG.INDEXEDDB_STORE);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (err) {
      console.warn('IndexedDB load failed, trying localStorage:', err);
      const item = localStorage.getItem(key);
      if (!item) return null;
      try {
        const binary = atob(item);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
      } catch (e) {
        return null;
      }
    }
  }

  static async clearAll() {
    try {
      const db = await this.openDB();
      const tx = db.transaction(CONFIG.INDEXEDDB_STORE, 'readwrite');
      tx.objectStore(CONFIG.INDEXEDDB_STORE).clear();
      localStorage.clear();
    } catch (e) {
      console.error('Clear DB failed:', e);
    }
  }
}
