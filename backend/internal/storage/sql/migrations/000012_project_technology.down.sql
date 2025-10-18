-- +goose Down
-- +goose StatementBegin
ALTER TABLE projects DROP COLUMN IF EXISTS technology_id;
DROP INDEX IF EXISTS idx_projects_technology_id;
-- +goose StatementEnd

