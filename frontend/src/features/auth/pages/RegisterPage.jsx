import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../../components/common/Button.jsx";
import Input from "../../../components/common/Input.jsx";
import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import { registerUser } from "../../../services/authService.js";


export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    password: "",
    phone_number: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await registerUser(form);
      toast.success("Account created. You can sign in now.");
      navigate("/login");
    } catch {
      toast.error("Registration failed. Please review your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Create your account and start tracking shared money clearly." title="Create account">
      <form className="space-y-4" onSubmit={submit}>
        <Input label="Full name" name="full_name" onChange={updateField} required value={form.full_name} />
        <Input label="Username" name="username" onChange={updateField} required value={form.username} />
        <Input label="Email" name="email" onChange={updateField} required type="email" value={form.email} />
        <Input label="Phone number" name="phone_number" onChange={updateField} value={form.phone_number} />
        <Input label="Password" name="password" minLength={8} onChange={updateField} required type="password" value={form.password} />
        <Button className="w-full" disabled={isLoading} type="submit">
          {isLoading ? "Creating account" : "Create account"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-zinc-500">
        Already registered? <Link className="font-semibold text-ink" to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
