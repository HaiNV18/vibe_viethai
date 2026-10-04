# Vibe Coding Workflow

## Mục tiêu

Sử dụng AI/Antigravity để xây dựng project theo từng bước thay vì yêu cầu AI tạo toàn bộ project trong một prompt duy nhất.

## Step 1 - Đọc specification

AI phải đọc:

- 00_PROJECT_OVERVIEW.md
- 01_REQUIREMENTS.md
- 02_PROJECT_STRUCTURE.md
- 03_DATABASE_SCHEMA.md

## Step 2 - Tạo skeleton

Tạo:

- HTML pages
- CSS folders
- JS folders
- data folders

Chưa cần CRUD hoàn chỉnh.

## Step 3 - Build UI

Ưu tiên:

1. Layout
2. Sidebar
3. Topbar
4. Cards
5. Tables
6. Forms
7. Responsive

## Step 4 - Build data layer

Implement:

- csv.js
- storage.js

## Step 5 - Authentication

Implement:

- login
- register
- forgot password
- logout
- route guard

## Step 6 - Dashboard

Implement:

- KPI
- Bar chart
- Line chart

## Step 7 - Video CRUD

Implement:

- list
- search
- filter
- add
- edit
- delete

## Step 8 - User CRUD

Implement:

- list
- add
- edit
- delete

## Step 9 - Category CRUD

Implement:

- list
- add
- edit
- delete

## Step 10 - Test

Test:

- Login ADMIN
- Login USER
- Wrong password
- Register
- Forgot password
- Logout
- Video add/edit/delete
- User add/edit/delete
- Category add/edit/delete
- Search
- Filter
- Responsive

## Quy tắc khi yêu cầu AI sửa code

Mỗi prompt nên:

1. Nêu file cần sửa.
2. Nêu behavior mong muốn.
3. Không phá các chức năng đang hoạt động.
4. Không thay đổi architecture nếu không được yêu cầu.
5. Sau khi sửa phải kiểm tra console error.
