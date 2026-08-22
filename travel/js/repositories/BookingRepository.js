import { query, queryOne, execute, getDb } from '../database/database.js';

export const BookingRepository = {
  createBooking(booking, flights = [], tours = []) {
    const db = getDb();
    const { booking_code, user_id, customer_name, customer_email, customer_phone, country, address, total_amount } = booking;
    const createdAt = new Date().toISOString();

    db.run("BEGIN TRANSACTION;");
    try {
      db.run(`
        INSERT INTO bookings (booking_code, user_id, customer_name, customer_email, customer_phone, country, address, total_amount, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?);
      `, [booking_code, user_id || null, customer_name, customer_email, customer_phone, country, address, total_amount, createdAt]);

      const lastIdRes = db.exec("SELECT last_insert_rowid() as id;");
      const bookingId = lastIdRes[0].values[0][0];

      // Insert flights
      flights.forEach(f => {
        db.run(`
          INSERT INTO booking_flights (booking_id, flight_id, fare_class, quantity, price)
          VALUES (?, ?, ?, ?, ?);
        `, [bookingId, f.flight_id, f.fare_class, f.quantity || 1, f.price]);
      });

      // Insert tours
      tours.forEach(t => {
        db.run(`
          INSERT INTO booking_tours (booking_id, tour_id, quantity, price)
          VALUES (?, ?, ?, ?);
        `, [bookingId, t.tour_id, t.quantity || 1, t.price]);
      });

      db.run("COMMIT;");
      return { success: true, bookingId, bookingCode: booking_code };
    } catch (error) {
      db.run("ROLLBACK;");
      throw error;
    }
  },

  getMonthlyTourCount() {
    const sql = `
      SELECT COUNT(bt.id) as count 
      FROM booking_tours bt
      JOIN bookings b ON bt.booking_id = b.id;
    `;
    const res = queryOne(sql);
    return res ? res.count : 0;
  },

  getFlightCount() {
    const res = queryOne("SELECT COUNT(*) as count FROM flights;");
    return res ? res.count : 0;
  },

  getTourCustomerCount() {
    const sql = `
      SELECT COUNT(DISTINCT b.id) as count
      FROM bookings b
      JOIN booking_tours bt ON bt.booking_id = b.id;
    `;
    const res = queryOne(sql);
    return res ? res.count : 0;
  },

  getFlightCustomerCount() {
    const sql = `
      SELECT COUNT(DISTINCT b.id) as count
      FROM bookings b
      JOIN booking_flights bf ON bf.booking_id = b.id;
    `;
    const res = queryOne(sql);
    return res ? res.count : 0;
  },

  getTopAirlines(limit = 10) {
    const sql = `
      SELECT a.name as airline_name, COUNT(bf.id) as booking_count
      FROM airlines a
      JOIN flights f ON f.airline_id = a.id
      JOIN booking_flights bf ON bf.flight_id = f.id
      GROUP BY a.id
      ORDER BY booking_count DESC
      LIMIT ?;
    `;
    return query(sql, [limit]);
  },

  getTopTourCountries(limit = 10) {
    const sql = `
      SELECT b.country, COUNT(DISTINCT bt.tour_id) as tour_count, COUNT(DISTINCT b.id) as customer_count, COUNT(b.id) as total_bookings
      FROM bookings b
      JOIN booking_tours bt ON bt.booking_id = b.id
      WHERE b.country IS NOT NULL AND b.country != ''
      GROUP BY b.country
      ORDER BY total_bookings DESC
      LIMIT ?;
    `;
    return query(sql, [limit]);
  }
};
