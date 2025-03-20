import { IBlog } from "@/app/db/models/blog.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION ||
      "https://blog-post-7dgh.onrender.com/"
    : process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT;
export const fetchBlog = createAsyncThunk(
  "blog/fetchBlog",
  async (page: number) => {
    try {
      const res = await axios.get(`${API_URL}/blogs/fetchBlogs?page=${page}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error while fetching blog:", error);
    }
  }
);

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

      return res.data;
    } catch (error) {
      console.error("Error while deleting comment:", error);
    }
  }
);

export const likeBlog = createAsyncThunk(
  "blog/likeComment",
  async (blogId: string) => {
    try {
      const res = await axios.put(
        `${API_URL}/blogs/likeBlog/${blogId}`,
        {},
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error while liking blog:", error);
    }
  }
);

export const unLikeBlog = createAsyncThunk(
  "blog/unlikeBlog",
  async (blogId: string) => {
    try {
      const res = await axios.put(`${API_URL}/blogs/unlikeBlog/${blogId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error while unliking blog:", error);
    }
  }
);
const initialState: {
  blogs: IBlog[];
  totalBlogs: number;
  limit: number;
  loading: "idle" | "pending" | "failed" | "succeeded";
} = {
  blogs: [],
  totalBlogs: 0,
  limit: 0,
  loading: "idle",
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      const isAlreadyAdded = state.blogs.some(
        (b) => b._id === action.payload._id
      );
      if (!isAlreadyAdded)
        if (!isAlreadyAdded) state.blogs.unshift(action.payload);
    },
    setComments: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlog.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchBlog.fulfilled, (state, action) => {
        const { blogs, totalBlogs, limit } = action.payload;
        state.loading = "succeeded";
        state.blogs = blogs;
        state.totalBlogs = totalBlogs;
        state.limit = limit;
      })
      .addCase(fetchBlog.rejected, (state) => {
        state.loading = "failed";
      })
      // .addCase(addBlog.fulfilled, (state, action) => {
      //   state.blogs.unshift(action.payload);
      //   state.loading = "succeeded";
      // })
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
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        const { blogId, userId } = action.payload;
        const blog = state.blogs.find((b) => b._id === blogId);
        if (blog) {
          blog?.likes?.push(userId);
        }
      })
      .addCase(unLikeBlog.fulfilled, (state, action) => {
        const { blogId, userId } = action.payload;
        const blog = state.blogs.find((b) => b._id === blogId);
        if (blog) {
          blog.likes = blog?.likes?.filter((id) => id != userId);
        }
      });
  },
});

export const { setBlogs } = blogSlice.actions;
export default blogSlice.reducer;
///hey heye
