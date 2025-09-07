package server

import (
	"context"
	"net"
	"net/http"
	"strconv"
	"time"

	"github.com/duckbugio/duckbug/internal/modules/app"
	"github.com/duckbugio/duckbug/internal/modules/errors"
	errorsGroup "github.com/duckbugio/duckbug/internal/modules/errorsGroup"
	"github.com/duckbugio/duckbug/internal/modules/log"
	logGroup "github.com/duckbugio/duckbug/internal/modules/logGroup"
	"github.com/duckbugio/duckbug/internal/modules/project"
	"github.com/duckbugio/duckbug/internal/modules/users"
	"github.com/duckbugio/duckbug/internal/server/http/handlers"
)

type Server struct {
	server *http.Server
	logger handlers.Logger
}

const (
	defaultReadTimeout  = 10 * time.Second
	defaultWriteTimeout = 10 * time.Second
)

func New(
	logger handlers.Logger,
	appService app.Service,
	userService users.Service,
	logService log.Service,
	logGroupService logGroup.Service,
	errorService errors.Service,
	errorGroupService errorsGroup.Service,
	projectService project.Service,
	host string,
	port int,
	jwtKey []byte,
) *Server {
	handler := NewHandler(
		logger,
		appService,
		userService,
		logService,
		logGroupService,
		errorService,
		errorGroupService,
		projectService,
		jwtKey,
	)

	servers := &http.Server{
		Addr:    net.JoinHostPort("0.0.0.0", strconv.Itoa(port)),
		Handler: loggingMiddleware(logger, handler),
		// Handler:      CORS(loggingMiddleware(logger, handler)),
		ReadTimeout:  defaultReadTimeout,
		WriteTimeout: defaultWriteTimeout,
	}

	return &Server{
		server: servers,
		logger: logger,
	}
}

func (s *Server) Start(ctx context.Context) error {
	err := s.server.ListenAndServe()
	if err != nil {
		return err
	}

	<-ctx.Done()

	return nil
}

func (s *Server) Stop(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
