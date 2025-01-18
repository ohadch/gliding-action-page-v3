import {configureStore} from '@reduxjs/toolkit'
import {useDispatch} from "react-redux";
import actionDaysSlice from "./actionDays";
import membersSlice from "./members";
import aircraftSlice from "./aircraft";
import eventsSlice from "./events";

export const store = configureStore({
    reducer: {
        actionDays: actionDaysSlice,
        members: membersSlice,
        aircraft: aircraftSlice,
        events: eventsSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
