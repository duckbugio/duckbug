-- +migrate Down
DROP INDEX IF EXISTS idx_projects_creator_deleted;
