import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
import commentReducer from "./slices/commentSlice";
import notificationReducer from "./slices/notificationSlice";
import adminReducer from "./slices/adminSlice";
import adminDashboardReducer from "./slices/adminDashboardSlice";
import categoriesReducer from "./slices/categorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    comments: commentReducer,
    notifications: notificationReducer,
    admin: adminReducer,
    adminDashboard: adminDashboardReducer,
    categories: categoriesReducer,
  },
});

export default store;
