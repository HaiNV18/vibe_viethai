# Project Structure

Đề xuất cấu trúc:

```text
video-admin/
│
├── index.html
│
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── forgot-password.html
│   ├── dashboard.html
│   ├── videos.html
│   ├── video-form.html
│   ├── users.html
│   └── categories.html
│
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   ├── forms.css
│   ├── tables.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── guard.js
│   ├── storage.js
│   ├── csv.js
│   ├── dashboard.js
│   ├── videos.js
│   ├── users.js
│   ├── categories.js
│   ├── charts.js
│   ├── components.js
│   └── utils.js
│
├── data/
│   ├── users.csv
│   ├── videos.csv
│   ├── video_categories.csv
│   ├── categories.csv
│   └── video_views.csv
│
└── README.md
```

## Nguyên tắc

Không đặt toàn bộ JavaScript vào HTML.

Không đặt CSS lớn trực tiếp trong HTML.

Các module JS có trách nhiệm riêng.

`storage.js` chịu trách nhiệm localStorage.

`csv.js` chịu trách nhiệm parse CSV.

`auth.js` xử lý login/register/logout.

`guard.js` xử lý route protection.

`dashboard.js` xử lý KPI.

`videos.js` xử lý video CRUD.

`users.js` xử lý user CRUD.

`categories.js` xử lý category CRUD.

`charts.js` xử lý biểu đồ.
