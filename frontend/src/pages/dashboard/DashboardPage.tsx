import {
    Alert, AlertTitle,
    Button, Card,
    Grid,
} from "@mui/material";
import FlightsTable from "../../components/flights/FlightsTable.tsx";
import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {createFlight, deleteFlight, fetchFlights, updateFlight} from "../../store/actions/currentAction.ts";
import FlightCreationWizardDialog from "../../components/flights/FlightCreationWizardDialog.tsx";
import {fetchGliderOwners, fetchGliders} from "../../store/actions/glider.ts";
import EditFlightDetailsDialog from "../../components/flights/EditFlightDetailsDialog.tsx";
import {FlightCreateSchema, FlightSchema, FlightState, FlightUpdateSchema} from "../../lib/types.ts";
import FlightStartTowDialog from "../../components/flights/FlightStartTowDialog.tsx";
import moment from "moment/moment";
import FlightEndTowDialog from "../../components/flights/FlightEndTowDialog.tsx";
import {ORDERED_FLIGHT_STATES} from "../../utils/consts.ts";
import {isFlightActive} from "../../utils/flights.ts";
import {getGliderDisplayValue, getMemberDisplayValue, getTowAirplaneDisplayValue} from "../../utils/display.ts";
import {createEvent} from "../../store/actions/event.ts";
import ActionConfigurationComponent from "../../components/actions/ActionConfigurationComponent.tsx";
import Typography from "@mui/material/Typography";
import {fetchMembers, fetchMembersRoles} from "../../store/actions/member.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import AddIcon from "@mui/icons-material/Add";
import {updateAction} from "../../store/actions/action.ts";
import ActionSummaryGeneratorWizardDialog from "../../components/actions/ActionSummaryGeneratorWizardDialog.tsx";
import {Summarize} from "@mui/icons-material";
import FlightSettlePaymentWizardDialog from "../../components/flights/FlightSettlePaymentWizardDialog.tsx";


