import { CheckCircle } from "lucide-react";

import { LOAN_STATUS } from "../../lib/constants.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";
import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";
import Card from "../common/Card.jsx";


function variant(status) {
  if (status === "paid") return "success";
  if (status === "cancelled") return "danger";
  if (status === "marked_paid") return "warning";
  return "neutral";
}

export default function LoanCard({ loan, onConfirmPaid, onMarkPaid, showConfirm, showMarkPaid }) {
  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-ink">{formatCurrency(loan.amount)}</h3>
            <Badge variant={variant(loan.status)}>{LOAN_STATUS[loan.status] ?? loan.status}</Badge>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            Lender #{loan.lender} to borrower #{loan.borrower}
          </p>
          <p className="mt-1 text-sm text-zinc-500">Due {formatDate(loan.due_date)}</p>
          {loan.reason ? <p className="mt-3 text-sm leading-6 text-zinc-600">{loan.reason}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {showMarkPaid ? (
            <Button icon={CheckCircle} onClick={() => onMarkPaid(loan.id)} variant="secondary">
              Mark paid
            </Button>
          ) : null}
          {showConfirm ? (
            <Button icon={CheckCircle} onClick={() => onConfirmPaid(loan.id)}>
              Confirm
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
