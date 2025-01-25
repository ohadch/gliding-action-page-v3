import { createSlice } from '@reduxjs/toolkit';
import { EventsState } from './types';
import { createEvent, updateEvent, fetchEvents } from './actions';

const initialState: EventsState = {
    events: [],
    loading: false,
    error: null,
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create event
            .addCase(createEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create event';
            })
            // Update event
            .addCase(updateEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex(e => e.id === action.payload.id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update event';
            })
            // Fetch events
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch events';
            });
    },
});

export default eventsSlice.reducer; 