-- +goose Up
-- +goose StatementBegin
ALTER TABLE projects ADD COLUMN technology_id INTEGER REFERENCES technologies(id);

-- Create index for better performance
CREATE INDEX idx_projects_technology_id ON projects(technology_id);


