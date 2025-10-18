-- +goose Up
-- +goose StatementBegin
ALTER TABLE projects ADD COLUMN technology_id INTEGER REFERENCES technologies(id);

-- Create index for better performance
CREATE INDEX idx_projects_technology_id ON projects(technology_id);

-- Update existing projects to have a default technology (assuming technology with id=1 exists)
UPDATE projects SET technology_id = 1 WHERE technology_id IS NULL;

-- Make technology_id NOT NULL after setting default values
ALTER TABLE projects ALTER COLUMN technology_id SET NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE projects DROP COLUMN IF EXISTS technology_id;
DROP INDEX IF EXISTS idx_projects_technology_id;
-- +goose StatementEnd

