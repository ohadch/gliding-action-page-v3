import { GliderSchema, GliderOwnerSchema, TowAirplaneSchema } from "../../lib/types";
import { BaseInitialState } from "./base";

export interface AircraftStoreState extends BaseInitialState {
    gliders?: GliderSchema[];
    gliderOwnerships?: GliderOwnerSchema[];
    towAirplanes?: TowAirplaneSchema[];
} 