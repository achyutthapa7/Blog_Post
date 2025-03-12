import { IBlog } from "@/app/db/models/blog.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBlog = createAsyncThunk("post/fetchBlog", async () => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT;
  try {
    const res = await axios.get(`${API_URL}/blogs/fetchBlogs`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error while fetching blog:", error);
  }
});

const initialState: {
  blogs: IBlog[];
  loading: "idle" | "pending" | "failed" | "succeeded";
} = {
  blogs: [],
  loading: "idle",
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    addBlog: (state, action) => {
      const { blog } = action.payload;
      console.log("addedBlog: ", state.blogs);
      state.blogs = [...state.blogs, blog];
      console.log("After adding: ", state.blogs);
    },
    removeBlog: (state, action) => {
      const { blogId } = action.payload;
      state.blogs = state.blogs.filter((b) => b._id != blogId);
    },
    likeBlog: (state, action) => {
      const { blogId, userId } = action.payload;
      state.blogs = state.blogs.map((b) =>
        b.id === blogId ? { ...b, likes: [...b.likes, userId] } : b
      );
    },
    unlikeBlog: (state, action) => {
      const { userId, blogId } = action.payload;
      state.blogs = state.blogs.map((b) =>
        b._id === blogId
          ? { ...b, likes: b.likes.filter((l) => l._id != userId) }
          : b
      );
    },
    commentOnBlog: (state, action) => {
      const { blogId, comment } = action.payload;
      state.blogs = state.blogs.map((b) =>
        b._id === blogId
          ? {
              ...b,
              comments: [...b.comments, comment],
            }
          : b
      );
    },
    deleteComment: (state, action) => {
      const { blogId, commentId } = action.payload;

      state.blogs = state.blogs.map((b) =>
        b._id === blogId
          ? {
              ...b,
              comments: b.comments.filter((c) => c._id != commentId),
            }
          : b
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlog.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchBlog.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.blogs = action.payload;
      })
      .addCase(fetchBlog.rejected, (state) => {
        state.loading = "failed";
      });
  },
});

export const {
  addBlog,
  removeBlog,
  likeBlog,
  unlikeBlog,
  commentOnBlog,
  deleteComment,
} = blogSlice.actions;
export default blogSlice.reducer;
