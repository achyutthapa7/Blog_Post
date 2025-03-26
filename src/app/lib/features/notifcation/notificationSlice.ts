import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../blog/blogSlice";

export const fetchNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications/getNotifications`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error while fetching notifications:", error);
    }
  }
);

export interface INotification {
  blogId: {
    _id: string;
    title: string;
    content: string;
  };
  createdAt: Date;
  _id: string;
  senderId: { _id: string; firstName: string; lastName: string };
  receiverId: { _id: string; firstName: string; lastName: string };
  message: string;
  read: boolean;
}
type notifcationState = {
  notifications: INotification[];
};

const initialState: notifcationState = {
  notifications: [],
};
export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification>) => {
      const isAlreadyExsited = state.notifications.find(
        (notification) => notification._id === action.payload._id
      );
      if (!isAlreadyExsited) state.notifications.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
    });
  },
});
export const { setNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
