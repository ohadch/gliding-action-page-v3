import { createAsyncThunk } from '@reduxjs/toolkit';
import createClient from "openapi-fetch";
import { paths } from "../../lib/api";
import { API_HOST } from "../../utils/consts";
import { EventSchema, EventCreateSchema } from "../../lib/types";

const { POST } = createClient<paths>({baseUrl: API_HOST});

export const createEvent = createAsyncThunk<EventSchema, EventCreateSchema, { rejectValue: string }>(
    'events/createEvent',
    async (event, thunkAPI) => {
        const { data, error } = await POST("/events", {
            body: event
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error creating event");
        }

        return data;
    }
);

export const updateEvent = createAsyncThunk<
    EventSchema,
    { eventId: number; updatePayload: EventUpdateSchema }
>(
    'events/updateEvent',
    async ({ eventId, updatePayload }) => {
        const response = await api.patch(`/events/${eventId}`, updatePayload);
        return response.data;
    }
);

export const fetchEvents = createAsyncThunk<EventSchema[], number>(
    'events/fetchEvents',
    async (actionId) => {
        const response = await api.get(`/actions/${actionId}/events`);
        return response.data;
    }
); 