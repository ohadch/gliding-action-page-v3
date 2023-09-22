import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ActionsStoreState} from "../@types/InitialData.ts";
import {fetchActions, fetchActiveTowAirplanes, fetchFlights} from "../actions/action.ts";
import {CacheService} from "../../utils/cache.ts";
import {CACHE_KEY_ACTION} from "../../utils/consts.ts";

const initialState: ActionsStoreState = {
    actions: undefined,
    currentAction: CacheService.get(CACHE_KEY_ACTION) ? JSON.parse(CacheService.get(CACHE_KEY_ACTION) as never) : undefined,
    fetchInProgress: false,
    fetchingActiveTowAirplanesInProgress: false,
    initialState: false,
    fieldResponsibleId: undefined,
    responsibleCfiId: undefined,
    fetchingFlightsInProgress: false,
}

export const actionsSlice = createSlice({
    name: 'actions',
    initialState,
    reducers: {
        setCurrentAction: (state, action) => {
            state.currentAction = action.payload
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
            .addCase(fetchActions.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchActions.fulfilled, (state, action) => {
                state.fetchInProgress = false
                state.actions = action.payload
            })
            .addCase(fetchActions.rejected, (state, action) => {
                state.fetchInProgress = false
                state.error = action.error.message
            })
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

    }
})

export const {setResponsibleCfiId, setCurrentAction, setFieldResponsibleId} = actionsSlice.actions;
