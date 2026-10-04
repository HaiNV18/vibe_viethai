# Suggested Antigravity Prompts

## Prompt 1 - Initialize

```text
Read all .md specification files in this project.

Build the project skeleton exactly according to the specifications.

Use only HTML, CSS and vanilla JavaScript.
Use CSV files as seed data and localStorage for client-side persistence.
Do not add a backend.

Create all required folders and files.
Do not implement advanced functionality yet.
```

## Prompt 2 - UI

```text
Read 04_UI_DESIGN.md.

Implement the complete light-mode admin layout:
- sidebar
- topbar
- responsive mobile menu
- dashboard cards
- tables
- forms
- buttons
- badges
- toast notifications

Use a clean modern white admin dashboard design.

Do not implement backend.
```

## Prompt 3 - Authentication

```text
Read 05_AUTH.md and 03_DATABASE_SCHEMA.md.

Implement:
- login
- register
- forgot password simulation
- logout
- current user session using localStorage
- protected pages
- ADMIN role guard

Use the seed users from users.csv.

Do not introduce a backend.
```

## Prompt 4 - Dashboard

```text
Read 06_DASHBOARD.md.

Implement dashboard KPI cards and charts.

Calculate:
- total videos
- total views
- storage used

Implement:
- top 10 videos bar chart
- views over time line chart

Use the project data layer.
Do not hardcode KPI values.
```

## Prompt 5 - Videos

```text
Read 07_VIDEO_MANAGEMENT.md.

Implement complete video management:
- list
- search
- category filter
- status filter
- sorting
- add
- edit
- delete
- validation
- confirmation dialog
- toast notification

Use localStorage persistence.
```

## Prompt 6 - Users

```text
Read 08_USER_MANAGEMENT.md.

Implement ADMIN-only user management with:
- list
- add
- edit
- delete
- validation
- role
- status

Do not break authentication.
```

## Prompt 7 - Categories

```text
Read 09_CATEGORY_MANAGEMENT.md.

Implement category CRUD.

Generate slug automatically from category name.

Check video references before deleting a category.
```

## Prompt 8 - QA

```text
Read all project specification files.

Review the entire implementation.

Find:
- broken links
- console errors
- missing files
- incorrect imports
- authentication bugs
- responsive UI issues
- CRUD bugs
- incorrect CSV parsing
- localStorage bugs

Fix only issues that are actually found.

Do not rewrite working modules unnecessarily.
```
