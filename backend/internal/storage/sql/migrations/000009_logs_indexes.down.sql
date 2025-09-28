-- +migrate Down

DROP INDEX IF EXISTS idx_logs_project_time;
DROP INDEX IF EXISTS idx_logs_project_fingerprint_time;


