import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {GliderOwnerSchema, GliderSchema} from "../../lib/types.ts";
import {GlidersStoreState} from "../types/InitialData.ts";
import {fetchGliderOwners, fetchGliders} from "../actions/glider.ts";

const initialState: GlidersStoreState = {
    gliders: undefined,
    ownerships: undefined,
    fetchInProgress: false,
    initialState: false,
}

export const glidersSlice = createSlice({
    name: 'gliders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGliders.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchGliders.fulfilled, (state, glider: PayloadAction<GliderSchema[]>) => {
                state.fetchInProgress = false
                state.gliders = glider.payload
            })
            .addCase(fetchGliders.rejected, (state, glider) => {
                state.fetchInProgress = false
                state.error = glider.error.message
            })
            .addCase(fetchGliderOwners.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchGliderOwners.fulfilled, (state, gliderOwners: PayloadAction<GliderOwnerSchema[]>) => {
                state.fetchInProgress = false
                state.ownerships = gliderOwners.payload
            })
    }
})
