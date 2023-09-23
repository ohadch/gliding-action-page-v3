import {
    ActionSchema,
    ActiveTowAirplaneSchema, FlightSchema, GliderOwnerSchema,
    GliderSchema,
    MemberSchema,
    TowAirplaneSchema,
} from "../../lib/types.ts";

export interface BaseInitialState {
    fetchInProgress: boolean;
    error?: string;
}


export interface ActionsStoreState extends BaseInitialState {
    actions: ActionSchema[] | undefined;
    initialState: boolean;
}


export interface CurrentActionStoreState extends BaseInitialState {
    action?: ActionSchema;
    initialState: boolean;
    fieldResponsibleId?: number;
    responsibleCfiId?: number;
    fetchingActiveTowAirplanesInProgress: boolean;
    fetchingFlightsInProgress: boolean;
    activeTowAirplanes?: ActiveTowAirplaneSchema[];
    flights?: FlightSchema[];
}

export interface MembersStoreState extends BaseInitialState {
    members: MemberSchema[] | undefined;
    initialState: boolean;
}


export interface GlidersStoreState extends BaseInitialState {
    gliders: GliderSchema[] | undefined;
    ownerships: GliderOwnerSchema[] | undefined;
    initialState: boolean;
}


export interface TowAirplanesStoreState extends BaseInitialState {
    towAirplanes: TowAirplaneSchema[] | undefined;
    initialState: boolean;
}
