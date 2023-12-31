"""notification_originator_event

Revision ID: f4e0463d3326
Revises: d7075cbab65b
Create Date: 2023-09-30 10:29:29.777110

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f4e0463d3326"
down_revision = "d7075cbab65b"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "notifications", sa.Column("originator_event_id", sa.Integer(), nullable=True)
    )
    op.create_foreign_key(
        None, "notifications", "events", ["originator_event_id"], ["id"]
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "notifications", type_="foreignkey")
    op.drop_column("notifications", "originator_event_id")
    # ### end Alembic commands ###
