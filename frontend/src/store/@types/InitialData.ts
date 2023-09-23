import {
    ActionSchema,
    ActiveTowAirplaneSchema, FlightSchema, FlightTypeSchema,
    GliderSchema,
    MemberSchema, PayersTypeSchema, PaymentMethodSchema,
    TowAirplaneSchema,
    TowTypeSchema
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

export interface PayersTypesStoreState extends BaseInitialState {
    payersTypes: PayersTypeSchema[] | undefined;
    initialState: boolean;
}

export interface PaymentMethodsStoreState extends BaseInitialState {
    paymentMethods: PaymentMethodSchema[] | undefined;
    initialState: boolean;
}
