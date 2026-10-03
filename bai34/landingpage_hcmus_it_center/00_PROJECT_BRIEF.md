# Project Brief — Landing Page Trung Tâm Tin Học

## Mục tiêu
Xây dựng một landing page hiện đại, responsive cho một trung tâm tin học bằng **HTML + CSS + JavaScript thuần**, không có backend và không dùng framework.

## Yêu cầu bắt buộc
- Chỉ sử dụng HTML, CSS, JavaScript.
- Không sử dụng backend, database server, Node.js runtime hoặc framework frontend.
- Menu/navigation phải lấy dữ liệu từ file `data/menu.csv`.
- Có popup liên hệ gồm:
  - Họ và tên
  - Năm sinh
  - Số điện thoại
  - Email
- Dữ liệu liên hệ phải được lưu thành CSV tại `data/contacts.csv`.
- Có trang `About Us` giới thiệu trung tâm.
- Responsive tốt trên desktop, tablet và mobile.
- Giao diện tiếng Việt.
- Code sạch, dễ bảo trì, tách HTML/CSS/JS.
- Có validation form và thông báo thành công/thất bại.

## Lưu ý quan trọng về CSV không backend
Trình duyệt không thể tự ý ghi file vào ổ đĩa. Vì vậy, phần lưu `contacts.csv` phải dùng **File System Access API** khi trình duyệt hỗ trợ:
1. Người dùng chọn thư mục project/data lần đầu.
2. JavaScript đọc/ghi `contacts.csv` trong thư mục đã cấp quyền.
3. Nếu trình duyệt không hỗ trợ File System Access API, cung cấp fallback xuất/tải `contacts.csv` mới và thông báo rõ cho người dùng.

Không được giả vờ rằng dữ liệu đã lưu vào file nếu thao tác ghi file thất bại.

## Kết quả mong muốn
Một project có thể mở/chạy bằng static server đơn giản và có cấu trúc rõ ràng để Antigravity có thể tiếp tục triển khai.
