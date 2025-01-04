#!/bin/bash

set -e

BACKUP_CRON_SCHEDULE=${BACKUP_CRON_SCHEDULE:-"*/10 * * * *"}

echo "Starting backup cron with schedule: $BACKUP_CRON_SCHEDULE"

# Create crontab file
echo "$BACKUP_CRON_SCHEDULE python3 /app/backup.py >> /var/log/cron.log 2>&1" > /etc/cron.d/backup_cron

# Give execute permissions
chmod 0644 /etc/cron.d/backup_cron

# Apply the cron job
crontab /etc/cron.d/backup_cron

# Start cron in foreground
cron -f
