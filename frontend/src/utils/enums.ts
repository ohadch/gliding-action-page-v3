export enum FlightState {
    DRAFT = "DRAFT",
    TOW = "TOW",
    IN_FLIGHT = "IN_FLIGHT",
    LANDED = "LANDED",
}


export enum PayersType {
    NoPayment = "NoPayment",
    FirstPilot = "FirstPilot",
    Guest = "Guest",
    BothPilots = "BothPilots",
    SecondPilot = "SecondPilot",
    ThirdMember = "ThirdMember",
}

export enum PaymentMethod {
    Cash = "Cash",
    CreditCard = "CreditCard",
    Check = "Check",
    Bit = "Bit",
}

export enum FlightType {
    Instruction = "Instruction",
    ClubGuest = "ClubGuest",
    MembersGuest = "MembersGuest",
    Inspection = "Inspection",
    Members = "Members",
    InstructorsCourse = "InstructorsCourse",
    Solo = "Solo",
    EnginedTower = "EnginedTower",
}

export enum TowType {
    AIRPLANE_1000 = "AIRPLANE_1000",
    AIRPLANE_1500 = "AIRPLANE_1500",
    AIRPLANE_2000 = "AIRPLANE_2000",
    AIRPLANE_2500 = "AIRPLANE_2500",
    AIRPLANE_3000 = "AIRPLANE_3000",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEnumValue<T>(enumType: any, value: string): T {
    if (enumType[value] === undefined) {
        throw new Error(`Unknown enum value: ${value}`)
    }
    return enumType[value]
}

export function getFlightState(value: string): FlightState {
    return getEnumValue<FlightState>(FlightState, value)
}


export function getFlightType(value: string): FlightType {
    return getEnumValue<FlightType>(FlightType, value)
}

export function getTowType(value: string): TowType {
    return getEnumValue<TowType>(TowType, value)
}

export function getPayersType(value: string): PayersType {
    return getEnumValue<PayersType>(PayersType, value)
}

export function getPaymentMethod(value: string): PaymentMethod {
    return getEnumValue<PaymentMethod>(PaymentMethod, value)
}

export function getEnumValues(enumType: any): string[] {
    return Object.keys(enumType).filter(key => isNaN(Number(key)))
}
