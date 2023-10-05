import {createSlice} from '@reduxjs/toolkit'
import {ActionsStoreState} from "../types/InitialData";
import {fetchActions, updateAction} from "../actions/action";

const initialState: ActionsStoreState = {
    page: 1,
    pageSize: 10,
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
                const {page, pageSize, actions} = action.payload
                state.actions = actions
                state.page = page
                state.pageSize = pageSize
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
                    return stateAction
                })
            })
            .addCase(updateAction.rejected, (state, action) => {
                state.fetchInProgress = false
                state.error = action.error.message
            })
    }
})
