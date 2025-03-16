import { IBlog } from "@/app/db/models/blog.model";
import {
  createAsyncThunk,
  createSlice,
  Draft,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

export const checkAuthStatus = createAsyncThunk(
  "user/checkAuthStatus",
  async () => {
    const API_URL =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
        : process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT;

    try {
      const res = await axios.get(`${API_URL}/auth/status`, {
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      console.error("Error while getting authentication status:", error);
    }
  }
);
interface IUser {
  _id: string;
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
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: USERSTATE = {
  user: null,
  isAuthenticated: false,
  loading: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload as Draft<IUser>;
      state.isAuthenticated = true;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user = action.payload?.rootUser || null;
        state.isAuthenticated = action.payload?.isAuthenticated || false;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = "failed";
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setUser, setIsAuthenticated, logoutUser } = userSlice.actions;
export default userSlice.reducer;
