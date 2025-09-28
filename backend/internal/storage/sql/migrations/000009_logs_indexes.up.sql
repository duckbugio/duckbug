-- +migrate Up

-- Composite indexes to speed up stats and filtered range scans
CREATE INDEX IF NOT EXISTS idx_logs_project_time ON logs(project_id, time);
CREATE INDEX IF NOT EXISTS idx_logs_project_fingerprint_time ON logs(project_id, fingerprint, time);


