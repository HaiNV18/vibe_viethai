# ARCHITECTURE.md - Kiến trúc Hệ thống & Cơ sở dữ liệu SQLite

## 1. Cấu trúc Thư mục Dự án
Dự án được tổ chức theo mô hình Multi-Page Application (MPA) thuần HTML, CSS, JavaScript, không phụ thuộc vào bất kỳ Backend Server nào:

```text
vietjet/
├── index.html              # Trang chủ (Tìm chuyến bay, 8 Tour nổi bật, Logo Hãng bay)
├── flights.html            # Trang danh sách Chuyến bay & Bộ lọc chi tiết
├── flight-detail.html      # Trang chi tiết Chuyến bay & Chọn hạng vé (Phổ thông / Thương gia)
├── tours.html              # Trang danh sách Tour du lịch & Bộ lọc
├── tour-detail.html        # Trang chi tiết Tour & Lịch trình chuyến đi
├── cart.html               # Trang Giỏ hàng, Form đăng ký & Modal Email xác nhận
├── css/
│   └── style.css           # Stylesheet tổng hợp (Biến màu #ee1d23, Grid, Responsive, Modal)
├── js/
│   ├── db.js               # Khởi tạo SQLite (sql.js), Schema, Seed Data & đồng bộ LocalStorage
│   ├── app.js              # Hàm tiện ích dùng chung (Header badge giỏ hàng, format tiền tệ)
│   ├── home.js             # Logic Trang chủ
│   ├── flights.js          # Logic lọc & hiển thị trang Chuyến bay
│   ├── flight-detail.js    # Logic chọn hạng vé & thêm chuyến bay vào Giỏ hàng
│   ├── tours.js            # Logic lọc & hiển thị trang Tour
│   ├── tour-detail.js      # Logic chi tiết Tour & thêm tour vào Giỏ hàng
│   └── cart.js             # Logic Giỏ hàng, Thanh toán & Giả lập gửi email từ nvhai061993@gmail.com
├── images/
│   ├── vietjet-logo.jpg    # Logo Vietjet có sẵn
│   ├── vietjet-may-bay.jpg # Ảnh máy bay Vietjet có sẵn
│   └── vietjet-tiep-viet-1.jpg # Ảnh tiếp viên Vietjet có sẵn
├── GEMINI.md               # Quy tắc cấu hình Antigravity
├── PRD.md                  # Tài liệu yêu cầu sản phẩm
├── ARCHITECTURE.md         # Tài liệu kiến trúc & Database
├── UI_DESIGN.md            # Tài liệu hệ thống giao diện
└── TASKS.md                # Lộ trình triển khai dự án
```

---

## 2. Cơ chế Hoạt động của SQLite Không Cần Backend (`sql.js`)

Vì dự án yêu cầu **HTML, CSS, JS thuần không có backend** nhưng sử dụng **Database: SQLite**, hệ thống sử dụng **`sql.js`** (bản biên dịch SQLite chính thức sang WebAssembly):

