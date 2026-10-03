# Run Guide

## Vì sao cần static server?
`fetch('./data/menu.csv')` thường không hoạt động khi mở trực tiếp HTML bằng `file://` do browser security policy.

Project không cần backend. Chỉ cần một static server để phục vụ file.

## Cách chạy
Nếu môi trường có Python:
```bash
python -m http.server 8000
```

Sau đó mở:
```text
http://localhost:8000/
```

Nếu Antigravity có preview/static server tích hợp, sử dụng preview đó.

## File System Access API
Để ghi trực tiếp `data/contacts.csv`:
1. Chạy project trên origin phù hợp, thường là `localhost` hoặc HTTPS.
2. Bấm CTA liên hệ và submit form.
3. Lần đầu browser có thể yêu cầu chọn thư mục project.
4. Chọn thư mục gốc chứa `data/`.
5. Cho phép quyền truy cập khi browser hỏi.

Nếu browser không hỗ trợ API hoặc quyền không được cấp:
- Website phải dùng fallback tải file CSV.
- Người dùng có thể thay thế file `data/contacts.csv` bằng file mới được tải xuống.

## Không được
- Không cài backend chỉ để giải quyết việc ghi CSV.
- Không gửi dữ liệu contact lên API bên thứ ba.
- Không lưu contact vào localStorage rồi tuyên bố rằng nó đã được ghi vào `contacts.csv`.
