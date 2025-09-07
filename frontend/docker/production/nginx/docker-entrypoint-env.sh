#!/bin/sh
set -e

find /app/public \
  -type f \
  -name '*.js' \
  -exec sed -i "s+__REACT_APP_API_BASE_URL__+${REACT_APP_API_BASE_URL:?}+g" '{}' \;

exec /docker-entrypoint.sh "$@"
