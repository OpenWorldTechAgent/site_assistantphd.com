#!/bin/bash

# Simple shell wrapper to run the waitlist listing script
# Usage: ./scripts/list-waitlist.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
node "$SCRIPT_DIR/list-waitlist.js"
