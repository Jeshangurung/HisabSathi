import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import Badge from "../../../components/common/Badge.jsx";
import Button from "../../../components/common/Button.jsx";
import Card from "../../../components/common/Card.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


const stats = [
  { label: "You owe", value: "Rs. 4,250", tone: "warning" },
  { label: "You are owed", value: "Rs. 8,900", tone: "success" },
  { label: "Pending settlements", value: "6", tone: "neutral" },
  { label: "Active loans", value: "3", tone: "neutral" },
];


export default function DashboardPage() {
  return (
    <>
      <PageHeader
        actions={
          <Link to="/expenses/new">
            <Button icon={Plus}>Add expense</Button>
          </Link>
        }
        description="A clear snapshot of shared expenses, settlements, and loans."
        eyebrow="Overview"
        title="Dashboard"
      />
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <Badge variant={stat.tone}>Live</Badge>
            </div>
            <p className="mt-5 text-3xl font-black text-ink">{stat.value}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-lg font-bold text-ink">Recent activity</h2>
          <div className="mt-4 divide-y divide-zinc-100">
            {["Dinner split added", "Hotel advance confirmed", "Loan reminder scheduled"].map((item) => (
              <div className="flex items-center justify-between py-4" key={item}>
                <p className="font-medium text-zinc-700">{item}</p>
                <span className="text-sm text-zinc-400">Today</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-ink">Next actions</h2>
          <div className="mt-4 space-y-3">
            <Link className="block rounded-md border border-zinc-200 p-4 font-semibold hover:bg-zinc-50" to="/settlements">
              Review pending settlements
            </Link>
            <Link className="block rounded-md border border-zinc-200 p-4 font-semibold hover:bg-zinc-50" to="/loans">
              Check active loans
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