export default function DashboardPage() {
    const [flightCreationWizardDialogOpen, setFlightCreationWizardDialogOpen] = useState<boolean>(false);
    const [summaryGeneratorWizardDialogOpen, setSummaryGeneratorWizardDialogOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const {flights, fetchingFlightsInProgress} = useSelector((state: RootState) => state.currentAction);
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))
    const membersStoreState = useSelector((state: RootState) => state.members);
    const glidersStoreState = useSelector((state: RootState) => state.gliders);
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes);
    const dispatch = useAppDispatch();
    const [editedFlightId, setEditedFlightId] = useState<number | null>(null);
    const [editedFlightData, setEditedFlightData] = useState<FlightCreateSchema | null>(null);
    const [editFlightDetailsDialogOpen, setEditFlightDetailsDialogOpen] = useState<boolean>(false);
    const [startTowDialogFlight, setStartTowDialogFlight] = useState<FlightSchema | null>(null);
    const [endTowDialogFlight, setEndTowDialogFlight] = useState<FlightSchema | null>(null);
    const [settlePaymentDialogFlight, setSettlePaymentDialogFlight] = useState<FlightSchema | null>(null);
    const shownFlightStates = action?.closed_at ? ["Landed"] : ORDERED_FLIGHT_STATES;
    const currentActionStoreState = useSelector((state: RootState) => state.currentAction)


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
    });


    const isFullyConfigured = () => {
        return action && action.field_responsible_id && action.responsible_cfi_id && ((currentActionStoreState.activeTowAirplanes?.length || 0) > 0)
    }
    const flightsInTowState = flights?.filter((flight) => flight.state === "Tow");
    const flightsInAnyFlightState = flights?.filter((flight) => isFlightActive(flight));
    const busyGliders = useCallback((currentFlight: FlightSchema) => flightsInAnyFlightState?.filter(flight => flight.id !== currentFlight.id).map((flight) => flight.glider_id).filter(Boolean) || [] as number[], [flightsInAnyFlightState])
    const busyTowAirplanesForFlight = useCallback((currentFlight: FlightSchema) => flightsInTowState?.filter(flight => flight.id !== currentFlight.id).map((flight) => flight.tow_airplane_id).filter(Boolean) || [] as number [], [flightsInTowState]);
    const busyGliderPilots = useCallback(
        (currentFlight: FlightSchema) => flightsInAnyFlightState?.filter(flight => flight.id !== currentFlight.id).map((flight) => [flight.pilot_1_id, flight.pilot_2_id])
            .flat()
            .filter(Boolean) || [] as number[],
        [flightsInAnyFlightState]
    );
    const busyTowPilots = useCallback((currentFlight: FlightSchema) => flightsInTowState?.filter(flight => flight.id !== currentFlight.id).map((flight) => flight.tow_pilot_id).filter(Boolean) || [] as number[], [flightsInTowState]);
    const busyMembers = useCallback((currentFlight: FlightSchema) => [...busyGliderPilots(currentFlight), ...busyTowPilots(currentFlight)], [busyGliderPilots, busyTowPilots]);
    const busyTowAirplaneIds = flightsInTowState?.map((flight) => flight.tow_airplane_id) || [];
    const availableTowAirplanes = currentActionStoreState.activeTowAirplanes?.filter((towAirplane) => !busyTowAirplaneIds?.includes(towAirplane.airplane_id)) || [];

    const getTowAirplaneById = (id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id);
    const getGliderById = (id: number) => glidersStoreState.gliders?.find((glider) => glider.id === id);
    const isTowAirplaneAvailable = (towAirplaneId: number) => availableTowAirplanes?.find((towAirplane) => towAirplane.airplane_id === towAirplaneId);


    /**
     * Returns a tuple of [hasBusyEntities, busyEntities]
     */
    const getBusyEntitiesFromFlight = useCallback((flight: FlightSchema, includeTowAirplanesAndPilots = true) => {
        if (!membersStoreState.members) {
            throw new Error("Members not loaded")
        }

        if (!glidersStoreState.gliders) {
            throw new Error("Gliders not loaded")
        }

        if (includeTowAirplanesAndPilots && !towAirplanesStoreState.towAirplanes) {
            throw new Error("Tow airplanes not loaded")
        }

        const busyEntities = {
            members: [] as string[],
            gliders: [] as string[],
            towAirplanes: [] as string[],
        }

        if (flight.glider_id && busyGliders(flight).includes(flight.glider_id)) {
            const glider = glidersStoreState.gliders.find((glider) => glider.id === flight.glider_id)
            if (!glider) {
                throw new Error(`Glider with id ${flight.glider_id} not found`)
            }
            busyEntities.gliders.push(getGliderDisplayValue(glider))
        }

        if (includeTowAirplanesAndPilots && flight.tow_airplane_id && busyTowAirplanesForFlight(flight).includes(flight.tow_airplane_id)) {
            const towAirplane = towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === flight.tow_airplane_id)
            if (!towAirplane) {
                throw new Error(`Tow airplane with id ${flight.tow_airplane_id} not found`)
            }
            busyEntities.towAirplanes.push(getTowAirplaneDisplayValue(towAirplane))
        }

        if (flight.pilot_1_id && busyMembers(flight).includes(flight.pilot_1_id)) {
            const member = membersStoreState.members.find((member) => member.id === flight.pilot_1_id)
            if (!member) {
                throw new Error(`Member with id ${flight.pilot_1_id} not found`)
            }
            busyEntities.members.push(getMemberDisplayValue(member))
        }

        if (flight.pilot_2_id && busyMembers(flight).includes(flight.pilot_2_id)) {
            const member = membersStoreState.members.find((member) => member.id === flight.pilot_2_id)
            if (!member) {
                throw new Error(`Member with id ${flight.pilot_2_id} not found`)
            }
            busyEntities.members.push(getMemberDisplayValue(member))
        }

        if (includeTowAirplanesAndPilots && flight.tow_pilot_id && busyMembers(flight).includes(flight.tow_pilot_id)) {
            const member = membersStoreState.members.find((member) => member.id === flight.tow_pilot_id)
            if (!member) {
                throw new Error(`Member with id ${flight.tow_pilot_id} not found`)
            }
            busyEntities.members.push(getMemberDisplayValue(member))
        }

        return busyEntities
    }, [busyGliders, busyTowAirplanesForFlight, busyMembers, membersStoreState.members, glidersStoreState.gliders, towAirplanesStoreState.towAirplanes])

    useEffect(() => {
        if (!flights && !fetchingFlightsInProgress && action) {
            dispatch(fetchFlights(action.id));
            dispatch(fetchGliders());
            dispatch(fetchGliderOwners());
        }
    });

    function onFlightStateUpdated(flightId: number, state: FlightState): undefined {
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
        }

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
                    const towAirplane = getTowAirplaneById(flight.tow_airplane_id)

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
                    return onFlightStateUpdated(flightId, "Inflight")
                }

                if (
                    (flight.state === "Inflight")
                    && (
                        (glider?.type === "touring") || (glider?.type === "self_launch" && !flight.tow_type)
                    )
                ) {
                    return onFlightStateUpdated(flightId, "Draft")
                }

                if (getBusyEntitiesFromFlight(flight)) {
                    const busyEntities = getBusyEntitiesFromFlight(flight)
                    const hasBusyEntities = Object.values(busyEntities).some((entities) => entities.length > 0)

                    if (hasBusyEntities) {
                        const busyEntitiesString = Object.values(busyEntities).flat().join(", ")

                        alert(`${t("FLIGHT_HAS_BUSY_ENTITIES_ALERT")}: ${busyEntitiesString}`)
                        return;
                    }
                }

                if ((!flight.tow_airplane_id || !flight.tow_pilot_id) && (glider?.type !== "touring")) {
                    if (glider?.type === "regular") {
                        if (availableTowAirplanes.length === 1) {
                            const towPilotId = availableTowAirplanes[0].tow_pilot_id;
                            if ([flight.pilot_1_id, flight.pilot_2_id].filter(Boolean).includes(towPilotId)) {
                                const towPilot = membersStoreState.members?.find((member) => member.id === availableTowAirplanes[0].tow_pilot_id)
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
                    const busyEntities = getBusyEntitiesFromFlight(flight)
                    const hasBusyEntities = Object.values(busyEntities).some((entities) => entities.length > 0)

                    if (hasBusyEntities) {
                        const busyEntitiesString = Object.values(busyEntities).flat().join(", ")

                        alert(`${t("FLIGHT_HAS_BUSY_ENTITIES_ALERT")}: ${busyEntitiesString}`)
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
                    }))))
                }

                break;
            default:
                throw new Error(`Unknown flight state: ${state}`)
        }

        promises.push(new Promise(() => {
            dispatch(updateFlight({
                flightId,
                updatePayload,
            }))
        }))

        Promise.all(promises).then()
    }

    function renderEditFlightDialog() {
        if (!editFlightDetailsDialogOpen || !editedFlightData) {
            return null;
        }

        return (
            <EditFlightDetailsDialog
                flightId={editedFlightId}
                flightData={editedFlightData}
                open={editFlightDetailsDialogOpen}
                onCancel={() => {
                    setEditedFlightId(null)
                    setEditFlightDetailsDialogOpen(false)
                }}
                onCreate={(createPayload) => {
                    dispatch(createFlight({
                        createPayload,
                    }));
                    setEditFlightDetailsDialogOpen(false)
                    setEditedFlightData(null)
                }}
                onUpdate={(flightId, updatePayload) => {
                    dispatch(updateFlight({
                        flightId,
                        updatePayload,
                    }));
                    setEditedFlightId(null);
                    setEditFlightDetailsDialogOpen(false)
                    setEditedFlightData(null)
                }}
            />
        )
    }

    function onAdvancedEdit(flight: FlightCreateSchema) {
        setEditedFlightId(null)
        setFlightCreationWizardDialogOpen(false);
        setEditedFlightData(flight)
        setEditFlightDetailsDialogOpen(true);
    }

    function renderStartTowDialog() {
        if (!startTowDialogFlight?.id) {
            return
        }

        return (
            <FlightStartTowDialog
                open={Boolean(startTowDialogFlight)}
                flight={startTowDialogFlight}
                onCancel={() => setStartTowDialogFlight(null)}
                onSubmit={(flight) => {
                    dispatch(updateFlight({
                        flightId: startTowDialogFlight?.id,
                        updatePayload: flight,
                    }))

                    if (action?.id) {
                        dispatch(createEvent({
                            action_id: action.id,
                            type: "flight_took_off",
                            payload: {
                                flight_id: startTowDialogFlight.id,
                                field_responsible_id: action?.field_responsible_id,
                            }
                        }))
                    }

                    setStartTowDialogFlight(null)
                }}
            />
        )
    }

    function renderFlightCreationWizardDialog() {
        return flightCreationWizardDialogOpen && (
            <FlightCreationWizardDialog
                open={flightCreationWizardDialogOpen}
                onCancel={() => {
                    setFlightCreationWizardDialogOpen(false);
                    setEditedFlightData(null);
                }}
                onSubmit={payload => {
                    dispatch(createFlight({
                        createPayload: payload
                    }))
                    setFlightCreationWizardDialogOpen(false);
                    setEditedFlightData(null)
                }}
                onAdvancedEdit={(flight) => onAdvancedEdit(flight)}
            />
        )
    }

    function renderSummaryGeneratorWizardDialog() {
        return (
            <ActionSummaryGeneratorWizardDialog
                open={Boolean(summaryGeneratorWizardDialogOpen)}
                onClose={() => {
                    setSummaryGeneratorWizardDialogOpen(false);
                }}
            />
        )
    }

    function renderSettlePaymentWizardDialog() {
        if (!settlePaymentDialogFlight) {
            return null;
        }

        return (
            <FlightSettlePaymentWizardDialog
                open={Boolean(settlePaymentDialogFlight)}
                onClose={() => setSettlePaymentDialogFlight(null)}
                flight={settlePaymentDialogFlight}
                onSubmit={(flight) => {
                    dispatch(updateFlight({
                        flightId: settlePaymentDialogFlight?.id,
                        updatePayload: flight,
                    }))
                    setSettlePaymentDialogFlight(null)
                }}
            />
        )
    }

    function renderEndTowDialog() {
        if (!endTowDialogFlight?.id) {
            return
        }

        return (
            <FlightEndTowDialog
                open={Boolean(endTowDialogFlight)}
                flight={endTowDialogFlight}
                onCancel={() => setEndTowDialogFlight(null)}
                onSubmit={(flight) => {
                    dispatch(updateFlight({
                        flightId: endTowDialogFlight?.id,
                        updatePayload: flight,
                    }))

                    if (action?.id) {
                        dispatch(createEvent({
                            action_id: action.id,
                            type: "flight_tow_released",
                            payload: {
                                flight_id: endTowDialogFlight.id,
                                field_responsible_id: action?.field_responsible_id,
                            }
                        }))
                    }

                    setEndTowDialogFlight(null)
                }}
            />
        )
    }

    const handleActionClosed = () => {
        if (!action) {
            return;
        }

        if (!confirm(t("CLOSE_ACTION_CONFIRMATION"))) {
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
        )

        dispatch(
            createEvent({
                action_id: action.id,
                type: "action_closed",
                payload: {
                    field_responsible_id: action?.field_responsible_id,
                }
            })
        )
    }

    function renderTopBar() {
        return (
            <Grid container mb={2} spacing={1}>
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!isFullyConfigured() || Boolean(action?.closed_at)}
                        style={{
                            height: "100%",
                            width: "100%",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                        }}
                        onClick={() => setFlightCreationWizardDialogOpen(true)}>
                        <AddIcon/>
                        {t("NEW_FLIGHT")}
                    </Button>
                </Grid>
                <Grid item xs={9}>
                    <ActionConfigurationComponent/>
                </Grid>
            </Grid>
        )
    }

    function renderActionNotConfigured() {
        const missingConfigurations = [];

        if (!action?.field_responsible_id) {
            missingConfigurations.push(t("FIELD_RESPONSIBLE"))
        }

        if (!action?.responsible_cfi_id) {
            missingConfigurations.push(t("RESPONSIBLE_CFI"))
        }

        if ((currentActionStoreState.activeTowAirplanes?.length || 0) === 0) {
            missingConfigurations.push(t("TOW_AIRPLANE"))
        }

        return (
            <Typography variant="h4" component="h4">
                <Card>
                    <Alert severity="warning" sx={{
                        height: "100%",
                    }}>
                        <AlertTitle>
                            <strong>{t("ACTION_NOT_FULLY_CONFIGURED_TITLE")}</strong>
                        </AlertTitle>
                        {t("ACTION_NOT_FULLY_CONFIGURED_MESSAGE")}.
                        <br/>
                        <br/>
                        <strong>{t("MISSING_CONFIGURATIONS")}:</strong> {missingConfigurations.join(", ")}
                    </Alert>
                </Card>
            </Typography>
        )
    }

    const activeFlightsExist = flights?.some((flight) => (flight.state === "Tow") || (flight.state === "Inflight"));
    const nonFlightsExist = flights?.some((flight) => flight.state !== "Draft");

    const isCloseActionDisabled = () => {
        const clubGuestFlights = flights?.filter((flight) => flight.flight_type === "ClubGuest") || [];

        const isFlightPaymentSettled = (flight: FlightSchema) => {
            if (flight.flight_type !== "ClubGuest") {
                return true;
            }

            return Boolean(
                (flight.paying_member_id) || (flight.payment_method && flight.payment_receiver_id)
            )
        }

        const clubGuestFlightsWithUnsettledPaymentsExist = clubGuestFlights
            .some((flight) => !isFlightPaymentSettled(flight))

        return activeFlightsExist || Boolean(action?.closed_at) || clubGuestFlightsWithUnsettledPaymentsExist
    }

    function renderCloseActionButton() {
        return (
            <Button
                variant="contained"
                color="error"
                disabled={isCloseActionDisabled()}
                onClick={() => handleActionClosed()}
                size={"large"}
                sx={{
                    fontSize: "1.5rem",
                }}
            >
                {t("CLOSE_ACTION")}
            </Button>
        )
    }

    function renderOpenSummaryGeneratorButton() {
        return (
            <Button
                variant="contained"
                color="success"
                onClick={() => setSummaryGeneratorWizardDialogOpen(true)}
                disabled={!nonFlightsExist}
                size={"large"}
                sx={{
                    fontSize: "1.5rem",
                    marginLeft: "1rem",
                }}
            >
                <Summarize/>
                {t("OPEN_SUMMARY_GENERATOR")}
            </Button>
        )
    }

    function renderFlightsTable(
        state: FlightState,
        flights: FlightSchema[]
    ) {
        function renderTable() {
            if (flights.length === 0) {
                return (
                    <Typography variant="h6" component="h6">
                        {t("NO_FLIGHTS_IN_THIS_STATE")}.
                    </Typography>
                )
            }

            return (
                <FlightsTable
                    flights={flights}
                    setDuplicateFlight={(flight) => {
                        setEditFlightDetailsDialogOpen(true);
                        setEditedFlightData({...flight})
                    }}
                    setEditedFlight={(flightId, flight) => {
                        const actionId = action?.id;

                        if (!actionId) {
                            return;
                        }

                        setEditFlightDetailsDialogOpen(true);
                        setEditedFlightId(flightId);
                        setEditedFlightData({
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            action_id: actionId,
                            ...flight
                        })
                    }}
                    onFlightStateUpdated={onFlightStateUpdated}
                    onSettlePayment={(flight) => setSettlePaymentDialogFlight(flight)}
                />
            )
        }

        return (
            <Grid mt={1}>
                <Grid>
                    <Typography variant="h5" component="h5" sx={{fontWeight: "bold"}}>
                        {t(state.toUpperCase())}: {flights.length} {t("FLIGHTS")}
                    </Typography>
                </Grid>
                <Grid mt={0.5}>
                    {renderTable()}
                </Grid>
            </Grid>
        )
    }

    function renderFlightsTables() {
        if (!isFullyConfigured()) {
            return renderActionNotConfigured()
        }

        return (
            <Grid container>
                <Grid item xs={12}>
                    {
                        shownFlightStates.includes("Draft") && renderFlightsTable(
                            t("DRAFT_FLIGHTS"),
                            flights?.filter((flight) => flight.state === "Draft").sort((a, b) => {
                                return a.id < b.id ? 1 : -1
                            }) || []
                        )
                    }
                    {
                        shownFlightStates.includes("Tow") && renderFlightsTable(
                            t("TOW_FLIGHTS"),
                            flights?.filter((flight) => flight.state === "Tow").sort((a, b) => {
                                if (!a.take_off_at || !b.take_off_at) {
                                    return 0
                                }

                                return new Date(a.take_off_at) < new Date(b.take_off_at) ? 1 : -1
                            }) || []
                        )
                    }
                    {
                        shownFlightStates.includes("Inflight") && renderFlightsTable(
                            t("INFLIGHT_FLIGHTS"),
                            flights?.filter((flight) => flight.state === "Inflight").sort((a, b) => {
                                if (!a.take_off_at || !b.take_off_at) {
                                    return 0
                                }

                                return new Date(a.take_off_at) < new Date(b.take_off_at) ? 1 : -1
                            }) || []
                        )
                    }
                    {
                        shownFlightStates.includes("Landed") && renderFlightsTable(
                            t("LANDED_FLIGHTS"),
                            flights?.filter((flight) => flight.state === "Landed").sort((a, b) => {
                                if (!a.landing_at || !b.landing_at) {
                                    return 0
                                }

                                return new Date(a.landing_at) < new Date(b.landing_at) ? 1 : -1
                            }) || []
                        )
                    }
                </Grid>
            </Grid>
        )
    }

    function renderQuickActions() {
        return (
            <Grid
                pt={2}
                sx={{
                    textAlign: "center",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {renderOpenSummaryGeneratorButton()}
                {renderCloseActionButton()}
            </Grid>
        )
    }

    function renderContent() {
        return (
            <Grid>
                {renderTopBar()}
                {renderFlightsTables()}
                {renderQuickActions()}
            </Grid>
        )
    }

    return (
        <>
            {renderEditFlightDialog()}
            {renderStartTowDialog()}
            {renderEndTowDialog()}
            {renderFlightCreationWizardDialog()}
            {renderSummaryGeneratorWizardDialog()}
            {renderSettlePaymentWizardDialog()}

            {renderContent()}
        </>
    )
}
