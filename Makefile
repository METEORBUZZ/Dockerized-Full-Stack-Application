.PHONY: help up dev down stop restart logs ps clean health seed

# Default target
help:
	@echo "========================================================================"
	@echo " Dockerized Full Stack Application - Makefile Commands"
	@echo "========================================================================"
	@echo " make up          - Launch production stack (React + Express + PostgreSQL)"
	@echo " make dev         - Launch development stack with live hot-reloading"
	@echo " make down        - Stop and remove containers and network"
	@echo " make stop        - Stop containers without removing them"
	@echo " make restart     - Restart all containers"
	@echo " make logs        - Follow logs across all containers"
	@echo " make ps          - Show running containers and health status"
	@echo " make clean       - Stop containers and remove persistent DB volumes"
	@echo " make health      - Check health status of API and PostgreSQL"
	@echo " make seed        - Re-run database seed script"
	@echo "========================================================================"

# Launch production stack (Multi-stage build, Nginx reverse proxy)
up:
	docker compose up --build -d

# Launch development stack with live reloading (tsx watch & Vite HMR)
dev:
	docker compose -f docker-compose.dev.yml up --build

# Stop and remove containers
down:
	docker compose down

# Stop containers without removing
stop:
	docker compose stop

# Restart containers
restart:
	docker compose restart

# View logs
logs:
	docker compose logs -f

# Check container status
ps:
	docker compose ps

# Clean containers and persistent volumes
clean:
	docker compose down -v --remove-orphans

# Health probe check
health:
	@curl -s http://localhost:5000/api/health | jq . || curl -s http://localhost:5000/api/health

# Re-seed database
seed:
	docker compose exec -T postgres psql -U postgres -d fullstack_db -f /docker-entrypoint-initdb.d/init.sql
