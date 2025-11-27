-- TinaCMS PostgreSQL Database Initialization Script
-- This script creates the necessary tables for TinaCMS backend

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with GitHub OAuth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    github_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for Auth.js
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Git commits tracking
CREATE TABLE IF NOT EXISTS commits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    commit_sha VARCHAR(255) NOT NULL,
    message TEXT,
    branch VARCHAR(255) DEFAULT 'main',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content locks (for collaborative editing)
CREATE TABLE IF NOT EXISTS content_locks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_path VARCHAR(500) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    locked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    UNIQUE(file_path)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_commits_sha ON commits(commit_sha);
CREATE INDEX IF NOT EXISTS idx_commits_user ON commits(user_id);
CREATE INDEX IF NOT EXISTS idx_locks_file ON content_locks(file_path);
CREATE INDEX IF NOT EXISTS idx_locks_user ON content_locks(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data (optional)
-- You can add your GitHub user here for immediate access
-- INSERT INTO users (github_id, username, email, name) 
-- VALUES ('your_github_id', 'hieunguyenzzz', 'your@email.com', 'Your Name')
-- ON CONFLICT (github_id) DO NOTHING;

COMMIT;
