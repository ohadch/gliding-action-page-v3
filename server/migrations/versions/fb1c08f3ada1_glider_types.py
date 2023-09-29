"""glider_types

Revision ID: fb1c08f3ada1
Revises: a936f8976e5b
Create Date: 2023-09-29 09:23:31.128956

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "fb1c08f3ada1"
down_revision = "a936f8976e5b"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("tow_airplanes", "type")
    op.drop_column("gliders", "type")
    op.add_column("gliders", sa.Column("type", sa.String(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "tow_airplanes",
        sa.Column("type", sa.INTEGER(), autoincrement=False, nullable=False),
    )
    op.drop_column("gliders", "type")
    op.add_column(
        "gliders", sa.Column("type", sa.INTEGER(), autoincrement=False, nullable=False)
    )
    # ### end Alembic commands ###
