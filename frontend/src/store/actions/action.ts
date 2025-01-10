import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {ActionSchema, ActionUpdateSchema} from "../../lib/types.ts";


const {POST, PUT} = createClient<paths>({baseUrl: API_HOST});


export const fetchActions = createAsyncThunk<{ page: number, pageSize: number, actions: ActionSchema[] }, {page: number, pageSize: number, date?: Date}, { rejectValue: string }
>(
    'actions/fetchActions',
    async ({page, pageSize, date}, thunkAPI) => {
        const {data, error} = await POST("/actions/search", {
            params: {
                query: {
                    page,
                    page_size: pageSize,
                },
            },
            body: {
                date: date?.toISOString().split("T")[0],
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching actions");
        }

        return {
            page,
            pageSize,
            actions: data,
        };
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
