import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {TowTypeSchema} from "../../lib/types.ts";
import {TowTypesStoreState} from "../@types/InitialData.ts";
import {fetchTowTypes} from "../actions/towType.ts";

const initialState: TowTypesStoreState = {
    towTypes: undefined,
    fetchInProgress: false,
    initialState: false,
}

export const towTypesSlice = createSlice({
    name: 'towTypes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTowTypes.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchTowTypes.fulfilled, (state, towType: PayloadAction<TowTypeSchema[]>) => {
                state.fetchInProgress = false
                state.towTypes = towType.payload
            })
            .addCase(fetchTowTypes.rejected, (state, towType) => {
                state.fetchInProgress = false
                state.error = towType.error.message
            })
    }
})
