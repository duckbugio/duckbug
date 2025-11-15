-- +migrate Up
-- Composite index to optimize projects query filtering by creator_id and deleted_at
CREATE INDEX IF NOT EXISTS idx_projects_creator_deleted ON projects(creator_id, deleted_at);
