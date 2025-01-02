import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api/admin`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}/role`, {
        role,
      });
      dispatch(fetchUsers());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAllBlogs = createAsyncThunk(
  "admin/fetchAllBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/blogs`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const approveBlog = createAsyncThunk(
  "comments/approveBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/blogs/${blogId}/approve`);
      return response.data.blog;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "admin/deleteBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/blogs/${blogId}`);
      return blogId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAllComments = createAsyncThunk(
  "admin/fetchAllComments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/comments");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "admin/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const approveComment = createAsyncThunk(
  "comments/approveComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/comments/${commentId}/approve`
      );
      return response.data.comment;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchFilteredBlogs = createAsyncThunk(
  "admin/fetchFilteredBlogs",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/filter/blogs", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchFilteredComments = createAsyncThunk(
  "admin/fetchFilteredComments",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/filter/comments", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    blogs: [],
    comments: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "success";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "success";
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.status = "success";
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.status = "success";
        state.blogs = action.payload;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(approveBlog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(approveBlog.fulfilled, (state, action) => {
        state.status = "success";
        const index = state.blogs.findIndex(
          (blog) => blog._id === action.payload._id
        );
        if (index !== -1) {
          state.blogs[index].approved = true;
        }
      })
      .addCase(approveBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.status = "success";
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllComments.fulfilled, (state, action) => {
        state.status = "success";
        state.comments = action.payload;
      })
      .addCase(fetchAllComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = "success";
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(approveComment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(approveComment.fulfilled, (state, action) => {
        state.status = "success";
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index].approved = true;
        }
      })
      .addCase(approveComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchFilteredBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFilteredBlogs.fulfilled, (state, action) => {
        state.status = "success";
        state.blogs = action.payload;
      })
      .addCase(fetchFilteredBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchFilteredComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFilteredComments.fulfilled, (state, action) => {
        state.status = "success";
        state.comments = action.payload;
      })
      .addCase(fetchFilteredComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
