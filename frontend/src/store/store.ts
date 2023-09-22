import {configureStore} from '@reduxjs/toolkit'
import {useDispatch} from "react-redux";
import {actionsSlice} from "./reducers/actionSlice.ts";
import {membersSlice} from "./reducers/memberSlice.ts";
import {glidersSlice} from "./reducers/gliderSlice.ts";
import {towAirplanesSlice} from "./reducers/towAirplaneSlice.ts";
import {towTypesSlice} from "./reducers/towTypeSlice.ts";
import {flightTypesSlice} from "./reducers/flightTypeSlice.ts";
import {payersTypesSlice} from "./reducers/payersTypeSlice.ts";
import {paymentMethodsSlice} from "./reducers/paymentMethod.ts";

export const store = configureStore({
    reducer: {
        actions: actionsSlice.reducer,
        members: membersSlice.reducer,
        gliders: glidersSlice.reducer,
        towAirplanes: towAirplanesSlice.reducer,
        towTypes: towTypesSlice.reducer,
        flightTypes: flightTypesSlice.reducer,
        payersTypes: payersTypesSlice.reducer,
        paymentMethods: paymentMethodsSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
