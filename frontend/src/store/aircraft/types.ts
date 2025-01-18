import { GliderSchema, TowAirplaneSchema, GliderOwnerSchema } from '../../lib/types';
import { BaseInitialState } from '../types/base';

export interface AircraftState extends BaseInitialState {
    gliders: GliderSchema[];
    towAirplanes: TowAirplaneSchema[];
    gliderOwnerships: GliderOwnerSchema[];
} 