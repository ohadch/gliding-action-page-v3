import {createSlice} from '@reduxjs/toolkit'
import {CurrentActionStoreState} from "../@types/InitialData.ts";
import {CacheService} from "../../utils/cache.ts";
import {CACHE_KEY_ACTION} from "../../utils/consts.ts";
import {
    createFlight,
    deleteFlight,
    fetchActiveTowAirplanes,
    fetchFlights,
    updateFlight
} from "../actions/currentAction.ts";

const initialState: CurrentActionStoreState = {
    actionId: CacheService.getNumber(CACHE_KEY_ACTION),
    fetchInProgress: false,
    fetchingActiveTowAirplanesInProgress: false,
    initialState: false,
    fetchingFlightsInProgress: false,
}

export const currentActionSlice = createSlice({
    name: 'actions',
    initialState,
    reducers: {
        setCurrentAction: (state, action) => {
            state.actionId = action.payload.id
            CacheService.set(CACHE_KEY_ACTION, action.payload.id)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveTowAirplanes.pending, (state) => {
                state.fetchingActiveTowAirplanesInProgress = true
            })
            .addCase(fetchActiveTowAirplanes.fulfilled, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.activeTowAirplanes = action.payload
            })
            .addCase(fetchActiveTowAirplanes.rejected, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.error = action.error.message
            })
            .addCase(fetchFlights.pending, (state) => {
                state.fetchingFlightsInProgress = true
            })
            .addCase(fetchFlights.fulfilled, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.flights = action.payload
            })
            .addCase(fetchFlights.rejected, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.error = action.error.message
            })
            .addCase(createFlight.pending, (state) => {
                state.fetchingFlightsInProgress = true
            })
            .addCase(createFlight.fulfilled, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.flights = [...(state.flights || []), action.payload]
            })
            .addCase(createFlight.rejected, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.error = action.error.message
            })
            .addCase(deleteFlight.pending, (state) => {
                state.fetchingFlightsInProgress = true
            })
            .addCase(deleteFlight.fulfilled, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.flights = state.flights?.filter(flight => flight.id !== action.payload)
            })
            .addCase(deleteFlight.rejected, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.error = action.error.message
            })
            .addCase(updateFlight.pending, (state) => {
                state.fetchingFlightsInProgress = true
            })
            .addCase(updateFlight.fulfilled, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.flights = state.flights?.map(flight => flight.id === action.payload.id ? action.payload : flight)
            })
            .addCase(updateFlight.rejected, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.error = action.error.message
            })
    }
})

export const {setCurrentAction} = currentActionSlice.actions;
