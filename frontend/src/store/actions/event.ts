import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {EventCreateSchema, EventSchema, EventUpdateSchema} from "../../lib/types.ts";


const {POST, PUT} = createClient<paths>({baseUrl: API_HOST});


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


export const updateEvent = createAsyncThunk<EventSchema, { eventId: number, updatePayload: EventUpdateSchema }, { rejectValue: string }
>(
    'events/updateEvent',
    async ({eventId, updatePayload}, thunkAPI) => {
        const {data, error} = await PUT("/events/{id_}", {
            body: {
                ...updatePayload,
            },
            params: {
                path: {
                    id_: eventId,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error updating event");
        }

        return data;
    }
)
