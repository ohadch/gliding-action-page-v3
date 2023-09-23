import {Button, Grid} from "@mui/material";
import FlightsTable from "../../components/flights/FlightsTable.tsx";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import CreateOrUpdateFlightDialog from "../../components/flights/CreateOrUpdateFlightDialog.tsx";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {FlightState} from "../../utils/enums.ts";
import {createFlight, fetchFlights} from "../../store/actions/currentAction.ts";
import FlightCreationWizardDialog from "../../components/flights/FlightCreationWizardDialog.tsx";

export default function DashboardPage() {
    const [createOrUpdateFlightDialogOpen, setCreateOrUpdateFlightDialogOpen] = useState<boolean>(false);
    const [flightCreationWizardDialogOpen, setFlightCreationWizardDialogOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const {flights, fetchingFlightsInProgress, action} = useSelector((state: RootState) => state.currentAction);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!flights && !fetchingFlightsInProgress && action) {
            dispatch(fetchFlights(action.id));
        }
    });


    return (
        <>
            {createOrUpdateFlightDialogOpen && (
                <CreateOrUpdateFlightDialog
                    open={createOrUpdateFlightDialogOpen}
                    onCancel={() => setCreateOrUpdateFlightDialogOpen(false)}
                    onSubmit={(payload) => {
                        if (!action) {
                            return;
                        }

                        dispatch(createFlight({
                            createPayload: {
                                action_id: action.id,
                                status: FlightState.DRAFT,
                                flight_type_id: payload.flightTypeId,
                                glider_id: payload.gliderId,
                                pilot_1_id: payload.pilot1Id,
                                pilot_2_id: payload.pilot2Id,
                                tow_airplane_id: payload.towAirplaneId,
                                tow_pilot_id: payload.towPilotId,
                                tow_type_id: payload.towTypeId,
                                payers_type_id: payload.payersTypeId,
                                payment_method_id: payload.paymentMethodId,
                                paying_member_id: payload.payingMemberId,
                                payment_receiver_id: payload.paymentReceiverId,
                                take_off_at: new Date().toISOString(),
                            }
                        }));

                        setCreateOrUpdateFlightDialogOpen(false);
                    }}
                />
            )}

            {flightCreationWizardDialogOpen && (
                <FlightCreationWizardDialog
                    open={flightCreationWizardDialogOpen}
                    onCancel={() => setFlightCreationWizardDialogOpen(false)}
                    onSubmit={() => alert("TODO")}
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


                <FlightsTable/>
            </Grid>
        </>
    )
}
