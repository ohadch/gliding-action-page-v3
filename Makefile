# This command is intended to be run on the server
deploy-prod:
	sudo docker compose -f docker-compose.prod.yml up -d --build
