# DuckBug - Unified Development Environment

.PHONY: help init up down restart clean test lint build deploy

# Default target
help: ## Show this help message
	@echo "DuckBug Development Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development Environment
init: ## Initialize development environment
	@echo "🚀 Initializing DuckBug development environment..."
	@make docker-down-clear
	@make docker-pull
	@make docker-build
	@make docker-up
	@make frontend-ready
	@echo "✅ Development environment ready!"

up: ## Start all services
	@echo "🔄 Starting DuckBug services..."
	docker compose up -d

down: ## Stop all services
	@echo "⏹️ Stopping DuckBug services..."
	docker compose down --remove-orphans

restart: down up ## Restart all services

# Docker Commands
docker-up:
	docker compose up -d

docker-down:
	docker compose down --remove-orphans

docker-down-clear:
	docker compose down -v --remove-orphans

docker-pull:
	docker compose pull

docker-build:
	docker compose build --pull

# Frontend Commands
frontend-ready:
	@echo "📦 Preparing frontend..."
	docker run --rm -v $(PWD)/frontend:/app -w /app alpine touch .ready

frontend-install:
	@echo "📦 Installing frontend dependencies..."
	docker compose run --rm frontend-cli npm install

frontend-lint:
	@echo "🔍 Running frontend linters..."
	docker compose run --rm frontend-cli npm run lint:js
	docker compose run --rm frontend-cli npm run lint:styles
	docker compose run --rm frontend-cli npm run lint:prettier

frontend-lint-fix:
	@echo "🔧 Fixing frontend linting issues..."
	docker compose run --rm frontend-cli npm run lint:fix

frontend-test:
	@echo "🧪 Running frontend tests..."
	docker compose run --rm frontend-cli npm run test:ci

frontend-build:
	@echo "🏗️ Building frontend..."
	docker compose run --rm frontend-cli npm run build

# Backend Commands
backend-test:
	@echo "🧪 Running backend tests..."
	docker compose run --rm backend-lint go test -v -count=1 -race -timeout=1m ./...

backend-lint:
	@echo "🔍 Running backend linter..."
	docker compose run --rm backend-lint

backend-migrate-new:
	@echo "📝 Creating new migration..."
	docker compose run --rm backend-lint migrate create -ext sql -dir ./internal/storage/sql/migrations -seq $(name)

backend-swagger:
	@echo "📚 Generating Swagger docs..."
	docker compose run --rm backend-lint swag init -g ./cmd/duckbug/main.go

# Testing
test: frontend-test backend-test ## Run all tests

test-frontend: frontend-test ## Run frontend tests only

test-backend: backend-test ## Run backend tests only

# Linting
lint: frontend-lint backend-lint ## Run all linters

lint-frontend: frontend-lint ## Run frontend linters only

lint-backend: backend-lint ## Run backend linter only

lint-fix: frontend-lint-fix backend-lint ## Fix all linting issues automatically

lint-fix-frontend: frontend-lint-fix ## Fix frontend linting issues only

# Building
build: frontend-build ## Build all projects

build-frontend: frontend-build ## Build frontend only

# Database
db-up: ## Start database services
	docker compose up -d postgres

db-down: ## Stop database services
	docker compose stop postgres

db-reset: db-down ## Reset database (WARNING: destroys data)
	docker volume rm duckbug_postgres_data 2>/dev/null || true
	docker compose up -d postgres

# Production
build-production: ## Build production images
	@echo "🏗️ Building production images..."
	docker build -f backend/build/duckbug/Dockerfile -t duckbug-api:latest ./backend
	docker build -f frontend/docker/production/nginx/Dockerfile -t duckbug-web:latest ./frontend

build-unified: ## Build unified image (frontend + backend)
	@echo "🏗️ Building unified DuckBug image..."
	docker build -f deploy/production/Dockerfile -t duckbug:latest .

deploy-production: ## Deploy to production using docker-compose
	@echo "🚀 Deploying to production..."
	cd deploy/production && docker compose -f docker-compose-production.yml pull && docker compose -f docker-compose-production.yml up -d

# Cleanup
clean: ## Clean up development environment
	@echo "🧹 Cleaning up..."
	docker compose down -v --remove-orphans
	docker system prune -f
	@echo "✅ Cleanup complete!"

clean-all: clean ## Clean everything including images
	docker system prune -a -f
	docker volume prune -f

# Logs
logs: ## Show logs for all services
	docker compose logs -f

logs-backend: ## Show backend logs
	docker compose logs -f backend

logs-frontend: ## Show frontend logs
	docker compose logs -f frontend frontend-dev

logs-db: ## Show database logs
	docker compose logs -f postgres

# Development shortcuts
dev: init ## Start development environment
	@echo "🎉 DuckBug development environment is running!"
	@echo "🌐 Frontend: http://duckbug.localhost"
	@echo "🔧 Backend API: http://duckbug.localhost/api/v1"
	@echo "📊 Database: localhost:5432"

# Quick commands
quick-start: ## Quick start (minimal setup)
	docker compose up -d traefik backend frontend frontend-dev postgres
	@make frontend-ready

# Health checks
health: ## Check service health
	@echo "🏥 Checking service health..."
	@docker compose ps
	@echo ""
	@echo "🌐 Testing endpoints..."
	@curl -s http://localhost/api/health || echo "❌ Backend not responding"
	@curl -s http://localhost/ || echo "❌ Frontend not responding"
