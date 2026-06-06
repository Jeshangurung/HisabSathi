import { Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

import ExpenseCard from "../../components/cards/ExpenseCard.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Card from "../../components/common/Card.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Input from "../../components/common/Input.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import Select from "../../components/common/Select.jsx";
import { useApi } from "../../hooks/useApi.js";
import { listExpenses } from "../expenses/expenseService.js";
import { addGroupMember, getGroup } from "./groupService.js";


export default function GroupDetailPage() {
  const { groupId } = useParams();
  const [memberForm, setMemberForm] = useState({ role: "member", user_id: "" });
  const groupApi = useApi(() => getGroup(groupId), [groupId]);
  const expensesApi = useApi(listExpenses, []);
  const expenses = (expensesApi.data ?? []).filter((expense) => Number(expense.group) === Number(groupId));

  const addMember = async (event) => {
    event.preventDefault();
    if (!memberForm.user_id) return;
    await addGroupMember(groupId, { role: memberForm.role, user_id: Number(memberForm.user_id) });
    toast.success("Member added.");
    setMemberForm({ role: "member", user_id: "" });
    groupApi.reload();
  };

  if (groupApi.isLoading) return <Loader label="Loading group" />;
  const group = groupApi.data;

  return (
    <>
      <PageHeader
        actions={<Link to={`/expenses/new?group=${groupId}`}><Button icon={Plus}>Add expense</Button></Link>}
        description={group?.description || "Members, expenses, and settlement activity for this group."}
        eyebrow="Group detail"
        title={group?.name ?? "Group"}
      />
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          <Card>
            <h2 className="text-lg font-bold text-ink">Members</h2>
            <div className="mt-4 space-y-3">
              {group?.members?.map((member) => (
                <div className="flex items-center justify-between rounded-md bg-zinc-50 p-3" key={member.id}>
                  <span className="text-sm font-semibold">{member.user_display || `User #${member.user}`}</span>
                  <Badge variant={member.role === "owner" ? "dark" : "neutral"}>{member.role}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-ink">Add member</h2>
            <form className="mt-4 space-y-3" onSubmit={addMember}>
              <Input label="User ID" onChange={(event) => setMemberForm((current) => ({ ...current, user_id: event.target.value }))} type="number" value={memberForm.user_id} />
              <Select label="Role" onChange={(event) => setMemberForm((current) => ({ ...current, role: event.target.value }))} value={memberForm.role}>
                <option value="member">Member</option>
                <option value="owner">Owner</option>
              </Select>
              <Button icon={UserPlus} type="submit">Add member</Button>
            </form>
          </Card>
        </div>
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Group expenses</h2>
          {expensesApi.isLoading ? <Loader label="Loading expenses" /> : null}
          {!expensesApi.isLoading && expenses.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {expenses.map((expense) => <ExpenseCard expense={expense} key={expense.id} />)}
            </div>
          ) : null}
          {!expensesApi.isLoading && !expenses.length ? <EmptyState description="Add an expense to generate split rows and settlements." title="No expenses yet" /> : null}
        </section>
      </div>
    </>
  );
}
