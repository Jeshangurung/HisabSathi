import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../../components/common/Button.jsx";
import Card from "../../../components/common/Card.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


const groups = [
  { id: 1, name: "Pokhara Trip", members: 5, balance: "Rs. 3,450 pending" },
  { id: 2, name: "Roommates", members: 3, balance: "Rs. 1,900 pending" },
];


export default function GroupsPage() {
  return (
    <>
      <PageHeader
        actions={
          <Link to="/groups/new">
            <Button icon={Plus}>Create group</Button>
          </Link>
        }
        description="Create groups for trips, rooms, offices, events, and recurring shared costs."
        eyebrow="Groups"
        title="Expense groups"
      />
      {groups.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Link key={group.id} to={`/groups/${group.id}`}>
              <Card className="transition hover:-translate-y-0.5 hover:border-zinc-300">
                <h2 className="text-xl font-bold text-ink">{group.name}</h2>
                <p className="mt-2 text-sm text-zinc-500">{group.members} members</p>
                <p className="mt-5 text-sm font-semibold text-sathi">{group.balance}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState description="Start by creating a group for your next shared bill." title="No groups yet" />
      )}
    </>
  );
}
