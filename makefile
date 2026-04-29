DEV_CMD  = docker compose -p portfolio-dev -f compose.yml -f compose.dev.yml
PROD_CMD = docker compose -p portfolio-prod -f compose.yml -f compose.prod.yml

exec-test:
	docker exec -it portfolio_frontend_dev npm run lint
	docker exec -it portfolio_frontend_dev npm audit
	docker exec -it portfolio_backend_dev npm run lint
	docker exec -it portfolio_backend_dev npm run typecheck


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

prod-build:
	$(PROD_CMD) build

prod-buildcache:
	$(PROD_CMD) build --no-cache

prod-up:
	$(PROD_CMD) up -d

prod-logs:
	$(PROD_CMD) logs -f

prod-down:
	$(PROD_CMD) down -v --rmi local
