import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {PaymentMethodSchema} from "../../lib/types.ts";


const {POST} = createClient<paths>({baseUrl: API_HOST});


export const fetchPaymentMethods = createAsyncThunk<PaymentMethodSchema[], void, { rejectValue: string }
>(
    'paymentMethods/fetchPaymentMethods',
    async (_, thunkAPI) => {
        const {data, error} = await POST("/payment_methods/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching paymentMethods");
        }

        return data;
    }
)
