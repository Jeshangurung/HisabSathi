import { Navigate, Outlet } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout.jsx";
import Loader from "../components/common/Loader.jsx";
import { useAuth } from "../hooks/useAuth.js";


export default function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-mist">
        <Loader label="Preparing your workspace" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
