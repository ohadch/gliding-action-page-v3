import { NotificationSchema } from '../../lib/types';
import { BaseInitialState } from '../types/base';

export interface NotificationsState extends BaseInitialState {
    notifications: NotificationSchema[];
} 