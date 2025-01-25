import { createSlice } from '@reduxjs/toolkit';
import { CommentsState } from './types';
import { fetchComments, createComment, updateComment, deleteComment } from './actions';

const initialState: CommentsState = {
    comments: [],
    loading: false,
    error: null,
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch comments
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch comments';
            })
            // Create comment
            .addCase(createComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments.push(action.payload);
            })
            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create comment';
            })
            // Update comment
            .addCase(updateComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.comments.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.comments[index] = action.payload;
                }
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update comment';
            })
            // Delete comment
            .addCase(deleteComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = state.comments.filter(c => c.id !== action.payload);
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete comment';
            });
    },
});

export default commentsSlice.reducer; 