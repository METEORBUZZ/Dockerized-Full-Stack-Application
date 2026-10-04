-- Database initialization script for Dockerized Full Stack Application
-- Automatically executed when the PostgreSQL container is first initialized

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'General',
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast status and category lookups
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);

-- Insert initial seed data demonstrating environment parity
INSERT INTO items (title, description, category, status, priority) VALUES
('Setup Docker Compose Orchestration', 'Define multi-container network, dependency health checks, and persistent volumes.', 'Infrastructure', 'completed', 'high'),
('Configure Environment Parity', 'Standardize environment variables across local development and production profiles.', 'DevOps', 'completed', 'high'),
('Implement PostgreSQL Healthchecks', 'Verify pg_isready before API container connects to prevent startup race conditions.', 'Database', 'completed', 'medium'),
('Build Multi-stage Production Dockerfiles', 'Optimize container size and layer caching for sub-minute build pipelines.', 'Docker', 'in-progress', 'high'),
('Add React Real-time Container Dashboard', 'Visualize container connectivity status, latency, and DB persistence live.', 'Frontend', 'in-progress', 'medium'),
('Deploy to Container Registry', 'Automate CI/CD pipeline push to Docker Hub / GitHub Container Registry.', 'Deployment', 'pending', 'low')
ON CONFLICT DO NOTHING;
