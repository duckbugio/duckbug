-- +migrate Up

-- Composite index to optimize batch queries filtering by project_id and status
CREATE INDEX IF NOT EXISTS idx_error_groups_project_id_status ON error_groups(project_id, status);
