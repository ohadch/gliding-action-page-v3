import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import reducers
import actionDaysReducer from './actionDays';
import membersReducer from './members';
import aircraftReducer from './aircraft';
import eventsReducer from './events';
import commentsReducer from './comments';
import notificationsReducer from './notifications';

export const store = configureStore({
    reducer: {
        actionDays: actionDaysReducer,
        members: membersReducer,
        aircraft: aircraftReducer,
        events: eventsReducer,
        comments: commentsReducer,
        notifications: notificationsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export from feature slices
export * from './actionDays';
export * from './members';
export * from './aircraft';
export * from './events';
export * from './comments';
export * from './notifications';
