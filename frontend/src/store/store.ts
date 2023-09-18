import {configureStore} from '@reduxjs/toolkit'
import {useDispatch} from "react-redux";
import {actionsReducer} from "./reducers/actionSlice.ts";

export const store = configureStore({
    reducer: {
        actions: actionsReducer.reducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
