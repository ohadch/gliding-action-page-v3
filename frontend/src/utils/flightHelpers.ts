import { FlightSchema } from "../lib/types";
import { getMemberDisplayValue, getGliderDisplayValue, getTowAirplaneDisplayValue } from "./display";

export function getBusyEntitiesFromFlight(
    flight: FlightSchema, 
    flights: FlightSchema[] | null,
    membersStoreState: any,
    glidersStoreState: any,
    towAirplanesStoreState: any,
    includeTowAirplanesAndPilots = true
) {
    // Move the getBusyEntitiesFromFlight implementation here
    // ... existing implementation ...
}

export function getGliderById(glidersStoreState: any, id: number) {
    return glidersStoreState.gliders?.find((glider: any) => glider.id === id);
} 