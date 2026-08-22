import { query, queryOne, execute, getDb } from '../database/database.js';

export const TourRepository = {
  getFeatured(limit = 8) {
    const sql = `
      SELECT t.*, a.name as airline_name, a.logo as airline_logo
      FROM tours t
      LEFT JOIN airlines a ON t.airline_id = a.id
      WHERE t.featured = 1
      ORDER BY t.id ASC
      LIMIT ?;
    `;
    return query(sql, [limit]);
  },

  findById(id) {
    const sql = `
      SELECT t.*, a.name as airline_name, a.logo as airline_logo
      FROM tours t
      LEFT JOIN airlines a ON t.airline_id = a.id
      WHERE t.id = ?;
    `;
    return queryOne(sql, [id]);
  },

  getItineraryByTourId(tourId) {
    const sql = `
      SELECT * FROM tour_itineraries
      WHERE tour_id = ?
      ORDER BY day_number ASC;
    `;
    return query(sql, [tourId]);
  },

  searchAndFilter(filters = {}) {
    let sql = `
      SELECT t.*, a.name as airline_name
      FROM tours t
      LEFT JOIN airlines a ON t.airline_id = a.id
      WHERE t.status = 'available'
    `;
    const params = [];

    if (filters.destination) {
      sql += ` AND (UPPER(t.destination) LIKE UPPER(?) OR UPPER(t.name) LIKE UPPER(?))`;
      params.push(`%${filters.destination}%`, `%${filters.destination}%`);
    }

    if (filters.operator) {
      sql += ` AND t.operator = ?`;
      params.push(filters.operator);
    }

    if (filters.departureDate) {
      sql += ` AND t.departure_date = ?`;
      params.push(filters.departureDate);
    }

    if (filters.days) {
      sql += ` AND t.days = ?`;
      params.push(parseInt(filters.days));
    }

    if (filters.country) {
      sql += ` AND UPPER(t.country) = UPPER(?)`;
      params.push(filters.country);
    }

    if (filters.sortBy === 'price-desc') {
      sql += ` ORDER BY t.price DESC`;
    } else {
      sql += ` ORDER BY t.price ASC`;
    }

    return query(sql, params);
  },

  countAll() {
    const res = queryOne("SELECT COUNT(*) as count FROM tours;");
    return res ? res.count : 0;
  },

  getPaginated(limit = 20, offset = 0) {
    const sql = `
      SELECT t.*, a.name as airline_name
      FROM tours t
      LEFT JOIN airlines a ON t.airline_id = a.id
      ORDER BY t.id ASC
      LIMIT ? OFFSET ?;
    `;
    return query(sql, [limit, offset]);
  },

  create(tourData, itineraries = []) {
    const db = getDb();
    const { code, name, operator, origin, destination, country, departure_date, days, nights, airline_id, aircraft, price, thumbnail, description, included_services, excluded_services, featured } = tourData;
    const createdAt = new Date().toISOString();

    db.run("BEGIN TRANSACTION;");
    try {
      db.run(`
        INSERT INTO tours (code, name, operator, origin, destination, country, departure_date, days, nights, airline_id, aircraft, price, thumbnail, description, included_services, excluded_services, featured, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `, [code, name, operator, origin, destination, country, departure_date, days, nights, airline_id || null, aircraft || null, price, thumbnail || null, description || null, included_services || null, excluded_services || null, featured ? 1 : 0, createdAt]);

      const lastIdRes = db.exec("SELECT last_insert_rowid() as id;");
      const tourId = lastIdRes[0].values[0][0];

      if (itineraries && itineraries.length > 0) {
        itineraries.forEach(it => {
          db.run(`
            INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation)
            VALUES (?, ?, ?, ?, ?, ?);
          `, [tourId, it.day_number, it.title, it.description, it.meals || null, it.accommodation || null]);
        });
      }

      db.run("COMMIT;");
      return { success: true, tourId };
    } catch (error) {
      db.run("ROLLBACK;");
      throw error;
    }
  }
};
