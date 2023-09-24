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
import {FlightCreateSchema, FlightSchema} from "../../lib/types.ts";

export default function DashboardPage() {
    const [flightCreationWizardDialogOpen, setFlightCreationWizardDialogOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const {flights, fetchingFlightsInProgress, action} = useSelector((state: RootState) => state.currentAction);
    const dispatch = useAppDispatch();
    const [editedFlightId, setEditedFlightId] = useState<number | null>(null);
    const [editedFlightData, setEditedFlightData] = useState<FlightCreateSchema | null>(null);
    const [duplicateFlightId, setDuplicateFlightId] = useState<number | null>(null);
    const [editFlightDetailsDialogOpen, setEditFlightDetailsDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!flights && !fetchingFlightsInProgress && action) {
            dispatch(fetchFlights(action.id));
            dispatch(fetchGliders());
            dispatch(fetchGliderOwners());
        }
    });

    function renderEditFlightDialog() {
        if (!editedFlightId && !duplicateFlightId) {
            return null
        }

        const flight = flights?.find((flight) => [editedFlightId, duplicateFlightId].includes(flight.id));

        let flightData: FlightCreateSchema | FlightSchema | null = null;

        if (flight) {
            flightData = flight
        } else if (editedFlightData) {
            flightData = editedFlightData
        } else {
            return null
        }

        return (
            <EditFlightDetailsDialog
                flightId={flight?.id}
                flightData={flightData}
                open={editFlightDetailsDialogOpen}
                onCancel={() => {
                    setEditedFlightId(null)
                    setDuplicateFlightId(null)
                    setEditFlightDetailsDialogOpen(false)
                }}
                onCreate={
                    duplicateFlightId
                        ? (createPayload) => {
                            dispatch(createFlight({
                                createPayload,
                            }));
                            setDuplicateFlightId(null);
                            setEditFlightDetailsDialogOpen(false)
                        }
                        : undefined
                }
                onUpdate={
                    editedFlightId
                        ? (flightId, updatePayload) => {
                            dispatch(updateFlight({
                                flightId,
                                updatePayload,
                            }));
                            setEditedFlightId(null);
                            setEditFlightDetailsDialogOpen(false)
                        }
                        : undefined
                }
            />
        )
    }

    return (
        <>
            {renderEditFlightDialog()}

            {flightCreationWizardDialogOpen && (
                <FlightCreationWizardDialog
                    open={flightCreationWizardDialogOpen}
                    onCancel={() => {
                        setFlightCreationWizardDialogOpen(false);
                    }}
                    onSubmit={payload => {
                        dispatch(createFlight({
                            createPayload: payload
                        }))
                        setFlightCreationWizardDialogOpen(false);
                    }}
                    onAdvancedEdit={(flight) => {
                        setFlightCreationWizardDialogOpen(false);
                        setEditedFlightData(flight)
                        setEditFlightDetailsDialogOpen(true);
                    }}
                />
            )}

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
                    setDuplicateFlightId={(flightId) => {
                        setDuplicateFlightId(flightId);
                        setEditFlightDetailsDialogOpen(true);
                    }}
                    setEditedFlightId={(flightId) => {
                        setEditedFlightId(flightId);
                        setEditFlightDetailsDialogOpen(true);
                    }}
                />
            </Grid>
        </>
    )
}
