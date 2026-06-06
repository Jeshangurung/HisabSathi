import { useState } from "react";

import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";


export default function RegisterForm({ onSubmit }) {
  const [form, setForm] = useState({ email: "", full_name: "", password: "", phone_number: "", username: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.full_name.trim()) nextErrors.full_name = "Full name is required.";
    if (!form.username.trim()) nextErrors.username = "Username is required.";
    if (!form.email.includes("@")) nextErrors.email = "Enter a valid email.";
    if (form.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setIsLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Input error={errors.full_name} label="Full name" name="full_name" onChange={update} value={form.full_name} />
      <Input error={errors.username} label="Username" name="username" onChange={update} value={form.username} />
      <Input error={errors.email} label="Email" name="email" onChange={update} type="email" value={form.email} />
      <Input label="Phone number" name="phone_number" onChange={update} value={form.phone_number} />
      <Input error={errors.password} label="Password" name="password" onChange={update} type="password" value={form.password} />
      <Button className="w-full" isLoading={isLoading} type="submit">
        Create account
      </Button>
    </form>
  );
}
