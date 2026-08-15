# Vibe Coding Prompt Pack

## Prompt 01 — Scaffold

```text
Build a frontend-only Video Admin application using only HTML, CSS and vanilla JavaScript.

Constraints:
- No backend.
- No Node.js server.
- SQLite databases run in the browser through SQLite WASM.
- Use ES modules.
- Separate UI, services, repositories and database layer.
- Prepare the project structure according to docs/01-ARCHITECTURE.md.

Create the base layout, routing-by-page, shared sidebar, header, toast and responsive styles.

Do not implement business logic yet.
```

## Prompt 02 — Database

```text
Implement the SQLite database layer for the Video Admin application.

Requirements:
- users.db
- videos.db
- optional categories.db
- Use SQLite WASM in the browser.
- Create DatabaseManager.
- Support init, query, execute, save, import and export.
- Use prepared statements/parameterized queries.
- Follow docs/02-DATABASE.md.

Do not create page-specific SQL.
Repositories must own database queries.
```

## Prompt 03 — Authentication

```text
Implement login, register, logout and forgot-password demo flow.

Requirements:
- Vanilla JavaScript.
- No backend.
- Use Web Crypto API for password hashing.
- Never store plain-text passwords.
- Use users.db.
- Use sessionStorage for authenticated session.
- Add route guards for admin pages.
- Follow docs/03-AUTH.md.

Keep authentication logic inside AuthService and UserRepository.
Do not put SQL directly inside HTML page scripts.
```

## Prompt 04 — Video CRUD

```text
Implement VideoRepository and VideoService.

Features:
- list videos
- search
- get by id
- create
- edit
- delete
- validation
- pagination-ready API

Use videos.db.
Follow docs/05-DATA-FLOW.md.

Then connect the implementation to videos.html and video-edit.html.
```

## Prompt 05 — Dashboard

```text
Implement dashboard.html and dashboard.js.

Show:
- Total videos
- Total views
- Storage used
- Top 10 videos by views as bar chart
- Views by day/month as line chart

All values must be calculated from videos.db.
Do not hard-code dashboard numbers.

If external chart libraries are not allowed, draw charts with SVG or Canvas using vanilla JavaScript.
```

## Prompt 06 — UI Polish

```text
Improve the Video Admin UI without changing business logic.

Requirements:
- responsive
- clean admin dashboard
- sidebar
- cards
- table
- forms
- modal/confirm delete
- toast notifications
- loading states
- empty states
- error states
- keyboard accessibility

Do not introduce a frontend framework.
Do not move database logic into UI code.
```

## Prompt 07 — Review

```text
Review the entire frontend-only Video Admin project against these documents:

- 00-README.md
- 01-ARCHITECTURE.md
- 02-DATABASE.md
- 03-AUTH.md
- 04-PAGES.md
- 05-DATA-FLOW.md

Find:
1. Architecture violations.
2. Security problems.
3. SQL bugs.
4. State/persistence bugs.
5. XSS risks.
6. Broken responsive behavior.
7. Missing loading/error states.
8. Duplicate code.

Return a prioritized checklist and fix only the highest-priority issues first.
```

## Prompt 08 — Seed Data

```text
Create realistic demo seed data for users.db and videos.db.

Requirements:
- 1-3 demo users.
- 15-30 demo videos.
- Different view counts.
- Different file sizes.
- At least 30 days of view statistics.
- Categories if categories are enabled.

Do not use real personal data.
Make dashboard charts visually meaningful.
```
