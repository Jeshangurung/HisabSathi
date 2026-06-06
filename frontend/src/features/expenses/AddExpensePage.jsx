import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

import Card from "../../components/common/Card.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import ExpenseForm from "../../components/forms/ExpenseForm.jsx";
import { useApi } from "../../hooks/useApi.js";
import { getGroup, listGroups } from "../groups/groupService.js";
import { createExpense } from "./expenseService.js";


export default function AddExpensePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupsApi = useApi(listGroups, [], { initialData: [] });
  const [group, setGroup] = useState(null);

  const loadGroup = async (id) => {
    if (!id) {
      setGroup(null);
      return;
    }
    setGroup(await getGroup(id));
  };

  useEffect(() => {
    const id = searchParams.get("group");
    if (id) loadGroup(id);
  }, [searchParams]);

  const submit = async (payload) => {
    const expense = await createExpense(payload);
    toast.success("Expense added.");
    navigate(`/expenses/${expense.id}`);
  };

  return (
    <>
      <PageHeader description="Record who paid, who participated, and how the bill should be split." eyebrow="Expenses" title="Add expense" />
      <Card>
        {groupsApi.isLoading ? <Loader label="Loading groups" /> : (
          <ExpenseForm group={group} groups={groupsApi.data ?? []} onGroupChange={loadGroup} onSubmit={submit} />
        )}
      </Card>
    </>
  );
}
