import {Button, Grid} from "@mui/material";
import FlightsTable from "../../components/flights/FlightsTable.tsx";
import {useEffect, useState} from "react";
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

export default function DashboardPage() {
    const [flightCreationWizardDialogOpen, setFlightCreationWizardDialogOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const {flights, fetchingFlightsInProgress, action} = useSelector((state: RootState) => state.currentAction);
    const dispatch = useAppDispatch();
    const [editedFlightId, setEditedFlightId] = useState<number | null>(null);
    const [editedFlightData, setEditedFlightData] = useState<FlightCreateSchema | null>(null);
    const [editFlightDetailsDialogOpen, setEditFlightDetailsDialogOpen] = useState<boolean>(false);
    const [startTowDialogFlight, setStartTowDialogFlight] = useState<FlightSchema | null>(null);
    const [endTowDialogFlight, setEndTowDialogFlight] = useState<FlightSchema | null>(null);

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
                    </Box>
                </Grid>


                <FlightsTable
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
