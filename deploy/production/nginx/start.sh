#!/bin/sh

# Inject runtime API base URL into frontend assets if provided
if [ -n "${REACT_APP_API_BASE_URL}" ]; then
    find /usr/share/nginx/html \
      -type f \
      -name '*.js' \
      -exec sed -i "s+__REACT_APP_API_BASE_URL__+${REACT_APP_API_BASE_URL}+g" '{}' \;
fi

# Start nginx in background
nginx -g "daemon off;" &

# Start backend
/opt/app/bin -config /etc/app/config.json

# Keep container running
wait
