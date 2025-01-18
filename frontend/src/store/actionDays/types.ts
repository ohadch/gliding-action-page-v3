import { ActionSchema, FlightSchema, CommentSchema, ActiveTowAirplaneSchema } from '../../lib/types';

export interface ActionDaysState {
    list: {
        actions: ActionSchema[];
        loading: boolean;
        error: string | null;
    };
    currentDay: {
        currentActionId: number | null;
        flights: FlightSchema[];
        comments: CommentSchema[];
        activeTowAirplanes: ActiveTowAirplaneSchema[];
        loading: boolean;
        error: string | null;
        reviewMode: boolean;
    };
} 