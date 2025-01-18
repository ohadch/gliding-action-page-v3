import { useState } from "react";
import { 
    FlightCreateSchema, 
    FlightSchema, 
    FlightState, 
    FlightUpdateSchema,
    GliderSchema,
    MemberSchema,
    TowAirplaneSchema,
    ActiveTowAirplaneSchema
} from "../../lib/types";
import { ActionConfiguration } from "../../components/dashboard/ActionConfiguration";
import { FlightsList } from "../../components/dashboard/FlightsList";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { FlightDialogs } from "../../components/dashboard/FlightDialogs";
import { useFlightData } from "../../hooks/useFlightData";
import { createEvent, useAppDispatch, RootState } from "../../store";
import { updateAction, deleteFlight, updateFlight } from "../../store/actionDays";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Grid, Alert, Card } from "@mui/material";
import { useSelector } from "react-redux";
import { getMemberDisplayValue, getTowAirplaneDisplayValue } from "../../utils/display";

export default function DashboardPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { action, flights } = useFlightData();
    const membersStoreState = useSelector((state: RootState) => state.members);
    const aircraftState = useSelector((state: RootState) => state.aircraft);

    // Helper functions
    const getGliderById = (id: number): GliderSchema | undefined => 
        aircraftState.gliders?.find(glider => glider.id === id);

    const getTowAirplaneById = (id: number): TowAirplaneSchema | undefined => 
        aircraftState.towAirplanes?.find(airplane => airplane.id === id);

    const isTowAirplaneAvailable = (id: number): boolean => {
        return !flights?.some(f => 
            f.state === "Tow" && f.tow_airplane_id === id
        );
    };

    const getBusyEntitiesFromFlight = (flight: FlightSchema, includeTowAirplane = true) => {
        const busyEntities = {
            pilots: [] as string[],
            gliders: [] as string[],
            towAirplanes: [] as string[]
        };

        // Add your busy entities check logic here
        // This should check for pilots, gliders, and tow airplanes that are already in use

        return busyEntities;
    };

    const availableTowAirplanes = action?.activeTowAirplanes?.filter(ata => 
        !flights?.some(f => f.state === "Tow" && f.tow_airplane_id === ata.airplane_id)
    ) || [];

    // Flight state update function
    // Flight state update function
    function onFlightStateUpdated(flightId: number, state: FlightState) {
        const flight = flights?.find((flight) => flight.id === flightId);
        if (!flight) {
            return;
        }

        const glider = flight.glider_id ? getGliderById(flight.glider_id) : null;

        if (flight.state === state) {
            return;
        }

        const updatePayload: FlightUpdateSchema = {
            ...flight,
            state
        };

        // The time is now's time, but the date is the action's date
        const now = moment().utcOffset(0, true).set({
            date: moment(action?.date).date(),
            month: moment(action?.date).month(),
            year: moment(action?.date).year(),
        }).toISOString();

        const promises = [];

        switch (state) {
            case "Draft":
                updatePayload.take_off_at = null;
                updatePayload.landing_at = null;
                updatePayload.tow_type = null;
                updatePayload.tow_airplane_id = null;
                updatePayload.tow_pilot_id = null;
                break;

            case "Tow":
                if (
                    (flight.state === "Inflight")
                    && (flight.tow_airplane_id)
                    && (!isTowAirplaneAvailable(flight.tow_airplane_id))
                    && (glider?.type === "regular")
                ) {
                    const towAirplane = getTowAirplaneById(flight.tow_airplane_id);

                    if (towAirplane) {
                        alert(`${t("TOW_AIRPLANE_NOT_AVAILABLE")}: ${getTowAirplaneDisplayValue(towAirplane)}`);
                        return;
                    }
                }

                if (
                    (flight.state === "Draft")
                    && (availableTowAirplanes.length === 0)
                    && (glider?.type === "regular")
                ) {
                    alert(t("NO_TOW_AIRPLANES_AVAILABLE"));
                    return;
                }

                if (
                    (flight.state === "Draft")
                    && (glider?.type === "touring")
                ) {
                    return onFlightStateUpdated(flightId, "Inflight");
                }

                if (
                    (flight.state === "Inflight")
                    && (
                        (glider?.type === "touring") || (glider?.type === "self_launch" && !flight.tow_type)
                    )
                ) {
                    return onFlightStateUpdated(flightId, "Draft");
                }

                if (getBusyEntitiesFromFlight(flight)) {
                    const busyEntities = getBusyEntitiesFromFlight(flight);
                    const hasBusyEntities = Object.values(busyEntities).some((entities) => entities.length > 0);

                    if (hasBusyEntities) {
                        const busyEntitiesString = Object.values(busyEntities).flat().join(", ");
                        alert(`${t("FLIGHT_HAS_BUSY_ENTITIES_ALERT")}: ${busyEntitiesString}`);
                        return;
                    }
                }

                if ((!flight.tow_airplane_id || !flight.tow_pilot_id) && (glider?.type !== "touring")) {
                    if (glider?.type === "regular") {
                        if (availableTowAirplanes.length === 1) {
                            const towPilotId = availableTowAirplanes[0].tow_pilot_id;
                            if ([flight.pilot_1_id, flight.pilot_2_id].filter(Boolean).includes(towPilotId)) {
                                const towPilot = membersStoreState.members?.find((member) => member.id === availableTowAirplanes[0].tow_pilot_id);
                                alert(`${t("TOW_PILOT_CANNOT_TOW_HIMSELF")}: ${towPilot && getMemberDisplayValue(towPilot)}`);
                                return;
                            }
                        }
                    }

                    setStartTowDialogFlight(flight);
                    return;
                }

                if (!flight.take_off_at) {
                    updatePayload.take_off_at = now;
                }
                updatePayload.tow_type = null;
                updatePayload.tow_release_at = null;
                break;

            case "Inflight":
                if (getBusyEntitiesFromFlight(flight, false)) {
                    const busyEntities = getBusyEntitiesFromFlight(flight);
                    const hasBusyEntities = Object.values(busyEntities).some((entities) => entities.length > 0);

                    if (hasBusyEntities) {
                        const busyEntitiesString = Object.values(busyEntities).flat().join(", ");
                        alert(`${t("FLIGHT_HAS_BUSY_ENTITIES_ALERT")}: ${busyEntitiesString}`);
                        return;
                    }
                }

                if (!flight.tow_type && ((glider?.type === "regular") || (glider?.type === "self_launch" && flight.tow_type))) {
                    setEndTowDialogFlight(flight);
                    return;
                }
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

                if (action?.id) {
                    promises.push(new Promise(() => dispatch(createEvent({
                        action_id: action.id,
                        type: "flight_landed",
                        payload: {
                            flight_id: flightId,
                            field_responsible_id: action?.field_responsible_id,
                        }
                    }))));
                }
                break;

            default:
                throw new Error(`Unknown flight state: ${state}`);
        }

        promises.push(new Promise(() => {
            dispatch(updateFlight({
                flightId,
                updatePayload,
            }));
        }));

        Promise.all(promises).then();
    }

    // Dialog states
    const [flightCreationWizardDialogOpen, setFlightCreationWizardDialogOpen] = useState(false);
    const [summaryGeneratorWizardDialogOpen, setSummaryGeneratorWizardDialogOpen] = useState(false);
    const [editedFlightId, setEditedFlightId] = useState<number | null>(null);
    const [editedFlightData, setEditedFlightData] = useState<FlightCreateSchema | null>(null);
    const [editFlightDetailsDialogOpen, setEditFlightDetailsDialogOpen] = useState(false);
    const [startTowDialogFlight, setStartTowDialogFlight] = useState<FlightSchema | null>(null);
    const [endTowDialogFlight, setEndTowDialogFlight] = useState<FlightSchema | null>(null);
    const [settlePaymentDialogFlight, setSettlePaymentDialogFlight] = useState<FlightSchema | null>(null);

    const handleCloseAction = () => {
        if (!action || !confirm(t("CLOSE_ACTION_CONFIRMATION"))) {
            return;
        }

        const draftFlights = flights?.filter((flight) => flight.state === "Draft") || [];
        draftFlights.forEach((flight) => dispatch(deleteFlight(flight.id)));

        dispatch(
            updateAction({
                actionId: action.id,
                updatePayload: {
                    ...action,
                    closed_at: moment().utcOffset(0, true).set({
                        date: moment(action?.date).date(),
                        month: moment(action?.date).month(),
                        year: moment(action?.date).year(),
                    }).toISOString()
                }
            })
        );

        if (confirm(t("CLOSE_ACTION_EVENT_CONFIRMATION"))) {
            dispatch(
                createEvent({
                    action_id: action.id,
                    type: "action_closed",
                    payload: {
                        field_responsible_id: action?.field_responsible_id,
                    }
                })
            );
        }
    };

    function renderActionNotConfiguredMessage() {
        if (!action?.field_responsible_id || !action?.responsible_cfi_id) {
            return (
                <Grid item xs={12} mb={2}>
                    <Card>
                        <Alert severity="warning">
                            {t("ACTION_NOT_CONFIGURED_MESSAGE")}
                        </Alert>
                    </Card>
                </Grid>
            );
        }
        return null;
    }

    if (!action) {
        return null;
    }

    const dialogProps = {
        flightCreationWizardDialogOpen,
        setFlightCreationWizardDialogOpen,
        editFlightDetailsDialogOpen,
        setEditFlightDetailsDialogOpen,
        editedFlightId,
        setEditedFlightId,
        editedFlightData,
        setEditedFlightData,
        startTowDialogFlight,
        setStartTowDialogFlight,
        endTowDialogFlight,
        setEndTowDialogFlight,
        settlePaymentDialogFlight,
        setSettlePaymentDialogFlight,
    };

    return (
        <Grid container spacing={2}>
            {renderActionNotConfiguredMessage()}
            <Grid item xs={12}>
                <ActionConfiguration onNewFlightClick={() => setFlightCreationWizardDialogOpen(true)} />
            </Grid>

            <Grid item xs={12}>
                <FlightsList
                    onEditFlight={(flightId, flight) => {
                        setEditFlightDetailsDialogOpen(true);
                        setEditedFlightId(flightId);
                        const flightCreateData: FlightCreateSchema = {
                            action_id: flight.action_id,
                            glider_id: flight.glider_id,
                            pilot_1_id: flight.pilot_1_id,
                            pilot_2_id: flight.pilot_2_id,
                            state: flight.state,
                            tow_pilot_id: flight.tow_pilot_id,
                            tow_airplane_id: flight.tow_airplane_id,
                            tow_type: flight.tow_type,
                            take_off_at: flight.take_off_at,
                            tow_release_at: flight.tow_release_at,
                            landing_at: flight.landing_at,
                            flight_type: flight.flight_type,
                            payers_type: flight.payers_type,
                            payment_method: flight.payment_method
                        };
                        setEditedFlightData(flightCreateData);
                    }}
                    onDuplicateFlight={(flight) => {
                        setEditFlightDetailsDialogOpen(true);
                        const flightCreateData: FlightCreateSchema = {
                            action_id: flight.action_id,
                            glider_id: flight.glider_id,
                            pilot_1_id: flight.pilot_1_id,
                            pilot_2_id: flight.pilot_2_id,
                            state: flight.state,
                            tow_pilot_id: flight.tow_pilot_id,
                            tow_airplane_id: flight.tow_airplane_id,
                            tow_type: flight.tow_type,
                            take_off_at: flight.take_off_at,
                            tow_release_at: flight.tow_release_at,
                            landing_at: flight.landing_at,
                            flight_type: flight.flight_type,
                            payers_type: flight.payers_type,
                            payment_method: flight.payment_method
                        };
                        setEditedFlightData(flightCreateData);
                    }}
                    onFlightStateUpdated={onFlightStateUpdated}
                    onSettlePayment={(flight) => setSettlePaymentDialogFlight(flight)}
                />
            </Grid>

            <Grid item xs={12}>
                <QuickActions 
                    onGenerateSummary={() => setSummaryGeneratorWizardDialogOpen(true)}
                    onCloseAction={handleCloseAction}
                />
            </Grid>

            <FlightDialogs
                {...dialogProps}
                actionId={action.id}
                onStartTowSubmit={(flightUpdate) => {
                    if (startTowDialogFlight) {
                        dispatch(updateFlight({
                            flightId: startTowDialogFlight.id,
                            updatePayload: flightUpdate
                        }));
                        setStartTowDialogFlight(null);
                    }
                }}
                onEndTowSubmit={(flightUpdate) => {
                    if (endTowDialogFlight) {
                        dispatch(updateFlight({
                            flightId: endTowDialogFlight.id,
                            updatePayload: flightUpdate
                        }));
                        setEndTowDialogFlight(null);
                    }
                }}
            />
        </Grid>
    );
}
