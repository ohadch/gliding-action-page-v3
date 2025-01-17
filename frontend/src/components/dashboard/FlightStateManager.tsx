import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { FlightSchema, FlightState } from "../../lib/types";
import { updateFlight } from "../../store/actions/action";
import { createEvent } from "../../store/actions/event";
import { getBusyEntitiesFromFlight, getGliderById } from "../../utils/flightHelpers";
import moment from "moment";

interface FlightStateManagerProps {
    flight: FlightSchema;
    state: FlightState;
    onShowStartTowDialog: (flight: FlightSchema) => void;
    onShowEndTowDialog: (flight: FlightSchema) => void;
}

export function FlightStateManager({ 
    flight, 
    state, 
    onShowStartTowDialog,
    onShowEndTowDialog 
}: FlightStateManagerProps) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const action = useSelector((state: RootState) => 
        state.actions.actions?.find((action) => action.id === state.actions.actionId)
    );
    const reviewMode = useSelector((state: RootState) => state.actions.reviewMode);
    const { flights } = useSelector((state: RootState) => state.actions);

    const handleStateUpdate = () => {
        if (!action) return;

        const glider = flight.glider_id ? getGliderById(flight.glider_id) : null;

        if (flight.state === state) return;

        // Add confirmations based on state transitions
        if (state === "Draft") {
            if (!confirm(t("MOVE_TO_DRAFT_CONFIRMATION"))) {
                return;
            }
        } else if (state === "Tow") {
            if (flight.state === "Draft" && !confirm(t("START_TOW_CONFIRMATION"))) {
                return;
            }
            if (flight.state === "Inflight" && !confirm(t("RETURN_TO_TOW_CONFIRMATION"))) {
                return;
            }

            // Show tow dialog if needed
            if ((!flight.tow_airplane_id || !flight.tow_pilot_id) && (glider?.type !== "touring")) {
                onShowStartTowDialog(flight);
                return;
            }
        } else if (state === "Inflight") {
            if (flight.state === "Draft" && !confirm(t("START_FLIGHT_CONFIRMATION"))) {
                return;
            }
            if (flight.state === "Tow" && !confirm(t("END_TOW_CONFIRMATION"))) {
                return;
            }

            // Show end tow dialog if needed
            if (!flight.tow_type && ((glider?.type === "regular") || (glider?.type === "self_launch" && flight.tow_type))) {
                onShowEndTowDialog(flight);
                return;
            }
        } else if (state === "Landed") {
            if (!confirm(t("LAND_FLIGHT_CONFIRMATION"))) {
                return;
            }
        }

        // ... rest of the state update logic (same as before)
    };

    return null; // This component doesn't render anything
} 