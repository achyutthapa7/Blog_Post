import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import blogSlice from "./features/blog/blogSlice";
import notificationSlice from "./features/notifcation/notificationSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    blog: blogSlice,
    notification: notificationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
