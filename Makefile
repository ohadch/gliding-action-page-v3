up-dev:
	docker-compose -f docker-compose.dev.yml up -d --build

down-dev:
	docker-compose -f docker-compose.dev.yml down

# This command is intended to be run on the server
deploy-prod:
	sudo docker compose -f docker-compose.prod.yml up -d --build
