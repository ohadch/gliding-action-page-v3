import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {TowAirplaneSchema} from "../../lib/types.ts";


const {POST} = createClient<paths>({baseUrl: API_HOST});


export const fetchTowAirplanes = createAsyncThunk<TowAirplaneSchema[], void, { rejectValue: string }
>(
    'towAirplanes/fetchTowAirplanes',
    async (_, thunkAPI) => {
        const {data, error} = await POST("/tow_airplanes/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching towAirplanes");
        }

        return data;
    }
)
