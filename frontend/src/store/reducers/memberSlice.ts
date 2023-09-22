import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {MemberSchema} from "../../lib/types.ts";
import {MembersStoreState} from "../@types/InitialData.ts";
import {fetchMembers} from "../actions/member.ts";

const initialState: MembersStoreState = {
    members: undefined,
    fetchInProgress: false,
    initialState: false,
}

export const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMembers.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchMembers.fulfilled, (state, member: PayloadAction<MemberSchema[]>) => {
                state.fetchInProgress = false
                state.members = member.payload
            })
            .addCase(fetchMembers.rejected, (state, member) => {
                state.fetchInProgress = false
                state.error = member.error.message
            })
    }
})
