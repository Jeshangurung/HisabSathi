import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../../components/common/Button.jsx";
import Card from "../../../components/common/Card.jsx";
import Input from "../../../components/common/Input.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


export default function AddExpensePage() {
  const [splitType, setSplitType] = useState("equal");

  const submit = (event) => {
    event.preventDefault();
    toast.success("Expense is ready to submit once the API is connected.");
  };

  return (
    <>
      <PageHeader description="Record who paid and decide whether members split equally or by custom amounts." eyebrow="Expenses" title="Add expense" />
      <Card className="max-w-3xl">
        <form className="space-y-5" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Expense title" required />
            <Input label="Amount" min="0" required type="number" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Paid by user ID" required />
            <Input label="Group ID" required />
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-700">Split type</span>
            <div className="mt-2 grid grid-cols-2 rounded-md border border-zinc-200 bg-white p-1">
              {["equal", "custom"].map((type) => (
                <button
                  className={`rounded-md px-4 py-2 text-sm font-semibold ${splitType === type ? "bg-ink text-white" : "text-zinc-500"}`}
                  key={type}
                  onClick={() => setSplitType(type)}
                  type="button"
                >
                  {type === "equal" ? "Equal split" : "Custom split"}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit">Save expense</Button>
        </form>
      </Card>
    </>
  );
}
