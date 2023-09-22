import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {FlightTypeSchema} from "../../lib/types.ts";


const {POST} = createClient<paths>({baseUrl: API_HOST});


export const fetchFlightTypes = createAsyncThunk<FlightTypeSchema[], void, { rejectValue: string }
>(
    'flightTypes/fetchFlightTypes',
    async (_, thunkAPI) => {
        const {data, error} = await POST("/flight_types/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching flightTypes");
        }

        return data;
    }
)
