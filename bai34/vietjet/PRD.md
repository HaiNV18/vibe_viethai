# PRD.md - Đặc tả Yêu cầu Sản phẩm (Product Requirements Document)

## 1. Giới thiệu chung
- **Tên dự án**: Website Du lịch & Đặt vé máy bay **Vietjet**
- **Mục tiêu**: Xây dựng website đặt vé máy bay và tour du lịch trọn gói với trải nghiệm trực quan, tốc độ nhanh, sử dụng HTML/CSS/JS thuần kết hợp cơ sở dữ liệu SQLite (`sql.js`) ngay trên trình duyệt.
- **Màu sắc chủ đạo**: Nền sáng/trắng (`#FFFFFF`), màu đỏ thương hiệu Vietjet (`#ee1d23`).

---

## 2. Cấu trúc các Trang (Pages Specification)

### 2.1. Trang Chủ (`index.html`)
Trang chủ gồm Header điều hướng, Hero Banner tìm kiếm, Khu vực 8 Tour du lịch nổi bật, Khu vực Đối tác Hãng hàng không và Footer.

1. **Khối Tìm kiếm Chuyến bay (Flight Search Widget)**:
   - Chọn loại vé (Radio/Tab): **Vé một chiều**, **Vé khứ hồi**.
   - Trường chọn **Điểm xuất phát** (Dropdown danh sách sân bay/thành phố: TP. Hồ Chí Minh (SGN), Hà Nội (HAN), Đà Nẵng (DAD), Phú Quốc (PQC), Nha Trang (CXR), Đà Lạt (DLI), Singapore (SIN), Bangkok (BKK), Seoul (ICN), Tokyo (NRT)...).
   - Trường chọn **Điểm đến** (Dropdown tương tự, kiểm tra không trùng điểm xuất phát).
   - Trường chọn **Ngày đi** (Date picker) và **Ngày về** (Date picker - tự động ẩn/vô hiệu hóa nếu chọn Vé một chiều).
   - Nút **"Tìm Kiếm"** (màu đỏ `#ee1d23`): Click vào sẽ chuyển hướng sang trang **Chuyến Bay (`flights.html`)** kèm các tham số lọc trên URL.

2. **Phần Tour Du lịch Nổi bật (Featured Tours)**:
   - Hiển thị đúng **8 tour du lịch nổi bật** (lấy từ bảng `tours` trong SQLite, chia lưới 4 cột x 2 hàng trên Desktop).
   - Mỗi thẻ Tour (Tour Card) bao gồm:
     - **Hình thumbnail kích thước chuẩn `600x400`** (tỷ lệ khung hình 3:2).
     - **Hãng du lịch** (ví dụ: Vietjet Travel, Saigontourist, Vietravel...) & **Hãng bay**.
     - **Số ngày/đêm** (ví dụ: 4 Ngày 3 Đêm, 3 Ngày 2 Đêm).
     - **Giá tour** nổi bật màu đỏ `#ee1d23`.
   - **Tương tác**: Click vào thẻ tour hoặc nút "Xem thêm" sẽ dẫn đến trang **Tour (`tours.html`)** hoặc chi tiết tour tương ứng.

3. **Phần Hãng Hàng Không (Airlines Section)**:
   - Hiển thị danh sách logo của các hãng hàng không uy tín: **VietJet Air**, **Vietnam Airlines**, **Singapore Airlines**, **Bamboo Airways**, **Thai Airways**, **Korean Air**...
   - **Tương tác**: Click vào bất kỳ logo hãng bay nào sẽ dẫn đến trang **Chuyến Bay (`flights.html`)** (tự động lọc hoặc hiển thị danh sách chuyến bay của hãng đó).

---

### 2.2. Trang Chuyến Bay (`flights.html`)
Bố cục 2 cột: **Cột trái (Bộ lọc - Sidebar 280px - 320px)** và **Cột phải (Danh sách chuyến bay)**.

1. **Bên trái - Bộ lọc tìm kiếm (Sidebar Filter)**:
   - **Sắp xếp giá vé**: Giá tăng dần (Thấp đến Cao), Giá giảm dần (Cao đến Thấp).
   - **Loại hành trình / Loại vé**:
     - Vé khứ hồi
     - Vé một chiều
     - Bay thẳng
     - Nhiều thành phố
   - **Các hãng hàng không** (Checkbox): VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways...
   - **Thời gian cất cánh (Giờ)** (Checkbox theo khung giờ):
     - Sáng sớm: `00:00 - 06:00`
     - Buổi sáng: `06:00 - 12:00`
     - Buổi chiều: `12:00 - 18:00`
     - Buổi tối: `18:00 - 24:00`
   - **Hạng dịch vụ** (Checkbox/Radio):
     - Hạng Phổ Thông (Economy)
     - Hạng Thương Gia (Business / SkyBoss)
   - Nút "Đặt lại bộ lọc" (Reset filter).

