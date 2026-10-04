-- ============================================================================
-- Supabase Schema for Video Admin
-- Description: Creates tables, foreign keys, check constraints, indexes, 
--              and updated_at triggers.
-- ============================================================================

-- 1. Enable common extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running (clean setup)
DROP TABLE IF EXISTS video_categories CASCADE;
DROP TABLE IF EXISTS video_views CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------------------------
-- TABLE: users
-- ----------------------------------------------------------------------------
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

-- Index for authentication search
CREATE INDEX idx_users_username ON users(LOWER(username));
CREATE INDEX idx_users_email ON users(LOWER(email));
CREATE INDEX idx_users_role ON users(role);

-- ----------------------------------------------------------------------------
-- TABLE: categories
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for slug lookups and status filtering
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_status ON categories(status);

-- ----------------------------------------------------------------------------
-- TABLE: videos
-- ----------------------------------------------------------------------------
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

-- Indexes for performance (search, category filter, status filter, views sorting)
CREATE INDEX idx_videos_category_id ON videos(category_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_views ON videos(views DESC);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);

-- Full-text search helper index on title and description
CREATE INDEX idx_videos_title_trgm ON videos USING gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- ----------------------------------------------------------------------------
-- TABLE: video_categories (Many-to-Many junction table)
-- ----------------------------------------------------------------------------
CREATE TABLE video_categories (
    video_id BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (video_id, category_id)
);

CREATE INDEX idx_video_categories_category ON video_categories(category_id);

-- ----------------------------------------------------------------------------
-- TABLE: video_views (History log for time-series charts)
-- ----------------------------------------------------------------------------
CREATE TABLE video_views (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    view_date DATE NOT NULL DEFAULT CURRENT_DATE,
    view_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_video_views_date ON video_views(view_date);
CREATE INDEX idx_video_views_video ON video_views(video_id);

-- ----------------------------------------------------------------------------
-- Trigger function for automatic updated_at timestamp
-- ----------------------------------------------------------------------------
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
