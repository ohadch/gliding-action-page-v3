import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {NotificationSchema, NotificationUpdateSchema} from "../../lib/types.ts";


const {PUT} = createClient<paths>({baseUrl: API_HOST});



export const updateNotification = createAsyncThunk<NotificationSchema, { notificationId: number, updatePayload: NotificationUpdateSchema }, { rejectValue: string }
>(
    'notifications/updateNotification',
    async ({notificationId, updatePayload}, thunkAPI) => {
        const {data, error} = await PUT("/notifications/{id_}", {
            body: updatePayload,
            params: {
                path: {
                    id_: notificationId,
                }
            }
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error updating notification");
        }

        return data;
    }
)
