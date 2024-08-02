import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {CurrentActionStoreState} from "../types/InitialData.ts";
import {CacheService} from "../../utils/cache.ts";
import {CACHE_KEY_ACTION} from "../../utils/consts.ts";
import {
    addActiveTowAirplane,
    createFlight, deleteActiveTowAirplane,
    deleteFlight,
    fetchActiveTowAirplanes, fetchComments, fetchEvents,
    fetchFlights, fetchNotifications, updateActiveTowAirplane,
    updateFlight
} from "../actions/currentAction.ts";
import {EventSchema, NotificationSchema} from "../../lib/types.ts";
import {updateNotification} from "../actions/notification.ts";
import {updateEvent} from "../actions/event.ts";
import {createComment, deleteComment, updateComment} from "../actions/comment.ts";

const initialState: CurrentActionStoreState = {
    actionId: CacheService.getNumber(CACHE_KEY_ACTION),
    fetchInProgress: false,
    fetchingActiveTowAirplanesInProgress: false,
    initialState: false,
    fetchingFlightsInProgress: false,
}

export const currentActionSlice = createSlice({
    name: 'actions',
    initialState,
    reducers: {
        setCurrentActionId: (state, action) => {
            state.actionId = action.payload
            action.payload ? CacheService.set(CACHE_KEY_ACTION, action.payload) : CacheService.remove(CACHE_KEY_ACTION)
        },
        setFlights: (state, action) => {
            state.flights = action.payload
        },
        setActiveTowAirplanes: (state, action) => {
            state.activeTowAirplanes = action.payload
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
            .addCase(deleteFlight.rejected, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.error = action.error.message
            })
            .addCase(updateFlight.pending, (state) => {
                state.fetchingFlightsInProgress = true
            })
            .addCase(updateFlight.fulfilled, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.flights = state.flights?.map(flight => flight.id === action.payload.id ? action.payload : flight)
            })
            .addCase(updateFlight.rejected, (state, action) => {
                state.fetchingFlightsInProgress = false
                state.error = action.error.message
            })
            .addCase(addActiveTowAirplane.pending, (state) => {
                state.fetchingActiveTowAirplanesInProgress = true
            })
            .addCase(addActiveTowAirplane.fulfilled, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.activeTowAirplanes = [...(state.activeTowAirplanes || []), action.payload]
            })
            .addCase(addActiveTowAirplane.rejected, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.error = action.error.message
            })
            .addCase(updateActiveTowAirplane.pending, (state) => {
                state.fetchingActiveTowAirplanesInProgress = true
            })
            .addCase(updateActiveTowAirplane.fulfilled, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.activeTowAirplanes = state.activeTowAirplanes?.map(airplane => airplane.id === action.payload.id ? action.payload : airplane)
            })
            .addCase(updateActiveTowAirplane.rejected, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.error = action.error.message
            })
            .addCase(deleteActiveTowAirplane.pending, (state) => {
                state.fetchingActiveTowAirplanesInProgress = true
            })
            .addCase(deleteActiveTowAirplane.fulfilled, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.activeTowAirplanes = state.activeTowAirplanes?.filter(activation => activation.id !== action.payload)
            })
            .addCase(deleteActiveTowAirplane.rejected, (state, action) => {
                state.fetchingActiveTowAirplanesInProgress = false
                state.error = action.error.message
            })
            .addCase(fetchEvents.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchEvents.fulfilled, (state, event: PayloadAction<EventSchema[]>) => {
                state.fetchInProgress = false
                state.events = event.payload.sort((a, b) => a.id - b.id)
            })
            .addCase(fetchEvents.rejected, (state, event) => {
                state.fetchInProgress = false
                state.error = event.error.message
            })
            .addCase(updateEvent.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.fetchInProgress = false
                state.events = state.events?.map(event => event.id === action.payload.id ? action.payload : event)
            })
            .addCase(updateEvent.rejected, (state, event) => {
                state.fetchInProgress = false
                state.error = event.error.message
            })
            .addCase(fetchNotifications.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchNotifications.fulfilled, (state, event: PayloadAction<NotificationSchema[]>) => {
                state.fetchInProgress = false
                state.notifications = event.payload.sort((a, b) => a.id - b.id)
            })
            .addCase(fetchNotifications.rejected, (state, event) => {
                state.fetchInProgress = false
                state.error = event.error.message
            })
            .addCase(updateNotification.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(updateNotification.fulfilled, (state, action) => {
                state.fetchInProgress = false
                state.notifications = state.notifications?.map(notification => notification.id === action.payload.id ? action.payload : notification)
            })
            .addCase(updateNotification.rejected, (state, notification) => {
                state.fetchInProgress = false
                state.error = notification.error.message
            })
            .addCase(fetchComments.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.fetchInProgress = false
                state.comments = action.payload
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.fetchInProgress = false
                state.error = action.error.message
            })
            .addCase(updateComment.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                state.fetchInProgress = false
                state.comments = state.comments?.map(comment => comment.id === action.payload.id ? action.payload : comment)
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.fetchInProgress = false
                state.error = action.error.message
            })
            .addCase(createComment.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.fetchInProgress = false
                state.comments = [...(state.comments || []), action.payload]
            })
            .addCase(createComment.rejected, (state, action) => {
                state.fetchInProgress = false
                state.error = action.error.message
            })
            .addCase(deleteComment.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.fetchInProgress = false
                state.comments = state.comments?.filter(comment => comment.id !== action.payload)
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.fetchInProgress = false
                state.error = action.error.message
            })
    }
})

export const {setCurrentActionId, setActiveTowAirplanes, setFlights} = currentActionSlice.actions;
