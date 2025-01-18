import { createAsyncThunk } from '@reduxjs/toolkit';
import createClient from "openapi-fetch";
import { paths } from "../../lib/api";
import { API_HOST } from "../../utils/consts";
import { EventSchema, EventCreateSchema, EventUpdateSchema } from "../../lib/types";

const { POST, PUT } = createClient<paths>({baseUrl: API_HOST});

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

export const updateEvent = createAsyncThunk<EventSchema, { id: number; event: EventUpdateSchema }, { rejectValue: string }>(
    'events/updateEvent',
    async ({ id, event }, thunkAPI) => {
        const { data, error } = await PUT(`/events/${id}`, {
            body: event
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error updating event");
        }

        return data;
    }
);

export const fetchEvents = createAsyncThunk<EventSchema[], number, { rejectValue: string }>(
    'events/fetchEvents',
    async (actionId, thunkAPI) => {
        const { data, error } = await POST("/events/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                }
            },
            body: {
                action_id: actionId
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching events");
        }

        return data;
    }
); 