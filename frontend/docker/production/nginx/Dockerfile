FROM node:23 AS builder

ENV REACT_APP_API_BASE_URL=__REACT_APP_API_BASE_URL__

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY ./ ./
RUN npm run build

FROM nginx:1.27-alpine

RUN apk update && apk add --no-cache curl

COPY ./docker/production/nginx/conf.d /etc/nginx/conf.d
COPY ./docker/production/nginx/docker-entrypoint-env.sh /
RUN chmod +x /docker-entrypoint-env.sh

ENTRYPOINT ["/docker-entrypoint-env.sh"]
CMD ["nginx", "-g", "daemon off;"]

WORKDIR /app

COPY --from=builder /app/dist ./public
