import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/comments",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCommentsByBlogId = createAsyncThunk(
  "comments/fetchCommentsByBlogId",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/${blogId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (commentData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post("", commentData);
      dispatch(fetchCommentsByBlogId(commentData.blogId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ id, blogId, content }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.put(`/${id}`, { content });
      dispatch(fetchCommentsByBlogId(blogId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const likeComment = createAsyncThunk(
  "comments/likeComment",
  async ({ id, blogId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.put(`/${id}/like`);
      dispatch(fetchCommentsByBlogId(blogId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const dislikeComment = createAsyncThunk(
  "comments/dislikeComment",
  async ({ id, blogId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.put(`/${id}/dislike`);
      dispatch(fetchCommentsByBlogId(blogId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchPopularComments = createAsyncThunk(
  "comments/fetchPopularComments",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/${blogId}/popular`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    popularComments: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "success";
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCommentsByBlogId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCommentsByBlogId.fulfilled, (state, action) => {
        state.status = "success";
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByBlogId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = "success";
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateComment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.status = "success";
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
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
      .addCase(likeComment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.status = "success";
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(dislikeComment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(dislikeComment.fulfilled, (state, action) => {
        state.status = "success";
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(dislikeComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPopularComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPopularComments.fulfilled, (state, action) => {
        state.status = "success";
        state.popularComments = action.payload;
      })
      .addCase(fetchPopularComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
