import { createAsyncThunk } from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import { paths } from "../../lib/api";
import { API_HOST } from "../../utils/consts";
import { NotificationSchema } from "../../lib/types";

const { GET, POST } = createClient<paths>({baseUrl: API_HOST});

export const fetchNotifications = createAsyncThunk<NotificationSchema[], number, { rejectValue: string }>(
    'notifications/fetchNotifications',
    async (actionId, thunkAPI) => {
        const { data, error } = await GET("/actions/{id_}/notifications", {
            params: {
                path: {
                    id_: actionId
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching notifications");
        }

        return data;
    }
); 