import {createAsyncThunk} from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {MemberRoleSchema, MemberSchema} from "../../lib/types.ts";


const {POST} = createClient<paths>({baseUrl: API_HOST});


export const fetchMembers = createAsyncThunk<MemberSchema[], void, { rejectValue: string }
>(
    'members/fetchMembers',
    async (_, thunkAPI) => {
        const {data, error} = await POST("/members/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching members");
        }

        return data;
    }
)

export const fetchMembersRoles = createAsyncThunk<MemberRoleSchema[], void, { rejectValue: string }
>(
    'members/fetchMembersRoles',
    async (_, thunkAPI) => {
        const {data, error} = await POST("/member_roles/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching members roles");
        }

        return data;
    }
)
