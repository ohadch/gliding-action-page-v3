import {
    ActiveTowAirplaneSchema,
    FlightSchema,
    EventSchema,
    NotificationSchema,
    CommentSchema,
    ActionSchema
} from "../../lib/types";
import { BaseInitialState } from "./base";

export interface ActionDayState extends BaseInitialState {
    currentActionId?: number;
    reviewMode: boolean;
    activeTowAirplanes?: ActiveTowAirplaneSchema[];
    flights?: FlightSchema[];
    events?: EventSchema[];
    notifications?: NotificationSchema[];
    comments?: CommentSchema[];
}

export interface ActionDaysListState extends BaseInitialState {
    actions?: ActionSchema[];
    page: number;
    pageSize: number;
}

export interface ActionsStoreState {
    currentDay: ActionDayState;
    list: ActionDaysListState;
} 