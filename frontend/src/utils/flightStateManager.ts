import {
    FlightSchema,
    FlightState,
    FlightUpdateSchema,
    GliderSchema,
    TowAirplaneSchema,
    MemberSchema,
    ActiveTowAirplaneSchema
} from "../lib/types";
import moment from "moment";
import { getMemberDisplayValue, getTowAirplaneDisplayValue } from "./display";

// Types
export interface FlightStateManagerConfig {
    flight: FlightSchema;
    newState: FlightState;
    glider: GliderSchema | null;
    availableTowAirplanes: ActiveTowAirplaneSchema[];
    flights: FlightSchema[];
    members: MemberSchema[];
    getTowAirplaneById: (id: number) => TowAirplaneSchema | undefined;
    t: (key: string) => string;
    actionDate: string;
    actionId: number;
    fieldResponsibleId?: number;
}

export interface FlightStateUpdateResult {
    shouldReturn: boolean;
    showStartTowDialog?: boolean;
    showEndTowDialog?: boolean;
    updatePayload?: FlightUpdateSchema;
    events?: FlightEvent[];
    alertMessage?: string;
}

interface FlightEvent {
    type: string;
    payload: {
        flight_id: number;
        field_responsible_id?: number;
    };
}

// Time utilities
export function getActionDateTime(actionDate: string): string {
    return moment().utc().set({
        date: moment(actionDate).date(),
        month: moment(actionDate).month(),
        year: moment(actionDate).year(),
    }).toISOString();
}

// State-specific handlers
export function handleDraftState(flight: FlightSchema): FlightUpdateSchema {
    return {
        ...flight,
        state: "Draft",
        take_off_at: null,
        landing_at: null,
        tow_type: null,
        tow_airplane_id: null,
        tow_pilot_id: null
    };
}

export function handleTowState(
    flight: FlightSchema,
    glider: GliderSchema | null,
    availableTowAirplanes: any[],
    flights: FlightSchema[],
    members: MemberSchema[],
    getTowAirplaneById: (id: number) => TowAirplaneSchema | undefined,
    t: (key: string) => string,
    now: string,
    fieldResponsibleId?: number
): FlightStateUpdateResult {
    // Handle touring glider
    if (flight.state === "Draft" && glider?.type === "touring") {
        return { shouldReturn: true, updatePayload: undefined };
    }

    // Handle regular glider in draft state
    if (flight.state === "Draft" && glider?.type === "regular") {
        if (availableTowAirplanes.length === 0) {
            return {
                shouldReturn: true,
                alertMessage: t("NO_TOW_AIRPLANES_AVAILABLE")
            };
        }
        return {
            shouldReturn: true,
            showStartTowDialog: true
        };
    }

    // Handle return from inflight
    if (shouldBlockReturnToTow(flight, glider, flights, getTowAirplaneById)) {
        const towAirplane = getTowAirplaneById(flight.tow_airplane_id!);
        if (towAirplane) {
            return {
                shouldReturn: true,
                alertMessage: `${t("TOW_AIRPLANE_NOT_AVAILABLE")}: ${getTowAirplaneDisplayValue(towAirplane)}`
            };
        }
    }

    // Check busy entities
    const busyEntitiesResult = checkBusyEntities(flight, flights, members, getTowAirplaneById, t);
    if (busyEntitiesResult.hasBusyEntities) {
        return busyEntitiesResult.result;
    }

    // Create update payload
    const updatePayload: FlightUpdateSchema = {
        ...flight,
        state: "Tow",
        take_off_at: flight.take_off_at || now,
        tow_type: null,
        tow_release_at: null
    };

    const events: FlightEvent[] = [{
        type: "flight_took_off",
        payload: {
            flight_id: flight.id,
            field_responsible_id: fieldResponsibleId
        }
    }];

    return { shouldReturn: false, updatePayload, events };
}

