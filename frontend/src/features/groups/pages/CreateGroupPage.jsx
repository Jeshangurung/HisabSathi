import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../../components/common/Button.jsx";
import Card from "../../../components/common/Card.jsx";
import Input from "../../../components/common/Input.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


export default function CreateGroupPage() {
  const [name, setName] = useState("");

  const submit = (event) => {
    event.preventDefault();
    toast.success(`${name || "Group"} is ready to create once the API is connected.`);
  };

  return (
    <>
      <PageHeader description="Add a group name and description, then invite members in the next step." eyebrow="Groups" title="Create group" />
      <Card className="max-w-2xl">
        <form className="space-y-4" onSubmit={submit}>
          <Input label="Group name" onChange={(event) => setName(event.target.value)} required value={name} />
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Description</span>
            <textarea className="mt-2 min-h-32 w-full rounded-md border border-zinc-200 px-4 py-3 outline-none focus:border-ink focus:ring-2 focus:ring-ink/10" />
          </label>
          <Button type="submit">Create group</Button>
        </form>
      </Card>
    </>
  );
}
