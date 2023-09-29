"""add_action_to_event_and_notification

Revision ID: d7075cbab65b
Revises: 3e2080d725ff
Create Date: 2023-09-29 14:47:27.966138

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d7075cbab65b"
down_revision = "3e2080d725ff"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("events", sa.Column("action_id", sa.Integer(), nullable=False))
    op.create_foreign_key(None, "events", "actions", ["action_id"], ["id"])
    op.add_column("notifications", sa.Column("action_id", sa.Integer(), nullable=False))
    op.create_foreign_key(None, "notifications", "actions", ["action_id"], ["id"])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "notifications", type_="foreignkey")
    op.drop_column("notifications", "action_id")
    op.drop_constraint(None, "events", type_="foreignkey")
    op.drop_column("events", "action_id")
    # ### end Alembic commands ###