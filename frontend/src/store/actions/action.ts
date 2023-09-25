import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {ActionSchema, ActionUpdateSchema} from "../../lib/types.ts";


const {POST, PUT} = createClient<paths>({baseUrl: API_HOST});


export const fetchActions = createAsyncThunk<ActionSchema[], void, { rejectValue: string }
>(
    'actions/fetchActions',
    async (_, thunkAPI) => {
        const {data, error} = await POST("/actions/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 20,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching actions");
        }

        return data;
    }
)


export const updateAction = createAsyncThunk<ActionSchema, { actionId: number, updatePayload: ActionUpdateSchema }, { rejectValue: string }
>(
    'actions/updateAction',
    async ({actionId, updatePayload}, thunkAPI) => {
        const {data, error} = await PUT("/actions/{id_}", {
            body: updatePayload,
            params: {
                path: {
                    id_: actionId,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error updating action");
        }

        return data;
    }
)
