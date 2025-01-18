import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch, fetchGliders, fetchTowAirplanes, fetchGliderOwners, fetchFlights, fetchMembers, fetchMembersRoles } from "../store";

export function useFlightData() {
    const dispatch = useAppDispatch();
    const action = useSelector((state: RootState) => 
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );
    const currentDay = useSelector((state: RootState) => state.actionDays.currentDay);
    const { flights } = useSelector((state: RootState) => state.actionDays.currentDay);
    const membersState = useSelector((state: RootState) => state.members);
    const aircraftState = useSelector((state: RootState) => state.aircraft);

    // Initial data fetch - only once
    useEffect(() => {
        if (!membersState.members.length && !membersState.loading) {
            dispatch(fetchMembers());
            dispatch(fetchMembersRoles());
        }
    }, [dispatch, membersState.members.length, membersState.loading]);

    // Fetch aircraft data - only when needed
    useEffect(() => {
        if (!aircraftState.gliders.length && !aircraftState.loading) {
            dispatch(fetchGliders());
        }

        if (!aircraftState.towAirplanes.length && !aircraftState.loading) {
            dispatch(fetchTowAirplanes());
        }
    }, [
        dispatch, 
        aircraftState.loading, 
        aircraftState.gliders.length,
        aircraftState.towAirplanes.length
    ]);

    // Fetch flights only when action changes
    useEffect(() => {
        if (action?.id && !flights && !currentDay.loading) {
            dispatch(fetchFlights(action.id));
            dispatch(fetchGliderOwners());
        }
    }, [action?.id]); // Only depend on action.id

    return {
        action,
        flights,
        membersState,
        aircraftState
    };
} 