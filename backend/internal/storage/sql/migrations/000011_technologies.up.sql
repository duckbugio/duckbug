-- +goose Up
-- +goose StatementBegin
CREATE TABLE technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    example_dsn_connection TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default technologies
INSERT INTO technologies (name, description, example_dsn_connection) VALUES
('React Native', 'Mobile app development framework', 'postgresql://user:password@localhost:5432/mydb'),
('PHP', 'Server-side scripting language', 'mysql://user:password@localhost:3306/mydb'),
('JavaScript', 'Client-side and server-side programming language', 'mongodb://user:password@localhost:27017/mydb'),
('Python', 'High-level programming language', 'postgresql://user:password@localhost:5432/mydb'),
('Java', 'Object-oriented programming language', 'mysql://user:password@localhost:3306/mydb'),
('Go', 'Statically typed programming language', 'postgresql://user:password@localhost:5432/mydb'),
('Node.js', 'JavaScript runtime for server-side development', 'mongodb://user:password@localhost:27017/mydb'),
('Ruby', 'Dynamic programming language', 'postgresql://user:password@localhost:5432/mydb'),
('C#', 'Microsoft programming language', 'sqlserver://user:password@localhost:1433/mydb'),
('Swift', 'Apple programming language for iOS/macOS', 'sqlite://path/to/database.db');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS technologies;
-- +goose StatementEnd

