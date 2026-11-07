# UI_DESIGN.md - Hệ thống Thiết kế Giao diện (UI/UX Design System)

## 1. Bảng màu (Color Palette)
Website sử dụng **tông màu sáng (Light Mode)**, nền trắng tinh khiết kết hợp sắc đỏ đặc trưng của thương hiệu **Vietjet (`#ee1d23`)**:

| Tên biến CSS | Mã màu (HEX) | Mục đích sử dụng |
| :--- | :--- | :--- |
| `--primary-red` | `#ee1d23` | Màu chủ đạo: Header bar, nút CTA chính (Tìm kiếm, Chọn vé, Đăng ký), giá tiền nổi bật, trạng thái active. |
| `--primary-red-dark` | `#c81016` | Màu khi Hover vào nút đỏ hoặc các liên kết quan trọng. |
| `--primary-red-light`| `#fff1f2` | Nền nhẹ cho các thẻ đang được chọn (ví dụ: thẻ Hạng Thương Gia khi click), badge khuyến mãi. |
| `--accent-yellow` | `#ffd200` | Màu vàng điểm nhấn đặc trưng của Vietjet (dùng cho nhãn "Hot", "SkyBoss", sao đánh giá). |
| `--bg-main` | `#ffffff` | Nền chính của toàn bộ trang và các Card nội dung. |
| `--bg-secondary` | `#f8fafc` | Nền phụ phân tách các section hoặc nền vùng danh sách kết quả để làm nổi bật các Card trắng. |
| `--text-primary` | `#0f172a` | Màu chữ chính (Tiêu đề, tên chuyến bay, tên tour) - độ tương phản cao, dễ đọc. |
| `--text-secondary` | `#475569` | Màu chữ phụ (Thời gian bay, mô tả dịch vụ, tên sân bay). |
| `--border-color` | `#e2e8f0` | Viền mảnh cho các khung Card, Input, Sidebar filter. |
| `--success-green` | `#16a34a` | Thông báo hoàn thành đặt chỗ và xác nhận gửi email. |

---

## 2. Font chữ & Typography
- **Font Family**: `'Be Vietnam Pro'`, `'Inter'`, hoặc `'Roboto'`, `sans-serif` (nhúng từ Google Fonts để hỗ trợ tiếng Việt có dấu đẹp mắt).
- **Phân cấp chữ**:
  - Tiêu đề Hero (`h1`): `32px - 40px`, `font-weight: 800`.
  - Tiêu đề Section (`h2`): `24px - 28px`, `font-weight: 700`, có gạch chân đỏ `#ee1d23` bên dưới.
  - Tiêu đề Card (`h3`): `18px`, `font-weight: 600`.
  - Giá vé / Giá tour: `20px - 24px`, `font-weight: 800`, màu `#ee1d23`.

---

## 3. Thiết kế Chi tiết các Thành phần (Components)

### 3.1. Header & Thanh Điều hướng (Sticky Navbar)
- Nền trắng `#ffffff`, viền dưới mảnh hoặc dải viền đỏ `#ee1d23` trên cùng (`4px`).
- Bên trái: Logo Vietjet (`images/vietjet-logo.jpg`) click về `index.html`.
- Ở giữa: Menu điều hướng gồm:
  - **Trang chủ** (`index.html`)
  - **Chuyến bay** (`flights.html`)
  - **Tour du lịch** (`tours.html`)
  - **Giỏ hàng** (`cart.html`)
- Bên phải: Nút **Giỏ hàng** nổi bật kèm Badge số lượng mục đã chọn (`0`, `1`, `2`...) lấy trực tiếp từ SQLite.

### 3.2. Trang Chủ (`index.html`)
1. **Hero Banner & Khung Tìm kiếm**:
   - Hình nền sử dụng ảnh `images/vietjet-tiep-viet-1.jpg` kết hợp lớp phủ sáng hoặc bố cục 2 cột hiện đại.
   - Khung tìm kiếm (Search Box) nền trắng `#ffffff`, bo góc `16px`, đổ bóng `0 10px 30px rgba(238, 29, 35, 0.12)`:
     - Hàng 1: Radio chọn `Vé khứ hồi` | `Vé một chiều`.
     - Hàng 2: Grid gồm `Điểm xuất phát`, `Điểm đến`, `Ngày đi`, `Ngày về` và nút đỏ `#ee1d23` **"TÌM KIẾM"**.
2. **Lưới 8 Tour Du lịch Nổi bật**:
   - Grid 4 cột trên Desktop (`grid-template-columns: repeat(4, 1fr)`), 2 cột trên Tablet, 1 cột trên Mobile.
   - **Hình ảnh Thumbnail**: Bắt buộc tỷ lệ **`600x400`** (`aspect-ratio: 3 / 2`, `object-fit: cover`), hiệu ứng phóng nhẹ khi hover.
   - Badge góc trên ảnh: Số ngày/đêm (VD: `4 Ngày 3 Đêm`).
   - Nội dung Card: Tên Tour, Hãng du lịch + Hãng bay, Giá tour màu đỏ `#ee1d23`.
