package handlers

import (
	"net/http"
	"strconv"

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
	routerV1.HandleFunc("/{id}", h.GetByID).Methods(http.MethodGet)
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

// GetByID godoc
// @Summary Get a technology by ID
// @Description Get a technology by ID
// @Tags technologies
// @Accept json
// @Produce json
// @Success 200 {object} technology.Entity
// @Param id path int true "Technology ID"
// @Router /v1/technologies/{id} [get].
func (h *technologyHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	if idStr == "" {
		httputils.RespondWithPlainError(w, http.StatusBadRequest, "id is required")
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		httputils.RespondWithPlainError(w, http.StatusBadRequest, "invalid id format")
		return
	}

	entity, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		httputils.RespondWithPlainError(w, http.StatusNotFound, err.Error())
		return
	}

	httputils.RespondWithJSON(w, http.StatusOK, entity)
}
