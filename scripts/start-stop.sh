#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")/.."
SCRIPT_DIR="scripts"
PID_FILE="$SCRIPT_DIR/dev.pid"
LOG_FILE="$SCRIPT_DIR/dev.log"
API_PID_FILE="$SCRIPT_DIR/api.pid"
API_LOG_FILE="$SCRIPT_DIR/api.log"
PORT=3001
API_PORT=3000
FORCE=false

show_help() {
    echo "Usage: ./scripts/start-stop.sh [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start     Start the Vite server (port $PORT) and API server (port $API_PORT)"
    echo "  stop      Stop both servers"
    echo "  restart   Restart both servers"
    echo "  status    Check status of both servers"
    echo "  logs      Tail Vite logs"
    echo "  api-logs  Tail API logs"
    echo "  --help    Show this help message"
}

start_server() {
    # Check if ports are already in use
    for p in $PORT $API_PORT; do
        PORT_PID=$(lsof -t -i :$p)
        if [ ! -z "$PORT_PID" ]; then
            if [ "$FORCE" = true ]; then
                echo "Port $p is occupied. Force killing PID(s): $PORT_PID..."
                echo "$PORT_PID" | xargs kill -9
                sleep 1
            else
                echo "Error: Port $p is already in use by PID(s): $PORT_PID. Use --force."
                exit 1
            fi
        fi
    done

    # Start API Server
    echo "Starting API server on port $API_PORT..."
    PORT=$API_PORT node server.js > "$API_LOG_FILE" 2>&1 &
    echo $! > "$API_PID_FILE"

    # Start Vite Server
    echo "Starting Vite server on port $PORT..."
    npx vite --port $PORT --host localhost --strictPort > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    
    echo "Servers started successfully."
    echo "Frontend: http://localhost:$PORT"
    echo "API:      http://localhost:$API_PORT"
}

stop_server() {
    for f in "$PID_FILE" "$API_PID_FILE"; do
        if [ -f "$f" ]; then
            PID=$(cat "$f")
            if ps -p $PID > /dev/null; then
                echo "Stopping process $PID..."
                kill $PID
            fi
            rm "$f"
        fi
    done
    echo "Servers stopped."
}

show_status() {
    if [ -f "$PID_FILE" ] && ps -p $(cat "$PID_FILE") > /dev/null; then
        echo "Vite:  RUNNING (PID: $(cat "$PID_FILE")) on http://localhost:$PORT"
    else
        echo "Vite:  STOPPED"
    fi

    if [ -f "$API_PID_FILE" ] && ps -p $(cat "$API_PID_FILE") > /dev/null; then
        echo "API:   RUNNING (PID: $(cat "$API_PID_FILE")) on http://localhost:$API_PORT"
    else
        echo "API:   STOPPED"
    fi
}

# Parse arguments
COMMAND=$1
shift

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -p|--port) PORT="$2"; shift ;;
        -f|--force) FORCE=true ;;
        *) echo "Unknown option: $1"; show_help; exit 1 ;;
    esac
    shift
done

case $COMMAND in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        start_server
        ;;
    status)
        show_status
        ;;
    logs)
        if [ -f "$LOG_FILE" ]; then
            echo "Tailing logs from $LOG_FILE (Ctrl+C to stop)..."
            tail -f "$LOG_FILE"
        else
            echo "Error: Log file not found at $LOG_FILE"
            exit 1
        fi
        ;;
    api-logs)
        if [ -f "$API_LOG_FILE" ]; then
            echo "Tailing API logs from $API_LOG_FILE (Ctrl+C to stop)..."
            tail -f "$API_LOG_FILE"
        else
            echo "Error: API log file not found at $API_LOG_FILE"
            exit 1
        fi
        ;;
    --help|help)
        show_help
        ;;
    *)
        if [ -z "$COMMAND" ]; then
            show_help
        else
            echo "Error: Unknown command '$COMMAND'"
            show_help
            exit 1
        fi
        ;;
esac
