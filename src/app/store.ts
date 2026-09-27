import { configureStore, type Action, type ThunkAction } from "@reduxjs/toolkit";

import taskReducer from '../features/tasksSlice'

export const store = configureStore({
    reducer: {
        tasks: taskReducer
    }
})

// Infer the type of `store`
export type AppStore = typeof store

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch

// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>

// Export a reusable type for handwritten thunks
export type AppThunk = ThunkAction<void, RootState, unknown, Action>