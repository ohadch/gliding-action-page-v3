import {
    Grid,
} from "@mui/material";
import FlightsTable from "../../components/flights/FlightsTable.tsx";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {
    fetchComments,
    fetchFlights,
} from "../../store/actions/action.ts";
import {fetchGliderOwners, fetchGliders} from "../../store/actions/glider.ts";
import {FlightSchema} from "../../lib/types.ts";
import moment from "moment/moment";
import {fetchMembers, fetchMembersRoles} from "../../store/actions/member.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";


export default function FlightsBoardPage() {
    const {flights, fetchingFlightsInProgress} = useSelector((state: RootState) => state.actions);
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.actions.actionId))
    const membersStoreState = useSelector((state: RootState) => state.members);
    const glidersStoreState = useSelector((state: RootState) => state.gliders);
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes);
    const dispatch = useAppDispatch();

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

    useEffect(() => {
        if (!flights && !fetchingFlightsInProgress && action) {
            dispatch(fetchFlights(action.id));
            dispatch(fetchComments({actionId: action.id}));
            dispatch(fetchGliders());
            dispatch(fetchGliderOwners());
        }
    });


    useEffect(() => {
        // Refresh the page after 30 seconds
        setTimeout(() => {
            window.location.reload();
        }, 60 * 1000); // 60 seconds
    });

    function renderFlightsTable(
        flights: FlightSchema[]
    ) {
        return (
            <Grid mt={1}>
                <FlightsTable
                    flights={flights}
                />
            </Grid>
        )
    }

    function renderFlightsTables() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    {
                        flights && renderFlightsTable(
                            flights
                                .filter((flight) => flight.state !== "Draft")
                                .sort((a, b) => {
                                if (!a.take_off_at || !b.take_off_at) {
                                    return 0
                                }

                                return moment(a.take_off_at).isBefore(moment(b.take_off_at)) ? 1 : -1
                            }) || []
                        )
                    }
                </Grid>
            </Grid>
        )
    }

    function renderContent() {
        return (
            <Grid>
                {renderFlightsTables()}
            </Grid>
        )
    }

    return (
        <>
            {renderContent()}
        </>
    )
}
