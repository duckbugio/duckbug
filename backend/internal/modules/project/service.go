package project

import (
	"context"

	moduleErrors "github.com/duckbugio/duckbug/internal/modules/errors"
	moduleErrorsGroup "github.com/duckbugio/duckbug/internal/modules/errorsGroup"
	moduleLog "github.com/duckbugio/duckbug/internal/modules/log"
	"github.com/google/uuid"
)

type Service interface {
	GetByID(ctx context.Context, id string) (*Entity, error)
	GetDSNByID(ctx context.Context, id string) (string, error)
	GetAll(ctx context.Context, params GetAllParams) ([]*Entity, int, error)
	Create(ctx context.Context, req *Create) (*Entity, error)
	Update(ctx context.Context, id string, req *Update) (*Entity, error)
	Delete(ctx context.Context, id string) error
}

type service struct {
	repo            Repository
	logger          Logger
	domain          string
	errorsRepo      moduleErrors.Repository
	errorGroupsRepo moduleErrorsGroup.Repository
	logsRepo        moduleLog.Repository
}

func NewService(repo Repository, logger Logger, domain string) Service {
	return &service{
		repo:   repo,
		logger: logger,
		domain: domain,
	}
}

// SetStatsRepos allows wiring optional repositories used to enrich projects with stats
func (s *service) SetStatsRepos(er moduleErrors.Repository, egr moduleErrorsGroup.Repository, lr moduleLog.Repository) {
	s.errorsRepo = er
	s.errorGroupsRepo = egr
	s.logsRepo = lr
}

func (s *service) GetByID(ctx context.Context, id string) (*Entity, error) {
	project, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return toResponse(project), nil
}

func (s *service) GetDSNByID(ctx context.Context, id string) (string, error) {
	project, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return "", err
	}

	dsn := "https://" + s.domain + "/api/ingest/" + project.ID + ":" + project.PublicKey

	return dsn, nil
}

func (s *service) GetAll(ctx context.Context, params GetAllParams) ([]*Entity, int, error) {
	projects, err := s.repo.GetAll(ctx, params)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.repo.Count(ctx)
	if err != nil {
		return nil, 0, err
	}

	// Collect project IDs for batch queries
	projectIDs := make([]string, 0, len(projects))
	for _, project := range projects {
		projectIDs = append(projectIDs, project.ID)
	}

	// Batch fetch error counts and log stats if repos are available
	var errorCounts map[string]int
	var logStats map[string]*moduleLog.Stats

	if s.errorGroupsRepo != nil && len(projectIDs) > 0 {
		errorCounts, _ = s.errorGroupsRepo.BatchCountByProjectIDs(ctx, projectIDs, moduleErrorsGroup.StatusUnresolved)
	}

	if s.logsRepo != nil && len(projectIDs) > 0 {
		logStats, _ = s.logsRepo.BatchGetStatsByProjectIDs(ctx, projectIDs)
	}

	// Build responses with batch-fetched stats
	responses := make([]*Entity, 0, len(projects))
	for _, project := range projects {
		entity := toResponse(project)

		if errorCounts != nil {
			entity.OpenErrors = errorCounts[project.ID]
		}

		if logStats != nil {
			if stats := logStats[project.ID]; stats != nil {
				entity.LogsLast24h = stats.Last24h
			}
		}

		responses = append(responses, entity)
	}

	return responses, total, nil
}

func (s *service) Create(ctx context.Context, req *Create) (*Entity, error) {
	project := &Project{
		ID:           uuid.New().String(),
		Name:         req.Name,
		TechnologyID: req.TechnologyID,
	}

	if err := s.repo.Create(ctx, project); err != nil {
		return nil, err
	}

	return toResponse(project), nil
}

func (s *service) Update(ctx context.Context, id string, req *Update) (*Entity, error) {
	project, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		project.Name = req.Name
	}
	if req.TechnologyID != 0 {
		project.TechnologyID = req.TechnologyID
	}

	if err := s.repo.Update(ctx, id, project); err != nil {
		return nil, err
	}

	return toResponse(project), nil
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func toResponse(p *Project) *Entity {
	return &Entity{
		ID:           p.ID,
		Name:         p.Name,
		TechnologyID: p.TechnologyID,
	}
}
