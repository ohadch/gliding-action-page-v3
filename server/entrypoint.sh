#!/bin/bash

set -e

# Migrate if MIGRATE_ON_STARTUP is set to true
if [ "$MIGRATE_ON_START" = true ]; then
    echo "Migrating database..."
    make migrate
fi

# Start the server
echo "Starting server..."
python main.py
