import {FlightSchema} from "../lib/types.ts";

export function isFlightActive(flight: FlightSchema) {
    return (flight.state === "Tow") || (flight.state === "Inflight")
}
