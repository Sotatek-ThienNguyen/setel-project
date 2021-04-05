
up:
	cd payments && docker-compose up -d
	cd orders && docker-compose up -d
	cd web && npm run start

down:
	cd orders && docker-compose down
	cd payments && docker-compose down

