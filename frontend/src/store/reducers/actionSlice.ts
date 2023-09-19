import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ActionSchema} from "../../lib/types.ts";
import {ActionsStoreState} from "../@types/InitialData.ts";
import {fetchActions} from "../actions/action.ts";
import {CacheService} from "../../utils/cache.ts";
import {CACHE_KEY_ACTION} from "../../utils/consts.ts";

const initialState: ActionsStoreState = {
    actions: undefined,
    currentAction: CacheService.get(CACHE_KEY_ACTION) ? JSON.parse(CacheService.get(CACHE_KEY_ACTION) as never) : undefined,
    fetchInProgress: false,
    initialState: false,
    fieldResponsibleId: undefined,
}

export const actionsReducer = createSlice({
    name: 'actions',
    initialState,
    reducers: {
        setCurrentAction: (state, action: PayloadAction<ActionSchema>) => {
            state.currentAction = action.payload
            CacheService.set(CACHE_KEY_ACTION, JSON.stringify(action.payload))
        },
        setFieldResponsibleId: (state, action: PayloadAction<number>) => {
            state.fieldResponsibleId = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActions.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchActions.fulfilled, (state, action: PayloadAction<ActionSchema[]>) => {
                state.fetchInProgress = false
                state.actions = action.payload
            })
            .addCase(fetchActions.rejected, (state, action) => {
                state.fetchInProgress = false
                state.error = action.error.message
            })
    }
})

export const {setCurrentAction, setFieldResponsibleId} = actionsReducer.actions;
