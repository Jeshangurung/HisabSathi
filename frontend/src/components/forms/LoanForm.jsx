import { useState } from "react";

import { isPositiveMoney } from "../../utils/validators.js";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import Textarea from "../common/Textarea.jsx";


export default function LoanForm({ onSubmit }) {
  const [form, setForm] = useState({ amount: "", borrower: "", due_date: "", lender: "", reason: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.lender) nextErrors.lender = "Lender user ID is required.";
    if (!form.borrower) nextErrors.borrower = "Borrower user ID is required.";
    if (form.lender && form.borrower && form.lender === form.borrower) nextErrors.borrower = "Borrower must be different.";
    if (!isPositiveMoney(form.amount)) nextErrors.amount = "Amount must be greater than zero.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setIsLoading(true);
    try {
      await onSubmit({
        ...form,
        borrower: Number(form.borrower),
        lender: Number(form.lender),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
      <Input error={errors.lender} label="Lender user ID" name="lender" onChange={update} type="number" value={form.lender} />
      <Input error={errors.borrower} label="Borrower user ID" name="borrower" onChange={update} type="number" value={form.borrower} />
      <Input error={errors.amount} label="Amount" min="0" name="amount" onChange={update} type="number" value={form.amount} />
      <Input label="Due date" name="due_date" onChange={update} type="date" value={form.due_date} />
      <div className="md:col-span-2">
        <Textarea label="Reason" name="reason" onChange={update} value={form.reason} />
      </div>
      <div className="md:col-span-2">
        <Button isLoading={isLoading} type="submit">
          Save loan
        </Button>
      </div>
    </form>
  );
}
