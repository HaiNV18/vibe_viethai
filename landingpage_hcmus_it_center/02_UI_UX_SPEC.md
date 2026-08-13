# UI/UX Specification

## 1. Header
Header sticky hoặc semi-sticky:
- Logo/tên trung tâm.
- Menu được render động từ `data/menu.csv`.
- CTA “Đăng ký tư vấn”.
- Mobile: hamburger menu.

## 2. Home — index.html

### Hero
- Eyebrow nhỏ.
- H1 mạnh, rõ lợi ích.
- Mô tả ngắn.
- CTA chính mở popup liên hệ.
- CTA phụ dẫn tới About Us hoặc khóa học.
- Visual minh họa bằng CSS/placeholder asset, không phụ thuộc ảnh bên ngoài.

### Courses
Hiển thị một số khóa học mẫu:
- Tin học văn phòng
- Excel nâng cao
- Lập trình cơ bản
- Thiết kế đồ họa
- Tin học cho người mới bắt đầu

Không biến danh sách này thành menu navigation; navigation phải lấy từ CSV.

### Benefits
4–6 lợi ích:
- Giảng viên thực tế
- Học theo dự án
- Lộ trình rõ ràng
- Lớp học quy mô phù hợp
- Hỗ trợ sau khóa học
- Chứng nhận/hoàn thành khóa học nếu phù hợp

### Learning Process
4 bước:
1. Tư vấn
2. Kiểm tra nhu cầu/trình độ
3. Học theo lộ trình
4. Đánh giá và hỗ trợ

### Testimonials
Dùng dữ liệu placeholder, không sử dụng thông tin cá nhân thật.

### Final CTA
CTA mở popup liên hệ.

### Footer
- Tên trung tâm
- Địa chỉ placeholder
- Điện thoại placeholder
- Email placeholder
- Navigation link
- Copyright

## 3. About Us — about.html
Các section:
- Hero About Us
- Trung tâm là ai?
- Câu chuyện hình thành
- Sứ mệnh
- Tầm nhìn
- Giá trị cốt lõi
- Phương pháp đào tạo
- Đội ngũ giảng viên
- CTA liên hệ

## 4. Contact Popup
Popup/modal có:
- Tiêu đề “Đăng ký tư vấn”
- Mô tả ngắn
- Họ và tên — bắt buộc
- Năm sinh — bắt buộc, dạng number
- Số điện thoại — bắt buộc
- Email — bắt buộc
- Checkbox đồng ý để trung tâm liên hệ lại
- Nút “Gửi thông tin”
- Nút đóng

Không lưu checkbox vào CSV nếu không cần; chỉ lưu 4 trường được yêu cầu và timestamp nếu muốn.

## 5. Responsive
Breakpoint tham khảo:
- Mobile: < 768px
- Tablet: 768–1023px
- Desktop: >= 1024px

Không được phụ thuộc cứng vào đúng breakpoint trên nếu layout cần điều chỉnh.

## 6. Accessibility
- Form field có `<label>`.
- Modal có `role="dialog"` và `aria-modal="true"`.
- Focus vào field đầu tiên khi mở modal.
- Escape để đóng.
- Khi modal đóng, trả focus về trigger.
- Contrast đủ tốt.
- Không chỉ dùng màu để truyền đạt trạng thái.

## 7. Visual direction
Phong cách:
- Clean
- Modern education
- Professional
- Có khoảng trắng tốt
- Typography rõ ràng
- Card bo góc vừa phải
- Hover/focus tinh tế
- Animation nhẹ, không gây khó chịu
