#!/bin/bash
# Start the API server in the background
cd "$(dirname "$0")/.."
PORT=3000 node server.js > scripts/api.log 2>&1 &
echo $! > scripts/api.pid
echo "API server started on port 3000 (PID: $!)"
