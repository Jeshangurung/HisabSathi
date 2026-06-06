import toast from "react-hot-toast";

import Button from "../../../components/common/Button.jsx";
import Card from "../../../components/common/Card.jsx";
import Input from "../../../components/common/Input.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


export default function AddLoanPage() {
  const submit = (event) => {
    event.preventDefault();
    toast.success("Loan is ready to submit once the API is connected.");
  };

  return (
    <>
      <PageHeader description="Record lender, borrower, amount, note, and due date." eyebrow="Loans" title="Add loan" />
      <Card className="max-w-3xl">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Input label="Lender user ID" required />
          <Input label="Borrower user ID" required />
          <Input label="Amount" min="0" required type="number" />
          <Input label="Due date" type="date" />
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Note</span>
            <textarea className="mt-2 min-h-28 w-full rounded-md border border-zinc-200 px-4 py-3 outline-none focus:border-ink focus:ring-2 focus:ring-ink/10" />
          </label>
          <div className="md:col-span-2">
            <Button type="submit">Save loan</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
