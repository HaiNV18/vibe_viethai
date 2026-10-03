-- Initial Seed Data

-- Pre-seeded Admin User (Email: admin@video.com, Password: admin123)
-- SHA-256 of "admin123": 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
INSERT OR IGNORE INTO users (id, email, password_hash, full_name, role, status, created_at, updated_at)
VALUES (1, 'admin@video.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'System Administrator', 'admin', 'active', '2026-07-01T00:00:00.000Z', '2026-07-01T00:00:00.000Z');

-- Categories
INSERT OR IGNORE INTO categories (id, name, slug, created_at) VALUES
(1, 'Technology', 'technology', '2026-07-01T00:00:00.000Z'),
(2, 'Education', 'education', '2026-07-01T00:00:00.000Z'),
(3, 'Entertainment', 'entertainment', '2026-07-01T00:00:00.000Z'),
(4, 'Gaming', 'gaming', '2026-07-01T00:00:00.000Z'),
(5, 'Music', 'music', '2026-07-01T00:00:00.000Z');

-- Videos
INSERT OR IGNORE INTO videos (id, title, description, thumbnail_url, video_url, file_size_bytes, duration_seconds, views, status, category_id, created_at, updated_at) VALUES
(1, 'Building Modern Web Apps with WebAssembly', 'Explore how WebAssembly enables high performance browser applications like SQLite WASM and video processing.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 452984832, 745, 14850, 'published', 1, '2026-07-05T10:00:00.000Z', '2026-07-05T10:00:00.000Z'),
(2, 'Complete JavaScript ES6+ Masterclass', 'Master async/await, ES modules, promises, Web Crypto API, and modern DOM manipulations.', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 892341024, 1840, 29400, 'published', 2, '2026-07-08T14:30:00.000Z', '2026-07-08T14:30:00.000Z'),
(3, 'Cyberpunk City Cinematic Demo 4K', 'Unreal Engine 5 real-time raytracing graphic benchmark preview in 4K resolution.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 1542981024, 320, 48210, 'published', 4, '2026-07-10T18:00:00.000Z', '2026-07-10T18:00:00.000Z'),
(4, 'Ambient Synthwave Music Session', '1 hour relaxing synthwave lo-fi chill beats for coding, studying, and deep focus.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 684201948, 3600, 31500, 'published', 5, '2026-07-12T09:15:00.000Z', '2026-07-12T09:15:00.000Z'),
(5, 'UI/UX Design Trends for 2026', 'Deep dive into micro-interactions, dark mode aesthetics, dynamic typography, and fluid layouts.', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 314572800, 610, 18920, 'published', 1, '2026-07-15T11:45:00.000Z', '2026-07-15T11:45:00.000Z'),
(6, 'Quantum Computing Explained Simply', 'What is quantum superposition and entanglement? How do qubit algorithms work?', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 524288000, 930, 22100, 'published', 2, '2026-07-18T16:20:00.000Z', '2026-07-18T16:20:00.000Z'),
(7, 'Indie Game Development Vlog #12', 'Adding procedural dungeon generation and AI pathfinding algorithm in C#.', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 412891024, 1120, 9540, 'published', 4, '2026-07-20T20:10:00.000Z', '2026-07-20T20:10:00.000Z'),
(8, 'Acoustic Guitar Cover - Summer Breeze', 'Fingerstyle acoustic guitar arrangement recorded live with studio condenser mic.', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 210000000, 245, 12400, 'published', 5, '2026-07-22T08:00:00.000Z', '2026-07-22T08:00:00.000Z'),
(9, 'Top 10 Sci-Fi Movie Details You Missed', 'Easter eggs, visual effects breakdowns, and hidden plot clues analyzed frame by frame.', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 629145600, 890, 36200, 'published', 3, '2026-07-25T13:00:00.000Z', '2026-07-25T13:00:00.000Z'),
(10, 'Database Indexing & Performance Tuning', 'Understanding B-Trees, Hash indexes, prepared statements, and query execution plans in SQLite.', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 380000000, 1420, 15600, 'published', 1, '2026-07-28T15:30:00.000Z', '2026-07-28T15:30:00.000Z'),
(11, 'Full Stack Web Architecture without Backend', 'Learn how client-side storage, WebAssembly SQLite, and browser APIs build offline-first apps.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 490000000, 1050, 8900, 'draft', 1, '2026-08-01T09:00:00.000Z', '2026-08-01T09:00:00.000Z'),
(12, 'Speedrun Championship Final Match', 'World record attempt commentary with live input overlay and split timer.', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80', 'https://www.w3schools.com/html/mov_bbb.mp4', 1100000000, 2800, 41200, 'published', 4, '2026-08-03T17:00:00.000Z', '2026-08-03T17:00:00.000Z');

-- Video Daily View Stats (30-day breakdown for realistic line chart)
INSERT OR IGNORE INTO video_view_stats (video_id, view_date, view_count) VALUES
(3, '2026-08-01', 1250), (3, '2026-08-02', 1400), (3, '2026-08-03', 1820), (3, '2026-08-04', 1650), (3, '2026-08-05', 2100), (3, '2026-08-06', 1950), (3, '2026-08-07', 2400), (3, '2026-08-08', 2800), (3, '2026-08-09', 2650), (3, '2026-08-10', 3100), (3, '2026-08-11', 2900), (3, '2026-08-12', 3400), (3, '2026-08-13', 3800), (3, '2026-08-14', 4200), (3, '2026-08-15', 3950),
(12, '2026-08-01', 980), (12, '2026-08-02', 1150), (12, '2026-08-03', 1500), (12, '2026-08-04', 1320), (12, '2026-08-05', 1780), (12, '2026-08-06', 1640), (12, '2026-08-07', 2150), (12, '2026-08-08', 2300), (12, '2026-08-09', 2200), (12, '2026-08-10', 2700), (12, '2026-08-11', 2550), (12, '2026-08-12', 3000), (12, '2026-08-13', 3200), (12, '2026-08-14', 3600), (12, '2026-08-15', 3400),
(9, '2026-08-01', 820), (9, '2026-08-02', 950), (9, '2026-08-03', 1100), (9, '2026-08-04', 1050), (9, '2026-08-05', 1400), (9, '2026-08-06', 1300), (9, '2026-08-07', 1650), (9, '2026-08-08', 1900), (9, '2026-08-09', 1850), (9, '2026-08-10', 2100), (9, '2026-08-11', 2000), (9, '2026-08-12', 2400), (9, '2026-08-13', 2600), (9, '2026-08-14', 2850), (9, '2026-08-15', 2700),
(4, '2026-08-01', 750), (4, '2026-08-02', 880), (4, '2026-08-03', 950), (4, '2026-08-04', 910), (4, '2026-08-05', 1200), (4, '2026-08-06', 1150), (4, '2026-08-07', 1400), (4, '2026-08-08', 1600), (4, '2026-08-09', 1520), (4, '2026-08-10', 1800), (4, '2026-08-11', 1750), (4, '2026-08-12', 2050), (4, '2026-08-13', 2200), (4, '2026-08-14', 2450), (4, '2026-08-15', 2300),
(2, '2026-08-01', 600), (2, '2026-08-02', 720), (2, '2026-08-03', 850), (2, '2026-08-04', 800), (2, '2026-08-05', 1050), (2, '2026-08-06', 980), (2, '2026-08-07', 1250), (2, '2026-08-08', 1420), (2, '2026-08-09', 1380), (2, '2026-08-10', 1600), (2, '2026-08-11', 1500), (2, '2026-08-12', 1800), (2, '2026-08-13', 1950), (2, '2026-08-14', 2100), (2, '2026-08-15', 2000);
