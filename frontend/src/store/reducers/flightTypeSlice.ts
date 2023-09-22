import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {FlightTypeSchema} from "../../lib/types.ts";
import {FlightTypesStoreState} from "../@types/InitialData.ts";
import {fetchFlightTypes} from "../actions/flightType.ts";

const initialState: FlightTypesStoreState = {
    flightTypes: undefined,
    fetchInProgress: false,
    initialState: false,
}

export const flightTypesSlice = createSlice({
    name: 'flightTypes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlightTypes.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchFlightTypes.fulfilled, (state, flightType: PayloadAction<FlightTypeSchema[]>) => {
                state.fetchInProgress = false
                state.flightTypes = flightType.payload
            })
            .addCase(fetchFlightTypes.rejected, (state, flightType) => {
                state.fetchInProgress = false
                state.error = flightType.error.message
            })
    }
})
