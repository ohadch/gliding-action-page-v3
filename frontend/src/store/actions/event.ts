import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {EventCreateSchema, EventSchema} from "../../lib/types.ts";


const {POST} = createClient<paths>({baseUrl: API_HOST});


export const fetchEvents = createAsyncThunk<EventSchema[], void, { rejectValue: string }
>(
    'events/fetchEvents',
    async (_, thunkAPI) => {
        const {data, error} = await POST("/events/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching events");
        }

        return data;
    }
)

export const createEvent = createAsyncThunk<EventSchema, EventCreateSchema, { rejectValue: string }
>(
    'events/createEvent',
    async (event, thunkAPI) => {
        const {data, error} = await POST("/events", {
            body: event,
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error creating event");
        }

        return data;
    }
)
