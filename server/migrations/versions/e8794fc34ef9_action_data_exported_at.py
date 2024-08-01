"""action_data_exported_at

Revision ID: e8794fc34ef9
Revises: f24a823213c5
Create Date: 2024-07-30 22:03:27.743842

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e8794fc34ef9"
down_revision = "f24a823213c5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "actions", sa.Column("data_exported_at", sa.DateTime(), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("actions", "data_exported_at")
    # ### end Alembic commands ###
