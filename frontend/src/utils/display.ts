import {
    FlightType,
    GliderOwnerSchema,
    GliderSchema, GliderType, MemberRoleSchema,
    MemberSchema, PayersType, PaymentMethod, Role,
    TowAirplaneSchema, TowType,
} from "../lib/types.ts";


export function getFlightTypeDisplayValue(type: FlightType): string {
    switch (type) {
        case "Instruction":
            return "הדרכה"
        case "ClubGuest":
            return "אורח מועדון"
        case "MembersGuest":
            return "אורח חבר"
        case "Inspection":
            return "ביקורת"
        case "Members":
            return "חברים"
        case "InstructorsCourse":
            return "קורס מדריכים"
        case "Solo":
            return "סולו"
        default:
            throw new Error(`Unknown flight type: ${type}`)
    }
}


export function getPaymentMethodDisplayValue(paymentMethod: PaymentMethod) {
    switch (paymentMethod) {
        case "Cash":
            return "מזומן"
        case "CreditCard":
            return "אשראי"
        case "Check":
            return "צ'ק"
        case "Bit":
            return "ביט"
        default:
            throw new Error(`Unknown payment method: ${paymentMethod}`)
    }
}

export function getTowTypeDisplayValue(towType: TowType) {
    switch (towType) {
        case "AIRPLANE_1000":
            return "מטוס 1000"
        case "AIRPLANE_1500":
            return "מטוס 1500"
        case "AIRPLANE_2000":
            return "מטוס 2000"
        case "AIRPLANE_2500":
            return "מטוס 2500"
        case "AIRPLANE_3000":
            return "מטוס 3000"
        case "AIRPLANE_3500":
            return "מטוס 3500"
        default:
            throw new Error(`Unknown tow type: ${towType}`)
    }
}

export function getPayersTypeDisplayValue(payersType: PayersType) {
    switch (payersType) {
        case "BothPilots":
            return "שני הטייסים"
        case "SecondPilot":
            return "טייס שני"
        case "ThirdMember":
            return "חבר שלישי"
        case "FirstPilot":
            return "טייס ראשון"
        case "Guest":
            return "אורח"
        case "NoPayment":
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
    if (!long || roles.length === 0) {
        return fullName
    }

    const rolesStr = roles.map(role => getRoleDisplayValue(role.role))
        .sort((a, b) => a.localeCompare(b))
        .join(", ")

    return `${fullName} (${rolesStr})`
}


export function getRoleDisplayValue(role: Role) {
    switch (role) {
        case "TowPilot":
            return "טייס גורר"
        case "FieldResponsible":
            return "אחראי בשדה"
        case "ResponsibleCFI":
            return "מדריך אחראי"
        case "CFI":
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


export function getGliderTypeDisplayValue(type: GliderType) {
    switch (type) {
        case "regular":
            return "רגיל"
        case "self_launch":
            return "מתאים להמראה עצמית"
        case "touring":
            return "טורינג"
        default:
            throw new Error(`Unknown glider type: ${type}`)
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
    ownerships?: GliderOwnerSchema[],
    long = false,
) {
    const numSeats = glider.num_seats > 1 ? `דו-מושבי` : `חד מושבי`;
    const ownership = ownerships && ownerships.length > 0 ? "פרטי" : "מועדון";

    const longSegments = [numSeats, ownership]

    if (glider.type !== "regular") {
        longSegments.push(getGliderTypeDisplayValue(glider.type))
    }

    const longStr = longSegments.join("/")

    return long && ownerships
        ? `${glider.call_sign} (${longStr})`
        : glider.call_sign
}

export function getTowAirplaneDisplayValue(towAirplane: TowAirplaneSchema) {
    return towAirplane.call_sign
}
