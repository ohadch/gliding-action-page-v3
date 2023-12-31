"""first_migration

Revision ID: db4503f2e91a
Revises:
Create Date: 2023-09-23 15:25:58.750970

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "db4503f2e91a"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "gliders",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("call_sign", sa.String(), nullable=False),
        sa.Column("num_seats", sa.Integer(), nullable=False),
        sa.Column("type", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_gliders_id"), "gliders", ["id"], unique=False)
    op.create_table(
        "members",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("first_name", sa.String(), nullable=False),
        sa.Column("last_name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("phone_number", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index(op.f("ix_members_id"), "members", ["id"], unique=False)
    op.create_table(
        "tow_airplanes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("call_sign", sa.String(), nullable=False),
        sa.Column("type", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_tow_airplanes_id"), "tow_airplanes", ["id"], unique=False)
    op.create_table(
        "actions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("date", sa.DateTime(), nullable=False),
        sa.Column("closed_at", sa.DateTime(), nullable=True),
        sa.Column("field_responsible_id", sa.Integer(), nullable=True),
        sa.Column("responsible_cfi_id", sa.Integer(), nullable=True),
        sa.Column("instruction_glider_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["field_responsible_id"],
            ["members.id"],
        ),
        sa.ForeignKeyConstraint(
            ["instruction_glider_id"],
            ["gliders.id"],
        ),
        sa.ForeignKeyConstraint(
            ["responsible_cfi_id"],
            ["members.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_actions_id"), "actions", ["id"], unique=False)
    op.create_table(
        "gliders_owners",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("glider_id", sa.Integer(), nullable=False),
        sa.Column("member_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["glider_id"],
            ["gliders.id"],
        ),
        sa.ForeignKeyConstraint(
            ["member_id"],
            ["members.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_gliders_owners_id"), "gliders_owners", ["id"], unique=False
    )
    op.create_table(
        "members_roles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("member_id", sa.Integer(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["member_id"],
            ["members.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_members_roles_id"), "members_roles", ["id"], unique=False)
    op.create_table(
        "active_tow_airplanes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("action_id", sa.Integer(), nullable=False),
        sa.Column("tow_pilot_id", sa.Integer(), nullable=False),
        sa.Column("airplane_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["action_id"],
            ["actions.id"],
        ),
        sa.ForeignKeyConstraint(
            ["airplane_id"],
            ["tow_airplanes.id"],
        ),
        sa.ForeignKeyConstraint(
            ["tow_pilot_id"],
            ["members.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_active_tow_airplanes_id"), "active_tow_airplanes", ["id"], unique=False
    )
    op.create_table(
        "flights",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("action_id", sa.Integer(), nullable=False),
        sa.Column("take_off_at", sa.DateTime(), nullable=True),
        sa.Column("landing_at", sa.DateTime(), nullable=True),
        sa.Column("glider_id", sa.Integer(), nullable=False),
        sa.Column("pilot_1_id", sa.Integer(), nullable=True),
        sa.Column("pilot_2_id", sa.Integer(), nullable=True),
        sa.Column("tow_airplane_id", sa.Integer(), nullable=True),
        sa.Column("tow_pilot_id", sa.Integer(), nullable=True),
        sa.Column("tow_type", sa.String(), nullable=True),
        sa.Column("flight_type", sa.String(), nullable=True),
        sa.Column("payers_type", sa.String(), nullable=True),
        sa.Column("payment_method", sa.String(), nullable=True),
        sa.Column("payment_receiver_id", sa.Integer(), nullable=True),
        sa.Column("paying_member_id", sa.Integer(), nullable=True),
        sa.Column("state", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["action_id"],
            ["actions.id"],
        ),
        sa.ForeignKeyConstraint(
            ["glider_id"],
            ["gliders.id"],
        ),
        sa.ForeignKeyConstraint(
            ["paying_member_id"],
            ["members.id"],
        ),
        sa.ForeignKeyConstraint(
            ["payment_receiver_id"],
            ["members.id"],
        ),
        sa.ForeignKeyConstraint(
            ["pilot_1_id"],
            ["members.id"],
        ),
        sa.ForeignKeyConstraint(
            ["pilot_2_id"],
            ["members.id"],
        ),
        sa.ForeignKeyConstraint(
            ["tow_airplane_id"],
            ["tow_airplanes.id"],
        ),
        sa.ForeignKeyConstraint(
            ["tow_pilot_id"],
            ["members.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_flights_id"), "flights", ["id"], unique=False)
    op.create_table(
        "emails",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("sent_at", sa.DateTime(), nullable=False),
        sa.Column("recipient_member_id", sa.Integer(), nullable=False),
        sa.Column("flight_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["flight_id"],
            ["flights.id"],
        ),
        sa.ForeignKeyConstraint(
            ["recipient_member_id"],
            ["members.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_emails_id"), "emails", ["id"], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_emails_id"), table_name="emails")
    op.drop_table("emails")
    op.drop_index(op.f("ix_flights_id"), table_name="flights")
    op.drop_table("flights")
    op.drop_index(op.f("ix_active_tow_airplanes_id"), table_name="active_tow_airplanes")
    op.drop_table("active_tow_airplanes")
    op.drop_index(op.f("ix_members_roles_id"), table_name="members_roles")
    op.drop_table("members_roles")
    op.drop_index(op.f("ix_gliders_owners_id"), table_name="gliders_owners")
    op.drop_table("gliders_owners")
    op.drop_index(op.f("ix_actions_id"), table_name="actions")
    op.drop_table("actions")
    op.drop_index(op.f("ix_tow_airplanes_id"), table_name="tow_airplanes")
    op.drop_table("tow_airplanes")
    op.drop_index(op.f("ix_members_id"), table_name="members")
    op.drop_table("members")
    op.drop_index(op.f("ix_gliders_id"), table_name="gliders")
    op.drop_table("gliders")
    # ### end Alembic commands ###
