import { query, queryOne, execute } from '../database/database.js';

export const FlightRepository = {
  findById(id) {
    const sql = `
      SELECT f.*, 
             a.name as airline_name, a.code as airline_code, a.logo as airline_logo,
             orig.code as origin_code, orig.name as origin_name, orig.city as origin_city,
             dest.code as destination_code, dest.name as destination_name, dest.city as destination_city
      FROM flights f
      JOIN airlines a ON f.airline_id = a.id
      JOIN airports orig ON f.origin_airport_id = orig.id
      JOIN airports dest ON f.destination_airport_id = dest.id
      WHERE f.id = ?;
    `;
    return queryOne(sql, [id]);
  },

  searchAndFilter(filters = {}) {
    let sql = `
      SELECT f.*, 
             a.name as airline_name, a.code as airline_code, a.logo as airline_logo,
             orig.code as origin_code, orig.name as origin_name, orig.city as origin_city,
             dest.code as destination_code, dest.name as destination_name, dest.city as destination_city
      FROM flights f
      JOIN airlines a ON f.airline_id = a.id
      JOIN airports orig ON f.origin_airport_id = orig.id
      JOIN airports dest ON f.destination_airport_id = dest.id
      WHERE f.status = 'available'
    `;
    const params = [];

    if (filters.origin) {
      sql += ` AND (UPPER(orig.code) = UPPER(?) OR UPPER(orig.city) LIKE UPPER(?))`;
      params.push(filters.origin, `%${filters.origin}%`);
    }

    if (filters.destination) {
      sql += ` AND (UPPER(dest.code) = UPPER(?) OR UPPER(dest.city) LIKE UPPER(?))`;
      params.push(filters.destination, `%${filters.destination}%`);
    }

    if (filters.departureDate) {
      sql += ` AND f.departure_date = ?`;
      params.push(filters.departureDate);
    }

    if (filters.tripType) {
      sql += ` AND f.trip_type = ?`;
      params.push(filters.tripType);
    }

    if (filters.stops !== undefined && filters.stops !== null && filters.stops !== '') {
      sql += ` AND f.stops = ?`;
      params.push(parseInt(filters.stops));
    }

    if (filters.airlineIds && filters.airlineIds.length > 0) {
      const placeholders = filters.airlineIds.map(() => '?').join(',');
      sql += ` AND f.airline_id IN (${placeholders})`;
      params.push(...filters.airlineIds);
    }

    if (filters.timeRange) {
      // 00:00-06:00, 06:00-12:00, 12:00-18:00, 18:00-24:00
      if (filters.timeRange === '0-6') {
        sql += ` AND f.departure_time >= '00:00' AND f.departure_time < '06:00'`;
      } else if (filters.timeRange === '6-12') {
        sql += ` AND f.departure_time >= '06:00' AND f.departure_time < '12:00'`;
      } else if (filters.timeRange === '12-18') {
        sql += ` AND f.departure_time >= '12:00' AND f.departure_time < '18:00'`;
      } else if (filters.timeRange === '18-24') {
        sql += ` AND f.departure_time >= '18:00' AND f.departure_time <= '23:59'`;
      }
    }

    // Sort Order
    if (filters.sortBy === 'price-desc') {
      sql += ` ORDER BY f.economy_price DESC`;
    } else {
      sql += ` ORDER BY f.economy_price ASC`;
    }

    return query(sql, params);
  },

  countAll() {
    const res = queryOne("SELECT COUNT(*) as count FROM flights;");
    return res ? res.count : 0;
  },

  getPaginated(limit = 20, offset = 0) {
    const sql = `
      SELECT f.*, 
             a.name as airline_name,
             orig.code as origin_code,
             dest.code as destination_code
      FROM flights f
      JOIN airlines a ON f.airline_id = a.id
      JOIN airports orig ON f.origin_airport_id = orig.id
      JOIN airports dest ON f.destination_airport_id = dest.id
      ORDER BY f.id ASC
      LIMIT ? OFFSET ?;
    `;
    return query(sql, [limit, offset]);
  },

  create(flightData) {
    const { flight_number, airline_id, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_time, duration_minutes, trip_type, stops, aircraft, economy_price, business_price, services } = flightData;
    return execute(`
      INSERT INTO flights (flight_number, airline_id, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_time, duration_minutes, trip_type, stops, aircraft, economy_price, business_price, services, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available');
    `, [flight_number, airline_id, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_time, duration_minutes, trip_type, stops || 0, aircraft || 'Airbus A320', economy_price, business_price, services || null]);
  }
};
