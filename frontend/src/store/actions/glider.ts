import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {GliderSchema} from "../../lib/types.ts";


const {POST} = createClient<paths>({baseUrl: API_HOST});


export const fetchGliders = createAsyncThunk<GliderSchema[], void, { rejectValue: string }
>(
    'gliders/fetchGliders',
    async (_, thunkAPI) => {
        const {data, error} = await POST("/gliders/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching gliders");
        }

        return data;
    }
)
