import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {FlightSchema, FlightState} from "../../lib/types";
import FlightsTable from "../flights/FlightsTable";
import { useTranslation } from "react-i18next";
import {ORDERED_FLIGHT_STATES} from "../../utils/consts.ts";

interface FlightsListProps {
    onEditFlight: (flightId: number, flight: FlightSchema) => void;
    onDuplicateFlight: (flight: FlightSchema) => void;
    onFlightStateUpdated: (flightId: number, state: FlightState) => void;
    onSettlePayment: (flight: FlightSchema) => void;
}

export function FlightsList({
    onEditFlight,
    onDuplicateFlight,
    onFlightStateUpdated,
    onSettlePayment
}: FlightsListProps) {
    const { t } = useTranslation();
    const { flights } = useSelector((state: RootState) => state.actions);
    const action = useSelector((state: RootState) => 
        state.actions.actions?.find((action) => action.id === state.actions.actionId)
    );
    const shownFlightStates: FlightState[] = action?.closed_at ? ["Landed"] : ORDERED_FLIGHT_STATES;

    function renderFlightsTable(state: FlightState, flights: FlightSchema[]) {
        return (
            <Grid mt={1} key={state}>
                <Grid>
                    <Typography variant="h5" component="h5" sx={{fontWeight: "bold"}}>
                        {t(state.toUpperCase())}: {flights.length} {t("FLIGHTS")}
                    </Typography>
                </Grid>
                <Grid mt={0.5}>
                    {flights.length === 0 ? (
                        <Typography variant="h6" component="h6">
                            {t("NO_FLIGHTS_IN_THIS_STATE")}.
                        </Typography>
                    ) : (
                        <FlightsTable
                            flights={flights}
                            setEditedFlight={onEditFlight}
                            setDuplicateFlight={onDuplicateFlight}
                            onFlightStateUpdated={onFlightStateUpdated}
                            onSettlePayment={onSettlePayment}
                        />
                    )}
                </Grid>
            </Grid>
        );
    }

    if (!flights) {
        return null;
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                {shownFlightStates.map(state => {
                    const stateFlights = flights.filter(f => f.state === state)
                        .sort((a, b) => {
                            if (state === "Draft") return b.id - a.id;
                            if (!a.take_off_at || !b.take_off_at) return 0;
                            return new Date(b.take_off_at).getTime() - new Date(a.take_off_at).getTime();
                        });
                    
                    return renderFlightsTable(state, stateFlights);
                })}
            </Grid>
        </Grid>
    );
}