import { EventSchema } from '../../lib/types';
import { BaseInitialState } from '../types/base';

export interface EventsState extends BaseInitialState {
    events: EventSchema[];
} 