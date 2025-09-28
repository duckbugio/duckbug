package errors

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	errorsGroup "github.com/duckbugio/duckbug/internal/modules/errorsGroup"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

var ErrNotFound = errors.New("not found")

type Repository interface {
	GetAll(ctx context.Context, params GetAllParams) ([]*Error, error)
	Count(ctx context.Context, params FilterParams) (int, error)
	GetStats(ctx context.Context, projectID string, fingerprint string) (*Stats, error)
	GetByID(ctx context.Context, id string) (*Error, error)
	Create(ctx context.Context, entity *Error) error
	Update(ctx context.Context, id string, entity *Error) error
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

func (r *repository) GetAll(ctx context.Context, params GetAllParams) ([]*Error, error) {
	query := `
        SELECT 
            id, project_id, fingerprint, message, stacktrace, file, line, context,
            ip, url, method, headers, query_params, body_params, cookies, session, files, env,
            time, created_at, updated_at 
        FROM
            errors 
        WHERE 1=1
    `

	args := map[string]interface{}{
		"limit":  params.Limit,
		"offset": params.Offset,
	}

	query, args = applyFilters(query, params.FilterParams, args)

	query += " ORDER BY time " + params.SortOrder
	query += " LIMIT :limit OFFSET :offset"

	query, namedArgs, err := sqlx.Named(query, args)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare named query: %w", err)
	}

	query = r.db.Rebind(query)

	r.logger.Debug(query)

	var entities []*Error
	err = r.db.SelectContext(ctx, &entities, query, namedArgs...)
	if err != nil {
		return nil, fmt.Errorf("failed to get errors: %w", err)
	}
	return entities, nil
}

func (r *repository) Count(ctx context.Context, params FilterParams) (int, error) {
	query := "SELECT COUNT(*) FROM errors WHERE 1=1"
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

func (r *repository) GetStats(ctx context.Context, projectID string, fingerprint string) (*Stats, error) {
	// Precompute thresholds in ms to help planner use range conditions on indexed column "time"
	nowMs := time.Now().UnixMilli()
	last24hFrom := nowMs - int64(24*time.Hour/time.Millisecond)
	last7dFrom := nowMs - int64(7*24*time.Hour/time.Millisecond)
	last30dFrom := nowMs - int64(30*24*time.Hour/time.Millisecond)

	query := `
        SELECT
            SUM(CASE WHEN time >= :last24hFrom THEN 1 ELSE 0 END) AS last_24h,
            SUM(CASE WHEN time >= :last7dFrom THEN 1 ELSE 0 END)   AS last_7d,
            SUM(CASE WHEN time >= :last30dFrom THEN 1 ELSE 0 END)  AS last_30d
        FROM errors
        WHERE project_id = :projectId
    `

	args := map[string]interface{}{
		"projectId":   projectID,
		"last24hFrom": last24hFrom,
		"last7dFrom":  last7dFrom,
		"last30dFrom": last30dFrom,
	}

	if fingerprint != "" {
		query += " AND fingerprint = :fingerprint"
		args["fingerprint"] = fingerprint
	}

	query, namedArgs, err := sqlx.Named(query, args)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare named query: %w", err)
	}

	query = r.db.Rebind(query)

	r.logger.Debug(query)

	var stats struct {
		Last24h int `db:"last_24h"`
		Last7d  int `db:"last_7d"`
		Last30d int `db:"last_30d"`
	}

	err = r.db.GetContext(ctx, &stats, query, namedArgs...)
	if err != nil {
		return nil, err
	}

	return &Stats{
		Last24h: stats.Last24h,
		Last7d:  stats.Last7d,
		Last30d: stats.Last30d,
	}, nil
}

func (r *repository) GetByID(ctx context.Context, id string) (*Error, error) {
	const query = `
		SELECT
			id, project_id, fingerprint, message, stacktrace, file, line, context,
			ip, url, method, headers, query_params, body_params, cookies, session, files, env,
			time, created_at, updated_at 
		FROM
		    errors
		WHERE id = $1
	`

	var entity Error
	err := r.db.GetContext(ctx, &entity, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to get error by id: %w", err)
	}
	return &entity, nil
}

