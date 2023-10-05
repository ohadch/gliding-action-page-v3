import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {CurrentActionStoreState} from "../types/InitialData.ts";
import {CacheService} from "../../utils/cache.ts";
import {CACHE_KEY_ACTION} from "../../utils/consts.ts";
import {
    addActiveTowAirplane,
    createFlight, deleteActiveTowAirplane,
    deleteFlight,
    fetchActiveTowAirplanes, fetchEvents,
    fetchFlights, updateActiveTowAirplane,
    updateFlight
} from "../actions/currentAction.ts";
import {EventSchema} from "../../lib/types.ts";

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
        setCurrentActionId: (state, action) => {
            state.actionId = action.payload
            action.payload ? CacheService.set(CACHE_KEY_ACTION, action.payload) : CacheService.remove(CACHE_KEY_ACTION)
        },
        setFlights: (state, action) => {
            state.flights = action.payload
        },
        setActiveTowAirplanes: (state, action) => {
            state.activeTowAirplanes = action.payload
        }
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
            .addCase(addActiveTowAirplane.pending, (state) => {
                state.fetchingActiveTowAirplanesInProgress = true
            })
            .addCase(addActiveTowAirplane.fulfilled, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.activeTowAirplanes = [...(state.activeTowAirplanes || []), action.payload]
            })
            .addCase(addActiveTowAirplane.rejected, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.error = action.error.message
            })
            .addCase(updateActiveTowAirplane.pending, (state) => {
                state.fetchingActiveTowAirplanesInProgress = true
            })
            .addCase(updateActiveTowAirplane.fulfilled, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.activeTowAirplanes = state.activeTowAirplanes?.map(airplane => airplane.id === action.payload.id ? action.payload : airplane)
            })
            .addCase(updateActiveTowAirplane.rejected, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.error = action.error.message
            })
            .addCase(deleteActiveTowAirplane.pending, (state) => {
                state.fetchingActiveTowAirplanesInProgress = true
            })
            .addCase(deleteActiveTowAirplane.fulfilled, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.activeTowAirplanes = state.activeTowAirplanes?.filter(activation => activation.id !== action.payload)
            })
            .addCase(deleteActiveTowAirplane.rejected, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.error = action.error.message
            })
            .addCase(fetchEvents.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchEvents.fulfilled, (state, event: PayloadAction<EventSchema[]>) => {
                state.fetchInProgress = false
                state.events = event.payload
            })
            .addCase(fetchEvents.rejected, (state, event) => {
                state.fetchInProgress = false
                state.error = event.error.message
            })
    }
})

export const {setCurrentActionId, setActiveTowAirplanes, setFlights} = currentActionSlice.actions;
