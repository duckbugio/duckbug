package server

import (
	"net/http"

	"github.com/duckbugio/duckbug/internal/modules/app"
	"github.com/duckbugio/duckbug/internal/modules/errors"
	errorsGroup "github.com/duckbugio/duckbug/internal/modules/errorsGroup"
	"github.com/duckbugio/duckbug/internal/modules/log"
	logGroup "github.com/duckbugio/duckbug/internal/modules/logGroup"
	"github.com/duckbugio/duckbug/internal/modules/project"
	"github.com/duckbugio/duckbug/internal/modules/technology"
	"github.com/duckbugio/duckbug/internal/modules/users"
	"github.com/duckbugio/duckbug/internal/server/http/handlers"
	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
)

func NewHandler(
	logger handlers.Logger,
	appService app.Service,
	userService users.Service,
	logService log.Service,
	logGroupService logGroup.Service,
	errorService errors.Service,
	errorGroupService errorsGroup.Service,
	technologyService technology.Service,
	projectService project.Service,
	jwtKey []byte,
) http.Handler {
	r := mux.NewRouter()
	r.MethodNotAllowedHandler = http.HandlerFunc(methodNotAllowedHandler)
	r.NotFoundHandler = http.HandlerFunc(methodNotFoundHandler)

	r.PathPrefix("/docs").Handler(httpSwagger.WrapHandler)

	handlers.RegisterAppHandlers(r, logger, appService)
	handlers.RegisterAuthHandlers(r, logger, userService)
	handlers.RegisterLogHandlers(r, logger, logService, jwtKey)
	handlers.RegisterLogGroupHandlers(r, logger, logGroupService, jwtKey)
	handlers.RegisterErrorHandlers(r, logger, errorService, jwtKey)
	handlers.RegisterErrorGroupHandlers(r, logger, errorGroupService, jwtKey)
	handlers.RegisterTechnologyHandlers(r, logger, technologyService)
	handlers.RegisterProjectHandlers(r, logger, projectService, jwtKey)

	return r
}

func methodNotAllowedHandler(w http.ResponseWriter, _ *http.Request) {
	http.Error(w, "405 Method Not Allowed", http.StatusMethodNotAllowed)
}

func methodNotFoundHandler(w http.ResponseWriter, _ *http.Request) {
	http.Error(w, "404 Not Found", http.StatusNotFound)
}
