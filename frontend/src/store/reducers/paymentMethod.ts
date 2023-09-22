import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {PaymentMethodSchema} from "../../lib/types.ts";
import {PaymentMethodsStoreState} from "../@types/InitialData.ts";
import {fetchPaymentMethods} from "../actions/paymentMethod.ts";

const initialState: PaymentMethodsStoreState = {
    paymentMethods: undefined,
    fetchInProgress: false,
    initialState: false,
}

export const paymentMethodsSlice = createSlice({
    name: 'paymentMethods',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentMethods.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchPaymentMethods.fulfilled, (state, paymentMethod: PayloadAction<PaymentMethodSchema[]>) => {
                state.fetchInProgress = false
                state.paymentMethods = paymentMethod.payload
            })
            .addCase(fetchPaymentMethods.rejected, (state, paymentMethod) => {
                state.fetchInProgress = false
                state.error = paymentMethod.error.message
            })
    }
})
