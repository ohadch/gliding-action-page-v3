import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import { fetchFlights, fetchComments } from "../store/actions/action";
import { fetchGliders, fetchGliderOwners } from "../store/actions/glider";
import { fetchMembers, fetchMembersRoles } from "../store/actions/member";
import { fetchTowAirplanes } from "../store/actions/towAirplane";

export function useFlightData() {
    const dispatch = useAppDispatch();
    const action = useSelector((state: RootState) => 
        state.actions.actions?.find((action) => action.id === state.actions.actionId)
    );
    const { flights, fetchingFlightsInProgress } = useSelector((state: RootState) => state.actions);
    const membersStoreState = useSelector((state: RootState) => state.members);
    const glidersStoreState = useSelector((state: RootState) => state.gliders);
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes);

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
    }, [dispatch, glidersStoreState.fetchInProgress, glidersStoreState.gliders, 
        membersStoreState.fetchInProgress, membersStoreState.members, 
        towAirplanesStoreState.fetchInProgress, towAirplanesStoreState.towAirplanes]);

    useEffect(() => {
        if (!flights && !fetchingFlightsInProgress && action) {
            dispatch(fetchFlights(action.id));
            dispatch(fetchComments({actionId: action.id}));
            dispatch(fetchGliders());
            dispatch(fetchGliderOwners());
        }
    }, [action, dispatch, fetchingFlightsInProgress, flights]);

    return {
        action,
        flights,
        membersStoreState,
        glidersStoreState,
        towAirplanesStoreState
    };
} 