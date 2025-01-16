import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import {FlightCreateSchema, FlightSchema, FlightState} from "../../lib/types";
import {
    fetchFlights, 
    fetchComments, 
    deleteFlight,
    updateAction,
    updateFlight,
} from "../../store/actions/action";
import { fetchGliders, fetchGliderOwners } from "../../store/actions/glider";
import { fetchMembers, fetchMembersRoles } from "../../store/actions/member";
import { fetchTowAirplanes } from "../../store/actions/towAirplane";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {createEvent} from "../../store/actions/event.ts";
import {ActionConfiguration} from "../../components/dashboard/ActionConfiguration.tsx";
import {FlightsList} from "../../components/dashboard/FlightsList.tsx";
import {QuickActions} from "../../components/dashboard/QuickActions.tsx";
import {FlightDialogs} from "../../components/dashboard/FlightDialogs.tsx";
import { 
    getGliderDisplayValue, 
    getMemberDisplayValue, 
    getTowAirplaneDisplayValue 
} from "../../utils/display";

export default function DashboardPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    
    // Dialog states
    const [flightCreationWizardDialogOpen, setFlightCreationWizardDialogOpen] = useState(false);
    const [summaryGeneratorWizardDialogOpen, setSummaryGeneratorWizardDialogOpen] = useState(false);
    const [editedFlightId, setEditedFlightId] = useState<number | null>(null);
    const [editedFlightData, setEditedFlightData] = useState<FlightCreateSchema | null>(null);
    const [editFlightDetailsDialogOpen, setEditFlightDetailsDialogOpen] = useState(false);
    const [startTowDialogFlight, setStartTowDialogFlight] = useState<FlightSchema | null>(null);
    const [endTowDialogFlight, setEndTowDialogFlight] = useState<FlightSchema | null>(null);
    const [settlePaymentDialogFlight, setSettlePaymentDialogFlight] = useState<FlightSchema | null>(null);

    // Selectors
    const action = useSelector((state: RootState) => 
        state.actions.actions?.find((action) => action.id === state.actions.actionId)
    );
    const { flights, fetchingFlightsInProgress } = useSelector((state: RootState) => state.actions);
    const membersStoreState = useSelector((state: RootState) => state.members);
    const glidersStoreState = useSelector((state: RootState) => state.gliders);
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes);
    const reviewMode = useSelector((state: RootState) => state.actions.reviewMode);
    const currentActionStoreState = useSelector((state: RootState) => state.actions);
    const busyTowAirplaneIds = flights?.filter((flight) => flight.state === "Tow")
        .map((flight) => flight.tow_airplane_id) || [];

    // Data fetching
    useEffect(() => {
        if (!membersStoreState.members && !membersStoreState.fetchInProgress) {
            dispatch(fetchMembers());
            dispatch(fetchMembersRoles());
        }

        if (!glidersStoreState.gliders && !glidersStoreState.fetchInProgress) {
            dispatch(fetchGliders());
        }

        if (!towAirplanesStoreState.towAirplanes && !towAirplanesStoreState.fetchInProgress) {
            dispatch(fetchTowAirplanes());
        }
    }, [dispatch, glidersStoreState.fetchInProgress, glidersStoreState.gliders, membersStoreState.fetchInProgress, membersStoreState.members, towAirplanesStoreState.fetchInProgress, towAirplanesStoreState.towAirplanes]);

    useEffect(() => {
        if (!flights && !fetchingFlightsInProgress && action) {
            dispatch(fetchFlights(action.id));
            dispatch(fetchComments({actionId: action.id}));
            dispatch(fetchGliders());
            dispatch(fetchGliderOwners());
        }
    }, [action, dispatch, fetchingFlightsInProgress, flights]);

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

    const handleFlightStateUpdated = (flightId: number, state: FlightState) => {
        // Guard clause - don't render anything if there's no action
        if (!action) {
            return;
        }

        const flight = flights?.find((flight) => flight.id === flightId);
        if (!flight) return;

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
                if (glider?.type === "regular") {
                    const availableTowAirplanes = currentActionStoreState.activeTowAirplanes?.filter(
                        (towAirplane) => !busyTowAirplaneIds.includes(towAirplane.airplane_id)
                    ) || [];

                    if (availableTowAirplanes.length === 1) {
                        const towPilotId = availableTowAirplanes[0].tow_pilot_id;
                        if ([flight.pilot_1_id, flight.pilot_2_id].filter(Boolean).includes(towPilotId)) {
                            const towPilot = membersStoreState.members?.find((member) => member.id === towPilotId);
                            alert(`${t("TOW_PILOT_CANNOT_TOW_HIMSELF")}: ${towPilot && getMemberDisplayValue(towPilot)}`);
                            return;
                        }
                    }
                }

                setStartTowDialogFlight(flight);
                return; // Important: return here to prevent the state update until dialog handles it
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
                setEndTowDialogFlight(flight);
                return; // Important: return here to prevent the state update until dialog handles it
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

        // The time is now's time, but the date is the action's date
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
                if (getBusyEntitiesFromFlight(flight)) {
                    const busyEntities = getBusyEntitiesFromFlight(flight);
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
                if (getBusyEntitiesFromFlight(flight, false)) {
                    const busyEntities = getBusyEntitiesFromFlight(flight);
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
                                flight_id: flightId,
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
                flightId,
                updatePayload,
            }))
        );

        Promise.all(promises).then();
    };

    const getGliderById = (id: number) => 
        glidersStoreState.gliders?.find((glider) => glider.id === id);

    const getBusyEntitiesFromFlight = (flight: FlightSchema, includeTowAirplanesAndPilots = true) => {
        if (!membersStoreState.members) {
            throw new Error("Members not loaded");
        }

        if (!glidersStoreState.gliders) {
            throw new Error("Gliders not loaded");
        }

        if (includeTowAirplanesAndPilots && !towAirplanesStoreState.towAirplanes) {
            throw new Error("Tow airplanes not loaded");
        }

        const busyEntities = {
            members: [] as string[],
            gliders: [] as string[],
            towAirplanes: [] as string[],
        };

        const flightsInTowState = flights?.filter((flight) => flight.state === "Tow");
        const flightsInAnyFlightState = flights?.filter((flight) => 
            flight.state === "Tow" || flight.state === "Inflight"
        );

        const busyGliders = flightsInAnyFlightState
            ?.filter(f => f.id !== flight.id)
            .map((f) => f.glider_id)
            .filter(Boolean) || [];

        const busyTowAirplanes = flightsInTowState
            ?.filter(f => f.id !== flight.id)
            .map((f) => f.tow_airplane_id)
            .filter(Boolean) || [];

        const busyGliderPilots = flightsInAnyFlightState
            ?.filter(f => f.id !== flight.id)
            .map((f) => [f.pilot_1_id, f.pilot_2_id])
            .flat()
            .filter(Boolean) || [];

        const busyTowPilots = flightsInTowState
            ?.filter(f => f.id !== flight.id)
            .map((f) => f.tow_pilot_id)
            .filter(Boolean) || [];

        const busyMembers = [...busyGliderPilots, ...busyTowPilots];

        if (flight.glider_id && busyGliders.includes(flight.glider_id)) {
            const glider = glidersStoreState.gliders.find((g) => g.id === flight.glider_id);
            if (glider) {
                busyEntities.gliders.push(getGliderDisplayValue(glider));
            }
        }

        if (includeTowAirplanesAndPilots && flight.tow_airplane_id && busyTowAirplanes.includes(flight.tow_airplane_id)) {
            const towAirplane = towAirplanesStoreState.towAirplanes?.find((ta) => ta.id === flight.tow_airplane_id);
            if (towAirplane) {
                busyEntities.towAirplanes.push(getTowAirplaneDisplayValue(towAirplane));
            }
        }

        if (flight.pilot_1_id && busyMembers.includes(flight.pilot_1_id)) {
            const member = membersStoreState.members.find((m) => m.id === flight.pilot_1_id);
            if (member) {
                busyEntities.members.push(getMemberDisplayValue(member));
            }
        }

        if (flight.pilot_2_id && busyMembers.includes(flight.pilot_2_id)) {
            const member = membersStoreState.members.find((m) => m.id === flight.pilot_2_id);
            if (member) {
                busyEntities.members.push(getMemberDisplayValue(member));
            }
        }

        if (includeTowAirplanesAndPilots && flight.tow_pilot_id && busyMembers.includes(flight.tow_pilot_id)) {
            const member = membersStoreState.members.find((m) => m.id === flight.tow_pilot_id);
            if (member) {
                busyEntities.members.push(getMemberDisplayValue(member));
            }
        }

        return busyEntities;
    };

    if (!action || !action.field_responsible_id) {
        return null;
    }

    return (
        <>
            <ActionConfiguration 
                onNewFlightClick={() => setFlightCreationWizardDialogOpen(true)} 
            />

            <FlightsList
                onEditFlight={(flightId, flight) => {
                    setEditFlightDetailsDialogOpen(true);
                    setEditedFlightId(flightId);
                    setEditedFlightData({
                        ...flight
                    });
                }}
                onDuplicateFlight={(flight) => {
                    setEditFlightDetailsDialogOpen(true);
                    setEditedFlightData({...flight});
                }}
                onFlightStateUpdated={handleFlightStateUpdated}
                onSettlePayment={(flight) => setSettlePaymentDialogFlight(flight)}
            />

            <QuickActions 
                onGenerateSummary={() => setSummaryGeneratorWizardDialogOpen(true)}
                onCloseAction={handleCloseAction}
            />

            <FlightDialogs
                flightCreationWizardDialogOpen={flightCreationWizardDialogOpen}
                setFlightCreationWizardDialogOpen={setFlightCreationWizardDialogOpen}
                editFlightDetailsDialogOpen={editFlightDetailsDialogOpen}
                setEditFlightDetailsDialogOpen={setEditFlightDetailsDialogOpen}
                editedFlightId={editedFlightId}
                setEditedFlightId={setEditedFlightId}
                editedFlightData={editedFlightData}
                setEditedFlightData={setEditedFlightData}
                startTowDialogFlight={startTowDialogFlight}
                setStartTowDialogFlight={setStartTowDialogFlight}
                endTowDialogFlight={endTowDialogFlight}
                setEndTowDialogFlight={setEndTowDialogFlight}
                settlePaymentDialogFlight={settlePaymentDialogFlight}
                setSettlePaymentDialogFlight={setSettlePaymentDialogFlight}
                actionId={action.id}
                fieldResponsibleId={action.field_responsible_id}
            />
        </>
    );
}
