import {FlightState} from "./enums.ts";
import {
    GliderSchema,
    MemberSchema,
    PayersTypeSchema,
    PaymentMethodSchema,
    TowAirplaneSchema,
    TowTypeSchema
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


export function getMemberDisplayName(member: MemberSchema) {
    return `${member.first_name} ${member.last_name}`
}

export function getGliderDisplayValue(glider: GliderSchema) {
    return glider.call_sign
}

export function getTowAirplaneDisplayValue(towAirplane: TowAirplaneSchema) {
    return towAirplane.call_sign
}

export function getTowTypeDisplayValue(towType: TowTypeSchema) {
    return towType.name
}

export function getPayersTypeDisplayValue(payersType: PayersTypeSchema) {
    return payersType.name
}

export function getPaymentMethodDisplayValue(paymentMethod: PaymentMethodSchema) {
    return paymentMethod.name
}
