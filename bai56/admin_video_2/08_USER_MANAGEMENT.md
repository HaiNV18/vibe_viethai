# User Management Specification

## Page

`users.html`

Chỉ ADMIN được truy cập.

## Columns

- ID
- Username
- Email
- Role
- Status
- Created At
- Action

## Actions

- Edit
- Delete

Không cho phép ADMIN tự xóa tài khoản đang đăng nhập nếu chưa có cơ chế xác nhận đặc biệt.

## Role

Allowed:

- ADMIN
- USER

## Status

Allowed:

- ACTIVE
- INACTIVE

## Add User

Fields:

- Username
- Email
- Password
- Role
- Status

## Edit User

Cho phép thay đổi:

- Username
- Email
- Role
- Status
- Password optional

## Delete

Confirm trước khi delete.

## Validation

- Username required
- Email required
- Email valid
- Password required khi tạo mới
- Role hợp lệ