2. **Bên phải - Danh sách Chuyến bay**:
   - Hiển thị các thẻ chuyến bay khớp với điều kiện lọc từ bảng `flights` trong SQLite.
   - Mỗi chuyến bay hiển thị đầy đủ:
     - Logo & Tên hãng hàng không, Mã chuyến bay (VD: `VJ122`).
     - Điểm đi -> Điểm đến.
     - **Ngày cất cánh**, giờ cất cánh - giờ hạ cánh, **tổng thời gian bay** (VD: `2 giờ 10 phút`), loại đường bay (Bay thẳng / Nhiều thành phố).
     - **Dịch vụ đi kèm** (VD: Hành lý xách tay 7kg, Suất ăn nhẹ, Wifi, Đổi vé linh hoạt...).
     - **Giá tiền** (hiển thị theo hạng dịch vụ đang chọn hoặc giá khởi điểm).
   - **Tương tác**: Click chọn chuyến bay sẽ chuyển đến trang **Chi tiết chuyến bay (`flight-detail.html?id=<flight_id>`)**.

---

### 2.3. Trang Chi Tiết Chuyến Bay (`flight-detail.html`)
Hiển thị thông tin chuyên sâu của chuyến bay được chọn và cho phép chọn hạng vé trước khi thêm vào giỏ hàng.

1. **Thông tin Hành trình & Máy bay**:
   - Điểm đi (Sân bay đi, Thành phố) & Điểm đến (Sân bay đến, Thành phố).
   - Ngày khởi hành, Giờ cất cánh, Giờ hạ cánh, Tổng thời gian bay.
   - Hãng bay (Logo + Tên hãng).
   - **Loại máy bay**: Hiển thị rõ dòng tàu bay (ví dụ: `Airbus A321neo`, `Airbus A320`, `Boeing 787-9 Dreamliner`, `Airbus A350-900`...).
   - Dịch vụ tiện ích trên chuyến bay.

2. **Khu vực Chọn Giá Vé theo Hạng Dịch Vụ (Fare Class Selector)**:
   - Thiết kế dạng 2 thẻ chọn trực quan cạnh nhau:
     - **Hạng Phổ Thông (Economy / Eco)**:
       - Giá vé tiêu chuẩn.
       - Quyền lợi: 07kg hành lý xách tay, chọn chỗ ngồi tiêu chuẩn, phí đổi lịch bay theo quy định.
     - **Hạng Thương Gia (Business / SkyBoss)**:
       - Giá vé thương gia.
       - Quyền lợi: 10kg-14kg hành lý xách tay + 30kg hành lý ký gửi, phòng chờ sang trọng, suất ăn nóng miễn phí, ưu tiên làm thủ tục & lên máy bay.
   - Người dùng click chọn 1 trong 2 hạng vé (có hiệu ứng viền đỏ `#ee1d23` và dấu tick xác nhận).

3. **Hành động Đặt chuyến bay**:
   - Nút **"Chọn chuyến bay / Thêm vào Giỏ Hàng"**:
     - Lưu chuyến bay kèm hạng vé và mức giá đã chọn vào bảng `cart_items` trong SQLite.
     - Cập nhật số lượng trên icon Giỏ hàng ở Header và chuyển hướng (hoặc hiển thị thông báo kèm nút đi tới) trang **Giỏ Hàng (`cart.html`)**.

---

### 2.4. Trang Tour Du Lịch (`tours.html`)
Bố cục 2 cột tương tự trang Chuyến bay nhưng tập trung vào các gói Tour du lịch kết hợp vé máy bay.

1. **Bên trái - Bộ lọc Tour (Sidebar Filter)**:
   - **Sắp xếp giá vé / giá tour**: Tăng dần, Giảm dần.
   - **Các hãng hàng không** đồng hành trong tour (VietJet Air, Vietnam Airlines, Singapore Airlines...).
   - **Thời gian cất cánh (Giờ)**: `00:00 - 06:00`, `06:00 - 12:00`, `12:00 - 18:00`, `18:00 - 24:00`.

