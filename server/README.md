# Gliding Action Management Server

This is the admin server for the action management system.
It is a FastAPI application that provides a REST API for managing the flight school data.


## Preparing the Development Environment

### Prerequisites

- Python 3.11
- postgres server running

### Installing Dependencies
```bash
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
pre-commit install
```

### Configuring environment variables

Copy the `.env.example` file to `.env` and edit the values as needed.


### Setting up the Database

Apply the migrations to the database:

```bash
make migrate
```

### Running the Server

```bash
python main.py
```
