-- ============================================================================
-- SUPABASE COMPLETE SETUP SCRIPT (ALL-IN-ONE)
-- Video Admin Management
-- 
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project -> Click "SQL Editor" in the left sidebar
-- 3. Click "+ New Query"
-- 4. Paste the entire content of this file and click "Run" (or Ctrl+Enter)
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS & CLEANUP
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS video_categories CASCADE;
DROP TABLE IF EXISTS video_views CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- Table: users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(LOWER(username));
CREATE INDEX idx_users_email ON users(LOWER(email));
CREATE INDEX idx_users_role ON users(role);

-- Table: categories
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_status ON categories(status);

-- Table: videos
CREATE TABLE videos (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    views BIGINT NOT NULL DEFAULT 0,
    duration VARCHAR(50) DEFAULT '00:00',
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('PUBLISHED', 'DRAFT', 'ARCHIVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_videos_category_id ON videos(category_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_views ON videos(views DESC);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);

-- Table: video_categories (Many-to-Many junction)
CREATE TABLE video_categories (
    video_id BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (video_id, category_id)
);

CREATE INDEX idx_video_categories_category ON video_categories(category_id);

-- Table: video_views (Time-series log)
CREATE TABLE video_views (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    view_date DATE NOT NULL DEFAULT CURRENT_DATE,
    view_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_video_views_date ON video_views(view_date);
CREATE INDEX idx_video_views_video ON video_views(video_id);

-- ============================================================================
-- 3. TRIGGERS (Auto-update updated_at)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON videos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for client-side demo operations
CREATE POLICY "Allow public read users" ON users FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert users" ON users FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update users" ON users FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow public delete users" ON users FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow public read categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert categories" ON categories FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update categories" ON categories FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow public delete categories" ON categories FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow public read videos" ON videos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert videos" ON videos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update videos" ON videos FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow public delete videos" ON videos FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow public read video_categories" ON video_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert video_categories" ON video_categories FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public delete video_categories" ON video_categories FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow public read video_views" ON video_views FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert video_views" ON video_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update video_views" ON video_views FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow public delete video_views" ON video_views FOR DELETE TO anon, authenticated USING (true);

-- ============================================================================
-- 5. SEED DATA
-- ============================================================================

-- Users
INSERT INTO users (id, username, email, password, role, status, created_at) VALUES
(1, 'admin1', 'admin1@gmail.com', '123456', 'ADMIN', 'ACTIVE', '2026-10-01 00:00:00+00'),
(2, 'user1', 'user1@gmail.com', '123456', 'USER', 'ACTIVE', '2026-10-01 00:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO categories (id, name, slug, description, status) VALUES
(1, 'Programming', 'programming', 'Programming tutorials', 'ACTIVE'),
(2, 'Web Development', 'web-development', 'Web development tutorials', 'ACTIVE'),
(3, 'Design', 'design', 'Design tutorials', 'ACTIVE'),
(4, 'Business', 'business', 'Business tutorials', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Videos
INSERT INTO videos (id, title, description, thumbnail_url, video_url, category_id, views, duration, file_size_bytes, status, created_at) VALUES
(1, 'Introduction to JavaScript', 'JavaScript basic lesson', 'https://images.unsplash.com/photo-1579468118864-ddab3493e878?w=400', 'https://www.w3schools.com/html/mov_bbb.mp4', 1, 12500, '12:30', 131072000, 'PUBLISHED', '2026-09-01 00:00:00+00'),
(2, 'HTML Basics', 'HTML introduction', 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400', 'https://www.w3schools.com/html/mov_bbb.mp4', 2, 9800, '08:45', 83886080, 'PUBLISHED', '2026-09-03 00:00:00+00'),
(3, 'CSS Flexbox Tutorial', 'Learn CSS Flexbox', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400', 'https://www.w3schools.com/html/mov_bbb.mp4', 2, 8700, '15:20', 157286400, 'PUBLISHED', '2026-09-05 00:00:00+00'),
(4, 'Responsive Web Design', 'Responsive layout tutorial', 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400', 'https://www.w3schools.com/html/mov_bbb.mp4', 2, 7600, '18:10', 178257920, 'PUBLISHED', '2026-09-07 00:00:00+00'),
(5, 'JavaScript DOM', 'Working with DOM', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', 'https://www.w3schools.com/html/mov_bbb.mp4', 1, 6900, '11:25', 125829120, 'PUBLISHED', '2026-09-10 00:00:00+00'),
(6, 'UI Design Basics', 'Introduction to UI Design', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', 'https://www.w3schools.com/html/mov_bbb.mp4', 3, 6100, '10:05', 104857600, 'PUBLISHED', '2026-09-12 00:00:00+00'),
(7, 'Git Basics', 'Learn Git', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400', 'https://www.w3schools.com/html/mov_bbb.mp4', 1, 5300, '09:15', 94371840, 'PUBLISHED', '2026-09-14 00:00:00+00'),
(8, 'Web Accessibility', 'Accessibility fundamentals', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', 'https://www.w3schools.com/html/mov_bbb.mp4', 2, 4900, '13:40', 115343360, 'PUBLISHED', '2026-09-16 00:00:00+00'),
(9, 'Introduction to React', 'React introduction', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', 'https://www.w3schools.com/html/mov_bbb.mp4', 1, 4500, '16:00', 146800640, 'DRAFT', '2026-09-18 00:00:00+00'),
(10, 'Modern CSS', 'Modern CSS techniques', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400', 'https://www.w3schools.com/html/mov_bbb.mp4', 2, 3900, '14:30', 136314880, 'PUBLISHED', '2026-09-20 00:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Video Categories
INSERT INTO video_categories (video_id, category_id) VALUES
(1, 1),
(2, 2),
(3, 2),
(4, 2),
(5, 1),
(6, 3),
(7, 1),
(8, 2),
(9, 1),
(10, 2)
ON CONFLICT (video_id, category_id) DO NOTHING;

-- Video Views
INSERT INTO video_views (id, video_id, view_date, view_count) VALUES
(1, 1, '2026-10-01', 420),
(2, 1, '2026-10-02', 510),
(3, 1, '2026-10-03', 620),
(4, 2, '2026-10-01', 310),
(5, 2, '2026-10-02', 450),
(6, 2, '2026-10-03', 520),
(7, 3, '2026-10-01', 280),
(8, 3, '2026-10-02', 390),
(9, 3, '2026-10-03', 470),
(10, 4, '2026-10-01', 210),
(11, 4, '2026-10-02', 330),
(12, 4, '2026-10-03', 410),
(13, 5, '2026-10-01', 180),
(14, 5, '2026-10-02', 260),
(15, 5, '2026-10-03', 350),
(16, 6, '2026-10-01', 150),
(17, 6, '2026-10-02', 220),
(18, 6, '2026-10-03', 310),
(19, 7, '2026-10-01', 120),
(20, 7, '2026-10-02', 190),
(21, 7, '2026-10-03', 250),
(22, 8, '2026-10-01', 100),
(23, 8, '2026-10-02', 170),
(24, 8, '2026-10-03', 230),
(25, 9, '2026-10-01', 90),
(26, 9, '2026-10-02', 130),
(27, 9, '2026-10-03', 180),
(28, 10, '2026-10-01', 80),
(29, 10, '2026-10-02', 120),
(30, 10, '2026-10-03', 160)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence counters
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories));
SELECT setval('videos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM videos));
SELECT setval('video_views_id_seq', (SELECT COALESCE(MAX(id), 1) FROM video_views));
