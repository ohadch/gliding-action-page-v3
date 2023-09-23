import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {ActionSchema} from "../../lib/types.ts";


const {POST} = createClient<paths>({baseUrl: API_HOST});


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
