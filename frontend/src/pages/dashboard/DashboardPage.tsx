import {
    Button,
    Checkbox,
    FormControl,
    Grid,
    InputLabel, ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent
} from "@mui/material";
import FlightsTable from "../../components/flights/FlightsTable.tsx";
import {useCallback, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {createFlight, fetchFlights, updateFlight} from "../../store/actions/currentAction.ts";
import FlightCreationWizardDialog from "../../components/flights/FlightCreationWizardDialog.tsx";
import {fetchGliderOwners, fetchGliders} from "../../store/actions/glider.ts";
import EditFlightDetailsDialog from "../../components/flights/EditFlightDetailsDialog.tsx";
import {FlightCreateSchema, FlightSchema, FlightState, FlightUpdateSchema} from "../../lib/types.ts";
import FlightStartTowDialog from "../../components/flights/FlightStartTowDialog.tsx";
import moment from "moment/moment";
import FlightEndTowDialog from "../../components/flights/FlightEndTowDialog.tsx";
import {ORDERED_FLIGHT_STATES} from "../../utils/consts.ts";
import {isFlightActive} from "../../utils/flights.ts";
import {getMemberDisplayValue, getTowAirplaneDisplayValue} from "../../utils/display.ts";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function DashboardPage() {
    const [flightCreationWizardDialogOpen, setFlightCreationWizardDialogOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const {flights, fetchingFlightsInProgress, action} = useSelector((state: RootState) => state.currentAction);
    const { members } = useSelector((state: RootState) => state.members);
    const { gliders } = useSelector((state: RootState) => state.gliders);
    const { towAirplanes } = useSelector((state: RootState) => state.towAirplanes);
    const dispatch = useAppDispatch();
    const [editedFlightId, setEditedFlightId] = useState<number | null>(null);
    const [editedFlightData, setEditedFlightData] = useState<FlightCreateSchema | null>(null);
    const [editFlightDetailsDialogOpen, setEditFlightDetailsDialogOpen] = useState<boolean>(false);
    const [startTowDialogFlight, setStartTowDialogFlight] = useState<FlightSchema | null>(null);
    const [endTowDialogFlight, setEndTowDialogFlight] = useState<FlightSchema | null>(null);
    const [shownFlightStates, setShownFlightStates] = useState<FlightState[]>(["Draft", "Tow", "Inflight"]);

    const activeFlights = useSelector((state: RootState) => state.currentAction.flights?.filter((flight) => isFlightActive(flight)));
    const occupiedGliders = useCallback(() => activeFlights?.map((flight) => flight.glider_id).filter(Boolean) || [] as number[], [activeFlights])
    const occupiedTowAirplanes = useCallback(() => activeFlights?.map((flight) => flight.tow_airplane_id).filter(Boolean) || [] as number [], [activeFlights]);
    const occupiedMembers = useCallback(
        () => activeFlights?.map((flight) => [flight.pilot_1_id, flight.pilot_2_id, flight.tow_pilot_id])
            .flat()
            .filter(Boolean) || [] as number[],
        [activeFlights]
    );

    /**
     * Returns a tuple of [hasOccupiedEntities, occupiedEntities]
     */
    const getOccupiedEntitiesFromFlight = useCallback((flight: FlightSchema) => {
        if (!members) {
            throw new Error("Members not loaded")
        }

        if (!gliders) {
            throw new Error("Gliders not loaded")
        }

        if (!towAirplanes) {
            throw new Error("Tow airplanes not loaded")
        }

        const occupiedEntities = {
            members: [] as string[],
            gliders: [] as string[],
            towAirplanes: [] as string[],
        }

        if (flight.glider_id && occupiedGliders().includes(flight.glider_id)) {
            const member = members.find((member) => member.id === flight.glider_id)
            if (!member) {
                throw new Error(`Member with id ${flight.glider_id} not found`)
            }
            occupiedEntities.gliders.push(getMemberDisplayValue(member))
        }

        if (flight.tow_airplane_id && occupiedTowAirplanes().includes(flight.tow_airplane_id)) {
            const towAirplane = towAirplanes.find((towAirplane) => towAirplane.id === flight.tow_airplane_id)
            if (!towAirplane) {
                throw new Error(`Tow airplane with id ${flight.tow_airplane_id} not found`)
            }
            occupiedEntities.towAirplanes.push(getTowAirplaneDisplayValue(towAirplane))
        }

        if (flight.pilot_1_id && occupiedMembers().includes(flight.pilot_1_id)) {
            const member = members.find((member) => member.id === flight.pilot_1_id)
            if (!member) {
                throw new Error(`Member with id ${flight.pilot_1_id} not found`)
            }
            occupiedEntities.members.push(getMemberDisplayValue(member))
        }

        if (flight.pilot_2_id && occupiedMembers().includes(flight.pilot_2_id)) {
            const member = members.find((member) => member.id === flight.pilot_2_id)
            if (!member) {
                throw new Error(`Member with id ${flight.pilot_2_id} not found`)
            }
            occupiedEntities.members.push(getMemberDisplayValue(member))
        }

        if (flight.tow_pilot_id && occupiedMembers().includes(flight.tow_pilot_id)) {
            const member = members.find((member) => member.id === flight.tow_pilot_id)
            if (!member) {
                throw new Error(`Member with id ${flight.tow_pilot_id} not found`)
            }
            occupiedEntities.members.push(getMemberDisplayValue(member))
        }

        return occupiedEntities
    }, [occupiedGliders, occupiedTowAirplanes, occupiedMembers, members, gliders, towAirplanes])

    useEffect(() => {
        if (!flights && !fetchingFlightsInProgress && action) {
            dispatch(fetchFlights(action.id));
            dispatch(fetchGliders());
            dispatch(fetchGliderOwners());
        }
    });

    function onFlightStateUpdated(flightId: number, state: FlightState) {
        const flight = flights?.find((flight) => flight.id === flightId);

        if (!flight) {
            return;
        }

        if (flight.state === state) {
            return;
        }

        const updatePayload: FlightUpdateSchema = {
            ...flight,
            state
        }

        const now = moment().utcOffset(0, true).toISOString();

        switch (state) {
            case "Draft":
                updatePayload.take_off_at = null;
                updatePayload.landing_at = null;
                updatePayload.tow_type = null;
                updatePayload.tow_airplane_id = null;
                updatePayload.tow_pilot_id = null;
                break;
            case "Tow":
                if (getOccupiedEntitiesFromFlight(flight)) {
                    const occupiedEntities = getOccupiedEntitiesFromFlight(flight)
                    const hasOccupiedEntities = Object.values(occupiedEntities).some((entities) => entities.length > 0)

                    if (hasOccupiedEntities) {
                        const occupiedEntitiesString = Object.values(occupiedEntities).flat().join(", ")

                        return alert(`${t("FLIGHT_HAS_OCCUPIED_ENTITIES_ALERT")}: ${occupiedEntitiesString}`)
                    }
                }

                if (!flight.tow_airplane_id || !flight.tow_pilot_id) {
                    return setStartTowDialogFlight(flight);
                }

                if (!flight.take_off_at) {
                    updatePayload.take_off_at = now;
                }
                updatePayload.tow_type = null;
                break;
            case "Inflight":
                if (!flight.tow_type) {
                    return setEndTowDialogFlight(flight);
                }
                updatePayload.landing_at = null;
                break;
            case "Landed":
                updatePayload.landing_at = now;
                break;
            default:
                throw new Error(`Unknown flight state: ${state}`)
        }

        dispatch(updateFlight({
            flightId,
            updatePayload,
        }))
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
                onAdvancedEdit={(flight) => {
                    setEditedFlightId(null)
                    setFlightCreationWizardDialogOpen(false);
                    setEditedFlightData(flight)
                    setEditFlightDetailsDialogOpen(true);
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
                    setEndTowDialogFlight(null)
                }}
            />
        )
    }

    const handleFlightStateChange = (event: SelectChangeEvent<typeof shownFlightStates>) => {
        const {
            target: {value},
        } = event;
        setShownFlightStates(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <>
            {renderEditFlightDialog()}
            {renderStartTowDialog()}
            {renderEndTowDialog()}
            {renderFlightCreationWizardDialog()}

            <Grid container spacing={2}>
                <Grid mb={2}>
                    <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                        <Button variant="contained" color="primary"
                                onClick={() => setFlightCreationWizardDialogOpen(true)}>
                            {t("NEW_FLIGHT")}
                        </Button>
                        <FormControl sx={{m: 1, width: 300}}>
                            <InputLabel id="flight-state-select-label">{t("FLIGHT_STATES")}</InputLabel>
                            <Select
                                labelId="flight-state-select-label"
                                id="flight-state-select"
                                multiple
                                value={shownFlightStates}
                                onChange={(event) => handleFlightStateChange(event)}
                                input={<OutlinedInput label="Tag"/>}
                                renderValue={(selected) => selected.map((value) => t(value.toUpperCase())).join(', ')}
                                MenuProps={MenuProps}
                            >
                                {ORDERED_FLIGHT_STATES.map((state) => (
                                    <MenuItem key={state} value={state}>
                                        <Checkbox checked={shownFlightStates.indexOf(state) > -1}/>
                                        <ListItemText primary={t(state.toUpperCase())}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>


                <FlightsTable
                    shownFlightStates={shownFlightStates}
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
                />
            </Grid>
        </>
    )
}
