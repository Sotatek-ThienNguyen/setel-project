install:
	cd orders && rm -rf ./node_modules package-log.json && npm i
	cd payments && rm -rf ./node_modules package-log.json && npm i

build:
	cd orders && cp .env.example .env
	cd payments && docker-compose build -d
	cd orders && docker-compose build -d
	cd web && npm run start

up:
	cd payments && docker-compose up -d
	cd orders && docker-compose up -d
	cd web && npm run start

down:
	cd orders && docker-compose down
	cd payments && docker-compose down

