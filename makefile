DEV_CMD  = docker compose -p portfolio-dev -f compose.yml -f compose.dev.yml
PROD_CMD = docker compose -p portfolio-prod -f compose.yml -f compose.prod.yml

dev-build:
	$(DEV_CMD) build

dev-buildcache:
	$(DEV_CMD) build --no-cache

dev-down:
	$(DEV_CMD) down -v --rmi local

dev-up:
	$(DEV_CMD) up -d

dev-logs:
	$(DEV_CMD) logs -f

dev-down:
	$(DEV_CMD) down -v --rmi local

prod-up:
	$(PROD_CMD) up -d
