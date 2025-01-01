import React from "react";
import { useSelector } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = useSelector((state) => state.auth.token);
  const role = decodeToken(token).role;

  return token && role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