3. **Khu vực Hãng Hàng Không**:
   - Dải các thẻ Logo hãng bay (VietJet Air, Vietnam Airlines, Singapore Airlines...) trên nền trắng, viền mảnh; khi hover viền chuyển sang màu đỏ `#ee1d23` và nâng nhẹ thẻ lên.

### 3.3. Trang Danh sách & Bộ lọc (`flights.html` và `tours.html`)
- **Bố cục**: Grid 2 cột (`300px 1fr`, khoảng cách `24px`).
- **Sidebar bên trái**:
  - Đặt trong thẻ trắng có `position: sticky; top: 90px`.
  - Chia từng nhóm bộ lọc rõ ràng bằng đường kẻ ngang mảnh: Sắp xếp giá, Loại vé/Đường bay, Hãng hàng không, Khung giờ cất cánh, Hạng dịch vụ.
  - Mỗi khi người dùng thay đổi bất kỳ bộ lọc nào, danh sách bên phải được truy vấn lại từ SQLite và cập nhật tức thì không cần tải lại trang.
- **Danh sách bên phải**:
  - Với **Chuyến bay**: Thẻ ngang hiển thị `[Logo & Hãng bay]` | `[Giờ đi - Điểm đi] ──✈── [Giờ đến - Điểm đến] (Thời gian bay & Ngày cất cánh)` | `[Dịch vụ đi kèm]` | `[Giá vé + Nút Chọn chuyến bay]`.
  - Với **Tour**: Thẻ hiển thị ảnh `600x400`, thông tin hãng bay, giờ cất cánh, thời gian bay, dịch vụ trọn gói và nút "Xem chi tiết".

### 3.4. Giao diện Chọn Hạng Vé tại Chi tiết Chuyến bay (`flight-detail.html`)
Thiết kế phần chọn giá vé **Hạng Phổ Thông** và **Hạng Thương Gia** trực quan theo chuẩn đặt vé hàng không:
- Đặt 2 cột thẻ lớn cạnh nhau:
  1. **Thẻ Hạng Phổ Thông (Economy)**:
     - Tiêu đề: **HẠNG PHỔ THÔNG (ECO)**
     - Giá tiền: Hiển thị lớn màu đỏ `#ee1d23`.
     - Danh sách quyền lợi (có icon dấu check):
       - `✓ 07 kg hành lý xách tay`
       - `✓ Miễn phí làm thủ tục trực tuyến`
       - `✓ Phí thay đổi chuyến bay/ngày bay theo quy định`
  2. **Thẻ Hạng Thương Gia (Business / SkyBoss)**:
     - Tiêu đề: **HẠNG THƯƠNG GIA (SKYBOSS / BUSINESS)** (kèm nhãn vàng nổi bật)
     - Giá tiền: Hiển thị lớn màu đỏ `#ee1d23`.
     - Danh sách quyền lợi:
       - `✓ 10 kg hành lý xách tay + 30 kg hành lý ký gửi`
       - `✓ Phòng chờ sang trọng tại sân bay`
       - `✓ Suất ăn nóng & đồ uống miễn phí trên chuyến bay`
       - `✓ Ưu tiên làm thủ tục check-in, lối đi riêng & chọn ghế đầu`
- Khi click vào thẻ nào, thẻ đó sáng viền đỏ dày `2px solid #ee1d23`, nền chuyển sang `#fff1f2`, và nút **"Thêm vào Giỏ Hàng"** cập nhật theo đúng mức giá của hạng vé đó.

### 3.5. Trang Giỏ hàng & Modal Email Xác nhận (`cart.html`)
- **Bố cục**: Cột trái (Danh sách chuyến bay & tour trong giỏ + Nút xóa từng mục / Xóa tất cả), Cột phải (Form nhập thông tin cá nhân + Tổng tiền + Nút **"ĐĂNG KÝ"**).
- **Modal Thông báo Hoàn thành & Mô phỏng Email**:
  - Khi nhấn **"Đăng ký"**, hiển thị hộp thoại xác nhận hoàn thành với khung mô phỏng giao diện Email thực tế:
    - **Người gửi (From)**: `nvhai061993@gmail.com` (Vietjet Travel Booking System)
    - **Người nhận (To)**: `<Email khách hàng vừa nhập>`
    - **Tiêu đề**: `Xác nhận đặt dịch vụ Chuyến bay / Tour du lịch Vietjet thành công`
    - **Nội dung**: Bảng tóm tắt các chuyến bay/tour đã đặt, mã đặt chỗ, thông tin hành khách và tổng số tiền thanh toán.
