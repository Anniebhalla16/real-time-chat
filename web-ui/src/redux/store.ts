import { configureStore } from "@reduxjs/toolkit";
import messages from "./features/messageSlice";

export const store = configureStore({
    reducer: {
        messages
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;