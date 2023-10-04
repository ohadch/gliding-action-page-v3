# Gliding Action Management

A system for managing gliding actions.

<img width="1542" alt="image" src="https://github.com/ohadch/gliding-action-page-v3/assets/17769668/8e4832d6-7f92-499b-9067-bfbf79d40340">

## Local Development

### Prepare the local machine

Run the DB:
```bash
docker-compose -f docker-compose.yml up -d db
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

### Run the project

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