func (r *repository) Create(ctx context.Context, e *Error) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if err != nil {
			if rbErr := tx.Rollback(); rbErr != nil && !errors.Is(rbErr, sql.ErrTxDone) {
				r.logger.Warn(fmt.Sprintf("failed to rollback transaction: %v", rbErr))
			}
		}
	}()

	const errorGroupQuery = `
        INSERT INTO error_groups (id, project_id, file, line, message, first_seen_at, last_seen_at, counter)
        VALUES (:id, :project_id, :file, :line, :message, :first_seen_at, :last_seen_at, 1)
        ON CONFLICT (id) DO UPDATE 
        SET 
            counter = error_groups.counter + 1,
            last_seen_at = EXCLUDED.last_seen_at,
            status = CASE 
                WHEN error_groups.status = 'resolved' THEN 'unresolved' 
                ELSE error_groups.status 
            END
    `

	now := time.Now().Unix()
	errorGroup := errorsGroup.Group{
		ID:          e.Fingerprint,
		ProjectID:   e.ProjectID,
		File:        e.File,
		Line:        e.Line,
		Message:     e.Message,
		FirstSeenAt: now,
		LastSeenAt:  now,
		Counter:     0,
		Status:      errorsGroup.StatusUnresolved,
	}

	_, err = tx.NamedExecContext(ctx, errorGroupQuery, errorGroup)
	if err != nil {
		return fmt.Errorf("failed to upsert error group: %w", err)
	}

	const query = `
		INSERT INTO errors (
			id, project_id, fingerprint, message, stacktrace, file, line, context,
			ip, url, method, headers, query_params, body_params, cookies, session, files, env,
			time, created_at, updated_at
		) VALUES (
		  	:id, :project_id, :fingerprint, :message, :stacktrace, :file, :line, :context,
		  	:ip, :url, :method, :headers, :query_params, :body_params, :cookies, :session, :files, :env,
		  	:time, :created_at, :updated_at
		)
	`

	if e.ID == "" {
		e.ID = uuid.New().String()
	}

	e.CreatedAt = now
	e.UpdatedAt = now

	_, err = tx.NamedExecContext(ctx, query, e)
	if err != nil {
		return fmt.Errorf("failed to create error: %w", err)
	}

	if err = tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

func (r *repository) Update(ctx context.Context, id string, updated *Error) error {
	const query = `
		UPDATE
			errors 
		SET 
		    fingerprint = :fingerprint,
		    message = :message,
		    stacktrace = :stacktrace,
		    file = :file,
		    line = :line,
		    context = :context,
		    time = :time,
		    updated_at = :updated_at
		WHERE
		    id = :id
	`

	updated.ID = id
	updated.UpdatedAt = time.Now().Unix()

	result, err := r.db.NamedExecContext(ctx, query, updated)
	if err != nil {
		return fmt.Errorf("failed to update error: %w", err)
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
	const query = `DELETE FROM errors WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete error: %w", err)
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

func applyFilters(baseQuery string, params FilterParams, args map[string]interface{}) (string, map[string]interface{}) {
	query := baseQuery

	if params.ProjectID != "" {
		query += " AND project_id = :projectId"
		args["projectId"] = params.ProjectID
	}

	if params.Fingerprint != "" {
		query += " AND fingerprint = :fingerprint"
		args["fingerprint"] = params.Fingerprint
	}

	if params.TimeFrom != 0 {
		query += " AND time >= :timeFrom"
		args["timeFrom"] = params.TimeFrom
	}

	if params.TimeTo != 0 {
		query += " AND time <= :timeTo"
		args["timeTo"] = params.TimeTo
	}

	if params.Search != "" {
		query += " AND message ILIKE :search"
		args["search"] = "%" + params.Search + "%"
	}

	return query, args
}
