# Acceptance Test Checklist

## Authentication

- [ ] Login admin1 works
- [ ] Login user1 works
- [ ] Wrong password shows error
- [ ] Register works
- [ ] Duplicate username rejected
- [ ] Duplicate email rejected
- [ ] Forgot password simulation works
- [ ] Logout works
- [ ] Protected pages redirect to login

## Authorization

- [ ] ADMIN can access dashboard
- [ ] ADMIN can access videos
- [ ] ADMIN can access users
- [ ] ADMIN can access categories
- [ ] USER cannot access admin-only user management
- [ ] USER cannot perform unauthorized admin actions

## Dashboard

- [ ] Total videos is calculated
- [ ] Total views is calculated
- [ ] Storage is calculated
- [ ] Top 10 chart works
- [ ] Line chart works
- [ ] Empty state works

## Videos

- [ ] List renders
- [ ] Search works
- [ ] Category filter works
- [ ] Status filter works
- [ ] Sort works
- [ ] Add works
- [ ] Edit works
- [ ] Delete works
- [ ] Delete confirmation works
- [ ] Data persists after reload

## Users

- [ ] User list works
- [ ] Add works
- [ ] Edit works
- [ ] Delete works
- [ ] Validation works

## Categories

- [ ] Category list works
- [ ] Add works
- [ ] Edit works
- [ ] Delete works
- [ ] Slug generation works

## UI

- [ ] Light mode only
- [ ] White background
- [ ] Responsive desktop
- [ ] Responsive tablet
- [ ] Responsive mobile
- [ ] No horizontal overflow except tables where intentional
- [ ] No browser console errors

## Data

- [ ] CSV seed data loads
- [ ] localStorage persistence works
- [ ] Reset demo data works
