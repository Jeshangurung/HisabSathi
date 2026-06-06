import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import RegisterForm from "../../../components/forms/RegisterForm.jsx";
import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import { useAuth } from "../../../hooks/useAuth.js";


export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const submit = async (form) => {
    try {
      await register(form);
      toast.success("Account created.");
      navigate("/dashboard");
    } catch {
      toast.error("Registration failed. Please review your details.");
    }
  };

  return (
    <AuthLayout subtitle="Create your account and start tracking shared money clearly." title="Create account">
      <RegisterForm onSubmit={submit} />
      <p className="mt-5 text-center text-sm text-zinc-500">
        Already registered? <Link className="font-semibold text-ink" to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
