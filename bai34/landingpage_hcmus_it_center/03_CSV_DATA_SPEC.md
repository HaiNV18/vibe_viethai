# CSV Data Specification

## 1. Menu CSV

File:
`data/menu.csv`

Header:
```csv
label,url,target,order,visible
```

Ví dụ:
```csv
Trang chủ,index.html,_self,1,true
Giới thiệu,about.html,_self,2,true
Khóa học,#courses,_self,3,true
Lợi ích,#benefits,_self,4,true
Liên hệ,#contact,_self,5,true
```

### Quy tắc
- UTF-8.
- Dòng đầu là header.
- `label`: text hiển thị.
- `url`: URL nội bộ hoặc anchor.
- `target`: `_self` hoặc `_blank`.
- `order`: số nguyên để sắp xếp.
- `visible`: `true` hoặc `false`.
- Chỉ render record có `visible=true`.
- Sort theo `order`.
- Không hard-code các menu item trong HTML.

## 2. Contacts CSV

File:
`data/contacts.csv`

Header tối thiểu:
```csv
name,birth_year,phone,email,timestamp
```

File khởi tạo:
```csv
name,birth_year,phone,email,timestamp
```

### Quy tắc
- UTF-8.
- Append record mới, không xóa record cũ.
- Escape CSV đúng chuẩn RFC-style:
  - field có dấu phẩy phải được quote.
  - dấu `"` bên trong field phải chuyển thành `""`.
  - field có newline phải được quote.
- `timestamp` dùng ISO 8601.
- Không lưu mật khẩu hoặc dữ liệu nhạy cảm khác.

## 3. Đọc menu.csv
Có thể dùng:
```js
fetch('./data/menu.csv')
```

Nếu chạy bằng `file://` và browser chặn fetch, hướng dẫn người dùng chạy bằng static server. Không tạo backend riêng.

## 4. Ghi contacts.csv
Ưu tiên:
- File System Access API (`showDirectoryPicker`)
- Chọn thư mục project một lần.
- Lấy file handle `data/contacts.csv`.
- Đọc nội dung hiện có.
- Append record.
- Ghi lại file.

Fallback:
- Tạo nội dung CSV đầy đủ trong browser.
- Trigger download `contacts.csv`.
- Thông báo rằng browser không hỗ trợ ghi trực tiếp vào file hiện tại.

## 5. An toàn dữ liệu
- Trim input.
- Validate trước khi append.
- Không render user input bằng `innerHTML` nếu không cần; dùng `textContent`.
- Không đưa dữ liệu contact vào URL.
