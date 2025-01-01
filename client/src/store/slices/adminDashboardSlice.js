import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/admin/dashboard",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchDashboardStats = createAsyncThunk(
  "adminDashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTrendReports = createAsyncThunk(
  "adminDashboard/fetchTrendReports ",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/trends");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTimeBasedStats = createAsyncThunk(
  "adminDashboard/fetchTimeBasedStats ",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/activity");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    stats: null,
    trends: null,
    activity: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = "success";
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTrendReports.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTrendReports.fulfilled, (state, action) => {
        state.status = "success";
        state.trends = action.payload;
      })
      .addCase(fetchTrendReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTimeBasedStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTimeBasedStats.fulfilled, (state, action) => {
        state.status = "success";
        state.activity = action.payload;
      })
      .addCase(fetchTimeBasedStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default adminDashboardSlice.reducer;
