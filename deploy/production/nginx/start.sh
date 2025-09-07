#!/bin/sh

# Start nginx in background
nginx -g "daemon off;" &

# Start backend
/opt/app/bin -config /etc/app/config.json

# Keep container running
wait
