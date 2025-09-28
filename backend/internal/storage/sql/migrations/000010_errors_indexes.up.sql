-- +migrate Up

-- Composite indexes to speed up stats and filtered range scans for errors
CREATE INDEX IF NOT EXISTS idx_errors_project_time ON errors(project_id, time);
CREATE INDEX IF NOT EXISTS idx_errors_project_fingerprint_time ON errors(project_id, fingerprint, time);


