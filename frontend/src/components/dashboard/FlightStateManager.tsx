import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { FlightSchema, FlightState } from "../../lib/types";
import { updateFlight, createEvent } from "../../store/actionDays";
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
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );
    const { reviewMode } = useSelector((state: RootState) => state.actionDays.currentDay);
    const aircraftState = useSelector((state: RootState) => state.aircraft);

    const handleStateUpdate = () => {
        if (!action) return;

        const glider = flight.glider_id ? 
            aircraftState.gliders?.find(g => g.id === flight.glider_id) : 
            null;

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

        const updatePayload = {
            ...flight,
            state
        };

        const now = moment().utcOffset(0, true).set({
            date: moment(action.date).date(),
            month: moment(action.date).month(),
            year: moment(action.date).year(),
        }).toISOString();

        const promises = [];
        const shouldCreateEvent = !reviewMode;

        switch (state) {
            case "Draft":
                updatePayload.take_off_at = null;
                updatePayload.landing_at = null;
                updatePayload.tow_type = null;
                updatePayload.tow_airplane_id = null;
                updatePayload.tow_pilot_id = null;
                break;
            case "Tow":
                updatePayload.take_off_at = now;
                updatePayload.landing_at = null;
                if (shouldCreateEvent) {
                    promises.push(
                        dispatch(createEvent({
                            action_id: action.id,
                            type: "flight_took_off",
                            payload: {
                                flight_id: flight.id,
                                field_responsible_id: action.field_responsible_id,
                            }
                        }))
                    );
                }
                break;
            case "Inflight":
                if (!updatePayload.take_off_at) {
                    updatePayload.take_off_at = now;
                }
                updatePayload.landing_at = null;
                if (shouldCreateEvent) {
                    promises.push(
                        dispatch(createEvent({
                            action_id: action.id,
                            type: "flight_tow_released",
                            payload: {
                                flight_id: flight.id,
                                field_responsible_id: action.field_responsible_id,
                            }
                        }))
                    );
                }
                break;
            case "Landed":
                if (!updatePayload.take_off_at) {
                    updatePayload.take_off_at = now;
                }
                updatePayload.landing_at = now;
                if (shouldCreateEvent) {
                    promises.push(
                        dispatch(createEvent({
                            action_id: action.id,
                            type: "flight_landed",
                            payload: {
                                flight_id: flight.id,
                                field_responsible_id: action.field_responsible_id,
                            }
                        }))
                    );
                }
                break;
        }

        promises.push(
            dispatch(updateFlight({
                flightId: flight.id,
                updatePayload
            }))
        );

        Promise.all(promises);
    };

    return null; // This component doesn't render anything
}