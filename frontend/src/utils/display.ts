import {FlightState, FlightType, PayersType, PaymentMethod, TowType} from "./enums.ts";
import {
    GliderOwnerSchema,
    GliderSchema, MemberRoleSchema,
    MemberSchema, Role,
    TowAirplaneSchema,
} from "../lib/types.ts";

export function getFlightStateDisplayValue(state: FlightState): string {
    switch (state) {
        case FlightState.DRAFT:
            return "בהכנה"
        case FlightState.TOW:
            return "בגרירה"
        case FlightState.IN_FLIGHT:
            return "בטיסה"
        case FlightState.LANDED:
            return "לאחר נחיתה"
        default:
            throw new Error(`Unknown flight state: ${state}`)
    }
}

export function getFlightTypeDisplayValue(type: FlightType): string {
    switch (type) {
        case FlightType.Instruction:
            return "הדרכה"
        case FlightType.ClubGuest:
            return "אורח מועדון"
        case FlightType.MembersGuest:
            return "אורח חבר"
        case FlightType.Inspection:
            return "ביקורת"
        case FlightType.Members:
            return "חברים"
        case FlightType.InstructorsCourse:
            return "קורס מדריכים"
        case FlightType.Solo:
            return "סולו"
        default:
            throw new Error(`Unknown flight type: ${type}`)
    }
}


export function getPaymentMethodDisplayValue(paymentMethod: PaymentMethod) {
    switch (paymentMethod) {
        case PaymentMethod.Cash:
            return "מזומן"
        case PaymentMethod.CreditCard:
            return "אשראי"
        case PaymentMethod.Check:
            return "צ'ק"
        case PaymentMethod.Bit:
            return "ביט"
        default:
            throw new Error(`Unknown payment method: ${paymentMethod}`)
    }
}


export function getTowTypeDisplayValue(towType: TowType) {
    switch (towType) {
        case TowType.AIRPLANE_1000:
            return "מטוס 1000"
        case TowType.AIRPLANE_1500:
            return "מטוס 1500"
        case TowType.AIRPLANE_2000:
            return "מטוס 2000"
        case TowType.AIRPLANE_2500:
            return "מטוס 2500"
        case TowType.AIRPLANE_3000:
            return "מטוס 3000"
        default:
            throw new Error(`Unknown tow type: ${towType}`)
    }
}

export function getPayersTypeDisplayValue(payersType: PayersType) {
    switch (payersType) {
        case PayersType.BothPilots:
            return "שני הטייסים"
        case PayersType.SecondPilot:
            return "טייס משני"
        case PayersType.ThirdMember:
            return "חבר שלישי"
        case PayersType.FirstPilot:
            return "טייס ראשון"
        case PayersType.Guest:
            return "אורח"
        case PayersType.NoPayment:
            return "ללא תשלום"
        default:
            throw new Error(`Unknown payers type: ${payersType}`)
    }
}

export function getMemberDisplayValue(
    member: MemberSchema,
    roles: MemberRoleSchema[] = [],
    long = false,
) {
    const fullName = `${member.first_name} ${member.last_name}`
    return long
        ? `${fullName} (${roles.map(role => getRoleDisplayValue(role.role)).join(", ")})`
        : fullName
}


export function getRoleDisplayValue(role: Role) {
    switch (role) {
        case "TowPilot":
            return "טייס גורר"
        case "FieldResponsible":
            return "אחראי בשדה"
        case "ResponsibleCFI":
            return "מדריך אחראי"
        case "Maintenance":
            return "תורן אחזקה"
        case "PrivatePilotLicense":
            return "טייס פרטי"
        case "NotCertifiedForSoloPayingStudent":
            return "חניך לפני סולו"
        case "SoloStudent":
            return "סוליסט"
        case "Contact":
            return "איש קשר"
        case "NotCertifiedForSoloNotPayingStudent":
            return "חניך לפני סולו - לא משלם"
        case "Observer":
            return "מדווח פעולה"
        case "Tester":
            return "בוחן"
        default:
            throw new Error(`Unknown role: ${role}`)
    }
}

/**
 * Returns the display value of a glider
 * @param glider - The glider to display
 * @param ownerships - The ownerships of the glider
 * @param long - Whether to return a long display value
 */
export function getGliderDisplayValue(
    glider: GliderSchema,
    ownerships: GliderOwnerSchema[],
    long = false,
) {
    const numSeats = glider.num_seats > 1 ? `דו-מושבי` : `חד מושבי`;
    const ownership = ownerships.length > 0 ? "פרטי" : "מועדון";

    return long
        ? `${glider.call_sign} (${numSeats}/${ownership})`
        : glider.call_sign
}

export function getTowAirplaneDisplayValue(towAirplane: TowAirplaneSchema) {
    return towAirplane.call_sign
}
