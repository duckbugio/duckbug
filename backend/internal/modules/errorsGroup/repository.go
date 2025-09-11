package errorsgroup

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

var ErrNotFound = errors.New("not found")

type Repository interface {
	GetAll(ctx context.Context, params GetAllParams) ([]*Group, error)
	Count(ctx context.Context, params FilterParams) (int, error)
	GetByID(ctx context.Context, id string) (*Group, error)
	UpdateStatus(ctx context.Context, id string, status Status) error
	BatchUpdateStatus(ctx context.Context, ids []string, status Status) error
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

func (r *repository) GetAll(ctx context.Context, params GetAllParams) ([]*Group, error) {
	query := `
        SELECT id, project_id, file, line, message, first_seen_at, last_seen_at, counter, status 
        FROM error_groups 
        WHERE 1=1
    `

	args := map[string]interface{}{
		"limit":  params.Limit,
		"offset": params.Offset,
	}

	query, args = applyFilters(query, params.FilterParams, args)

	query += " ORDER BY last_seen_at " + params.SortOrder
	query += " LIMIT :limit OFFSET :offset"

	query, namedArgs, err := sqlx.Named(query, args)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare named query: %w", err)
	}

	query = r.db.Rebind(query)

	r.logger.Debug(query)

	var entities []*Group
	err = r.db.SelectContext(ctx, &entities, query, namedArgs...)
	if err != nil {
		return nil, fmt.Errorf("failed to get error groups: %w", err)
	}
	return entities, nil
}

func (r *repository) Count(ctx context.Context, params FilterParams) (int, error) {
	query := "SELECT COUNT(*) FROM error_groups WHERE 1=1"
	query, args := applyFilters(query, params, make(map[string]interface{}))

	query, namedArgs, err := sqlx.Named(query, args)
	if err != nil {
		return 0, fmt.Errorf("failed to prepare named query: %w", err)
	}

	query = r.db.Rebind(query)

	r.logger.Debug(query)

	var count int
	err = r.db.GetContext(ctx, &count, query, namedArgs...)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (r *repository) GetByID(ctx context.Context, id string) (*Group, error) {
	const query = `SELECT id, project_id, file, line, message, first_seen_at, last_seen_at, counter, status 
		FROM error_groups WHERE id = $1`

	var entity Group
	err := r.db.GetContext(ctx, &entity, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to get error by id: %w", err)
	}
	return &entity, nil
}

func (r *repository) UpdateStatus(ctx context.Context, id string, status Status) error {
	const query = `UPDATE error_groups SET status = $1 WHERE id = $2`
	res, err := r.db.ExecContext(ctx, query, status, id)
	if err != nil {
		return fmt.Errorf("failed to update status: %w", err)
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	if affected == 0 {
		return ErrNotFound
	}
	return nil
}

func (r *repository) BatchUpdateStatus(ctx context.Context, ids []string, status Status) error {
	if len(ids) == 0 {
		return nil
	}
	const query = `UPDATE error_groups SET status = $1 WHERE id = ANY($2::char(64)[])`
	res, err := r.db.ExecContext(ctx, query, status, pq.StringArray(ids))
	if err != nil {
		return fmt.Errorf("failed to batch update status: %w", err)
	}
	if affected, err := res.RowsAffected(); err == nil && affected == 0 {
		return ErrNotFound
	}
	return nil
}

func applyFilters(baseQuery string, params FilterParams, args map[string]interface{}) (string, map[string]interface{}) {
	query := baseQuery

	if params.ProjectID != "" {
		query += " AND project_id = :projectId"
		args["projectId"] = params.ProjectID
	}

	if params.TimeFrom != 0 {
		query += " AND last_seen_at >= :timeFrom"
		args["timeFrom"] = params.TimeFrom
	}

	if params.TimeTo != 0 {
		query += " AND last_seen_at <= :timeTo"
		args["timeTo"] = params.TimeTo
	}

	if params.Search != "" {
		query += " AND message ILIKE :search"
		args["search"] = "%" + params.Search + "%"
	}

	if params.Status != "" {
		query += " AND status = :status"
		args["status"] = params.Status
	}

	return query, args
}
