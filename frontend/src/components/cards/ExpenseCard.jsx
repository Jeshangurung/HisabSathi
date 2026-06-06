import { Link } from "react-router-dom";

import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";
import Badge from "../common/Badge.jsx";
import Card from "../common/Card.jsx";


export default function ExpenseCard({ expense }) {
  return (
    <Link to={`/expenses/${expense.id}`}>
      <Card className="transition hover:-translate-y-0.5 hover:border-zinc-300">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-ink">{expense.title}</h3>
            <p className="mt-1 text-sm text-zinc-500">{formatDate(expense.expense_date)}</p>
          </div>
          <Badge variant="neutral">{expense.split_type}</Badge>
        </div>
        <p className="mt-5 text-2xl font-black text-ink">{formatCurrency(expense.total_amount)}</p>
        {expense.category ? <p className="mt-2 text-sm font-medium text-zinc-500">{expense.category}</p> : null}
      </Card>
    </Link>
  );
}
