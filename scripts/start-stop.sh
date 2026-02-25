#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")/.."
SCRIPT_DIR="scripts"
PID_FILE="$SCRIPT_DIR/dev.pid"
LOG_FILE="$SCRIPT_DIR/dev.log"
PORT=3001
FORCE=false

show_help() {
    echo "Usage: ./scripts/start-stop.sh [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start     Start the local development server (Vite) on port $PORT"
    echo "  stop      Stop the running development server"
    echo "  restart   Stop and then start the development server"
    echo "  status    Check if the development server is currently running"
    echo "  --help    Show this help message"
    echo ""
    echo "Options:"
    echo "  -p, --port PORT    Override the default port (default: $PORT)"
    echo "  -f, --force        Force start by killing any process on the target port"
}

start_server() {
    # Check if the port is already in use by ANY process
    PORT_PID=$(lsof -t -i :$PORT)
    if [ ! -z "$PORT_PID" ]; then
        if [ "$FORCE" = true ]; then
            echo "Port $PORT is occupied by PID(s): $PORT_PID. Force killing..."
            echo "$PORT_PID" | xargs kill -9
            sleep 1
        else
            echo "Error: Port $PORT is already in use by PID(s): $PORT_PID."
            echo "Use --force or -f to kill the existing process and start."
            exit 1
        fi
    fi

    # Check for our specific PID file
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null; then
            echo "Server is already running (PID: $PID) at http://localhost:$PORT"
            exit 0
        else
            echo "Removing stale PID file..."
            rm "$PID_FILE"
        fi
    fi

    echo "Starting development server on port $PORT..."
    # Run vite in the background and redirect output to log file
    # Using --strictPort to ensure it doesn't jump to another port if busy
    npx vite --port $PORT --host localhost --strictPort > "$LOG_FILE" 2>&1 &
    
    NEW_PID=$!
    echo $NEW_PID > "$PID_FILE"
    
    # Give it a few seconds to initialize and check if it's actually listening
    echo "Verifying server is listening on port $PORT..."
    MAX_RETRIES=10
    RETRY_COUNT=0
    SUCCESS=false

    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        if lsof -t -i :$PORT > /dev/null; then
            SUCCESS=true
            break
        fi
        sleep 1
        ((RETRY_COUNT++))
    done
    
    if [ "$SUCCESS" = true ]; then
        echo "Server started successfully (PID: $NEW_PID)."
        echo "URL: http://localhost:$PORT"
        echo "Logs: $LOG_FILE"
    else
        echo "Error: Server process started but is not listening on port $PORT after $MAX_RETRIES seconds."
        echo "Check $LOG_FILE for details."
        # Clean up the process if it's still hanging around
        kill $NEW_PID 2>/dev/null
        rm "$PID_FILE"
        exit 1
    fi
}

stop_server() {
    if [ ! -f "$PID_FILE" ]; then
        echo "No PID file found. Is the server running?"
        exit 0
    fi

    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null; then
        echo "Stopping server (PID: $PID)..."
        kill $PID
        rm "$PID_FILE"
        echo "Server stopped."
    else
        echo "Server was not running (stale PID file removed)."
        rm "$PID_FILE"
    fi
}

show_status() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null; then
            echo "Status: RUNNING (PID: $PID)"
            echo "URL:    http://localhost:$PORT"
        else
            echo "Status: STOPPED (Stale PID file exists)"
        fi
    else
        # Also check if something else is on the port
        PORT_PID=$(lsof -t -i :$PORT)
        if [ ! -z "$PORT_PID" ]; then
            echo "Status: STOPPED (But port $PORT is occupied by PID: $PORT_PID)"
        else
            echo "Status: STOPPED"
        fi
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
