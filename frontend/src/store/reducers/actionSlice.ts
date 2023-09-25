import {createSlice} from '@reduxjs/toolkit'
import {ActionsStoreState} from "../@types/InitialData.ts";
import {fetchActions, updateAction} from "../actions/action.ts";

const initialState: ActionsStoreState = {
    actions: undefined,
    fetchInProgress: false,
    initialState: true,
}

export const actionsSlice = createSlice({
    name: 'actions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchActions.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchActions.fulfilled, (state, action) => {
                state.fetchInProgress = false
                state.actions = action.payload
            })
            .addCase(fetchActions.rejected, (state, action) => {
                state.fetchInProgress = false
                state.error = action.error.message
            })
            .addCase(updateAction.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(updateAction.fulfilled, (state, {payload: action}) => {
                state.fetchInProgress = false
                state.actions = state.actions?.map((stateAction) => {
                    if (stateAction.id === action.id) {
                        return action
                    }
                    return action
                })
            })
            .addCase(updateAction.rejected, (state, action) => {
                state.fetchInProgress = false
                state.error = action.error.message
            })
    }
})
