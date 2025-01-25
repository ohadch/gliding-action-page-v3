import { EventSchema } from "../../lib/types";
import { BaseInitialState } from "./base";

export interface EventsStoreState extends BaseInitialState {
    events?: EventSchema[];
} 