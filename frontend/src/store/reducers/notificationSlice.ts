import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {NotificationSchema} from "../../lib/types.ts";
import {NotificationsStoreState} from "../@types/InitialData.ts";
import {createNotification, fetchNotifications} from "../actions/notification.ts";

const initialState: NotificationsStoreState = {
    notifications: undefined,
    fetchInProgress: false,
    initialState: false,
}

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchNotifications.fulfilled, (state, notification: PayloadAction<NotificationSchema[]>) => {
                state.fetchInProgress = false
                state.notifications = notification.payload
            })
            .addCase(fetchNotifications.rejected, (state, notification) => {
                state.fetchInProgress = false
                state.error = notification.error.message
            })
            .addCase(createNotification.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(createNotification.fulfilled, (state, notification: PayloadAction<NotificationSchema>) => {
                state.fetchInProgress = false
                state.notifications = state.notifications || []
                state.notifications.push(notification.payload)
            })
            .addCase(createNotification.rejected, (state, notification) => {
                state.fetchInProgress = false
                state.error = notification.error.message
            })
    }
})
