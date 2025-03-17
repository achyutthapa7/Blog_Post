import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import blogSlice from "./features/blog/blogSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    blog: blogSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
