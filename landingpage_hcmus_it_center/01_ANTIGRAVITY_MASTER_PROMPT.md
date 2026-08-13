# Antigravity Master Prompt

Bạn là senior frontend developer. Hãy xây dựng một website landing page cho **Trung tâm Tin học** theo toàn bộ yêu cầu trong file `00_PROJECT_BRIEF.md`.

## Công nghệ
Chỉ được dùng:
- HTML5
- CSS3
- JavaScript ES6+

Không dùng:
- React/Vue/Angular/Svelte
- Bootstrap/Tailwind nếu làm phát sinh dependency
- Backend
- Database
- PHP/Python/Node server
- API bên ngoài nếu không thật sự cần thiết

## Cấu trúc mong muốn
```text
/
├── index.html
├── about.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── csv.js
│   └── contact.js
├── data/
│   ├── menu.csv
│   └── contacts.csv
├── assets/
│   └── README.md
├── 00_PROJECT_BRIEF.md
├── 01_ANTIGRAVITY_MASTER_PROMPT.md
├── 02_UI_UX_SPEC.md
├── 03_CSV_DATA_SPEC.md
├── 04_FUNCTIONAL_SPEC.md
└── 05_ACCEPTANCE_CHECKLIST.md
```

## Quy tắc triển khai
1. Đọc toàn bộ các file `.md` trong project trước khi code.
2. Không thay đổi yêu cầu bắt buộc.
3. Tách trách nhiệm:
   - `csv.js`: parse/serialize CSV và xử lý file.
   - `contact.js`: popup, validation, lưu contact.
   - `app.js`: navigation, load menu, các hành vi chung.
4. Không nhúng CSS/JS lớn trực tiếp vào HTML.
5. Dùng semantic HTML.
6. Accessibility:
   - label rõ ràng
   - keyboard navigation
   - focus state
   - đóng popup bằng Escape
   - `aria-*` phù hợp
7. Responsive mobile-first.
8. Không hard-code menu nếu menu có thể lấy từ CSV.
9. Menu phải được load từ `data/menu.csv`.
10. Link trong CSV phải được validate trước khi render.
11. Popup liên hệ phải mở được từ CTA/header/menu.
12. Form phải validate cả phía client.
13. Email và số điện thoại phải có validation hợp lý.
14. Không lưu dữ liệu liên hệ vào server vì project không có backend.
15. Với `contacts.csv`, ưu tiên File System Access API; nếu không hỗ trợ thì fallback tải CSV.
16. Escape CSV đúng chuẩn khi field có dấu phẩy, dấu ngoặc kép hoặc xuống dòng.
17. Không ghi đè dữ liệu cũ khi thêm contact; phải append record mới.
18. Không đưa dữ liệu cá nhân mẫu thật vào source code.
19. Tạo dữ liệu mẫu an toàn trong `menu.csv` và `contacts.csv`.
20. Sau khi hoàn thành, kiểm tra toàn bộ acceptance checklist.

## Phong cách giao diện
- Hiện đại, chuyên nghiệp, thân thiện với học sinh/sinh viên/người đi làm.
- Có hero section nổi bật.
- CTA rõ ràng: “Đăng ký tư vấn”, “Xem khóa học”.
- Card khóa học.
- Section lợi ích.
- Section quy trình học.
- Testimonial.
- CTA cuối trang.
- Footer.
- About Us có câu chuyện, sứ mệnh, tầm nhìn, giá trị cốt lõi và đội ngũ/giảng viên ở mức giới thiệu.

## Không cần hỏi lại
Nếu thiếu thông tin thương hiệu, hãy dùng nội dung placeholder có thể dễ dàng sửa, ví dụ:
- “TechEdu Center”
- “Trung tâm Tin học TechEdu”
- Slogan placeholder
- Thông tin liên hệ placeholder

Hãy ưu tiên hoàn thành một phiên bản chạy được trước, sau đó tối ưu UI/UX.
