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
    try {
      const res = await axios.get("http://localhost:3000/api/auth/status", {
        withCredentials: true,
      });
      console.log("res: ", res.data);
      return res.data;
    } catch (error) {
      console.error("Error while getting authentication status:", error);
    }
  }
);
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
