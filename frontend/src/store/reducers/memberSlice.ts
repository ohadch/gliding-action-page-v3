import {createSlice} from '@reduxjs/toolkit'
import {MembersStoreState} from "../@types/InitialData.ts";
import {fetchMembers, fetchMembersRoles} from "../actions/member.ts";

const initialState: MembersStoreState = {
    members: undefined,
    fetchInProgress: false,
    initialState: false,
    membersRoles: undefined,
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
            .addCase(fetchMembers.fulfilled, (state, member) => {
                state.fetchInProgress = false
                state.members = member.payload
            })
            .addCase(fetchMembers.rejected, (state, member) => {
                state.fetchInProgress = false
                state.error = member.error.message
            })
            .addCase(fetchMembersRoles.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(fetchMembersRoles.fulfilled, (state, memberRoles) => {
                state.fetchInProgress = false
                state.membersRoles = memberRoles.payload
            })
            .addCase(fetchMembersRoles.rejected, (state, memberRoles) => {
                state.fetchInProgress = false
                state.error = memberRoles.error.message
            })
    }
})
