import {ActionSchema, MemberSchema} from "../../lib/types.ts";

export interface BaseInitialState {
    fetchInProgress: boolean;
    error?: string;
}


export interface ActionsStoreState extends BaseInitialState {
    currentAction?: ActionSchema;
    actions: ActionSchema[] | undefined;
    initialState: boolean;
    fieldResponsibleId?: number;
}

export interface MembersStoreState extends BaseInitialState {
    members: MemberSchema[] | undefined;
    initialState: boolean;
}
