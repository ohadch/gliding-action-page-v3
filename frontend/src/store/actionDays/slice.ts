import { createSlice } from '@reduxjs/toolkit';
import { ActionDaysState } from './types';
import {
    fetchActions,
    setCurrentActionId,
    updateAction,
    addActiveTowAirplane,
    deleteActiveTowAirplane,
    fetchFlights,
    createFlight,
    updateFlight,
    deleteFlight,
    fetchActiveTowAirplanes,
    setActionAsToday,
} from './actions';

const initialState: ActionDaysState = {
    list: {
        actions: [],
        loading: false,
        error: null,
    },
    currentDay: {
        currentActionId: null,
        flights: null,
        comments: [],
        activeTowAirplanes: [],
        loading: false,
        error: null,
        reviewMode: false,
    },
};

const actionDaysSlice = createSlice({
    name: 'actionDays',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch actions
            .addCase(fetchActions.pending, (state) => {
                state.list.loading = true;
                state.list.error = null;
            })
            .addCase(fetchActions.fulfilled, (state, action) => {
                state.list.loading = false;
                state.list.actions = action.payload;
            })
            .addCase(fetchActions.rejected, (state, action) => {
                state.list.loading = false;
                state.list.error = action.error.message || 'Failed to fetch actions';
            })
            // Set current action
            .addCase(setCurrentActionId.fulfilled, (state, action) => {
                state.currentDay.currentActionId = action.payload;
            })
            // Update action
            .addCase(updateAction.fulfilled, (state, action) => {
                const index = state.list.actions.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.list.actions[index] = action.payload;
                }
            })
            // Add active tow airplane
            .addCase(addActiveTowAirplane.fulfilled, (state, action) => {
                state.currentDay.activeTowAirplanes.push(action.payload);
            })
            // Delete active tow airplane
            .addCase(deleteActiveTowAirplane.fulfilled, (state, action) => {
                state.currentDay.activeTowAirplanes = state.currentDay.activeTowAirplanes
                    .filter(ata => ata.id !== action.payload);
            })
            // Fetch flights
            .addCase(fetchFlights.pending, (state) => {
                state.currentDay.loading = true;
                state.currentDay.error = null;
            })
            .addCase(fetchFlights.fulfilled, (state, action) => {
                state.currentDay.loading = false;
                state.currentDay.flights = action.payload;
            })
            .addCase(fetchFlights.rejected, (state, action) => {
                state.currentDay.loading = false;
                state.currentDay.error = action.error.message || 'Failed to fetch flights';
                state.currentDay.flights = null;
            })
            // Create flight
            .addCase(createFlight.fulfilled, (state, action) => {
                state.currentDay.flights.push(action.payload);
            })
            // Update flight
            .addCase(updateFlight.fulfilled, (state, action) => {
                const index = state.currentDay.flights.findIndex(f => f.id === action.payload.id);
                if (index !== -1) {
                    state.currentDay.flights[index] = action.payload;
                }
            })
            // Delete flight
            .addCase(deleteFlight.fulfilled, (state, action) => {
                state.currentDay.flights = state.currentDay.flights.filter(f => f.id !== action.payload);
            })
            // Fetch active tow airplanes
            .addCase(fetchActiveTowAirplanes.pending, (state) => {
                state.currentDay.loading = true;
                state.currentDay.error = null;
            })
            .addCase(fetchActiveTowAirplanes.fulfilled, (state, action) => {
                state.currentDay.loading = false;
                state.currentDay.activeTowAirplanes = action.payload;
            })
            .addCase(fetchActiveTowAirplanes.rejected, (state, action) => {
                state.currentDay.loading = false;
                state.currentDay.error = action.error.message || 'Failed to fetch active tow airplanes';
            })
            // Set action as today
            .addCase(setActionAsToday.pending, (state) => {
                state.currentDay.loading = true;
                state.currentDay.error = null;
            })
            .addCase(setActionAsToday.fulfilled, (state, action) => {
                state.currentDay.loading = false;
                state.currentDay.currentActionId = action.payload.id;
                state.list.actions.push(action.payload);
            })
            .addCase(setActionAsToday.rejected, (state, action) => {
                state.currentDay.loading = false;
                state.currentDay.error = action.error.message || 'Failed to set action as today';
            })
    },
});

// Export the reducer as default
export default actionDaysSlice.reducer;