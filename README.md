# Gliding Action Management

A system for managing gliding actions.

<img width="1725" alt="image" src="https://github.com/ohadch/gliding-action-page-v3/assets/17769668/b4a696e5-712d-4834-b25c-def4ddeb4c30">

## Setup Development Environment

First, create a `./server/.env` file based on the `./server/.env.example` file.

### Using Docker Compose

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Local Environment

Run the DB:
```bash
docker-compose -f docker-compose.dev.yml up -d db
```

Install the server's env:
```
cd server

# Create a .env based on the .env.example file and connect it to the db
cp .env.example .env

# Install the virtualenv
python3.11 -m virtualenv venv
source venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt

# Migrate
make migrate
```

Install the frontend env:
```bash
# Install the frontend's env
cd frontend && yarn
```

Run the frontend:

```bash
cd frontend
yarn dev
```

Run the server:
```
cd server
source venv/bin/activate
python main.py
```

### Migrations

```bash
# The migrations are declared in the server folder.
cd server

# Create migrations
make makemigrations message="Some migration message"

# Migrate
make migrate

# Rollback last migration
make rollback
```


## Deployment

### Configure HTTPS

To configure HTTPS, you need to create a certificate and key file and place them in the `server/certs` folder.

Please note that `*.key` and `*.crt` files are ignored by git.
