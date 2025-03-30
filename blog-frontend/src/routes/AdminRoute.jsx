import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Get admin status from localStorage

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoute;
