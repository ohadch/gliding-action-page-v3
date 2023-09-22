import {
    ActionSchema,
    ActiveTowAirplaneSchema, FlightTypeSchema,
    GliderSchema,
    MemberSchema,
    TowAirplaneSchema,
    TowTypeSchema
} from "../../lib/types.ts";

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


export interface GlidersStoreState extends BaseInitialState {
    gliders: GliderSchema[] | undefined;
    initialState: boolean;
}


export interface TowAirplanesStoreState extends BaseInitialState {
    towAirplanes: TowAirplaneSchema[] | undefined;
    initialState: boolean;
}

export interface TowTypesStoreState extends BaseInitialState {
    towTypes: TowTypeSchema[] | undefined;
    initialState: boolean;
}

export interface FlightTypesStoreState extends BaseInitialState {
    flightTypes: FlightTypeSchema[] | undefined;
    initialState: boolean;
}
