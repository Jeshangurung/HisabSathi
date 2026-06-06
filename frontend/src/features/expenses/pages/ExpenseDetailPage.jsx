import { useParams } from "react-router-dom";

import Badge from "../../../components/common/Badge.jsx";
import Card from "../../../components/common/Card.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


export default function ExpenseDetailPage() {
  const { expenseId } = useParams();

  return (
    <>
      <PageHeader description="Split details and payment progress for this expense." eyebrow={`Expense ${expenseId}`} title="Expense detail" />
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Dinner bill</h2>
            <p className="mt-2 text-sm text-zinc-500">Paid by Sita</p>
          </div>
          <Badge variant="warning">Pending</Badge>
        </div>
        <div className="mt-6 divide-y divide-zinc-100">
          {["Ramesh owes Rs. 900", "Asha owes Rs. 900", "Bikram owes Rs. 900"].map((row) => (
            <p className="py-4 font-semibold text-zinc-700" key={row}>{row}</p>
          ))}
        </div>
      </Card>
    </>
  );
}
