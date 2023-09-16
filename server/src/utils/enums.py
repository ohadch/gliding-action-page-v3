import enum


class AircraftTypeId(enum.Enum):
    TouringGlider = 1
    SelfLaunch = 2
    DualSeat = 3
    SingleSeat = 4
    MainTowAirplane = 5
    SecondaryTowAirplane = 6


class PayersTypeId(enum.Enum):
    NoPayment = 1
    FirstPilot = 2
    Guest = 3
    BothPilots = 4
    SecondPilot = 5
    ThirdMember = 6


class FlightTypeId(enum.Enum):
    Instruction = 1
    ClubGuest = 2
    MembersGuest = 3
    Inspection = 4
    Members = 5
    InstructorsCourse = 6
    Solo = 7
    EnginedTower = 8


class RoleId(enum.Enum):
    TowPilot = 1
    FieldResponsible = 2
    ResponsibleCFI = 3
    Maintenance = 4
    PrivatePilotLicense = 5
    CFI = 6
    NotCertifiedForSoloPayingStudent = 7
    SoloStudent = 8
    Contact = 9
    NotCertifiedForSoloNotPayingStudent = 10
    Observer = 11
    Tester = 12


class ImportantMemberIds(enum.Enum):
    ClubGuest = 1951
    MemberGuest = 1952


class FlightStatus(enum.Enum):
    Draft = "Draft"
    Tow = "Tow"
    Inflight = "Inflight"
    Landed = "Landed"
