import { FlightSchema, FlightState } from "../lib/types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import { updateFlight } from "../store/actions/action";
import { createEvent } from "../store/actions/event";
import { getBusyEntitiesFromFlight, getGliderById } from "./flightHelpers";
import moment from "moment";

export function useFlightStateManager() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const action = useSelector((state: RootState) => 
        state.actions.actions?.find((action) => action.id === state.actions.actionId)
    );
    const reviewMode = useSelector((state: RootState) => state.actions.reviewMode);
    const { flights } = useSelector((state: RootState) => state.actions);

    const handleStateUpdate = (
        flight: FlightSchema, 
        state: FlightState,
        onShowStartTowDialog: (flight: FlightSchema) => void,
        onShowEndTowDialog: (flight: FlightSchema) => void
    ) => {
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
                if (getBusyEntitiesFromFlight(flight, flights, membersStoreState, glidersStoreState, towAirplanesStoreState)) {
                    const busyEntities = getBusyEntitiesFromFlight(flight, flights, membersStoreState, glidersStoreState, towAirplanesStoreState);
                    const hasBusyEntities = Object.values(busyEntities).some((entities) => entities.length > 0);

                    if (hasBusyEntities) {
                        const busyEntitiesString = Object.values(busyEntities).flat().join(", ");
                        alert(`${t("FLIGHT_HAS_BUSY_ENTITIES_ALERT")}: ${busyEntitiesString}`);
                        return;
                    }
                }

                if (!flight.take_off_at) {
                    updatePayload.take_off_at = now;
                }
                updatePayload.tow_type = null;
                updatePayload.tow_release_at = null;
                break;
            case "Inflight":
                if (!flight.take_off_at) {
                    updatePayload.take_off_at = now;
                }
                updatePayload.landing_at = null;

                if (!flight.tow_release_at && (glider?.type !== "touring")) {
                    updatePayload.tow_release_at = now;
                }
                break;
            case "Landed":
                updatePayload.landing_at = now;

                if (action.id && shouldCreateEvent) {
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
            default:
                throw new Error(`Unknown flight state: ${state}`);
        }

        promises.push(
            dispatch(updateFlight({
                flightId: flight.id,
                updatePayload,
            }))
        );

        Promise.all(promises).then();
    };

    return handleStateUpdate;
} 