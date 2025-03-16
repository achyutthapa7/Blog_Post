import { IBlog } from "@/app/db/models/blog.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
    : process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT;
export const fetchBlog = createAsyncThunk("blog/fetchBlog", async () => {
  try {
    const res = await axios.get(`${API_URL}/blogs/fetchBlogs`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error while fetching blog:", error);
  }
});

export const addBlog = createAsyncThunk(
  "blog/addBlog",
  async (blogData: { title: string; content: string }) => {
    try {
      const res = await axios.post(`${API_URL}/blogs/addBlog`, blogData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res);
      return res.data.post;
    } catch (error) {
      console.error("Error while adding blog:", error);
    }
  }
);

export const addComment = createAsyncThunk(
  "blog/addComment",
  async ({ blogId, comment }: { blogId: string; comment: string }) => {
    try {
      const res = await axios.post(
        `${API_URL}/blogs/commentOnBlog/${blogId}`,
        { commentText: comment },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error while adding comment:", error);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "blog/deleteComment",
  async ({ blogId, commentId }: { blogId: string; commentId: string }) => {
    try {
      const res = await axios.delete(
        `${API_URL}/blogs/deleteComment/${commentId}/${blogId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error while deleting comment:", error);
    }
  }
);

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
  reducers: {},
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
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
        state.loading = "succeeded";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { blogId, newComment } = action.payload;
        const blog = state.blogs.find((b) => b._id === blogId);
        if (blog) blog.comments.unshift(newComment);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { blogId, commentId } = action.payload;
        const blog = state.blogs.find((b) => b._id === blogId);
        if (blog) {
          blog.comments = blog.comments.filter(
            (comment) => comment._id != commentId
          );
        }
      });
  },
});

export const {} = blogSlice.actions;
export default blogSlice.reducer;
