import { useState, useEffect, KeyboardEvent } from "react";
import { 
    FlightCreateSchema, 
    FlightSchema, 
    FlightState, 
    GliderSchema,
    TowAirplaneSchema,
} from "../../lib/types";
import { ActionConfiguration } from "../../components/dashboard/ActionConfiguration";
import { FlightsList } from "../../components/dashboard/FlightsList";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { FlightDialogs } from "../../components/dashboard/FlightDialogs";
import { useFlightData } from "../../hooks/useFlightData";
import { createEvent, useAppDispatch, RootState } from "../../store";
import { updateAction, deleteFlight, updateFlight } from "../../store";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Grid, Alert, Card } from "@mui/material";
import { useSelector } from "react-redux";
import { getMemberDisplayValue } from "../../utils/display";
import { handleFlightStateUpdate } from "../../utils/flightStateManager";

export default function DashboardPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { action, flights, availableTowAirplanes } = useFlightData();
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

        const busyFlights = flights?.filter(f => 
            (f.id !== flight.id) && 
            (f.state === "Tow" || f.state === "Inflight")
        ) || [];

        busyFlights.forEach(busyFlight => {
            // Check pilots
            const pilot1 = membersStoreState.members?.find(m => m.id === busyFlight.pilot_1_id);
            const pilot2 = membersStoreState.members?.find(m => m.id === busyFlight.pilot_2_id);
            const towPilot = membersStoreState.members?.find(m => m.id === busyFlight.tow_pilot_id);

            if (pilot1) busyEntities.pilots.push(getMemberDisplayValue(pilot1));
            if (pilot2) busyEntities.pilots.push(getMemberDisplayValue(pilot2));
            if (includeTowAirplane && towPilot) busyEntities.pilots.push(getMemberDisplayValue(towPilot));

            // Check gliders
            const glider = getGliderById(busyFlight.glider_id);
            if (glider) busyEntities.gliders.push(glider.call_sign);

            // Check tow airplanes
            if (includeTowAirplane && busyFlight.tow_airplane_id) {
                const towAirplane = getTowAirplaneById(busyFlight.tow_airplane_id);
                if (towAirplane) busyEntities.towAirplanes.push(towAirplane.call_sign);
            }
        });

        return busyEntities;
    };

    // Flight state update function
    function onFlightStateUpdated(flightId: number, state: FlightState) {
        console.log('onFlightStateUpdated called:', { flightId, state });
        
        const flight = flights?.find((flight) => flight.id === flightId);
        if (!flight) return;

        const glider = flight.glider_id ? getGliderById(flight.glider_id) : null;
        console.log('Found flight and glider:', { flight, glider });

        const result = handleFlightStateUpdate({
            flight,
            newState: state,
            glider,
            availableTowAirplanes,
            flights: flights || [],
            members: membersStoreState.members || [],
            getTowAirplaneById,
            t,
            actionDate: action?.date || "",
            actionId: action?.id || 0,
            fieldResponsibleId: action?.field_responsible_id
        });

        console.log('handleFlightStateUpdate result:', result);

        if (result?.shouldReturn) {
            console.log('Should return with:', result);
            if (result.showEndTowDialog) {
                console.log('Setting endTowDialogFlight:', flight);
                setEndTowDialogFlight(flight);
            }
            if (result.alertMessage) {
                alert(result.alertMessage);
            }
            if (result.showStartTowDialog) {
                setStartTowDialogFlight(flight);
            }
            return;
        }

        if (result.updatePayload) {
            const promises = [];

            if (result.events) {
                result.events.forEach(event => {
                    promises.push(new Promise(() => dispatch(createEvent({
                        action_id: action?.id || 0,
                        type: event.type,
                        payload: event.payload
                    }))));
                });
            }

            promises.push(new Promise(() => {
                dispatch(updateFlight({
                    flightId,
                    updatePayload: result.updatePayload!
                }));
            }));

            Promise.all(promises).then();
        }
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

    // Add keyboard event listener for flight creation shortcut
    useEffect(() => {
        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.shiftKey && event.key === "+") {
                event.preventDefault();
                setFlightCreationWizardDialogOpen(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

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
