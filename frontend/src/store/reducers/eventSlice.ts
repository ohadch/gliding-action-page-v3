import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {EventSchema} from "../../lib/types.ts";
import {EventsStoreState} from "../types/InitialData.ts";
import {createEvent, fetchEvents} from "../actions/event.ts";

const initialState: EventsStoreState = {
    events: undefined,
    fetchInProgress: false,
    initialState: false,
}

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            .addCase(createEvent.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(createEvent.fulfilled, (state, event: PayloadAction<EventSchema>) => {
                state.fetchInProgress = false
                state.events = state.events || []
                state.events.push(event.payload)
            })
            .addCase(createEvent.rejected, (state, event) => {
                state.fetchInProgress = false
                state.error = event.error.message
            })
    }
})
