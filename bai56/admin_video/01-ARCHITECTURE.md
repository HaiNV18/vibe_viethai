# Architecture

## 1. Tổng quan

```text
HTML Pages
   |
   v
UI Components / DOM
   |
   v
Application Services
   |-- AuthService
   |-- VideoService
   |-- DashboardService
   |-- CategoryService
   |
   v
Database Layer
   |-- users.db
   |-- videos.db
   |-- categories.db (optional)
   |
   v
SQLite WASM
   |
   v
Browser Storage
   |-- IndexedDB / OPFS
   |
   +--> Export / Import .db
```

## 2. Không dùng backend

Không tạo:

- Node.js server
- Express
- PHP
- REST API
- GraphQL API
- Server-side authentication

Nếu cần thư viện bên ngoài, chỉ dùng thư viện chạy ở frontend và giữ toàn bộ business logic trong browser.

## 3. SQLite trong browser

Browser không có API SQLite native ổn định để mở trực tiếp `users.db` bằng JavaScript thuần.

Do đó database adapter phải:

- Load SQLite WASM.
- Mở database từ `ArrayBuffer`.
- Chạy SQL prepared statements.
- Serialize database về binary khi cần lưu.
- Persist dữ liệu vào IndexedDB hoặc OPFS.
- Có chức năng import/export `.db`.

Có thể dùng `sql.js` cho bản demo/ứng dụng nhỏ. Nếu cần storage và hiệu năng tốt hơn, có thể cân nhắc SQLite WASM/OPFS phù hợp.

## 4. Database repository pattern

UI không được gọi SQL trực tiếp.

Ví dụ:

```text
videos.html
   -> VideoService.getVideos()
      -> VideoRepository.findAll()
         -> DatabaseManager.query()
```

Điều này giúp Vibe Coding dễ hơn vì mỗi lớp có trách nhiệm rõ ràng.

## 5. Suggested project structure

```text
video-admin/
├── index.html
├── login.html
├── register.html
├── forgot-password.html
├── dashboard.html
├── videos.html
├── video-edit.html
│
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   └── pages.css
│
├── js/
│   ├── app.js
│   ├── config.js
│   │
│   ├── db/
│   │   ├── database-manager.js
│   │   ├── users-db.js
│   │   └── videos-db.js
│   │
│   ├── services/
│   │   ├── auth-service.js
│   │   ├── video-service.js
│   │   ├── dashboard-service.js
│   │   └── category-service.js
│   │
│   ├── repositories/
│   │   ├── user-repository.js
│   │   ├── video-repository.js
│   │   └── category-repository.js
│   │
│   ├── pages/
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── forgot-password.js
│   │   ├── dashboard.js
│   │   ├── videos.js
│   │   └── video-edit.js
│   │
│   └── utils/
│       ├── validation.js
│       ├── format.js
│       ├── storage.js
│       └── toast.js
│
├── database/
│   ├── users.db
│   ├── videos.db
│   ├── categories.db
│   ├── schema-users.sql
│   ├── schema-videos.sql
│   └── seed.sql
│
├── assets/
│   ├── thumbnails/
│   └── icons/
│
└── docs/
```

## 6. Static hosting

Có thể deploy static files lên hosting hỗ trợ HTTPS.

HTTPS nên được dùng vì Web Crypto API, storage APIs và một số browser APIs có yêu cầu secure context.

## 7. Quy tắc code

- ES modules.
- `const`/`let`, không dùng `var`.
- Async/await.
- Không inline JavaScript.
- Không inline CSS.
- Escape dữ liệu trước khi render HTML.
- Dùng prepared statements cho SQL.
- Tách UI khỏi database logic.
- Không duplicate SQL giữa các page.
