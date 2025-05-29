import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// This component will be used to protect routes based on user roles (Employer / Job Seeker)
const RoleProtectedRoute = ({ requiredRole }) => {
  const { user } = useSelector((state) => state.auth);

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has the required role
  if (user.accountType !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If the user has the required role, render the protected component
  return <Outlet />;
};

export default RoleProtectedRoute;

// accountType: "jobSeeker";
