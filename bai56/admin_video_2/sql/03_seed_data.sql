-- ============================================================================
-- Supabase Seed Data for Video Admin
-- Description: Populates initial sample records matching the original CSV data
--              and updates sequence counters.
-- ============================================================================

-- 1. Insert seed Users
INSERT INTO users (id, username, email, password, role, status, created_at) VALUES
(1, 'admin1', 'admin1@gmail.com', '123456', 'ADMIN', 'ACTIVE', '2026-10-01 00:00:00+00'),
(2, 'user1', 'user1@gmail.com', '123456', 'USER', 'ACTIVE', '2026-10-01 00:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert seed Categories
INSERT INTO categories (id, name, slug, description, status) VALUES
(1, 'Programming', 'programming', 'Programming tutorials', 'ACTIVE'),
(2, 'Web Development', 'web-development', 'Web development tutorials', 'ACTIVE'),
(3, 'Design', 'design', 'Design tutorials', 'ACTIVE'),
(4, 'Business', 'business', 'Business tutorials', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert seed Videos
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

-- 4. Insert seed Video Categories relationships
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

-- 5. Insert seed Video Views history
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

-- ----------------------------------------------------------------------------
-- Reset sequences so new auto-increment IDs start correctly after seed IDs
-- ----------------------------------------------------------------------------
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories));
SELECT setval('videos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM videos));
SELECT setval('video_views_id_seq', (SELECT COALESCE(MAX(id), 1) FROM video_views));
