init: init-ci ready
init-ci: docker-down-clear \
	clear \
	docker-pull docker-build docker-up \
	npm-install

up: docker-up
down: docker-down
restart: down up
check: eslint stylelint


#Docker
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

clear:
	docker run --rm -v ${PWD}:/app -w /app alpine sh -c 'rm -rf .ready build'


npm-install:
	docker compose run -u root --rm frontend-node-cli npm install

ready:
	docker run --rm -v ${PWD}:/app -w /app alpine touch .ready


eslint:
	docker compose run --rm frontend-node-cli npm run lint:js

stylelint:
	docker compose run --rm frontend-node-cli npm run lint:styles

prettier:
	docker compose run --rm frontend-node-cli npm run lint:prettier

lint-fix:
	docker compose run --rm frontend-node-cli npm run lint:fix


#Build
build-project:
	docker --log-level=debug build --pull --file=./docker/production/nginx/Dockerfile --tag=${REGISTRY}/fuckbug:${IMAGE_TAG} .

push:
	docker push ${REGISTRY}/fuckbug:${IMAGE_TAG}

deploy:
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'docker login -u=${DOCKERHUB_USER} -p=${DOCKERHUB_PASSWORD} ${REGISTRY}'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'rm -rf ${PROJECT_NAME}/v_${BUILD_NUMBER}'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'mkdir -p ${PROJECT_NAME}/v_${BUILD_NUMBER}'

	scp -o StrictHostKeyChecking=no -P ${PORT} docker-compose-production.yml deploy@${HOST}:${PROJECT_NAME}/v_${BUILD_NUMBER}/docker-compose.yml
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "COMPOSE_PROJECT_NAME=fuckbug-web" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "REGISTRY=${REGISTRY}" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "IMAGE_TAG=${IMAGE_TAG}" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "DOMAIN=${DOMAIN}" >> .env'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && echo "REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}" >> .env'

	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && docker compose pull'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd ${PROJECT_NAME}/v_${BUILD_NUMBER} && docker compose up --build --remove-orphans -d'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'rm -f ${PROJECT_NAME}/${PROJECT_NAME}'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'ln -sr ${PROJECT_NAME}/v_${BUILD_NUMBER} ${PROJECT_NAME}/${PROJECT_NAME}'
