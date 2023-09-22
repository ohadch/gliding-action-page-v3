import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {PayersTypeSchema} from "../../lib/types.ts";
import {PayersTypesStoreState} from "../@types/InitialData.ts";
import {fetchPayersTypes} from "../actions/payersType.ts";

const initialState: PayersTypesStoreState = {
    payersTypes: undefined,
    fetchInProgress: false,
    initialState: false,
}

export const payersTypesSlice = createSlice({
    name: 'payersTypes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayersTypes.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchPayersTypes.fulfilled, (state, payersType: PayloadAction<PayersTypeSchema[]>) => {
                state.fetchInProgress = false
                state.payersTypes = payersType.payload
            })
            .addCase(fetchPayersTypes.rejected, (state, payersType) => {
                state.fetchInProgress = false
                state.error = payersType.error.message
            })
    }
})
