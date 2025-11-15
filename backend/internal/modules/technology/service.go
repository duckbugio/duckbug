package technology

import (
	"context"
)

type Service interface {
	GetAll(ctx context.Context) ([]*Entity, error)
	GetByID(ctx context.Context, id int) (*Entity, error)
}

type service struct {
	repo   Repository
	logger Logger
}

func NewService(repo Repository, logger Logger) Service {
	return &service{
		repo:   repo,
		logger: logger,
	}
}

func (s *service) GetAll(ctx context.Context) ([]*Entity, error) {
	technologies, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	entities := make([]*Entity, 0, len(technologies))
	for _, tech := range technologies {
		entities = append(entities, toResponse(tech))
	}
	return entities, nil
}

func (s *service) GetByID(ctx context.Context, id int) (*Entity, error) {
	technology, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return toResponse(technology), nil
}

func toResponse(t *Technology) *Entity {
	return &Entity{
		ID:                   t.ID,
		Name:                 t.Name,
		Description:          t.Description,
		ExampleDSNConnection: t.ExampleDSNConnection,
	}
}
