import datetime
from typing import Optional

from sqlalchemy.orm import Session
import logging

from src import MemberRole, Role, TowAirplane, Glider, Member, Action, FlightType, PayersType, PaymentMethod, TowType, \
    GliderOwner
from src.utils.enums import RoleId, ImportantMemberIds, AircraftTypeId, FlightTypeId, PayersTypeId

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
            type_: AircraftTypeId,
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
        member = Member(
            **creation_data
        )

        for role in roles:
            self.session.add(
                MemberRole(
                    member=member,
                    role=role,
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

    def _create_flight_type(self, **kwargs):
        flight_type = FlightType(**kwargs)
        self.session.add(flight_type)
        self.session.commit()
        return flight_type

    def _create_payers_type(self, **kwargs):
        payers_type = PayersType(**kwargs)
        self.session.add(payers_type)
        self.session.commit()
        return payers_type

    def _create_payment_method(self, **kwargs):
        payment_method = PaymentMethod(**kwargs)
        self.session.add(payment_method)
        self.session.commit()
        return payment_method

    def _create_tow_type(self, **kwargs):
        tow_type = TowType(**kwargs)
        self.session.add(tow_type)
        self.session.commit()
        return tow_type

    def create_seed_data(self):
        # If there is something in the database, don't create seed data
        if self.session.query(Role).count() > 0:
            logger.warning("Seed data already exists, skipping")
            return

        # Create Roles
        tow_pilot_role = self._create_role(id=RoleId.TowPilot.value, name="טייס גורר")
        field_responsible_role = self._create_role(id=RoleId.FieldResponsible.value, name="אחראי בשדה")
        responsible_cfi_role = self._create_role(id=RoleId.ResponsibleCFI.value, name="מדריך אחראי")
        maintenance_role = self._create_role(id=RoleId.Maintenance.value, name="אחזקה")
        private_pilot_license_role = self._create_role(id=RoleId.PrivatePilotLicense.value, name="טייס פרטי")
        cfi_role = self._create_role(id=RoleId.CFI.value, name="מדריך")
        not_certified_for_solo_paying_student_role = self._create_role(
            id=RoleId.NotCertifiedForSoloPayingStudent.value,
            name="סטודנט משלם לא מורשה סולו",
        )
        solo_student_role = self._create_role(id=RoleId.SoloStudent.value, name="סטודנט מורשה סולו")
        contact_role = self._create_role(id=RoleId.Contact.value, name="איש קשר")
        not_certified_for_solo_not_paying_student_role = self._create_role(
            id=RoleId.NotCertifiedForSoloNotPayingStudent.value,
            name="סטודנט לא משלם לא מורשה סולו",
        )
        observer_role = self._create_role(id=RoleId.Observer.value, name="מפקח")
        tester_role = self._create_role(id=RoleId.Tester.value, name="בוחן")

        # Create Members
        self._create_member(
            first_name="שילה",
            last_name="דיסקין",
            email="example1@email.com",
            phone_number="0501234567",
            roles=[not_certified_for_solo_paying_student_role, maintenance_role],
        )

        self._create_member(
            first_name="גיא",
            last_name="אפשטיין",
            email="example2@email.com",
            phone_number="0501234567",
            roles=[not_certified_for_solo_not_paying_student_role, maintenance_role],
        )

        self._create_member(
            first_name="דנה",
            last_name="כהן",
            email="example3@example.com",
            phone_number="0501234567",
            roles=[solo_student_role, maintenance_role],
        )

        self._create_member(
            first_name="אבירם",
            last_name="שלום",
            email="example4@example.com",
            phone_number="0501234567",
            roles=[private_pilot_license_role, field_responsible_role],
        )

        self._create_member(
            first_name="רוני",
            last_name="סמרה",
            email="example5@example.com",
            phone_number="0501234567",
            roles=[private_pilot_license_role, field_responsible_role],
        )

        member1 = self._create_member(
            first_name="דניאל",
            last_name="רגב",
            email="example6@example.com",
            phone_number="0501234567",
            roles=[responsible_cfi_role, private_pilot_license_role],
        )

        member2 = self._create_member(
            first_name="אלה",
            last_name="דניאלי",
            email="example7@example.com",
            phone_number="0501234567",
            roles=[tow_pilot_role],
        )

        member3 = self._create_member(
            first_name="דני",
            last_name="לוי",
            email="example8@example.com",
            phone_number="0501234567",
            roles=[tow_pilot_role, cfi_role, private_pilot_license_role],
        )

        self._create_member(
            first_name="אורי",
            last_name="כהן",
            email="example9@example.com",
            phone_number="0501234567",
            roles=[private_pilot_license_role, tow_pilot_role, cfi_role, observer_role],
        )

        self._create_member(
            first_name="מגדל",
            last_name="שדה",
            email="example10@example.com",
            phone_number="0501234567",
            roles=[contact_role],
        )

        self._create_member(
            first_name="בקרה",
            last_name="מרחבית",
            email="example11@example.com",
            phone_number="0507654321",
            roles=[contact_role],
        )

        self._create_member(
            first_name="עדי",
            last_name="אריאלי",
            email="example12@example.com",
            phone_number="0501234567",
            roles=[tester_role],
        )

        self._create_member(
            id_=ImportantMemberIds.MemberGuest.value,
            first_name="אורח",
            last_name="חבר",
            email="example13@example.com",
            phone_number="",
            roles=[],
        )

        self._create_member(
            id_=ImportantMemberIds.ClubGuest.value,
            first_name="אדמין",
            last_name="מועדון",
            email="example14@example.com",
            phone_number="",
            roles=[],
        )

        # Club single-seat glider
        self._create_glider(
            call_sign="4X-GAA",
            num_seats=1,
            type_=AircraftTypeId.SingleSeat.value,
            owners=[],
        )

        # Club two-seat glider
        self._create_glider(
            call_sign="4X-GAB",
            num_seats=2,
            type_=AircraftTypeId.DualSeat.value,
            owners=[],
        )

        # Private single-seat glider
        self._create_glider(
            call_sign="4X-GAC",
            num_seats=1,
            type_=AircraftTypeId.SingleSeat.value,
            owners=[member1],
        )

        # Private two-seat glider
        self._create_glider(
            call_sign="4X-GAD",
            num_seats=2,
            type_=AircraftTypeId.DualSeat.value,
            owners=[member2, member3],
        )

        # Touring glider
        self._create_glider(
            call_sign="4X-GME",
            num_seats=1,
            type_=AircraftTypeId.TouringGlider.value,
            owners=[member1, member3],
        )

        # Self-launching glider
        self._create_glider(
            call_sign="4X-GMF",
            num_seats=1,
            type_=AircraftTypeId.SelfLaunch.value,
            owners=[],
        )

        # Main tow plane
        self._create_tow_airplane(
            call_sign="4X-CAA",
            type=AircraftTypeId.MainTowAirplane.value,
        )

        # Secondary tow plane
        self._create_tow_airplane(
            call_sign="4X-CAB",
            type=AircraftTypeId.SecondaryTowAirplane.value,
        )

        # Action
        self._create_action(date=datetime.date(2021, 1, 1))

        self._create_action(date=datetime.date(2021, 1, 2))

        # Flight Types
        self._create_flight_type(id=FlightTypeId.ClubGuest.value, name="אורח מועדון")
        self._create_flight_type(id=FlightTypeId.MembersGuest.value, name="אורח חבר")
        self._create_flight_type(id=FlightTypeId.Solo.value, name="סולו")
        self._create_flight_type(id=FlightTypeId.Instruction.value, name="הדרכה")
        self._create_flight_type(id=FlightTypeId.Members.value, name="חברים")
        self._create_flight_type(id=FlightTypeId.InstructorsCourse.value, name="קורס מדריכים")

        # PayersType
        self._create_payers_type(id=PayersTypeId.FirstPilot.value, name="טייס ראשון")
        self._create_payers_type(id=PayersTypeId.SecondPilot.value, name="טייס שני")
        self._create_payers_type(id=PayersTypeId.BothPilots.value, name="שני הטייסים")
        self._create_payers_type(id=PayersTypeId.ThirdMember.value, name="צד שלישי")
        self._create_payers_type(id=PayersTypeId.NoPayment.value, name="ללא תשלום")
        self._create_payers_type(id=PayersTypeId.Guest.value, name="אורח")

        # PaymentMethod
        self._create_payment_method(name="מזומן")
        self._create_payment_method(name="אשראי")
        self._create_payment_method(name="ביט")

        # TowType
        self._create_tow_type(name="1500 מטוס")
        self._create_tow_type(name="2000 מטוס")
