# Implementation Checklist

## Phase 1 — Foundation

- [ ] Create folder structure.
- [ ] Create shared CSS variables.
- [ ] Create admin layout.
- [ ] Create responsive sidebar.
- [ ] Create toast component.
- [ ] Create modal/confirm component.
- [ ] Configure ES modules.

## Phase 2 — SQLite

- [ ] Add SQLite WASM library.
- [ ] Implement DatabaseManager.
- [ ] Load `users.db`.
- [ ] Load `videos.db`.
- [ ] Implement browser persistence.
- [ ] Implement save after mutation.
- [ ] Implement import/export.
- [ ] Create schema SQL.
- [ ] Create seed SQL/data.

## Phase 3 — Authentication

- [ ] Register.
- [ ] Password hashing.
- [ ] Login.
- [ ] Session.
- [ ] Logout.
- [ ] Route guard.
- [ ] Forgot password demo flow.
- [ ] Duplicate email validation.
- [ ] Disabled account handling.

## Phase 4 — Video Management

- [ ] VideoRepository.
- [ ] VideoService.
- [ ] List.
- [ ] Search.
- [ ] Pagination.
- [ ] Edit.
- [ ] Delete.
- [ ] Delete confirmation.
- [ ] Empty state.
- [ ] Error state.

## Phase 5 — Dashboard

- [ ] Total video count.
- [ ] Total views.
- [ ] Storage calculation.
- [ ] Top 10 query.
- [ ] Bar chart.
- [ ] Daily views.
- [ ] Monthly views.
- [ ] Line chart.
- [ ] Loading state.
- [ ] No-data state.

## Phase 6 — Quality

- [ ] Escape user-generated HTML.
- [ ] Use parameterized SQL.
- [ ] Validate forms.
- [ ] Test refresh persistence.
- [ ] Test database import/export.
- [ ] Test mobile.
- [ ] Test keyboard navigation.
- [ ] Test empty database.
- [ ] Test corrupted database handling.
- [ ] Test logout.
- [ ] Test invalid session.

## Phase 7 — Demo Release

- [ ] Add seed data.
- [ ] Add README.
- [ ] Add setup instructions.
- [ ] Add database backup instructions.
- [ ] Verify static hosting.
- [ ] Verify HTTPS.
- [ ] Verify no backend dependency.

## Production warning

- [ ] Do not treat frontend-only auth as strong security.
- [ ] Do not store secrets in source code.
- [ ] Do not expose sensitive user data.
- [ ] If strong security is required, migrate authentication and database access to a backend.
