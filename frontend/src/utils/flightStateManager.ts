import { FlightSchema, FlightState } from "../lib/types";
import { RootState } from "../store";

interface FlightStateUpdateHandlerProps {
    flight: FlightSchema;
    state: FlightState;
    onShowStartTowDialog: (flight: FlightSchema) => void;
    onShowEndTowDialog: (flight: FlightSchema) => void;
}

export function handleFlightStateUpdate({
    flight,
    state,
    onShowStartTowDialog,
    onShowEndTowDialog
}: FlightStateUpdateHandlerProps) {
    const glider = flight.glider_id ? 
        (state: RootState) => state.aircraft.gliders?.find(g => g.id === flight.glider_id) : 
        null;

    if (flight.state === state) return;

    // Handle state transitions
    if (state === "Tow") {
        // Show tow dialog if needed
        if ((!flight.tow_airplane_id || !flight.tow_pilot_id) && (glider?.type !== "touring")) {
            onShowStartTowDialog(flight);
            return;
        }
    } else if (state === "Inflight") {
        // Show end tow dialog if needed
        if (!flight.tow_type && ((glider?.type === "regular") || (glider?.type === "self_launch" && flight.tow_type))) {
            onShowEndTowDialog(flight);
            return;
        }
    }

    return {
        state,
        flight
    };
}

export function useFlightStateManager() {
    return {
        handleFlightStateUpdate
    };
} 