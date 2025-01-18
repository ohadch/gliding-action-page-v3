import { createSlice } from '@reduxjs/toolkit';
import { AircraftState } from './types';
import { fetchGliders, fetchGliderOwners, fetchTowAirplanes } from './actions';

const initialState: AircraftState = {
    gliders: [],
    towAirplanes: [],
    gliderOwnerships: [],
    loading: false,
    error: null,
};

const aircraftSlice = createSlice({
    name: 'aircraft',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch gliders
            .addCase(fetchGliders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGliders.fulfilled, (state, action) => {
                state.loading = false;
                state.gliders = action.payload;
            })
            .addCase(fetchGliders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch gliders';
            })
            // Fetch glider owners
            .addCase(fetchGliderOwners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGliderOwners.fulfilled, (state, action) => {
                state.loading = false;
                state.gliderOwnerships = action.payload;
            })
            .addCase(fetchGliderOwners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch glider owners';
            })
            // Fetch tow airplanes
            .addCase(fetchTowAirplanes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTowAirplanes.fulfilled, (state, action) => {
                state.loading = false;
                state.towAirplanes = action.payload;
            })
            .addCase(fetchTowAirplanes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tow airplanes';
            });
    },
});

export default aircraftSlice.reducer; 