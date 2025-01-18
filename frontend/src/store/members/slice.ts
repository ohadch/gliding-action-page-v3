import { createSlice } from '@reduxjs/toolkit';
import { MembersState } from './types';
import { fetchMembers, fetchMembersRoles } from './actions';

const initialState: MembersState = {
    members: [],
    roles: [],
    loading: false,
    error: null,
};

const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch members
            .addCase(fetchMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(fetchMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch members';
            })
            // Fetch member roles
            .addCase(fetchMembersRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMembersRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload;
            })
            .addCase(fetchMembersRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch member roles';
            })
    },
});

export default membersSlice.reducer; 