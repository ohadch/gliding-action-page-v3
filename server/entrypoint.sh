#!/bin/bash

set -e

# If mode is server, then start the server
if [ "$MODE" = "server" ]; then
  # Migrate if MIGRATE_ON_STARTUP is set to true
    if [ "$MIGRATE_ON_START" = true ]; then
        echo "Migrating database..."
        make migrate
    fi

    echo "Starting server..."
    python main.py
elif [ "$MODE" = "backup_cron" ]; then
    echo "Starting backup cron..."

    # Copy crontab file to cron.d directory
    echo "$BACKUP_CRON_SCHEDULE /usr/bin/python /app/backup.py" > /etc/cron.d/backup_cron

    # Give execute permissions
    chmod 0644 /etc/cron.d/backup_cron

    # Apply the cron job
    crontab /etc/cron.d/backup_cron

    # Start cron in foreground
    cron -f
else
    echo "Invalid mode. Exiting..."
    exit 1
fi

# Start the server
echo "Starting server..."
python main.py
