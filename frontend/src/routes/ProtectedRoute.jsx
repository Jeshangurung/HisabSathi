import { Navigate, Outlet } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout.jsx";
import { useAuth } from "../hooks/useAuth.js";


export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
