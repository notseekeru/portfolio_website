DEV_CMD  = docker compose -p portfolio-dev -f compose.yml -f compose.dev.yml
PROD_CMD = docker compose -p portfolio-prod -f compose.yml -f compose.prod.yml

exec:
	@echo "**---------Checking Frontend...-----------**"
	docker exec -t portfolio_frontend_dev sh -c "(npm run lint && npm run typecheck && npm audit) && npm outdated || true && npm prune"

lint:
	docker exec -t portfolio_frontend_dev sh -c "npm run lint"

build:
	$(DEV_CMD) build

buildcache:
	$(DEV_CMD) build --no-cache

logs:
	$(DEV_CMD) logs -f

up:
	$(DEV_CMD) up -d

down:
	$(DEV_CMD) down -v

prod-build:
	$(PROD_CMD) build

prod-buildcache:
	$(PROD_CMD) build --no-cache

prod-logs:
	$(PROD_CMD) logs -f

prod-down:
	$(PROD_CMD) down -v --rmi local

prod-up:
	$(PROD_CMD) up -d
