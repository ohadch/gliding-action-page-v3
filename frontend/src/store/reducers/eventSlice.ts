import {createSlice} from '@reduxjs/toolkit'
import {EventsStoreState} from "../types/InitialData.ts";
import {createEvent} from "../actions/event.ts";

const initialState: EventsStoreState = {
    fetchInProgress: false,
    initialState: false,
}

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createEvent.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(createEvent.fulfilled, (state) => {
                state.fetchInProgress = false
            })
            .addCase(createEvent.rejected, (state, event) => {
                state.fetchInProgress = false
                state.error = event.error.message
            })
    }
})
