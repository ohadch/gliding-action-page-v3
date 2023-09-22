import {ActionSchema, ActiveTowAirplaneSchema, MemberSchema} from "../../lib/types.ts";

export interface BaseInitialState {
    fetchInProgress: boolean;
    error?: string;
}


export interface ActionsStoreState extends BaseInitialState {
    currentAction?: ActionSchema;
    actions: ActionSchema[] | undefined;
    initialState: boolean;
    fieldResponsibleId?: number;
    responsibleCfiId?: number;
    fetchingActiveTowAirplanesInProgress: boolean;
    activeTowAirplanes?: ActiveTowAirplaneSchema[];
}

export interface MembersStoreState extends BaseInitialState {
    members: MemberSchema[] | undefined;
    initialState: boolean;
}
