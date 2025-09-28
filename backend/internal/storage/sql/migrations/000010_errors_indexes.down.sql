-- +migrate Down

DROP INDEX IF EXISTS idx_errors_project_time;
DROP INDEX IF EXISTS idx_errors_project_fingerprint_time;


