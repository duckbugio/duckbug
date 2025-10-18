package technology

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/jmoiron/sqlx"
)

var ErrNotFound = errors.New("not found")

type Repository interface {
	GetAll(ctx context.Context) ([]*Technology, error)
	GetByID(ctx context.Context, id int) (*Technology, error)
}

type repository struct {
	db     *sqlx.DB
	logger Logger
}

func NewRepository(db *sqlx.DB, logger Logger) Repository {
	return &repository{
		db:     db,
		logger: logger,
	}
}

func (r *repository) GetAll(ctx context.Context) ([]*Technology, error) {
	const query = `SELECT id, name, description, example_dsn_connection, created_at, updated_at 
		FROM technologies ORDER BY name`

	var technologies []*Technology
	err := r.db.SelectContext(ctx, &technologies, query)
	if err != nil {
		return nil, fmt.Errorf("failed to get technologies: %w", err)
	}
	return technologies, nil
}

func (r *repository) GetByID(ctx context.Context, id int) (*Technology, error) {
	const query = `SELECT id, name, description, example_dsn_connection, created_at, updated_at 
		FROM technologies WHERE id = $1`

	var technology Technology
	err := r.db.GetContext(ctx, &technology, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to get technology by id: %w", err)
	}
	return &technology, nil
}
