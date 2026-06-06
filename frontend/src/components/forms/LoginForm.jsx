import { useState } from "react";

import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";


export default function LoginForm({ onSubmit }) {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.identifier.trim()) nextErrors.identifier = "Username or email is required.";
    if (!form.password) nextErrors.password = "Password is required.";
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
      <Input error={errors.identifier} label="Username or email" name="identifier" onChange={update} value={form.identifier} />
      <Input error={errors.password} label="Password" name="password" onChange={update} type="password" value={form.password} />
      <Button className="w-full" isLoading={isLoading} type="submit">
        Sign in
      </Button>
    </form>
  );
}
