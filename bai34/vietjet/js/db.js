/**
 * FILE: js/db.js
 * MÔ TẢ: Tầng kết nối SQLite trên trình duyệt (sql.js) nạp dữ liệu trực tiếp từ file sqlite/db.db
 * và đồng bộ giỏ hàng / đơn đặt chỗ vào localStorage.
 */

const VietjetDB = (() => {
  let dbInstance = null;
  let initPromise = null;

  const STORAGE_CART_KEY = 'vietjet_cart_items_v1';
  const STORAGE_BOOKINGS_KEY = 'vietjet_bookings_v1';

  /**
   * Chuyển chuỗi Base64 sang Uint8Array
   */
  function base64ToUint8Array(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Tải dữ liệu nhị phân từ file sqlite/db.db (hoặc db.db, hoặc bản snapshot nhị phân nếu chạy qua file://)
   */
  async function loadDatabaseBytes() {
    const candidatePaths = ['sqlite/db.db', 'db.db', './sqlite/db.db'];
    for (const path of candidatePaths) {
      try {
        const response = await fetch(path, { cache: 'no-store' });
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          if (buffer && buffer.byteLength > 0) {
            console.log(`[VietjetDB] Đã tải database SQLite từ: ${path} (${buffer.byteLength} bytes)`);
            return new Uint8Array(buffer);
          }
        }
      } catch (err) {
        // Nếu mở trực tiếp qua giao thức file://, fetch sẽ bị chặn CORS -> chuyển sang fallback
      }
    }

    if (window.VIETJET_DB_BASE64) {
      console.log('[VietjetDB] Sử dụng dữ liệu nhị phân từ sqlite/db.db (chế độ file:// offline)');
      return base64ToUint8Array(window.VIETJET_DB_BASE64);
    }

    throw new Error('Không thể tải file sqlite/db.db');
  }

  /**
   * Đồng bộ bảng cart_items và bookings từ localStorage vào phiên SQLite hiện tại
   */
  function restoreUserTables() {
    if (!dbInstance) return;
    try {
      const savedCart = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');
      if (Array.isArray(savedCart) && savedCart.length > 0) {
        dbInstance.run('DELETE FROM cart_items;');
        const stmt = dbInstance.prepare(`
          INSERT INTO cart_items (item_type, item_id, title, airline_name, departure_info, aircraft, service_class, quantity, unit_price)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        savedCart.forEach((item) => {
          stmt.run([
            item.item_type,
            item.item_id,
            item.title,
            item.airline_name,
            item.departure_info,
            item.aircraft || '',
            item.service_class,
            item.quantity || 1,
            item.unit_price
          ]);
        });
        stmt.free();
      }

      const savedBookings = JSON.parse(localStorage.getItem(STORAGE_BOOKINGS_KEY) || '[]');
      if (Array.isArray(savedBookings) && savedBookings.length > 0) {
        dbInstance.run('DELETE FROM bookings;');
        const bStmt = dbInstance.prepare(`
          INSERT INTO bookings (booking_code, customer_name, customer_email, customer_phone, customer_note, items_json, total_amount, sender_email, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        savedBookings.forEach((b) => {
          bStmt.run([
            b.booking_code,
            b.customer_name,
            b.customer_email,
            b.customer_phone,
            b.customer_note || '',
            b.items_json,
            b.total_amount,
            b.sender_email || 'nvhai061993@gmail.com',
            b.created_at || new Date().toISOString()
          ]);
        });
        bStmt.free();
      }
    } catch (e) {
      console.warn('[VietjetDB] Không thể khôi phục trạng thái giỏ hàng:', e);
    }
  }

  /**
   * Lưu bảng cart_items và bookings từ SQLite vào localStorage để giữ dữ liệu khi chuyển trang
   */
  function persistUserTables() {
    if (!dbInstance) return;
    const cartRows = queryAll('SELECT * FROM cart_items ORDER BY id ASC');
    const bookingRows = queryAll('SELECT * FROM bookings ORDER BY id DESC');
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartRows));
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookingRows));
  }

  /**
   * Khởi tạo SQLite Database từ file sqlite/db.db
   */
  async function init() {
    if (dbInstance) return dbInstance;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      const SQL = await initSqlJs({
        locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
      });
      const dbBytes = await loadDatabaseBytes();
      dbInstance = new SQL.Database(dbBytes);
      restoreUserTables();
      return dbInstance;
    })();

    return initPromise;
  }

  /**
   * Thực thi câu lệnh SELECT trả về mảng các object
   */
  function queryAll(sql, params = []) {
    if (!dbInstance) throw new Error('Database chưa được khởi tạo. Hãy gọi await VietjetDB.init() trước.');
    const stmt = dbInstance.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  /**
   * Thực thi câu lệnh SELECT trả về 1 dòng đầu tiên
   */
  function queryOne(sql, params = []) {
    const rows = queryAll(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Thực thi câu lệnh INSERT / UPDATE / DELETE
   */
  function run(sql, params = []) {
    if (!dbInstance) throw new Error('Database chưa được khởi tạo.');
    dbInstance.run(sql, params);
    persistUserTables();
  }

  // ========================================================================
  // CÁC HÀM TRUY VẤN NGHIỆP VỤ (AIRLINES, FLIGHTS, TOURS, CART, BOOKINGS)
  // ========================================================================

  function getAirlines() {
    return queryAll('SELECT * FROM airlines ORDER BY id ASC');
  }

  function getFeaturedTours(limit = 8) {
    return queryAll('SELECT * FROM tours WHERE is_featured = 1 ORDER BY id ASC LIMIT ?', [limit]);
  }

  function getTourById(id) {
    return queryOne('SELECT * FROM tours WHERE id = ?', [Number(id)]);
  }

  function getFlightById(id) {
    const flight = queryOne(
      `SELECT f.*, a.logo AS airline_logo
       FROM flights f
       LEFT JOIN airlines a ON f.airline_code = a.code
       WHERE f.id = ?`,
      [Number(id)]
    );
    return flight;
  }

  function getDistinctLocations() {
    const fromList = queryAll('SELECT DISTINCT from_code AS code, from_city AS city FROM flights ORDER BY from_city ASC');
    const toList = queryAll('SELECT DISTINCT to_code AS code, to_city AS city FROM flights ORDER BY to_city ASC');
    return { fromList, toList };
  }

  /**
   * Lọc danh sách Chuyến bay theo bộ lọc ở trang flights.html
   */
  function filterFlights(filters = {}) {
    let sql = `
      SELECT f.*, a.logo AS airline_logo
      FROM flights f
      LEFT JOIN airlines a ON f.airline_code = a.code
      WHERE 1 = 1
    `;
    const params = [];

    if (filters.fromCode) {
      sql += ' AND f.from_code = ?';
      params.push(filters.fromCode);
    }

    if (filters.toCode) {
      sql += ' AND f.to_code = ?';
      params.push(filters.toCode);
    }

    if (filters.departureDate) {
      sql += ' AND f.departure_date = ?';
      params.push(filters.departureDate);
    }

    // Lọc loại hành trình: round-trip / one-way
    if (Array.isArray(filters.tripTypes) && filters.tripTypes.length > 0) {
      const placeholders = filters.tripTypes.map(() => '?').join(',');
      sql += ` AND f.trip_type IN (${placeholders})`;
      params.push(...filters.tripTypes);
    }

    // Lọc loại đường bay: direct (Bay thẳng) / multi-city (Nhiều thành phố)
    if (Array.isArray(filters.routeTypes) && filters.routeTypes.length > 0) {
      const placeholders = filters.routeTypes.map(() => '?').join(',');
      sql += ` AND f.route_type IN (${placeholders})`;
      params.push(...filters.routeTypes);
    }

    // Lọc hãng hàng không
    if (Array.isArray(filters.airlines) && filters.airlines.length > 0) {
      const placeholders = filters.airlines.map(() => '?').join(',');
      sql += ` AND f.airline_code IN (${placeholders})`;
      params.push(...filters.airlines);
    }

    // Lọc khung giờ cất cánh: 'early' (0-5), 'morning' (6-11), 'afternoon' (12-17), 'evening' (18-23)
    if (Array.isArray(filters.timeSlots) && filters.timeSlots.length > 0) {
      const slotConditions = [];
      filters.timeSlots.forEach((slot) => {
        if (slot === '0-6') slotConditions.push('(f.departure_hour >= 0 AND f.departure_hour < 6)');
        if (slot === '6-12') slotConditions.push('(f.departure_hour >= 6 AND f.departure_hour < 12)');
        if (slot === '12-18') slotConditions.push('(f.departure_hour >= 12 AND f.departure_hour < 18)');
        if (slot === '18-24') slotConditions.push('(f.departure_hour >= 18 AND f.departure_hour <= 23)');
      });
      if (slotConditions.length > 0) {
        sql += ` AND (${slotConditions.join(' OR ')})`;
      }
    }

    // Sắp xếp theo giá của hạng vé đang chọn (Phổ thông hoặc Thương gia)
    const priceColumn = filters.serviceClass === 'business' ? 'f.price_business' : 'f.price_economy';
    const sortDir = filters.sortPrice === 'desc' ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${priceColumn} ${sortDir}`;

    return queryAll(sql, params);
  }

  /**
   * Lọc danh sách Tour du lịch ở trang tours.html
   */
  function filterTours(filters = {}) {
    let sql = `
      SELECT t.*, a.logo AS airline_logo
      FROM tours t
      LEFT JOIN airlines a ON t.airline_code = a.code
      WHERE 1 = 1
    `;
    const params = [];

    if (Array.isArray(filters.airlines) && filters.airlines.length > 0) {
      const placeholders = filters.airlines.map(() => '?').join(',');
      sql += ` AND t.airline_code IN (${placeholders})`;
      params.push(...filters.airlines);
    }

    if (Array.isArray(filters.timeSlots) && filters.timeSlots.length > 0) {
      const slotConditions = [];
      filters.timeSlots.forEach((slot) => {
        if (slot === '0-6') slotConditions.push('(t.departure_hour >= 0 AND t.departure_hour < 6)');
        if (slot === '6-12') slotConditions.push('(t.departure_hour >= 6 AND t.departure_hour < 12)');
        if (slot === '12-18') slotConditions.push('(t.departure_hour >= 12 AND t.departure_hour < 18)');
        if (slot === '18-24') slotConditions.push('(t.departure_hour >= 18 AND t.departure_hour <= 23)');
      });
      if (slotConditions.length > 0) {
        sql += ` AND (${slotConditions.join(' OR ')})`;
      }
    }

    const sortDir = filters.sortPrice === 'desc' ? 'DESC' : 'ASC';
    sql += ` ORDER BY t.price ${sortDir}`;

    return queryAll(sql, params);
  }

  /**
   * Quản lý Giỏ hàng (cart_items)
   */
  function getCartItems() {
    return queryAll('SELECT * FROM cart_items ORDER BY id DESC');
  }

  function addToCart(item) {
    // Kiểm tra xem mục tương tự đã có trong giỏ chưa
    const existing = queryOne(
      'SELECT * FROM cart_items WHERE item_type = ? AND item_id = ? AND service_class = ?',
      [item.item_type, Number(item.item_id), item.service_class]
    );

    if (existing) {
      run('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [
        Number(item.quantity || 1),
        existing.id
      ]);
    } else {
      run(
        `INSERT INTO cart_items (item_type, item_id, title, airline_name, departure_info, aircraft, service_class, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.item_type,
          Number(item.item_id),
          item.title,
          item.airline_name,
          item.departure_info,
          item.aircraft || '',
          item.service_class,
          Number(item.quantity || 1),
          Number(item.unit_price)
        ]
      );
    }
  }

  function removeCartItem(cartId) {
    run('DELETE FROM cart_items WHERE id = ?', [Number(cartId)]);
  }

  function clearCart() {
    run('DELETE FROM cart_items');
  }

  function createBooking(customer) {
    const items = getCartItems();
    if (items.length === 0) {
      throw new Error('Giỏ hàng đang trống!');
    }

    const totalAmount = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `VJ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomNum}`;
    const senderEmail = 'nvhai061993@gmail.com';
    const createdAt = new Date().toLocaleString('vi-VN');

    run(
      `INSERT INTO bookings (booking_code, customer_name, customer_email, customer_phone, customer_note, items_json, total_amount, sender_email, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingCode,
        customer.name,
        customer.email,
        customer.phone,
        customer.note || '',
        JSON.stringify(items),
        totalAmount,
        senderEmail,
        createdAt
      ]
    );

    clearCart();

    return {
      bookingCode,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerNote: customer.note || '',
      items,
      totalAmount,
      senderEmail,
      createdAt
    };
  }

  return {
    init,
    queryAll,
    queryOne,
    run,
    getAirlines,
    getFeaturedTours,
    getTourById,
    getFlightById,
    getDistinctLocations,
    filterFlights,
    filterTours,
    getCartItems,
    addToCart,
    removeCartItem,
    clearCart,
    createBooking
  };
})();
