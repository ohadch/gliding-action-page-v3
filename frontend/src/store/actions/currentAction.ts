import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {
    ActiveTowAirplaneCreateSchema,
    ActiveTowAirplaneSchema, ActiveTowAirplaneUpdateSchema, CommentSchema, EventSchema,
    FlightCreateSchema,
    FlightSchema,
    FlightUpdateSchema, NotificationSchema
} from "../../lib/types.ts";


const {POST, PUT, DELETE} = createClient<paths>({baseUrl: API_HOST});



export const fetchActiveTowAirplanes = createAsyncThunk<ActiveTowAirplaneSchema[], number, { rejectValue: string }
>(
    'currentAction/fetchActiveTowAirplanes',
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
    'currentAction/fetchFlights',
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

export const createFlight = createAsyncThunk<FlightSchema, { createPayload: FlightCreateSchema }, { rejectValue: string }
>(
    'currentAction/createFlight',
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

export const deleteFlight = createAsyncThunk<number, number, { rejectValue: string }
>(
    'currentAction/deleteFlight',
    async (flightId, thunkAPI) => {
        const {error} = await DELETE("/flights/{id_}", {
            params: {
                path: {
                    id_: flightId,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error deleting flight");
        }

        return flightId;
    }
)


export const updateFlight = createAsyncThunk<FlightSchema, { flightId: number, updatePayload: FlightUpdateSchema }, { rejectValue: string }
>(
    'currentAction/updateFlight',
    async ({flightId, updatePayload}, thunkAPI) => {
        const {data, error} = await PUT("/flights/{id_}", {
            body: {
                ...updatePayload,
            },
            params: {
                path: {
                    id_: flightId,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error updating flight");
        }

        return data;
    }
)


export const addActiveTowAirplane = createAsyncThunk<ActiveTowAirplaneSchema, ActiveTowAirplaneCreateSchema, { rejectValue: string }
>(
    'currentAction/addActiveTowAirplane',
    async (body, thunkAPI) => {
        const {data, error} = await POST("/active_tow_airplanes", {
            body,
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error adding active tow airplane");
        }

        return data;
    }
)


export const updateActiveTowAirplane = createAsyncThunk<ActiveTowAirplaneSchema, { activationId: number, body: ActiveTowAirplaneUpdateSchema }, { rejectValue: string }
>(
    'currentAction/updateActiveTowAirplane',
    async ({activationId, body}, thunkAPI) => {
        const {data, error} = await PUT("/active_tow_airplanes/{id_}", {
            body,
            params: {
                path: {
                    id_: activationId,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error updating active tow airplane");
        }

        return data;
    }
)

export const deleteActiveTowAirplane = createAsyncThunk<number, number, { rejectValue: string }
>(
    'currentAction/deleteActiveTowAirplane',
    async (activationId, thunkAPI) => {
        const {error} = await DELETE("/active_tow_airplanes/{id_}", {
            params: {
                path: {
                    id_: activationId,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error deleting active tow airplane");
        }

        return activationId;
    }
)


export const fetchEvents = createAsyncThunk<EventSchema[], {actionId: number}, { rejectValue: string }
>(
    'currentAction/fetchEvents',
    async ({
                actionId,
           }, thunkAPI) => {
        const {data, error} = await POST("/events/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 3000,
                },
            },
            body: {
                action_id: actionId,
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching events");
        }

        return data
    }
)

export const fetchNotifications = createAsyncThunk<NotificationSchema[], {actionId: number}, { rejectValue: string }
>(
    'currentAction/fetchNotifications',
    async ({
                actionId,
    }, thunkAPI) => {
        const {data, error} = await POST("/notifications/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 3000,
                },
            },
            body: {
                action_id: actionId,
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching notifications");
        }

        return data
    }
)


export const fetchComments = createAsyncThunk<CommentSchema[], {actionId: number}, { rejectValue: string }
>(
    'currentAction/fetchComments',
    async ({
                actionId,
           }, thunkAPI) => {
        const {data, error} = await POST("/comments/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 3000,
                },
            },
            body: {
                action_id: actionId,
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching comments");
        }

        return data
    }
)