export function handleInflightState(
    flight: FlightSchema,
    glider: GliderSchema | null,
    flights: FlightSchema[],
    members: MemberSchema[],
    getTowAirplaneById: (id: number) => TowAirplaneSchema | undefined,
    t: (key: string) => string,
    now: string,
    fieldResponsibleId?: number
): FlightStateUpdateResult | undefined {
    console.log('handleInflightState called:', { flight, glider });
    
    // First check if we need to show the end tow dialog
    const shouldShow = shouldShowEndTowDialog(flight, glider);
    console.log('shouldShowEndTowDialog result:', shouldShow, {
        state: flight.state,
        towType: flight.tow_type,
        gliderType: glider?.type
    });

    if (shouldShow) {
        return {
            shouldReturn: true,
            showEndTowDialog: true
        };
    }

    // Check busy entities - skip tow checks when coming from Tow state
    const includeTowAirplane = flight.state !== "Tow";
    const busyEntitiesResult = checkBusyEntities(flight, flights, members, getTowAirplaneById, t, includeTowAirplane);
    if (busyEntitiesResult.hasBusyEntities) {
        return busyEntitiesResult.result;
    }

    // Create update payload
    const updatePayload: FlightUpdateSchema = {
        ...flight,
        state: "Inflight",
        take_off_at: flight.take_off_at || now,
        landing_at: null,
        tow_release_at: (!flight.tow_release_at && glider?.type !== "touring") ? now : flight.tow_release_at
    };

    const events: FlightEvent[] = [{
        type: "flight_tow_released",
        payload: {
            flight_id: flight.id,
            field_responsible_id: fieldResponsibleId
        }
    }];

    return { shouldReturn: false, updatePayload, events };
}

export function handleLandedState(
    flight: FlightSchema,
    now: string,
    fieldResponsibleId?: number
): FlightStateUpdateResult {
    const updatePayload: FlightUpdateSchema = {
        ...flight,
        state: "Landed",
        landing_at: now
    };

    const events: FlightEvent[] = [{
        type: "flight_landed",
        payload: {
            flight_id: flight.id,
            field_responsible_id: fieldResponsibleId
        }
    }];

    return { shouldReturn: false, updatePayload, events };
}

// Helper functions
function shouldBlockReturnToTow(
    flight: FlightSchema,
    glider: GliderSchema | null,
    flights: FlightSchema[],
    getTowAirplaneById: (id: number) => TowAirplaneSchema | undefined
): boolean {
    return Boolean(
        flight.state === "Inflight" &&
        flight.tow_airplane_id &&
        !isTowAirplaneAvailable(flights, flight.tow_airplane_id) &&
        glider?.type === "regular"
    );
}

function shouldShowEndTowDialog(flight: FlightSchema, glider: GliderSchema | null): boolean {
    // Show dialog when:
    // 1. Coming from Tow state
    // 2. No tow type set yet
    // 3. Either regular glider or self-launch glider
    return Boolean(
        flight.state === "Tow" &&  // Coming from Tow state
        !flight.tow_type &&        // No tow type set yet
        (glider?.type === "regular" || glider?.type === "self_launch")  // For regular or self-launch gliders
    );
}

function isTowAirplaneAvailable(flights: FlightSchema[], towAirplaneId: number): boolean {
    return !flights?.some(f => 
        f.state === "Tow" && f.tow_airplane_id === towAirplaneId
    );
}

function getBusyEntitiesFromFlight(
    flight: FlightSchema,
    flights: FlightSchema[],
    members: MemberSchema[],
    getTowAirplaneById: (id: number) => TowAirplaneSchema | undefined,
    includeTowAirplane = true
) {
    const busyEntities = {
        pilots: [] as string[],
        gliders: [] as string[],
        towAirplanes: [] as string[]
    };

    // If we're moving from Tow to Inflight, skip all checks
    if (flight.state === "Tow" && !includeTowAirplane) {
        return busyEntities;
    }

    const busyFlights = flights.filter(f => 
        (f.id !== flight.id) && 
        (f.state === "Tow" || f.state === "Inflight")
    );

    busyFlights.forEach(busyFlight => {
        // Check pilots - but skip tow pilot checks if includeTowAirplane is false
        if (flight.pilot_1_id) {
            const pilotIds = [
                busyFlight.pilot_1_id,
                busyFlight.pilot_2_id
            ];
            if (includeTowAirplane) {
                pilotIds.push(busyFlight.tow_pilot_id);
            }

            if (pilotIds.includes(flight.pilot_1_id)) {
                const pilot = members.find(m => m.id === flight.pilot_1_id);
                if (pilot) busyEntities.pilots.push(getMemberDisplayValue(pilot));
            }
        }

        if (flight.pilot_2_id) {
            const pilotIds = [
                busyFlight.pilot_1_id,
                busyFlight.pilot_2_id
            ];
            if (includeTowAirplane) {
                pilotIds.push(busyFlight.tow_pilot_id);
            }

            if (pilotIds.includes(flight.pilot_2_id)) {
                const pilot = members.find(m => m.id === flight.pilot_2_id);
                if (pilot) busyEntities.pilots.push(getMemberDisplayValue(pilot));
            }
        }

        // Only check tow pilot if includeTowAirplane is true
        if (includeTowAirplane && flight.tow_pilot_id) {
            const isBusyTowPilot = [
                busyFlight.pilot_1_id,
                busyFlight.pilot_2_id,
                busyFlight.tow_pilot_id
            ].includes(flight.tow_pilot_id);

            if (isBusyTowPilot) {
                const pilot = members.find(m => m.id === flight.tow_pilot_id);
                if (pilot) busyEntities.pilots.push(getMemberDisplayValue(pilot));
            }
        }

        // Check gliders
        if (flight.glider_id === busyFlight.glider_id) {
            const glider = getTowAirplaneById(busyFlight.glider_id);
            if (glider) busyEntities.gliders.push(glider.call_sign);
        }

        // Only check tow airplanes if includeTowAirplane is true
        if (includeTowAirplane && flight.tow_airplane_id === busyFlight.tow_airplane_id) {
            const towAirplane = getTowAirplaneById(flight.tow_airplane_id);
            if (towAirplane) busyEntities.towAirplanes.push(towAirplane.call_sign);
        }
    });

    return busyEntities;
}

