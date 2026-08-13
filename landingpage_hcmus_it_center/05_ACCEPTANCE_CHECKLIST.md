# Acceptance Checklist

## Project
- [ ] Chỉ có HTML/CSS/JavaScript.
- [ ] Không có backend.
- [ ] Không có framework frontend bắt buộc.
- [ ] Có cấu trúc thư mục rõ ràng.

## Home
- [ ] `index.html` chạy được.
- [ ] Hero rõ ràng.
- [ ] Có CTA mở popup.
- [ ] Có section khóa học.
- [ ] Có section lợi ích.
- [ ] Có quy trình học.
- [ ] Có testimonial.
- [ ] Có final CTA.
- [ ] Có footer.

## Dynamic Menu
- [ ] Menu không hard-code.
- [ ] Menu lấy từ `data/menu.csv`.
- [ ] Có parse CSV.
- [ ] Có filter `visible`.
- [ ] Có sort `order`.
- [ ] Desktop và mobile dùng cùng nguồn dữ liệu.
- [ ] Xử lý lỗi khi CSV không load được.

## Contact
- [ ] Popup mở từ nhiều CTA.
- [ ] Có field họ tên.
- [ ] Có field năm sinh.
- [ ] Có field số điện thoại.
- [ ] Có field email.
- [ ] Có consent checkbox.
- [ ] Validation hoạt động.
- [ ] Escape đóng modal.
- [ ] Focus management hoạt động.
- [ ] Không dùng `innerHTML` để chèn input người dùng.

## Contacts CSV
- [ ] Có `data/contacts.csv`.
- [ ] Header đúng.
- [ ] Record mới được append.
- [ ] Record cũ không bị mất.
- [ ] CSV escaping đúng.
- [ ] Có timestamp.
- [ ] File System Access API được ưu tiên.
- [ ] Có fallback download khi không hỗ trợ.
- [ ] Không báo thành công giả khi ghi thất bại.

## About Us
- [ ] Có `about.html`.
- [ ] Có giới thiệu trung tâm.
- [ ] Có câu chuyện.
- [ ] Có sứ mệnh.
- [ ] Có tầm nhìn.
- [ ] Có giá trị cốt lõi.
- [ ] Có phương pháp đào tạo.
- [ ] Có CTA liên hệ.

## Responsive
- [ ] Mobile không vỡ layout.
- [ ] Tablet không vỡ layout.
- [ ] Desktop cân đối.
- [ ] Menu mobile hoạt động.
- [ ] Modal hoạt động tốt trên mobile.

## Final QA
- [ ] Không có console error nghiêm trọng.
- [ ] Không có broken link nội bộ.
- [ ] Không có dữ liệu cá nhân thật.
- [ ] Code có comment ở các phần logic khó.
- [ ] Tên file và đường dẫn nhất quán.
- [ ] Có hướng dẫn chạy project bằng static server.
