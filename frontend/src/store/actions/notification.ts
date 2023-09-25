import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {NotificationCreateSchema, NotificationSchema} from "../../lib/types.ts";


const {POST} = createClient<paths>({baseUrl: API_HOST});


export const fetchNotifications = createAsyncThunk<NotificationSchema[], void, { rejectValue: string }
>(
    'notifications/fetchNotifications',
    async (_, thunkAPI) => {
        const {data, error} = await POST("/notifications/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching notifications");
        }

        return data;
    }
)

export const createNotification = createAsyncThunk<NotificationSchema, NotificationCreateSchema, { rejectValue: string }
>(
    'notifications/createNotification',
    async (notification, thunkAPI) => {
        const {data, error} = await POST("/notifications", {
            body: notification,
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error creating notification");
        }

        return data;
    }
)
