makemigrations:
	alembic revision --autogenerate -m "$(name)"

migrate:
	alembic upgrade head

rollback:
	alembic downgrade -1

create-seed-data:
	python cli.py create-seed-data
