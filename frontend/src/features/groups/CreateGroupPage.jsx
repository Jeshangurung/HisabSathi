import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import GroupForm from "../../components/forms/GroupForm.jsx";
import Card from "../../components/common/Card.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { createGroup } from "./groupService.js";


export default function CreateGroupPage() {
  const navigate = useNavigate();

  const submit = async (payload) => {
    const group = await createGroup(payload);
    toast.success("Group created.");
    navigate(`/groups/${group.id}`);
  };

  return (
    <>
      <PageHeader description="Create a shared place for bills, members, expenses, and settlements." eyebrow="Groups" title="Create group" />
      <Card className="max-w-2xl">
        <GroupForm onSubmit={submit} />
      </Card>
    </>
  );
}
