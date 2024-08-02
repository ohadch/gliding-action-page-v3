"""event_is_deleted_column

Revision ID: f24a823213c5
Revises: cc263ebd9333
Create Date: 2024-07-19 18:33:47.694457

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f24a823213c5"
down_revision = "cc263ebd9333"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("events", sa.Column("is_deleted", sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("events", "is_deleted")
    # ### end Alembic commands ###