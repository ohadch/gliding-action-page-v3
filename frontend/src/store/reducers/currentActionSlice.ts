import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {CurrentActionStoreState} from "../@types/InitialData.ts";
import {CacheService} from "../../utils/cache.ts";
import {CACHE_KEY_ACTION} from "../../utils/consts.ts";
import {createFlight, deleteFlight, fetchActiveTowAirplanes, fetchFlights} from "../actions/currentAction.ts";

const initialState: CurrentActionStoreState = {
    action: CacheService.get(CACHE_KEY_ACTION) ? JSON.parse(CacheService.get(CACHE_KEY_ACTION) as never) : undefined,
    fetchInProgress: false,
    fetchingActiveTowAirplanesInProgress: false,
    initialState: false,
    fieldResponsibleId: undefined,
    responsibleCfiId: undefined,
    fetchingFlightsInProgress: false,
}

export const currentActionSlice = createSlice({
    name: 'actions',
    initialState,
    reducers: {
        setCurrentAction: (state, action) => {
            state.action = action.payload
            CacheService.set(CACHE_KEY_ACTION, JSON.stringify(action.payload))
        },
        setFieldResponsibleId: (state, action: PayloadAction<number | undefined>) => {
            state.fieldResponsibleId = action.payload
        },
        setResponsibleCfiId: (state, action: PayloadAction<number | undefined>) => {
            state.responsibleCfiId = action.payload
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
    }
})

export const {setResponsibleCfiId, setCurrentAction, setFieldResponsibleId} = currentActionSlice.actions;
