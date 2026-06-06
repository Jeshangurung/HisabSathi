import Badge from "../../../components/common/Badge.jsx";
import Button from "../../../components/common/Button.jsx";
import Card from "../../../components/common/Card.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


const settlements = [
  { name: "Ramesh to Sita", amount: "Rs. 900", status: "pending" },
  { name: "Asha to Sita", amount: "Rs. 1,200", status: "paid" },
  { name: "Bikram to You", amount: "Rs. 750", status: "confirmed" },
];


export default function SettlementPage() {
  return (
    <>
      <PageHeader
        description="Mark payments as paid, upload proof, and confirm money received."
        eyebrow="Settlements"
        title="Settlement tracking"
      />
      <div className="space-y-4">
        {settlements.map((settlement) => (
          <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between" key={settlement.name}>
            <div>
              <h2 className="text-lg font-bold text-ink">{settlement.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">{settlement.amount}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={settlement.status === "confirmed" ? "success" : "warning"}>{settlement.status}</Badge>
              <Button variant="secondary">Review</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
