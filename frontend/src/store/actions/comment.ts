import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {CommentCreateSchema, CommentSchema, CommentUpdateSchema} from "../../lib/types.ts";


const {POST, PUT, DELETE} = createClient<paths>({baseUrl: API_HOST});


export const createComment = createAsyncThunk<CommentSchema, CommentCreateSchema, { rejectValue: string }
>(
    'comments/createComment',
    async (comment, thunkAPI) => {
        const {data, error} = await POST("/comments", {
            body: comment,
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error creating comment");
        }

        return data;
    }
)


export const updateComment = createAsyncThunk<CommentSchema, { commentId: number, updatePayload: CommentUpdateSchema }, { rejectValue: string }
>(
    'comments/updateComment',
    async ({commentId, updatePayload}, thunkAPI) => {
        const {data, error} = await PUT("/comments/{id_}", {
            body: {
                ...updatePayload,
            },
            params: {
                path: {
                    id_: commentId,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error updating comment");
        }

        return data;
    }
)


export const deleteComment = createAsyncThunk<number, number, { rejectValue: string }
>(
    'comments/deleteComment',
    async (commentId, thunkAPI) => {
        const {error} = await DELETE("/comments/{id_}", {
            params: {
                path: {
                    id_: commentId,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error deleting comment");
        }

        return commentId;
    }
)
