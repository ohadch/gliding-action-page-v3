import {Button, Grid} from "@mui/material";
import FlightsTable from "../../components/flights/FlightsTable.tsx";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import CreateOrUpdateFlightDialog from "../../components/flights/CreateOrUpdateFlightDialog.tsx";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {createFlight, fetchFlights} from "../../store/actions/action.ts";
import {FlightState} from "../../utils/enums.ts";

export default function DashboardPage() {
    const [createFlightDialogOpen, setCreateFlightDialogOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const { flights, fetchingFlightsInProgress, currentAction} = useSelector((state: RootState) => state.actions);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!flights && !fetchingFlightsInProgress && currentAction) {
            dispatch(fetchFlights(currentAction.id));
        }
    });


    return (
        <>
            <CreateOrUpdateFlightDialog
                open={createFlightDialogOpen}
                onCancel={() => setCreateFlightDialogOpen(false)}
                onSubmit={(payload) => {
                    if (!currentAction) {
                        return;
                    }

                    dispatch(createFlight({
                        createPayload: {
                            action_id: currentAction.id,
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
                            take_off_at: new Date().toISOString(),
                        }
                    }));

                    setCreateFlightDialogOpen(false);
                }}
            />

            <Grid container spacing={2}>
                <Grid mb={2}>
                    <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                        <Button variant="contained" color="primary" onClick={() => setCreateFlightDialogOpen(true)}>
                            {t("NEW_FLIGHT")}
                        </Button>
                    </Box>
                </Grid>


                {flights && <FlightsTable flights={flights}/>}
            </Grid>
        </>
    )
}
