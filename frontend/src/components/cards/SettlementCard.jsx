import { useState } from "react";
import { Check, Upload, X } from "lucide-react";

import { SETTLEMENT_STATUS } from "../../lib/constants.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";
import Card from "../common/Card.jsx";
import Input from "../common/Input.jsx";


function statusVariant(status) {
  if (status === "confirmed") return "success";
  if (status === "rejected") return "danger";
  if (status === "marked_paid") return "warning";
  return "neutral";
}

export default function SettlementCard({ canConfirm, canMarkPaid, onConfirm, onMarkPaid, onReject, settlement }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionNote, setTransactionNote] = useState("");
  const [proofImage, setProofImage] = useState(null);

  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-ink">{formatCurrency(settlement.amount)}</h3>
            <Badge variant={statusVariant(settlement.status)}>{SETTLEMENT_STATUS[settlement.status] ?? settlement.status}</Badge>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            From user #{settlement.from_user} to user #{settlement.to_user}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canConfirm ? (
            <>
              <Button icon={Check} onClick={() => onConfirm(settlement.id)} variant="secondary">
                Confirm
              </Button>
              <Button icon={X} onClick={() => onReject(settlement.id)} variant="ghost">
                Reject
              </Button>
            </>
          ) : null}
        </div>
      </div>
      {canMarkPaid ? (
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input label="Payment method" onChange={(event) => setPaymentMethod(event.target.value)} placeholder="eSewa, Khalti, Bank" value={paymentMethod} />
          <Input label="Transaction note" onChange={(event) => setTransactionNote(event.target.value)} placeholder="Reference or note" value={transactionNote} />
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Proof</span>
            <input className="mt-2 block w-full text-sm text-zinc-600" onChange={(event) => setProofImage(event.target.files?.[0] ?? null)} type="file" />
          </label>
          <div className="md:col-span-3">
            <Button icon={Upload} onClick={() => onMarkPaid(settlement.id, { payment_method: paymentMethod, proof_image: proofImage, transaction_note: transactionNote })}>
              Mark as paid
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
