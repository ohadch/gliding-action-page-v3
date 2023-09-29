import datetime
from typing import Optional

from sqlalchemy.orm import Session
import logging

from src import MemberRole, TowAirplane, Glider, Member, Action, GliderOwner
from src.utils.enums import Role, GliderType

logger = logging.getLogger(__name__)


class SeedDataGenerator:
    def __init__(self, session: Session):
        self.session = session

    def _create_role(self, **kwargs):
        role = Role(**kwargs)
        self.session.add(role)
        self.session.commit()
        return role

    def _create_tow_airplane(self, **kwargs):
        tow_airplane = TowAirplane(**kwargs)
        self.session.add(tow_airplane)
        self.session.commit()
        return tow_airplane

    def _create_glider(
        self,
        call_sign: str,
        num_seats: int,
        type_: GliderType,
        owners: list[Member],
        id_: Optional[int] = None,
    ):
        creation_data = {
            k: v
            for k, v in dict(
                id=id_,
                call_sign=call_sign,
                num_seats=num_seats,
                type=type_,
            ).items()
            if v is not None
        }

        glider = Glider(**creation_data)

        for owner in owners:
            self.session.add(
                GliderOwner(
                    member=owner,
                    glider=glider,
                )
            )

        self.session.add(glider)
        self.session.commit()
        return glider

    def _create_member(
        self,
        first_name: str,
        last_name: str,
        email: str,
        phone_number: str,
        roles: list[Role],
        id_: Optional[int] = None,
    ):
        creation_data = {
            k: v
            for k, v in dict(
                id=id_,
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone_number=phone_number,
            ).items()
            if v is not None
        }
        member = Member(**creation_data)

        for role in roles:
            self.session.add(
                MemberRole(
                    member=member,
                    role=role.value,
                )
            )

        self.session.add(member)
        self.session.commit()
        return member

    def _create_action(self, **kwargs):
        action = Action(**kwargs)
        self.session.add(action)
        self.session.commit()
        return action

    def create_seed_data(self):
        # If there is something in the database, don't create seed data
        if self.session.query(Member).count() > 0:
            logger.warning("Seed data already exists, skipping")
            return

        # Create Members
        self._create_member(
            first_name="שילה",
            last_name="דיסקין",
            email="example1@email.com",
            phone_number="0501234567",
            roles=[Role.NotCertifiedForSoloPayingStudent, Role.Maintenance],
        )

        self._create_member(
            first_name="גיא",
            last_name="אפשטיין",
            email="example2@email.com",
            phone_number="0501234567",
            roles=[Role.NotCertifiedForSoloNotPayingStudent, Role.Maintenance],
        )

        self._create_member(
            first_name="דנה",
            last_name="כהן",
            email="example3@example.com",
            phone_number="0501234567",
            roles=[Role.SoloStudent, Role.Maintenance],
        )

        self._create_member(
            first_name="אבירם",
            last_name="שלום",
            email="example4@example.com",
            phone_number="0501234567",
            roles=[Role.PrivatePilotLicense, Role.FieldResponsible],
        )

        self._create_member(
            first_name="רוני",
            last_name="סמרה",
            email="example5@example.com",
            phone_number="0501234567",
            roles=[Role.PrivatePilotLicense, Role.FieldResponsible],
        )

        member1 = self._create_member(
            first_name="דניאל",
            last_name="רגב",
            email="example6@example.com",
            phone_number="0501234567",
            roles=[Role.ResponsibleCFI],
        )

        member2 = self._create_member(
            first_name="אלה",
            last_name="דניאלי",
            email="example7@example.com",
            phone_number="0501234567",
            roles=[Role.TowPilot],
        )

        member3 = self._create_member(
            first_name="דני",
            last_name="לוי",
            email="example8@example.com",
            phone_number="0501234567",
            roles=[Role.TowPilot, Role.CFI, Role.PrivatePilotLicense],
        )

        self._create_member(
            first_name="אורי",
            last_name="כהן",
            email="example9@example.com",
            phone_number="0501234567",
            roles=[Role.PrivatePilotLicense, Role.TowPilot, Role.CFI, Role.Observer],
        )

        self._create_member(
            first_name="מגדל",
            last_name="שדה",
            email="example10@example.com",
            phone_number="0501234567",
            roles=[Role.Contact],
        )

        self._create_member(
            first_name="בקרה",
            last_name="מרחבית",
            email="example11@example.com",
            phone_number="0507654321",
            roles=[Role.Contact],
        )

        self._create_member(
            first_name="עדי",
            last_name="אריאלי",
            email="example12@example.com",
            phone_number="0501234567",
            roles=[Role.Tester],
        )

        # Club single-seat glider
        self._create_glider(
            call_sign="4X-GAA",
            num_seats=1,
            type_=GliderType.Regular.value,
            owners=[],
        )

        # Club two-seat glider
        self._create_glider(
            call_sign="4X-GAB",
            num_seats=2,
            type_=GliderType.Regular.value,
            owners=[],
        )

        # Private single-seat glider
        self._create_glider(
            call_sign="4X-GAC",
            num_seats=1,
            type_=GliderType.Regular.value,
            owners=[member1],
        )

        # Private two-seat glider
        self._create_glider(
            call_sign="4X-GAD",
            num_seats=2,
            type_=GliderType.Regular.value,
            owners=[member2, member3],
        )

        # Touring glider
        self._create_glider(
            call_sign="4X-GME",
            num_seats=1,
            type_=GliderType.Touring.value,
            owners=[member1, member3],
        )

        # Self-launching glider
        self._create_glider(
            call_sign="4X-GMF",
            num_seats=1,
            type_=GliderType.SelfLaunch.value,
            owners=[],
        )

        # Main tow plane
        self._create_tow_airplane(
            call_sign="4X-CAA",
        )

        # Secondary tow plane
        self._create_tow_airplane(
            call_sign="4X-CAB",
        )

        # Action
        self._create_action(date=datetime.date(2021, 1, 1))

        self._create_action(date=datetime.date(2021, 1, 2))
