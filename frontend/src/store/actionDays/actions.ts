import { createAsyncThunk } from '@reduxjs/toolkit';
import createClient from "openapi-fetch";
import { paths } from "../../lib/api";
import { API_HOST } from "../../utils/consts";
import {
    ActionSchema,
    FlightSchema,
    FlightCreateSchema,
    FlightUpdateSchema,
    ActionUpdateSchema,
    ActiveTowAirplaneSchema,
    ActiveTowAirplaneCreateSchema
} from '../../lib/types';

const { POST, PUT, DELETE } = createClient<paths>({baseUrl: API_HOST});

// Action List Actions
export const fetchActions = createAsyncThunk<ActionSchema[], void, { rejectValue: string }>(
    'actionDays/fetchActions',
    async (_, thunkAPI) => {
        const { data, error } = await POST("/actions/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching actions");
        }

        return data;
    }
);

export const setCurrentActionId = createAsyncThunk<number, number>(
    'actionDays/setCurrentActionId',
    async (actionId) => actionId
);

export const updateAction = createAsyncThunk<
    ActionSchema,
    { actionId: number; updatePayload: ActionUpdateSchema },
    { rejectValue: string }
>(
    'actionDays/updateAction',
    async ({ actionId, updatePayload }, thunkAPI) => {
        const { data, error } = await PUT("/actions/{id_}", {
            params: {
                path: {
                    id_: actionId
                }
            },
            body: updatePayload
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error updating action");
        }

        return data;
    }
);

export const setActionAsToday = createAsyncThunk<ActionSchema, { date: string }, { rejectValue: string }>(
    'actionDays/setActionAsToday',
    async ({ date }, thunkAPI) => {
        const { data, error } = await POST("/actions/get-or-create-by-date", {
            body: { date }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error setting action as today");
        }

        // After getting today's action, fetch its active tow airplanes
        thunkAPI.dispatch(fetchActiveTowAirplanes(data.id));
        
        return data;
    }
);

// Active Tow Airplane Actions
export const fetchActiveTowAirplanes = createAsyncThunk<ActiveTowAirplaneSchema[], number, { rejectValue: string }>(
    'actionDays/fetchActiveTowAirplanes',
    async (actionId, thunkAPI) => {
        const { data, error } = await POST("/active_tow_airplanes/search", {
            body: {
                action_id: actionId
            },
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching active tow airplanes");
        }

        return data;
    }
);

export const addActiveTowAirplane = createAsyncThunk<
    ActiveTowAirplaneCreateSchema,
    { actionId: number; airplaneId: number; towPilotId: number },
    { rejectValue: string }
>(
    'actionDays/addActiveTowAirplane',
    async ({ actionId, airplaneId, towPilotId }, thunkAPI) => {
        const { data, error } = await POST("/active_tow_airplanes", {
            body: {
                action_id: actionId,
                airplane_id: airplaneId,
                tow_pilot_id: towPilotId
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error adding active tow airplane");
        }

        return data;
    }
);

export const deleteActiveTowAirplane = createAsyncThunk<number, number, { rejectValue: string }>(
    'actionDays/deleteActiveTowAirplane',
    async (activeTowAirplaneId, thunkAPI) => {
        const { error } = await DELETE("/active_tow_airplanes/{id_}", {
            params: {
                path: {
                    id_: activeTowAirplaneId
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error deleting active tow airplane");
        }

        return activeTowAirplaneId;
    }
);

// Flight Actions
export const fetchFlights = createAsyncThunk<FlightSchema[], number, { rejectValue: string }>(
    'actionDays/fetchFlights',
    async (actionId, thunkAPI) => {
        const { data, error } = await POST("/flights/search", {
            body: {
                action_id: actionId
            },
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching flights");
        }

        return data;
    }
);

export const createFlight = createAsyncThunk<
    FlightSchema,
    { createPayload: FlightCreateSchema },
    { rejectValue: string }
>(
    'actionDays/createFlight',
    async ({ createPayload }, thunkAPI) => {
        const { data, error } = await POST("/flights", {
            body: createPayload
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error creating flight");
        }

        return data;
    }
);

export const updateFlight = createAsyncThunk<
    FlightSchema,
    { flightId: number; updatePayload: FlightUpdateSchema },
    { rejectValue: string }
>(
    'actionDays/updateFlight',
    async ({ flightId, updatePayload }, thunkAPI) => {
        const { data, error } = await PUT("/flights/{id_}", {
            params: {
                path: {
                    id_: flightId
                }
            },
            body: updatePayload
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error updating flight");
        }

        return data;
    }
);

export const deleteFlight = createAsyncThunk<number, number, { rejectValue: string }>(
    'actionDays/deleteFlight',
    async (flightId, thunkAPI) => {
        const { error } = await DELETE("/flights/{id_}", {
            params: {
                path: {
                    id_: flightId
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error deleting flight");
        }

        return flightId;
    }
);