2. **Bên phải - Danh sách Tour du lịch**:
   - Mỗi thẻ Tour hiển thị:
     - Hình ảnh thumbnail `600x400`, Tên tour du lịch, Hãng lữ hành.
     - **Hãng bay** vận chuyển.
     - **Ngày cất cánh (Ngày khởi hành)**, **Thời gian bay** (giờ cất cánh & thời lượng bay) + Thời lượng tour (Số ngày/đêm).
     - **Dịch vụ bao gồm**: Vé máy bay khứ hồi, Khách sạn 4-5 sao, Xe đưa đón, Hướng dẫn viên, Bảo hiểm du lịch...
     - **Giá tiền** trọn gói.
   - **Tương tác**: Click chọn tour sẽ dẫn đến trang **Chi tiết Tour (`tour-detail.html?id=<tour_id>`)**.

---

### 2.5. Trang Chi Tiết Tour (`tour-detail.html`)
Hiển thị toàn bộ thông tin chuyến đi, thông tin hàng không của tour và lịch trình chi tiết từng ngày.

1. **Thông tin Chuyến bay & Hành trình trong Tour**:
   - Điểm đi, Điểm đến.
   - Ngày khởi hành, Thời gian bay (giờ cất cánh - hạ cánh, tổng giờ bay).
   - Hãng bay & Hãng lữ hành tổ chức.
   - **Loại máy bay** sử dụng (ví dụ: `Boeing 787`, `Airbus A321`, `Airbus A330`...).
   - Số ngày/đêm và tổng quan dịch vụ.

2. **Lịch trình Chuyến đi (Tour Itinerary)**:
   - Hiển thị dạng Timeline hoặc Accordion rõ ràng theo từng ngày:
     - **Ngày 1**: Đón sân bay – Khởi hành – Nhận phòng khách sạn – Tham quan điểm đến...
     - **Ngày 2**: Khám phá các danh lam thắng cảnh – Ẩm thực địa phương...
     - **Ngày 3 / Ngày 4**: Mua sắm đặc sản – Ra sân bay làm thủ tục đáp chuyến bay về lại điểm xuất phát.

3. **Hành động Đặt Tour**:
   - Chọn số lượng hành khách (mặc định 1 người).
   - Nút **"Chọn Tour / Thêm vào Giỏ Hàng"**:
     - Lưu tour đã chọn vào bảng `cart_items` trong SQLite.
     - Hiển thị thông báo thành công và dẫn tới trang **Giỏ Hàng (`cart.html`)**.

---

### 2.6. Trang Giỏ Hàng (`cart.html`)
Quản lý các dịch vụ đã chọn và hoàn tất đăng ký đặt chỗ.

1. **Danh sách Chuyến bay & Tour đã chọn**:
   - Hiển thị bảng hoặc danh sách thẻ các mục trong giỏ hàng (phân biệt rõ loại `Chuyến bay` hay `Tour du lịch`).
   - Thông tin hiển thị: Tên hành trình/Tour, Hãng bay, Ngày/Giờ khởi hành, Hạng vé (nếu là chuyến bay), Số lượng, Đơn giá, Thành tiền.
   - **Chức năng Xóa**:
     - Nút xóa từng mục khỏi giỏ hàng.
     - Nút **"Xóa toàn bộ giỏ hàng"**.
   - Hiển thị **Tổng cộng thanh toán** tự động tính toán chính xác từ SQLite.

2. **Form Nhập Thông tin Cá nhân**:
   - Họ và tên khách hàng *(bắt buộc)*.
   - Địa chỉ Email nhận vé/xác nhận *(bắt buộc, kiểm tra đúng định dạng email)*.
   - Số điện thoại liên hệ *(bắt buộc)*.
   - CMND/CCCD/Hộ chiếu & Ghi chú thêm *(tùy chọn)*.

3. **Đăng ký & Mô phỏng Gửi Email Xác nhận**:
   - Khi nhấn nút **"Đăng ký"**:
     1. Kiểm tra giỏ hàng không rỗng và thông tin cá nhân hợp lệ.
     2. Lưu đơn hàng vào bảng `bookings` trong SQLite, sau đó xóa các mục trong `cart_items`.
     3. Hiển thị **Thông báo hoàn thành** đặt vé/tour thành công.
     4. Hiển thị **Popup / Modal Chi tiết Email Xác nhận** được gửi từ địa chỉ **`nvhai061993@gmail.com`** đến địa chỉ email của khách hàng, bao gồm:
        - `Từ (From)`: `Vietjet Travel <nvhai061993@gmail.com>`
        - `Đến (To)`: `<Email của khách hàng>`
        - `Tiêu đề (Subject)`: `[Vietjet] Xác nhận đăng ký Chuyến bay & Tour du lịch thành công - Mã đơn #VJ...`
        - `Nội dung email`: Thông tin khách hàng, chi tiết các chuyến bay/tour đã đặt, tổng tiền và lời cảm ơn từ Vietjet.
