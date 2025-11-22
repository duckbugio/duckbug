-- +goose Up
-- +goose StatementBegin
CREATE TABLE technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    example_dsn_connection TEXT,
    created_at INT NOT NULL,
    updated_at INT NOT NULL
);

