export enum FlightState {
    DRAFT = "DRAFT",
    TOW = "TOW",
    IN_FLIGHT = "IN_FLIGHT",
    LANDED = "LANDED",
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
