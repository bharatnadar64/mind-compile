// admin/routes/AdminRoute.jsx
// @ts-nocheck
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));

    // ❌ Not admin
    if (!decoded.isAdmin) {
      return <Navigate to="/" replace />;
    }

    // ✅ Admin access
    return <Outlet />;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
