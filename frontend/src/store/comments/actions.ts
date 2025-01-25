import { createAsyncThunk } from '@reduxjs/toolkit';
import createClient from "openapi-fetch";
import { paths } from "../../lib/api";
import { API_HOST } from "../../utils/consts";
import { CommentSchema, CommentCreateSchema } from "../../lib/types";

const { GET, POST, PATCH, DELETE } = createClient<paths>({baseUrl: API_HOST});

export const fetchComments = createAsyncThunk<CommentSchema[], number, { rejectValue: string }>(
    'comments/fetchComments',
    async (actionId, thunkAPI) => {
        const { data, error } = await GET("/actions/{id_}/comments", {
            params: {
                path: {
                    id_: actionId
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching comments");
        }

        return data;
    }
);

export const createComment = createAsyncThunk<CommentSchema, CommentCreateSchema, { rejectValue: string }>(
    'comments/createComment',
    async (comment, thunkAPI) => {
        const { data, error } = await POST("/comments", {
            body: comment
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error creating comment");
        }

        return data;
    }
);

export const updateComment = createAsyncThunk<
    CommentSchema,
    { commentId: number; updatePayload: Partial<CommentSchema> },
    { rejectValue: string }
>(
    'comments/updateComment',
    async ({ commentId, updatePayload }, thunkAPI) => {
        const { data, error } = await PATCH("/comments/{id_}", {
            params: {
                path: {
                    id_: commentId
                }
            },
            body: updatePayload
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error updating comment");
        }

        return data;
    }
);

export const deleteComment = createAsyncThunk<number, number, { rejectValue: string }>(
    'comments/deleteComment',
    async (commentId, thunkAPI) => {
        const { error } = await DELETE("/comments/{id_}", {
            params: {
                path: {
                    id_: commentId
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error deleting comment");
        }

        return commentId;
    }
); 