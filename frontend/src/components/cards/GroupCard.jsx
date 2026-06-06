import { ArrowUpRight, Users } from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../common/Card.jsx";


export default function GroupCard({ group }) {
  return (
    <Link to={`/groups/${group.id}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:border-zinc-300">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">{group.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">{group.description || "No description added."}</p>
          </div>
          <ArrowUpRight className="text-zinc-400" size={20} />
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-zinc-600">
          <Users size={17} />
          {group.member_count ?? group.members?.length ?? 0} members
        </div>
      </Card>
    </Link>
  );
}
