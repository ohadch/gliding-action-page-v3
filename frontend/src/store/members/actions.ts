import { createAsyncThunk } from "@reduxjs/toolkit";
import createClient from "openapi-fetch";
import { paths } from "../../lib/api";
import { API_HOST } from "../../utils/consts";
import { MemberSchema, MemberRoleSchema } from "../../lib/types";

const { POST } = createClient<paths>({baseUrl: API_HOST});

// Fetch all members
export const fetchMembers = createAsyncThunk<MemberSchema[], void, { rejectValue: string }>(
    'members/fetchMembers',
    async (_, thunkAPI) => {
        const { data, error } = await POST("/members/search", {
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

        return [...data].sort((a, b) => {
            const aFullName = `${a.first_name} ${a.last_name}`;
            const bFullName = `${b.first_name} ${b.last_name}`;
            return aFullName.localeCompare(bFullName);
        });
    }
);

// Fetch member roles
export const fetchMembersRoles = createAsyncThunk<MemberRoleSchema[], void, { rejectValue: string }>(
    'members/fetchMembersRoles',
    async (_, thunkAPI) => {
        const { data, error } = await POST("/member_roles/search", {
            params: {
                query: {
                    page: 1,
                    page_size: 1000,
                },
            },
        });

        if (error) {
            return thunkAPI.rejectWithValue("Error fetching member roles");
        }

        return data;
    }
);