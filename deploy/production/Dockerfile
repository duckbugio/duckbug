# Multi-stage build для DuckBug (Frontend + Backend)

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM golang:1.24-alpine AS backend-build
RUN apk add --no-cache git gcc musl-dev
RUN go install github.com/swaggo/swag/cmd/swag@latest

WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./
RUN swag init -g ./cmd/duckbug/main.go

ARG LDFLAGS
RUN CGO_ENABLED=0 go build -ldflags "$LDFLAGS" -o /app/bin cmd/duckbug/*

# Stage 3: Production Image
FROM alpine:latest

LABEL SERVICE="duckbug"
LABEL MAINTAINERS="zaytcev.com"

# Install nginx
RUN apk add --no-cache nginx

# Copy backend binary
COPY --from=backend-build /app/bin /opt/app/bin

# Copy backend config
COPY backend/configs/duckbug/config.json /etc/app/config.json

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY deploy/production/nginx/nginx.conf /etc/nginx/nginx.conf

# Create nginx directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

EXPOSE 80

# Start both nginx and backend
COPY deploy/production/nginx/start.sh /nginx/start.sh
RUN chmod +x /nginx/start.sh

CMD ["/nginx/start.sh"]