1. **Tải thư viện**: Nhúng trực tiếp qua CDN trong các trang HTML:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"></script>
   ```
2. **Lưu trữ bền vững (Persistence)**:
   - Khi trang web khởi chạy, `js/db.js` kiểm tra khóa `vietjet_sqlite_db` trong `localStorage`.
   - Nếu đã tồn tại: Giải mã chuỗi Base64 thành `Uint8Array` và nạp vào `new SQL.Database(uint8Array)`.
   - Nếu chưa tồn tại (lần đầu truy cập): Khởi tạo `new SQL.Database()`, chạy toàn bộ lệnh `CREATE TABLE` và `INSERT INTO` dữ liệu mẫu (Seed Data), sau đó xuất `db.export()` lưu vào `localStorage`.
   - Bất kỳ thao tác thay đổi dữ liệu nào (`INSERT`, `UPDATE`, `DELETE` trên `cart_items` hoặc `bookings`) đều gọi hàm `saveDatabase()` để cập nhật ngay vào `localStorage`.

---

## 3. Thiết kế Schema SQLite (Database Schema)

### 3.1. Bảng `airlines` (Hãng hàng không)
Lưu thông tin các hãng hàng không hiển thị ở trang chủ và bộ lọc:
```sql
CREATE TABLE IF NOT EXISTS airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,      -- VD: 'VJ', 'VN', 'SQ', 'QH', 'KE', 'TG'
    name TEXT NOT NULL,             -- VD: 'VietJet Air', 'Vietnam Airlines', 'Singapore Airlines'
    logo TEXT NOT NULL,             -- Đường dẫn ảnh logo hoặc SVG/URL
    country TEXT                    -- Quốc gia
);
```

### 3.2. Bảng `flights` (Chuyến bay)
Lưu danh sách chuyến bay và đầy đủ thuộc tính phục vụ bộ lọc:
```sql
CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_code TEXT NOT NULL,      -- VD: 'VJ122', 'VN254', 'SQ177'
    airline_code TEXT NOT NULL,     -- Liên kết với airlines.code
    airline_name TEXT NOT NULL,     -- Tên hãng hàng không
    from_code TEXT NOT NULL,        -- Mã sân bay đi (SGN, HAN, DAD...)
    from_city TEXT NOT NULL,        -- Tên thành phố đi (TP. Hồ Chí Minh, Hà Nội...)
    to_code TEXT NOT NULL,          -- Mã sân bay đến
    to_city TEXT NOT NULL,          -- Tên thành phố đến
    departure_date TEXT NOT NULL,   -- Ngày cất cánh (YYYY-MM-DD)
    return_date TEXT,               -- Ngày về (nếu là vé khứ hồi)
    departure_time TEXT NOT NULL,   -- Giờ cất cánh (HH:MM, VD: '08:30')
    arrival_time TEXT NOT NULL,     -- Giờ hạ cánh (HH:MM, VD: '10:40')
    departure_hour INTEGER NOT NULL,-- Giờ nguyên (0-23) để lọc nhanh theo khung giờ cất cánh
    duration TEXT NOT NULL,         -- Thời gian bay (VD: '2 giờ 10 phút')
    trip_type TEXT NOT NULL,        -- 'one-way' (Một chiều) hoặc 'round-trip' (Khứ hồi)
    route_type TEXT NOT NULL,       -- 'direct' (Bay thẳng) hoặc 'multi-city' (Nhiều thành phố)
    aircraft TEXT NOT NULL,         -- Loại máy bay (VD: 'Airbus A321neo', 'Boeing 787-9 Dreamliner')
    price_economy INTEGER NOT NULL, -- Giá vé Hạng Phổ Thông (VNĐ)
    price_business INTEGER NOT NULL,-- Giá vé Hạng Thương Gia (VNĐ)
    services TEXT NOT NULL          -- Dịch vụ đi kèm (VD: 'Hành lý xách tay 7kg, Suất ăn nóng, Wifi')
);
```

### 3.3. Bảng `tours` (Tour du lịch)
Lưu trữ 8+ tour du lịch nổi bật với ảnh thumbnail chuẩn `600x400`:
```sql
CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,            -- Tên tour du lịch
    thumbnail TEXT NOT NULL,        -- URL/Path hình ảnh tỷ lệ 600x400
    travel_agency TEXT NOT NULL,    -- Hãng du lịch (VD: 'Vietjet Travel', 'Vietravel')
    airline_code TEXT NOT NULL,     -- Mã hãng bay vận chuyển
    airline_name TEXT NOT NULL,     -- Tên hãng bay (VD: 'VietJet Air', 'Singapore Airlines')
    from_city TEXT NOT NULL,        -- Điểm đi
    to_city TEXT NOT NULL,          -- Điểm đến
    departure_date TEXT NOT NULL,   -- Ngày cất cánh / khởi hành (YYYY-MM-DD)
    departure_time TEXT NOT NULL,   -- Giờ cất cánh (HH:MM)
    departure_hour INTEGER NOT NULL,-- Giờ nguyên (0-23) để lọc theo khung giờ cất cánh
    flight_duration TEXT NOT NULL,  -- Thời gian bay (VD: '1 giờ 50 phút')
    duration_days TEXT NOT NULL,    -- Số ngày/đêm (VD: '4 Ngày 3 Đêm')
    aircraft TEXT NOT NULL,         -- Loại máy bay (VD: 'Airbus A321', 'Boeing 787-10')
    price INTEGER NOT NULL,         -- Giá tour trọn gói (VNĐ)
    services TEXT NOT NULL,         -- Dịch vụ bao gồm (Vé máy bay, KS 4*, Ăn uống, HDV)
    itinerary TEXT NOT NULL,        -- Lịch trình chi tiết (Chuỗi JSON lưu mảng các ngày)
    is_featured INTEGER DEFAULT 1   -- 1: Hiển thị trong 8 tour nổi bật ở Trang chủ
);
```

### 3.4. Bảng `cart_items` (Giỏ hàng)
Lưu trữ các chuyến bay và tour mà người dùng đã chọn:
```sql
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,        -- 'flight' hoặc 'tour'
    item_id INTEGER NOT NULL,       -- ID của flight hoặc tour
    title TEXT NOT NULL,            -- Tên hành trình hoặc tên Tour
    airline_name TEXT NOT NULL,     -- Hãng hàng không
    departure_info TEXT NOT NULL,   -- Ngày & giờ khởi hành
    aircraft TEXT,                  -- Loại máy bay
    service_class TEXT,             -- 'Hạng Phổ Thông' hoặc 'Hạng Thương Gia' (hoặc 'Trọn gói Tour')
    quantity INTEGER DEFAULT 1,     -- Số lượng hành khách
    unit_price INTEGER NOT NULL,    -- Đơn giá đã chọn
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 3.5. Bảng `bookings` (Đơn đăng ký đặt chỗ)
Lưu thông tin khách hàng và lịch sử đặt hàng sau khi nhấn "Đăng ký":
```sql
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL,     -- Mã đơn (VD: 'VJ-20261107-889')
    customer_name TEXT NOT NULL,    -- Họ tên khách hàng
    customer_email TEXT NOT NULL,   -- Email khách hàng
    customer_phone TEXT NOT NULL,   -- Số điện thoại
    customer_note TEXT,             -- Ghi chú
    items_json TEXT NOT NULL,       -- Danh sách chi tiết các mục đã đặt
    total_amount INTEGER NOT NULL,  -- Tổng thanh toán
    sender_email TEXT DEFAULT 'nvhai061993@gmail.com',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Dữ liệu Mẫu (Seed Data) Yêu cầu
File `js/db.js` cần khởi tạo tối thiểu:
1. **6 Hãng hàng không**:
   - `VietJet Air` (VJ) - sử dụng `images/vietjet-logo.jpg`
   - `Vietnam Airlines` (VN)
   - `Singapore Airlines` (SQ)
   - `Bamboo Airways` (QH)
   - `Korean Air` (KE)
   - `Thai Airways` (TG)
2. **12 - 16 Chuyến bay (`flights`)**:
   - Đa dạng điểm đi/đến (TP.HCM, Hà Nội, Đà Nẵng, Phú Quốc, Nha Trang, Đà Lạt, Singapore, Bangkok, Seoul).
   - Đủ 4 khung giờ cất cánh (Sáng sớm `05:15`, Buổi sáng `08:30`, Buổi chiều `14:20`, Buổi tối `20:45`).
   - Đủ các loại vé (`one-way`, `round-trip`) và loại đường bay (`direct`, `multi-city`).
   - Đủ các dòng máy bay (`Airbus A320`, `Airbus A321neo`, `Airbus A350-900`, `Boeing 787-9 Dreamliner`, `Boeing 737 MAX`).
3. **8 Tour du lịch nổi bật (`tours`)**:
   - Tất cả đều có hình ảnh thumbnail đúng kích thước `600x400`.
   - Ví dụ 8 tour:
     1. *Phú Quốc – Đảo Ngọc Thiên Đường (3 Ngày 2 Đêm)* – VietJet Air – Airbus A321
     2. *Đà Nẵng – Hội An – Bà Nà Hills (4 Ngày 3 Đêm)* – VietJet Air – Airbus A321neo
     3. *Hà Nội – Hạ Long – Sapa Mờ Sương (5 Ngày 4 Đêm)* – Vietnam Airlines – Boeing 787-9
     4. *Đảo Quốc Sư Tử Singapore – Gardens by the Bay (4 Ngày 3 Đêm)* – Singapore Airlines – Airbus A350
     5. *Nha Trang – Vịnh San Hô – VinWonders (3 Ngày 2 Đêm)* – VietJet Air – Airbus A320
     6. *Đà Lạt – Thành Phố Ngàn Hoa Săn Mây (3 Ngày 2 Đêm)* – Bamboo Airways – Airbus A320neo
     7. *Bangkok – Pattaya – Xứ Sở Chùa Vàng (5 Ngày 4 Đêm)* – VietJet Air – Airbus A321
     8. *Seoul – Đảo Nami – Cung Điện Gyeongbokgung (5 Ngày 4 Đêm)* – Korean Air – Boeing 787-10
