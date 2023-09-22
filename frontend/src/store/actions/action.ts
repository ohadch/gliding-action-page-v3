import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {ActionSchema, ActiveTowAirplaneSchema, FlightCreateSchema, FlightSchema} from "../../lib/types.ts";


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


export const fetchActiveTowAirplanes = createAsyncThunk<ActiveTowAirplaneSchema[], number, { rejectValue: string }
>(
    'actions/fetchActiveTowAirplanes',
    async (actionId, thunkAPI) => {
        const {data, error} = await POST("/active_tow_airplanes/search", {
            body: {
                action_id: actionId,
            },
            params: {
                query: {
                    page: 1,
                    page_size: 20,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching active tow airplanes");
        }

        return data;
    }
)

export const fetchFlights = createAsyncThunk<FlightSchema[], number, { rejectValue: string }
>(
    'actions/fetchFlights',
    async (actionId, thunkAPI) => {
        const {data, error} = await POST("/flights/search", {
            body: {
                action_id: actionId,
            },
            params: {
                query: {
                    page: 1,
                    page_size: 100,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching flights");
        }

        return data;
    }
)

export const createFlight = createAsyncThunk<FlightSchema, { actionId: number, createPayload: FlightCreateSchema }, { rejectValue: string }
>(
    'actions/createFlight',
    async ({ createPayload}, thunkAPI) => {
        const {data, error} = await POST("/flights", {
            body: {
                ...createPayload,
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error creating flight");
        }

        return data;
    }
)
