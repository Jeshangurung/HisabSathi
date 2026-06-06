import { useParams } from "react-router-dom";

import Badge from "../../components/common/Badge.jsx";
import Card from "../../components/common/Card.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { useApi } from "../../hooks/useApi.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";
import { getExpense } from "./expenseService.js";


export default function ExpenseDetailPage() {
  const { expenseId } = useParams();
  const { data: expense, error, isLoading } = useApi(() => getExpense(expenseId), [expenseId]);

  if (isLoading) return <Loader label="Loading expense" />;

  return (
    <>
      <PageHeader description="Expense information, split rows, and status." eyebrow="Expense" title={expense?.title ?? "Expense detail"} />
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-3xl font-black text-ink">{formatCurrency(expense?.total_amount)}</p>
            <p className="mt-2 text-sm text-zinc-500">{formatDate(expense?.expense_date)} · Paid by user #{expense?.paid_by}</p>
          </div>
          <Badge variant="neutral">{expense?.split_type}</Badge>
        </div>
        <p className="mt-5 text-sm leading-6 text-zinc-600">{expense?.description || "No description provided."}</p>
        <div className="mt-6 divide-y divide-zinc-100">
          {expense?.splits?.map((split) => (
            <div className="flex items-center justify-between gap-4 py-4" key={split.id}>
              <span className="font-semibold text-zinc-700">{split.user_display || `User #${split.user}`}</span>
              <div className="flex items-center gap-3">
                <span className="font-bold">{formatCurrency(split.amount_owed)}</span>
                <Badge variant={split.status === "confirmed" ? "success" : "warning"}>{split.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