function hasAnyBusyEntities(busyEntities: ReturnType<typeof getBusyEntitiesFromFlight>): boolean {
    return Object.values(busyEntities).some(entities => entities.length > 0);
}

// Add this helper function
function checkBusyEntities(
    flight: FlightSchema,
    flights: FlightSchema[],
    members: MemberSchema[],
    getTowAirplaneById: (id: number) => TowAirplaneSchema | undefined,
    t: (key: string) => string,
    includeTowAirplane = true
): { hasBusyEntities: boolean; result?: FlightStateUpdateResult } {
    const busyEntities = getBusyEntitiesFromFlight(flight, flights, members, getTowAirplaneById, includeTowAirplane);
    const hasBusyEntities = hasAnyBusyEntities(busyEntities);

    if (hasBusyEntities) {
        const busyEntitiesString = Object.values(busyEntities).flat().join(", ");
        return {
            hasBusyEntities: true,
            result: {
                shouldReturn: true,
                alertMessage: `${t("FLIGHT_HAS_BUSY_ENTITIES_ALERT")}: ${busyEntitiesString}`
            }
        };
    }

    return { hasBusyEntities: false };
}

// Add confirmation keys
const STATE_CHANGE_CONFIRMATIONS: Record<string, string> = {
    "Draft_Tow": "START_TOW_CONFIRMATION",
    "Draft_Inflight": "START_FLIGHT_CONFIRMATION",
    "Tow_Draft": "RETURN_TO_DRAFT_CONFIRMATION",
    "Tow_Inflight": "END_TOW_CONFIRMATION",
    "Inflight_Draft": "RETURN_TO_DRAFT_CONFIRMATION",
    "Inflight_Tow": "RETURN_TO_TOW_CONFIRMATION",
    "Inflight_Landed": "LAND_FLIGHT_CONFIRMATION",
    "Landed_Draft": "RETURN_TO_DRAFT_CONFIRMATION",
    "Landed_Inflight": "RETURN_TO_INFLIGHT_CONFIRMATION",
};

// Main function
export function handleFlightStateUpdate(config: FlightStateManagerConfig): FlightStateUpdateResult {
    const {
        flight,
        newState,
        glider,
        availableTowAirplanes,
        flights,
        members,
        getTowAirplaneById,
        t,
        actionDate,
        fieldResponsibleId
    } = config;

    if (flight.state === newState) {
        return { shouldReturn: true };
    }

    // Create transition key from current state to new state
    const transitionKey = `${flight.state}_${newState}`;
    const confirmationKey = STATE_CHANGE_CONFIRMATIONS[transitionKey];
    if (confirmationKey && !window.confirm(t(confirmationKey))) {
        return { shouldReturn: true };
    }

    const now = getActionDateTime(actionDate);

    switch (newState) {
        case "Draft":
            return { shouldReturn: false, updatePayload: handleDraftState(flight) };
        case "Tow":
            return handleTowState(flight, glider, availableTowAirplanes, flights, members, getTowAirplaneById, t, now, fieldResponsibleId);
        case "Inflight":
            return handleInflightState(flight, glider, flights, members, getTowAirplaneById, t, now, fieldResponsibleId);
        case "Landed":
            return handleLandedState(flight, now, fieldResponsibleId);
        default:
            throw new Error(`Unknown flight state: ${newState}`);
    }
}