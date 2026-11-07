-- ============================================================================
-- FILE: 01_schema.sql
-- MÔ TẢ: Khởi tạo cấu trúc bảng (Schema) cho cơ sở dữ liệu SQLite Website Vietjet
-- ============================================================================

PRAGMA foreign_keys = ON;

-- Xóa bảng cũ nếu cần khởi tạo lại từ đầu
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS airlines;

-- 1. Bảng Hãng hàng không (airlines)
CREATE TABLE airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,          -- Mã IATA hãng bay: VJ, VN, SQ, QH, KE, TG
    name TEXT NOT NULL,                 -- Tên hãng hàng không
    logo TEXT NOT NULL,                 -- Đường dẫn ảnh logo
    country TEXT NOT NULL,              -- Quốc gia
    description TEXT                    -- Mô tả ngắn
);

-- 2. Bảng Chuyến bay (flights)
CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_code TEXT NOT NULL UNIQUE,   -- Số hiệu chuyến bay (VD: VJ122, VN254)
    airline_code TEXT NOT NULL,         -- Mã hãng bay (FK -> airlines.code)
    airline_name TEXT NOT NULL,         -- Tên hãng hàng không
    from_code TEXT NOT NULL,            -- Mã sân bay đi (SGN, HAN, DAD, PQC...)
    from_city TEXT NOT NULL,            -- Thành phố xuất phát
    to_code TEXT NOT NULL,              -- Mã sân bay đến
    to_city TEXT NOT NULL,              -- Thành phố điểm đến
    departure_date TEXT NOT NULL,       -- Ngày cất cánh (YYYY-MM-DD)
    return_date TEXT,                   -- Ngày về (YYYY-MM-DD, NULL nếu vé 1 chiều)
    departure_time TEXT NOT NULL,       -- Giờ cất cánh (HH:MM)
    arrival_time TEXT NOT NULL,         -- Giờ hạ cánh (HH:MM)
    departure_hour INTEGER NOT NULL,    -- Giờ nguyên (0 - 23) phục vụ bộ lọc khung giờ
    duration TEXT NOT NULL,             -- Tổng thời gian bay (VD: '2 giờ 05 phút')
    trip_type TEXT NOT NULL,            -- 'one-way' (Một chiều) | 'round-trip' (Khứ hồi)
    route_type TEXT NOT NULL,           -- 'direct' (Bay thẳng) | 'multi-city' (Nhiều thành phố)
    aircraft TEXT NOT NULL,             -- Loại máy bay (Airbus A321neo, Boeing 787-9...)
    price_economy INTEGER NOT NULL,     -- Giá vé Hạng Phổ Thông (VNĐ)
    price_business INTEGER NOT NULL,    -- Giá vé Hạng Thương Gia (VNĐ)
    services TEXT NOT NULL,             -- Dịch vụ đi kèm
    FOREIGN KEY (airline_code) REFERENCES airlines(code)
);

-- 3. Bảng Tour du lịch (tours)
CREATE TABLE tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,                -- Tên tour du lịch
    thumbnail TEXT NOT NULL,            -- Ảnh đại diện chuẩn kích thước 600x400
    travel_agency TEXT NOT NULL,        -- Hãng lữ hành tổ chức
    airline_code TEXT NOT NULL,         -- Mã hãng hàng không vận chuyển
    airline_name TEXT NOT NULL,         -- Tên hãng hàng không
    from_city TEXT NOT NULL,            -- Điểm xuất phát
    to_city TEXT NOT NULL,              -- Điểm đến
    departure_date TEXT NOT NULL,       -- Ngày cất cánh / khởi hành (YYYY-MM-DD)
    departure_time TEXT NOT NULL,       -- Giờ cất cánh (HH:MM)
    departure_hour INTEGER NOT NULL,    -- Giờ nguyên (0 - 23) phục vụ bộ lọc giờ cất cánh
    flight_duration TEXT NOT NULL,      -- Thời gian bay (VD: '1 giờ 00 phút')
    duration_days TEXT NOT NULL,        -- Số ngày/đêm (VD: '3 Ngày 2 Đêm')
    aircraft TEXT NOT NULL,             -- Loại máy bay (Boeing 787, Airbus A321...)
    price INTEGER NOT NULL,             -- Giá tour trọn gói (VNĐ)
    services TEXT NOT NULL,             -- Dịch vụ bao gồm trong tour
    itinerary TEXT NOT NULL,            -- Lịch trình chuyến đi chi tiết (JSON array)
    is_featured INTEGER DEFAULT 1,      -- 1: Hiển thị ở 8 tour nổi bật Trang chủ
    FOREIGN KEY (airline_code) REFERENCES airlines(code)
);

-- 4. Bảng Giỏ hàng (cart_items)
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,            -- 'flight' (Chuyến bay) | 'tour' (Tour du lịch)
    item_id INTEGER NOT NULL,           -- ID tham chiếu tới bảng flights hoặc tours
    title TEXT NOT NULL,                -- Tên hành trình hoặc tên Tour
    airline_name TEXT NOT NULL,         -- Hãng hàng không
    departure_info TEXT NOT NULL,       -- Thông tin ngày & giờ khởi hành
    aircraft TEXT,                      -- Loại máy bay
    service_class TEXT NOT NULL,        -- 'Hạng Phổ Thông' | 'Hạng Thương Gia' | 'Trọn gói Tour'
    quantity INTEGER NOT NULL DEFAULT 1,-- Số lượng khách
    unit_price INTEGER NOT NULL,        -- Đơn giá (VNĐ)
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Đơn đặt chỗ / Đăng ký (bookings)
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL UNIQUE,  -- Mã đặt chỗ (VD: VJ-20261107-001)
    customer_name TEXT NOT NULL,        -- Họ tên khách hàng
    customer_email TEXT NOT NULL,       -- Email nhận xác nhận của khách hàng
    customer_phone TEXT NOT NULL,       -- Số điện thoại khách hàng
    customer_note TEXT,                 -- Ghi chú thêm
    items_json TEXT NOT NULL,           -- Chuỗi JSON lưu danh sách chuyến bay/tour đã đặt
    total_amount INTEGER NOT NULL,      -- Tổng tiền thanh toán (VNĐ)
    sender_email TEXT NOT NULL DEFAULT 'nvhai061993@gmail.com', -- Email người gửi mặc định
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tạo Index tối ưu tốc độ truy vấn bộ lọc (Filter)
CREATE INDEX idx_flights_airline ON flights(airline_code);
CREATE INDEX idx_flights_route ON flights(from_code, to_code);
CREATE INDEX idx_flights_hour ON flights(departure_hour);
CREATE INDEX idx_flights_price_eco ON flights(price_economy);
CREATE INDEX idx_tours_airline ON tours(airline_code);
CREATE INDEX idx_tours_hour ON tours(departure_hour);
CREATE INDEX idx_tours_price ON tours(price);
