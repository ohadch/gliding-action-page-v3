import {configureStore} from '@reduxjs/toolkit'
import {useDispatch} from "react-redux";
import {actionsSlice} from "./reducers/actionSlice.ts";
import {membersSlice} from "./reducers/memberSlice.ts";
import {glidersSlice} from "./reducers/gliderSlice.ts";
import {towAirplanesSlice} from "./reducers/towAirplaneSlice.ts";
import {currentActionSlice} from "./reducers/currentActionSlice.ts";
import {eventsSlice} from "./reducers/eventSlice.ts";

export const store = configureStore({
    reducer: {
        actions: actionsSlice.reducer,
        currentAction: currentActionSlice.reducer,
        members: membersSlice.reducer,
        gliders: glidersSlice.reducer,
        towAirplanes: towAirplanesSlice.reducer,
        events: eventsSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
