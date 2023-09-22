import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {PayersTypeSchema} from "../../lib/types.ts";


const {POST} = createClient<paths>({baseUrl: API_HOST});


export const fetchPayersTypes = createAsyncThunk<PayersTypeSchema[], void, { rejectValue: string }
>(
    'payersTypes/fetchPayersTypes',
    async (_, thunkAPI) => {
        const {data, error} = await POST("/payers_types/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching payersTypes");
        }

        return data;
    }
)
