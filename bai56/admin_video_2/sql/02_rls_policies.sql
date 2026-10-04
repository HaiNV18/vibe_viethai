-- ============================================================================
-- Supabase Row Level Security (RLS) Policies
-- Description: Configures Row Level Security and access policies for client-side
--              operations via Supabase anon/authenticated API keys.
-- ============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- CLIENT-SIDE DEMO POLICIES (Full CRUD access for Anon & Authenticated users)
-- Note: In a client-side architecture using the Supabase anon key, these policies
-- allow the browser application to read, insert, update, and delete records.
-- ----------------------------------------------------------------------------

-- Policies for "users"
CREATE POLICY "Allow public read users" 
ON users FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert users" 
ON users FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow public update users" 
ON users FOR UPDATE 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public delete users" 
ON users FOR DELETE 
TO anon, authenticated 
USING (true);

-- Policies for "categories"
CREATE POLICY "Allow public read categories" 
ON categories FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert categories" 
ON categories FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow public update categories" 
ON categories FOR UPDATE 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public delete categories" 
ON categories FOR DELETE 
TO anon, authenticated 
USING (true);

-- Policies for "videos"
CREATE POLICY "Allow public read videos" 
ON videos FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert videos" 
ON videos FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow public update videos" 
ON videos FOR UPDATE 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public delete videos" 
ON videos FOR DELETE 
TO anon, authenticated 
USING (true);

-- Policies for "video_categories"
CREATE POLICY "Allow public read video_categories" 
ON video_categories FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert video_categories" 
ON video_categories FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow public delete video_categories" 
ON video_categories FOR DELETE 
TO anon, authenticated 
USING (true);

-- Policies for "video_views"
CREATE POLICY "Allow public read video_views" 
ON video_views FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert video_views" 
ON video_views FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow public update video_views" 
ON video_views FOR UPDATE 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public delete video_views" 
ON video_views FOR DELETE 
TO anon, authenticated 
USING (true);
