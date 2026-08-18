import { configureStore } from '@reduxjs/toolkit'
import toggleSidbarReducer from './slices/toggleSidebarSlice'
import authReducer from './slices/auth/authSlice'
import toastificationReducer from './slices/toastificationSlice'

import userProfileReducer from './slices/profile/getUserProfileSlice'
export const store = configureStore({
    reducer: {
        toggleSidbarSlice: toggleSidbarReducer,
        authSlice: authReducer,
        toastificationSlice: toastificationReducer,

        //profile 

        userProfileSlice: userProfileReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch