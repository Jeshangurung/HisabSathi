import { Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Button from "../../../components/common/Button.jsx";
import Card from "../../../components/common/Card.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


export default function GroupDetailPage() {
  const { groupId } = useParams();

  return (
    <>
      <PageHeader
        actions={
          <Link to="/expenses/new">
            <Button icon={Plus}>Add expense</Button>
          </Link>
        }
        description="Members, recent bills, and settlement status for this group."
        eyebrow={`Group ${groupId}`}
        title="Group detail"
      />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-lg font-bold text-ink">Members</h2>
          <div className="mt-4 space-y-3">
            {["Sita", "Ramesh", "Asha", "Bikram"].map((member) => (
              <div className="rounded-md bg-zinc-50 p-3 text-sm font-semibold" key={member}>{member}</div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-ink">Expenses</h2>
          <div className="mt-4 divide-y divide-zinc-100">
            {["Dinner", "Hotel advance", "Taxi"].map((expense) => (
              <div className="flex justify-between py-4" key={expense}>
                <span className="font-semibold">{expense}</span>
                <span className="text-zinc-500">Rs. 2,400</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
