-- +migrate Down

DROP INDEX IF EXISTS idx_error_groups_project_id_status;
