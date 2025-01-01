import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";
import { ToastContainer } from "react-toastify";

// Pages
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BlogList from "./pages/blogs/BlogList";
import BlogDetail from "./pages/blogs/BlogDetail";
import BlogForm from "./pages/blogs/BlogForm";
import Notifications from "./components/Notifications";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />

          <Route path="/blogs/create" element={<ProtectedRoute />}>
            <Route path="/blogs/create" element={<BlogForm />} />
          </Route>
          <Route path="/blogs/edit/:id" element={<ProtectedRoute />}>
            <Route path="/blogs/edit/:id" element={<BlogForm />} />
          </Route>

          <Route path="/notifications" element={<ProtectedRoute />}>
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          <Route path="/profile" element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          <Route path="/admin/dashboard" element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>

        <ToastContainer position="top-center" />
      </div>
    </Router>
  );
}

export default App;
