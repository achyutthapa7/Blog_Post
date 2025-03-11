import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import userSlice from "./features/user/userSlice";
// import storage from "redux-persist/lib/storage";
// import {
//   FLUSH,
//   PAUSE,
//   PERSIST,
//   persistReducer,
//   PURGE,
//   REGISTER,
//   REHYDRATE,
// } from "redux-persist";
// import { persistStore } from "redux-persist";

// const combinedReducers = combineReducers({
//   user: userSlice,
// });

// const persistedReducer = persistReducer(
//   {
//     key: "auth",
//     storage,
//     whitelist: ["user"],
//   },
//   combinedReducers
// );

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// export const persistor = persistStore(store);
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
