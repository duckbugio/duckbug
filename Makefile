# DuckBug - Unified Development Environment

.PHONY: help init up down restart clean test lint deploy

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
	docker compose run --rm -T frontend-cli npm run lint:js
	docker compose run --rm -T frontend-cli npm run lint:styles
	docker compose run --rm -T frontend-cli npm run lint:prettier
	docker compose run --rm -T frontend-cli npm run type-check

frontend-lint-fix:
	@echo "🔧 Fixing frontend linting issues..."
	docker compose run --rm -T frontend-cli npm run lint:fix

frontend-test:
	@echo "🧪 Running frontend tests..."
	docker compose run --rm -T frontend-cli npm run test:ci

frontend-build:
	@echo "🏗️ Building frontend..."
	docker compose run --rm -T frontend-cli npm run build

# Backend Commands
backend-test:
	@echo "🧪 Running backend tests..."
	docker compose run --rm -T backend-lint go test -v -count=1 -race -timeout=1m ./...

backend-lint:
	@echo "🔍 Running backend linter..."
	docker compose run --rm -T backend-lint

backend-migrate-new:
	@echo "📝 Creating new migration..."
	docker compose run --rm backend-lint migrate create -ext sql -dir ./internal/storage/sql/migrations -seq $(name)

backend-swagger:
	@echo "📚 Generating Swagger docs..."
	docker compose run --rm backend-lint swag init -g ./cmd/duckbug/main.go

backend-seed: ## Run database seeds
	@echo "🌱 Running database seeds..."
	docker compose run --rm backend-lint go run ./cmd/seeds/main.go -config=$(or $(CONFIG_FILE),./configs/duckbug/config.json) 

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

deploy:
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'docker login -u=${DOCKERHUB_USER} -p=${DOCKERHUB_PASSWORD} ${REGISTRY}'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'rm -rf ${PROJECT_NAME}/v_${BUILD_NUMBER}'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'mkdir -p ${PROJECT_NAME}/v_${BUILD_NUMBER}'

	scp -o StrictHostKeyChecking=no -P ${PORT} deploy/production/docker-compose-production.yml deploy@${HOST}:${PROJECT_NAME}/v_${BUILD_NUMBER}/docker-compose.yml
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "COMPOSE_PROJECT_NAME=duckbug" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "REGISTRY=${REGISTRY}" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "IMAGE_TAG=${IMAGE_TAG}" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "DOMAIN=${DOMAIN}" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "POSTGRES_DSN=${POSTGRES_DSN}" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "JWT_SECRET=${JWT_SECRET}" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "LOGGER_LEVEL=${LOGGER_LEVEL}" >> .env'

	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && docker compose pull'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && docker compose up --build --remove-orphans -d'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'rm -f ${PROJECT_NAME}/${PROJECT_NAME}'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'ln -sr ${PROJECT_NAME}/v_${BUILD_NUMBER} ${PROJECT_NAME}/${PROJECT_NAME}'