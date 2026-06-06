import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../../components/common/Button.jsx";
import Card from "../../../components/common/Card.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


export default function LoanTrackerPage() {
  return (
    <>
      <PageHeader
        actions={
          <Link to="/loans/new">
            <Button icon={Plus}>Add loan</Button>
          </Link>
        }
        description="Track personal money borrowed or lent outside group expenses."
        eyebrow="Loans"
        title="Loan tracker"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {["You lent Rs. 5,000 to Asha", "You borrowed Rs. 2,000 from Ramesh"].map((loan) => (
          <Card key={loan}>
            <h2 className="text-lg font-bold text-ink">{loan}</h2>
            <p className="mt-2 text-sm text-zinc-500">Due this month</p>
            <Button className="mt-5" variant="secondary">Mark paid</Button>
          </Card>
        ))}
      </div>
    </>
  );
}
