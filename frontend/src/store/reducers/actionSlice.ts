import {createSlice} from '@reduxjs/toolkit'
import {ActionsStoreState} from "../types/InitialData";
import {fetchActions, updateAction} from "../actions/action";
import {CacheService} from "../../utils/cache.ts";
import {CACHE_KEY_ACTION_PAGE, CACHE_KEY_ACTION_PAGE_SIZE} from "../../utils/consts.ts";

const initialState: ActionsStoreState = {
    page: CacheService.getNumber(CACHE_KEY_ACTION_PAGE) || 1,
    pageSize: CacheService.getNumber(CACHE_KEY_ACTION_PAGE_SIZE) || 10,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
                CacheService.set(CACHE_KEY_ACTION_PAGE, `${page}`)
                CacheService.set(CACHE_KEY_ACTION_PAGE_SIZE, `${pageSize}`)
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
