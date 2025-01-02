import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api/blogs`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const response = await axiosInstance.get();
  return response.data;
});

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id) => {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blogData) => {
    const response = await axiosInstance.post("", blogData);
    return response.data;
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blogData }) => {
    const response = await axiosInstance.put(`/${id}`, blogData);
    return response.data;
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id, { dispatch }) => {
    await axiosInstance.delete(`/${id}`);
    dispatch(fetchBlogs());
    return id;
  }
);

export const toggleLikeBlog = createAsyncThunk(
  "blogs/toggleLikeBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/${blogId}/like`);
      return response.data.blog;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTrendingBlogs = createAsyncThunk(
  "blogs/fetchTrendingBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/trending/blogs");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchRecommendedBlogs = createAsyncThunk(
  "blogs/fetchRecommendedBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/recommended/blogs");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchPersonalizedBlogs = createAsyncThunk(
  "blogs/fetchPersonalizedBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/personalized/blogs");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchBlogsByCategory = createAsyncThunk(
  "blogs/getBlogsByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/filter/${categoryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const searchBlogs = createAsyncThunk(
  "blogs/searchBlogs",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/search/blogs", {
        params: searchTerm,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    trendingBlogs: [],
    recommendedBlogs: [],
    personalizedBlogs: [],
    blog: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetBlogs: (state) => {
      state.blogs = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "success";
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.status = "success";
        state.blog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createBlog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.status = "success";
        state.blogs.push(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.status = "success";
        const index = state.blogs.findIndex(
          (blog) => blog.id === action.payload.id
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.status = "success";
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(toggleLikeBlog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(toggleLikeBlog.fulfilled, (state, action) => {
        state.status = "success";
        const index = state.blogs.findIndex(
          (blog) => blog._id === action.payload._id
        );
        if (index !== -1) {
          state.blogs[index].likes = action.payload.likes;
        }
      })
      .addCase(toggleLikeBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTrendingBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTrendingBlogs.fulfilled, (state, action) => {
        state.status = "success";
        state.trendingBlogs = action.payload;
      })
      .addCase(fetchTrendingBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRecommendedBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecommendedBlogs.fulfilled, (state, action) => {
        state.status = "success";
        state.recommendedBlogs = action.payload;
      })
      .addCase(fetchRecommendedBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPersonalizedBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPersonalizedBlogs.fulfilled, (state, action) => {
        state.status = "success";
        state.personalizedBlogs = action.payload;
      })
      .addCase(fetchPersonalizedBlogs.rejected, (state, action) => {
        state.status = "loading";
        state.error = action.payload;
      })
      .addCase(fetchBlogsByCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlogsByCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.blogs = action.payload;
      })
      .addCase(fetchBlogsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(searchBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchBlogs.fulfilled, (state, action) => {
        state.status = "success";
        state.blogs = action.payload;
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetBlogs } = blogSlice.actions;
export default blogSlice.reducer;
