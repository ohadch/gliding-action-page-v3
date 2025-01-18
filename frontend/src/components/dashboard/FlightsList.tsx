import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FlightSchema, FlightState } from "../../lib/types";
import FlightsTable from "../flights/FlightsTable";
import { useTranslation } from "react-i18next";
import { ORDERED_FLIGHT_STATES } from "../../utils/consts";

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
    const flights = useSelector((state: RootState) => state.actionDays.currentDay.flights);
    const action = useSelector((state: RootState) => 
        state.actionDays.list.actions?.find(a => a.id === state.actionDays.currentDay.currentActionId)
    );

    const shownFlightStates: FlightState[] = action?.closed_at ? ["Landed"] : ORDERED_FLIGHT_STATES;

    if (!flights || !action) {
        return null;
    }

    function renderFlightsTable(state: FlightState, stateFlights: FlightSchema[]) {
        return (
            <Grid item xs={12} mt={1} key={state}>
                <Typography variant="h5" component="h5" sx={{ fontWeight: "bold" }}>
                    {t(state.toUpperCase())}: {stateFlights.length} {t("FLIGHTS")}
                </Typography>
                
                <Grid mt={0.5}>
                    {stateFlights.length === 0 ? (
                        <Typography variant="h6" component="h6">
                            {t("NO_FLIGHTS_IN_THIS_STATE")}.
                        </Typography>
                    ) : (
                        <FlightsTable
                            flights={stateFlights}
                            setEditedFlight={onEditFlight}
                            setDuplicateFlight={onDuplicateFlight}
                            onFlightStateUpdated={onFlightStateUpdated}
                            onSettlePayment={onSettlePayment}
                            disabled={Boolean(action.closed_at)}
                        />
                    )}
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={2}>
            {shownFlightStates.map(state => {
                const stateFlights = flights
                    .filter(f => f.state === state)
                    .sort((a, b) => {
                        if (state === "Draft") return b.id - a.id;
                        if (!a.take_off_at || !b.take_off_at) return 0;
                        return new Date(b.take_off_at).getTime() - new Date(a.take_off_at).getTime();
                    });
                
                return renderFlightsTable(state, stateFlights);
            })}
        </Grid>
    );
}