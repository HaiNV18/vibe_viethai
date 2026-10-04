# Video Admin Management

A modern, frontend-only administrative dashboard for video management built with HTML5, CSS3, and Vanilla JavaScript. Designed for learning Vibe Coding and Antigravity workflows.

---

## 🚀 Key Features

1. **Authentication Simulation (No Backend Required)**
   - **Login**: Support for username or email with Remember Me.
   - **Register**: Client-side validation, duplicate checks, default `USER` role.
   - **Forgot Password**: Password retrieval simulation.
   - **Session Storage**: Current user session stored in `localStorage`.
   - **Route Guards**: Automatic redirects for guest/protected pages and `ADMIN` role restriction.

2. **Dashboard Overview**
   - **KPI 1**: Total Videos count (`COUNT(videos)`).
   - **KPI 2**: Total Views sum (`SUM(videos.views)`).
   - **KPI 3**: Storage Used calculated in human-readable units (B, KB, MB, GB).
   - **Bar Chart**: Top 10 Videos by Views (Chart.js CDN).
   - **Line Chart**: Views Over Time aggregated by date (Chart.js CDN).
   - **Recent Videos**: Quick list of newly registered media.

3. **Video Management**
   - Data table with thumbnails, categories, views, duration, file size, status badges.
   - Realtime instant search by title and description.
   - Filtering by Category and Status (`PUBLISHED`, `DRAFT`, `ARCHIVED`).
   - Sorting by Views (asc/desc), Date (newest/oldest), Title (A-Z).
   - Client-side pagination.
   - Full CRUD: Add & Edit page (`video-form.html`) with live thumbnail & video player preview.
   - Delete confirmation modal dialog.

4. **Category Management (ADMIN Only)**
   - View, add, edit, and delete categories.
   - Automatic slug generation from category names (e.g. `Web Development` -> `web-development`).
   - Referential safety warning: Alert when deleting categories currently assigned to videos.

5. **User Management (ADMIN Only)**
   - Manage user accounts, roles (`ADMIN`, `USER`), and statuses (`ACTIVE`, `INACTIVE`).
   - Password reset / update capability.
   - Safety guard: Prevents administrators from deleting their own active account.

6. **CSV Database Simulation & Reset**
   - Initial seed data loaded from `data/*.csv`.
   - Client-side persistence using `localStorage`.
   - **Reset Demo Data** button in topbar to revert any changes back to the original CSV seeds at any time.
   - Embedded seed fallback so the app works seamlessly even if opened via `file:///`.

---

## 📁 Project Structure

```text
admin_video_2/
│
├── index.html                   # Entry point redirecting based on auth
├── README.md                    # Project documentation
│
├── pages/
│   ├── login.html               # Sign in page
│   ├── register.html            # Sign up page
│   ├── forgot-password.html     # Password reset simulation
│   ├── dashboard.html           # Main analytics dashboard
│   ├── videos.html              # Video catalog & management table
│   ├── video-form.html          # Add / Edit video form with media preview
│   ├── categories.html          # Taxonomy & category management (ADMIN)
│   └── users.html               # User accounts & role management (ADMIN)
│
├── css/
│   ├── reset.css                # CSS reset & base element styling
│   ├── variables.css            # Light theme color palette & design tokens
│   ├── layout.css               # Sidebar, topbar, and main container layout
│   ├── components.css           # Cards, buttons, badges, modals, toasts
│   ├── forms.css                # Form controls, inputs, and auth cards
│   ├── tables.css               # Responsive tables, thumbnail cells, actions
│   └── responsive.css           # Mobile drawer, adaptive grid breakpoints
│
├── js/
│   ├── app.js                   # Application bootstrap & global listeners
│   ├── auth.js                  # Authentication logic
│   ├── guard.js                 # Route protection & role verification
│   ├── storage.js               # localStorage manager & seed loader
│   ├── csv.js                   # RFC-compliant CSV parser & stringifier
│   ├── dashboard.js             # KPI computation & dashboard controller
│   ├── charts.js                # Chart.js visualizations
│   ├── videos.js                # Video CRUD, search, filter, and pagination
│   ├── categories.js            # Category CRUD & auto-slug generator
│   ├── users.js                 # User CRUD & authorization checks
│   ├── components.js            # Dynamic sidebar, topbar, toast & modal engine
│   └── utils.js                 # Formatting, slugify, XSS escaping helpers
│
└── data/
    ├── users.csv                # User accounts seed data
    ├── videos.csv               # Video catalog seed data
    ├── categories.csv           # Categories seed data
    ├── video_categories.csv     # Many-to-many relationship seed data
    └── video_views.csv          # View history seed data
```

---

## 🔑 Demo Accounts

| Role | Username | Email | Password |
|---|---|---|---|
| **ADMIN** | `admin1` | `admin1@gmail.com` | `123456` |
| **USER** | `user1` | `user1@gmail.com` | `123456` |

> *Note: On `login.html`, click the "Use" button next to any demo account to instantly autofill the form.*

---

## 💻 How to Run

Because modern browsers enforce CORS restrictions on `fetch()` calls from `file:///` URLs, it is recommended to run via a local HTTP server:

### Option 1: Python
```bash
# In the project directory:
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

### Option 2: VS Code Live Server
1. Install the "Live Server" extension in VS Code.
2. Right click `index.html` and select **"Open with Live Server"**.

### Option 3: Direct File Opening
The application includes an embedded fallback seed mechanism in `js/csv.js` so it will gracefully initialize data and function even if opened directly via `file:///path/to/index.html`.

---

## 🧪 Acceptance Testing

Refer to [13_ACCEPTANCE_TEST.md](file:///13_ACCEPTANCE_TEST.md) for full acceptance test criteria covering:
- Authentication & route authorization
- KPI calculations and chart rendering
- Video search, filter, sort, pagination, add, edit, and delete
- User & category management
- Responsive layout across desktop, tablet, and mobile
