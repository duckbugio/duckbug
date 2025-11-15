package project

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"time"

	"github.com/duckbugio/duckbug/internal/middleware"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

var (
	ErrNotFound = errors.New("not found")
	KeyLength   = 64
)

type Repository interface {
	GetAll(ctx context.Context, params GetAllParams) ([]*Project, int, error)
	GetByID(ctx context.Context, id string) (*Project, error)
	Create(ctx context.Context, project *Project) error
	Update(ctx context.Context, id string, project *Project) error
	Delete(ctx context.Context, id string) error
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

func (r *repository) GetAll(ctx context.Context, params GetAllParams) ([]*Project, int, error) {
	userID, ok := middleware.GetUserID(ctx)
	if !ok {
		return nil, 0, fmt.Errorf("unauthorized")
	}

	// Use COUNT(*) OVER() to get total count in a single query
	query := `
        SELECT 
            id, name, public_key, created_at, updated_at, deleted_at,
            COUNT(*) OVER() as total_count
        FROM projects 
        WHERE creator_id = :creator_id AND deleted_at IS NULL
        ORDER BY created_at ` + params.SortOrder + `
        LIMIT :limit OFFSET :offset
    `

	args := map[string]interface{}{
		"creator_id": userID,
		"limit":      params.Limit,
		"offset":     params.Offset,
	}

	query, namedArgs, err := sqlx.Named(query, args)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to prepare named query: %w", err)
	}

	query = r.db.Rebind(query)

	r.logger.Debug(query)

	type projectRow struct {
		ID        string  `db:"id"`
		Name      string  `db:"name"`
		PublicKey string  `db:"public_key"`
		CreatedAt int64   `db:"created_at"`
		UpdatedAt int64   `db:"updated_at"`
		DeletedAt *int64  `db:"deleted_at"`
		TotalCount int    `db:"total_count"`
	}

	var rows []projectRow
	err = r.db.SelectContext(ctx, &rows, query, namedArgs...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get projects: %w", err)
	}

	projects := make([]*Project, 0, len(rows))
	var totalCount int
	for i, row := range rows {
		projects = append(projects, &Project{
			ID:        row.ID,
			Name:      row.Name,
			PublicKey: row.PublicKey,
			CreatedAt: row.CreatedAt,
			UpdatedAt: row.UpdatedAt,
			DeletedAt: row.DeletedAt,
		})
		// Total count is the same for all rows, take it from the first one
		if i == 0 {
			totalCount = row.TotalCount
		}
	}

	// If no rows returned, totalCount will be 0 (default value)

	return projects, totalCount, nil
}

func (r *repository) GetByID(ctx context.Context, id string) (*Project, error) {
	const query = `SELECT id, name, public_key, created_at, updated_at, deleted_at 
		FROM projects WHERE id = $1 AND deleted_at IS NULL`

	var entity Project
	err := r.db.GetContext(ctx, &entity, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to get project by id: %w", err)
	}
	return &entity, nil
}

func (r *repository) Create(ctx context.Context, p *Project) error {
	userID, ok := middleware.GetUserID(ctx)
	if !ok {
		return fmt.Errorf("unauthorized")
	}

	const query = `INSERT INTO projects 
		(id, creator_id, name, public_key, created_at, updated_at, deleted_at)
		VALUES (:id, :creator_id, :name, :public_key, :created_at, :updated_at, null)`

	if p.ID == "" {
		p.ID = uuid.New().String()
	}

	now := time.Now().Unix()
	p.CreatorID = userID
	p.PublicKey = generateRandomKey()
	p.CreatedAt = now
	p.UpdatedAt = now

	_, err := r.db.NamedExecContext(ctx, query, p)
	if err != nil {
		return fmt.Errorf("failed to create project: %w", err)
	}
	return nil
}

func (r *repository) Update(ctx context.Context, id string, updated *Project) error {
	const query = `UPDATE projects 
		SET name = :name,
		    updated_at = :updated_at
		WHERE id = :id`

	updated.ID = id
	updated.UpdatedAt = time.Now().Unix()

	result, err := r.db.NamedExecContext(ctx, query, updated)
	if err != nil {
		return fmt.Errorf("failed to update project: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}

func (r *repository) Delete(ctx context.Context, id string) error {
	const query = `DELETE FROM projects WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete project: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}

func generateRandomKey() string {
	b := make([]byte, KeyLength)
	_, err := rand.Read(b)
	if err != nil {
		return uuid.New().String()
	}
	return base64.RawURLEncoding.EncodeToString(b)
}
