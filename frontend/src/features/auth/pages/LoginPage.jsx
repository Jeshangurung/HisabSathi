import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import LoginForm from "../../../components/forms/LoginForm.jsx";
import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import { useAuth } from "../../../hooks/useAuth.js";


export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (form) => {
    try {
      await login(form);
      navigate("/dashboard");
    } catch {
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <AuthLayout subtitle="Enter your account details to continue." title="Welcome back">
      <LoginForm onSubmit={submit} />
      <p className="mt-5 text-center text-sm text-zinc-500">
        New here? <Link className="font-semibold text-ink" to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
