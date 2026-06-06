import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Button from "../../../components/common/Button.jsx";
import Input from "../../../components/common/Input.jsx";
import { useAuth } from "../../../hooks/useAuth.js";
import { loginUser } from "../../../services/authService.js";


export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const data = await loginUser(form);
      login({ token: data.access, profile: { username: form.username } });
      navigate("/dashboard");
    } catch {
      toast.error("Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Enter your account details to continue." title="Welcome back">
      <form className="space-y-4" onSubmit={submit}>
        <Input label="Username" name="username" onChange={updateField} required value={form.username} />
        <Input label="Password" name="password" onChange={updateField} required type="password" value={form.password} />
        <Button className="w-full" disabled={isLoading} type="submit">
          {isLoading ? "Signing in" : "Sign in"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-zinc-500">
        New here? <Link className="font-semibold text-ink" to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
