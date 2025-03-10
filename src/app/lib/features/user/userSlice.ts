import { IBlog } from "@/app/db/models/blog.model";
import {
  createAsyncThunk,
  createSlice,
  Draft,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  blog: IBlog[];
  followers: string[];
  sentFollowRequest: string[];
  receivedFollowRequest: string[];
}

interface USERSTATE {
  user: IUser | null;
  isAuthenticated: boolean | null;
}

const initialState: USERSTATE = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload as Draft<IUser>;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setIsAuthenticated, logoutUser } = userSlice.actions;
export default userSlice.reducer;
