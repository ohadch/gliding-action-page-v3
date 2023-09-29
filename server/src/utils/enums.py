import enum


class GliderType(enum.Enum):
    Regular = "regular"
    Touring = "touring"
    SelfLaunch = "self_launch"


class PayersType(enum.Enum):
    NoPayment = "NoPayment"
    FirstPilot = "FirstPilot"
    Guest = "Guest"
    BothPilots = "BothPilots"
    SecondPilot = "SecondPilot"
    ThirdMember = "ThirdMember"


class FlightType(enum.Enum):
    Instruction = "Instruction"
    ClubGuest = "ClubGuest"
    MembersGuest = "MembersGuest"
    Inspection = "Inspection"
    Members = "Members"
    InstructorsCourse = "InstructorsCourse"
    Solo = "Solo"


class Role(enum.Enum):
    TowPilot = "TowPilot"
    FieldResponsible = "FieldResponsible"
    ResponsibleCFI = "ResponsibleCFI"
    Maintenance = "Maintenance"
    PrivatePilotLicense = "PrivatePilotLicense"
    CFI = "CFI"
    NotCertifiedForSoloPayingStudent = "NotCertifiedForSoloPayingStudent"
    SoloStudent = "SoloStudent"
    Contact = "Contact"
    NotCertifiedForSoloNotPayingStudent = "NotCertifiedForSoloNotPayingStudent"
    Observer = "Observer"
    Tester = "Tester"


class PaymentMethod(enum.Enum):
    Cash = "Cash"
    Check = "Check"
    CreditCard = "CreditCard"
    Bit = "Bit"


class FlightState(enum.Enum):
    Draft = "Draft"
    Tow = "Tow"
    Inflight = "Inflight"
    Landed = "Landed"


class NotificationMethod(enum.Enum):
    CONSOLE = "console"
    EMAIL = "email"


class NotificationState(enum.Enum):
    PENDING = "pending"
    BEING_HANDLED = "being_handled"
    SENT = "sent"
    FAILED = "failed"


class EventType(enum.Enum):
    FLIGHT_LANDED = "flight_landed"
    FLIGHT_TOOK_OFF = "flight_took_off"
    FLIGHT_TOW_RELEASED = "flight_tow_released"
    ACTION_CLOSED = "action_closed"
    RESPONSIBLE_CFI_ASSIGNED = "responsible_cfi_assigned"
    FIELD_RESPONSIBLE_ASSIGNED = "field_responsible_assigned"
    TOW_AIRPLANE_ACTIVATED = "tow_airplane_activated"
    TOW_AIRPLANE_DEACTIVATED = "tow_airplane_deactivated"


class EventState(enum.Enum):
    PENDING = "pending"
    BEING_HANDLED = "being_handled"
    HANDLED = "handled"
    FAILED = "failed"


class NotificationType(enum.Enum):
    FlightSummaryForPilot = "FlightSummaryForPilot"
    DailySummaryForObserver = "DailySummaryForObserver"
    DailySummaryForTowPilot = "DailySummaryForTowPilot"
    DailySummaryForCfi = "DailySummaryForCfi"


class Language(enum.Enum):
    Hebrew = "he"
    English = "en"


class TowType(enum.Enum):
    AIRPLANE_1000 = "AIRPLANE_1000"
    AIRPLANE_1500 = "AIRPLANE_1500"
    AIRPLANE_2000 = "AIRPLANE_2000"
    AIRPLANE_2500 = "AIRPLANE_2500"
    AIRPLANE_3000 = "AIRPLANE_3000"
    AIRPLANE_3500 = "AIRPLANE_3500"
