import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {TowAirplaneSchema} from "../../lib/types.ts";
import {TowAirplanesStoreState} from "../@types/InitialData.ts";
import {fetchTowAirplanes} from "../actions/towAirplane.ts";

const initialState: TowAirplanesStoreState = {
    towAirplanes: undefined,
    fetchInProgress: false,
    initialState: false,
}

export const towAirplanesSlice = createSlice({
    name: 'towAirplanes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTowAirplanes.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchTowAirplanes.fulfilled, (state, towAirplane: PayloadAction<TowAirplaneSchema[]>) => {
                state.fetchInProgress = false
                state.towAirplanes = towAirplane.payload
            })
            .addCase(fetchTowAirplanes.rejected, (state, towAirplane) => {
                state.fetchInProgress = false
                state.error = towAirplane.error.message
            })
    }
})
