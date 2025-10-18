package handlers

import (
	"net/http"

	"github.com/duckbugio/duckbug/internal/modules/technology"
	"github.com/duckbugio/duckbug/pkg/httputils"
	"github.com/gorilla/mux"
)

type technologyHandler struct {
	logger  Logger
	service technology.Service
}

func RegisterTechnologyHandlers(
	r *mux.Router,
	logger Logger,
	service technology.Service,
) {
	h := &technologyHandler{
		logger:  logger,
		service: service,
	}

	routerV1 := r.PathPrefix("/v1/technologies").Subrouter()

	routerV1.HandleFunc("", h.GetAll).Methods(http.MethodGet)
}

// GetAll godoc
// @Summary Get all technologies
// @Description Retrieves a list of all available technologies
// @Tags technologies
// @Accept  json
// @Produce  json
// @Success 200 {object} technology.EntityList "Successfully retrieved list of technologies"
// @Router /v1/technologies [get].
func (h *technologyHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	technologies, err := h.service.GetAll(r.Context())
	if err != nil {
		httputils.RespondWithPlainError(w, http.StatusInternalServerError, err.Error())
		return
	}

	httputils.RespondWithJSON(w, http.StatusOK, httputils.NewListResponse(len(technologies), technologies))
}
