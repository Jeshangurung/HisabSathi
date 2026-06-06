import { useState } from "react";

import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import Textarea from "../common/Textarea.jsx";


export default function GroupForm({ initialValues = {}, onSubmit }) {
  const [form, setForm] = useState({ description: initialValues.description ?? "", name: initialValues.name ?? "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Group name is required.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Input error={error} label="Group name" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={form.name} />
      <Textarea label="Description" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} value={form.description} />
      <Button isLoading={isLoading} type="submit">
        Save group
      </Button>
    </form>
  );
}
