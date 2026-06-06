import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import GroupCard from "../../components/cards/GroupCard.jsx";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { useApi } from "../../hooks/useApi.js";
import { listGroups } from "./groupService.js";


export default function GroupsPage() {
  const { data: groups = [], error, isLoading } = useApi(listGroups, [], { initialData: [] });

  return (
    <>
      <PageHeader
        actions={<Link to="/groups/new"><Button icon={Plus}>Create group</Button></Link>}
        description="Groups keep every trip, room, office, and shared plan organized."
        eyebrow="Groups"
        title="Expense groups"
      />
      {isLoading ? <Loader label="Loading groups" /> : null}
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {!isLoading && groups.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => <GroupCard group={group} key={group.id} />)}
        </div>
      ) : null}
      {!isLoading && !groups.length ? <EmptyState description="Create a group and invite friends by user ID." title="No groups yet" /> : null}
    </>
  );
}
