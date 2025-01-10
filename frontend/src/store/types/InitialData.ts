import {
    ActionSchema,
    ActiveTowAirplaneSchema, FlightSchema, GliderOwnerSchema,
    GliderSchema, MemberRoleSchema,
    MemberSchema, EventSchema,
    TowAirplaneSchema, NotificationSchema, CommentSchema,
} from "../../lib/types.ts";

export interface BaseInitialState {
    fetchInProgress: boolean;
    error?: string;
}


export interface ActionsStoreState extends BaseInitialState {
    page: number;
    pageSize: number;
    actions: ActionSchema[] | undefined;
    initialState: boolean;
}


export interface CurrentActionStoreState extends BaseInitialState {
    reviewMode: boolean;
    actionId?: number;
    initialState: boolean;
    fetchingActiveTowAirplanesInProgress: boolean;
    fetchingFlightsInProgress: boolean;
    activeTowAirplanes?: ActiveTowAirplaneSchema[];
    flights?: FlightSchema[];
    events?: EventSchema[];
    notifications?: NotificationSchema[];
    comments?: CommentSchema[];
}

export interface MembersStoreState extends BaseInitialState {
    members: MemberSchema[] | undefined;
    initialState: boolean;
    membersRoles: MemberRoleSchema[] | undefined;
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


export interface EventsStoreState extends BaseInitialState {
    initialState: boolean;
}
