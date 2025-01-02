import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api/users`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/login", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Giriş başarısız");
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/profile", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchProfileBlogs = createAsyncThunk(
  "auth/fetchProfileBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/profile/my-blogs");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchProfileComments = createAsyncThunk(
  "auth/fetchProfileComments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/profile/my-comments");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  "auth/uploadProfileImage",
  async (formData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axiosInstance.post(
        "/profile/upload/profile-image",
        formData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  blogs: [],
  comments: [],
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProfileBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfileBlogs.fulfilled, (state, action) => {
        state.status = "success";
        state.blogs = action.payload;
      })
      .addCase(fetchProfileBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProfileComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfileComments.fulfilled, (state, action) => {
        state.status = "success";
        state.comments = action.payload;
      })
      .addCase(fetchProfileComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(uploadProfileImage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.status = "success";
        state.user.profileImage = action.payload.profileImage;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
