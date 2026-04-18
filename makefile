dev build:
	docker compose -p portfolio-dev -f compose.yml -f compose.dev.yml build --no-cache

dev up:
	docker compose -p portfolio-dev -f compose.yml -f compose.dev.yml up -d

prod build:
	docker compose -p portfolio-prod -f compose.yml -f compose.prod.yml build --no-cache

prod up:
	docker compose -p portfolio-prod -f compose.yml -f compose.prod.yml up -d