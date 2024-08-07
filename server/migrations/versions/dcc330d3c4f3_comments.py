"""comments

Revision ID: dcc330d3c4f3
Revises: e8794fc34ef9
Create Date: 2024-08-02 12:34:14.627612

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "dcc330d3c4f3"
down_revision = "e8794fc34ef9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "comments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("action_id", sa.Integer(), nullable=False),
        sa.Column("flight_id", sa.Integer(), nullable=True),
        sa.Column("text", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(
            ["action_id"],
            ["actions.id"],
        ),
        sa.ForeignKeyConstraint(
            ["author_id"],
            ["members.id"],
        ),
        sa.ForeignKeyConstraint(
            ["flight_id"],
            ["flights.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_comments_id"), "comments", ["id"], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_comments_id"), table_name="comments")
    op.drop_table("comments")
    # ### end Alembic commands ###
