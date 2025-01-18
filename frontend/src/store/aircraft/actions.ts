import { createAsyncThunk } from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import { paths } from "../../lib/api";
import { API_HOST } from "../../utils/consts";
import { GliderSchema, TowAirplaneSchema, GliderOwnerSchema } from "../../lib/types";

const { POST } = createClient<paths>({baseUrl: API_HOST});

export const fetchGliders = createAsyncThunk<GliderSchema[], void, { rejectValue: string }>(
    'aircraft/fetchGliders',
    async (_, thunkAPI) => {
        const { data, error } = await POST("/gliders/search", {
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
);

export const fetchGliderOwners = createAsyncThunk<GliderOwnerSchema[], void, { rejectValue: string }>(
    'aircraft/fetchGliderOwners',
    async (_, thunkAPI) => {
        const { data, error } = await POST("/glider_owners/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching glider owners");
        }

        return data;
    }
);

export const fetchTowAirplanes = createAsyncThunk<TowAirplaneSchema[], void, { rejectValue: string }>(
    'aircraft/fetchTowAirplanes',
    async (_, thunkAPI) => {
        const { data, error } = await POST("/tow_airplanes/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching tow airplanes");
        }

        return data;
    }
); 