import { useMemo, useState } from "react";

import { SPLIT_TYPES } from "../../lib/constants.js";
import { isPositiveMoney, parseIdList, sumMoney } from "../../utils/validators.js";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import Select from "../common/Select.jsx";
import Textarea from "../common/Textarea.jsx";


function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExpenseForm({ group, groups = [], onGroupChange, onSubmit }) {
  const [form, setForm] = useState({
    category: "",
    description: "",
    expense_date: today(),
    paid_by: "",
    split_participant_ids: "",
    split_type: "equal",
    title: "",
    total_amount: "",
  });
  const [customSplits, setCustomSplits] = useState([{ amount: "", user: "" }]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const members = group?.members ?? [];
  const customTotal = useMemo(() => sumMoney(customSplits.map((split) => split.amount)), [customSplits]);

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!group?.id) nextErrors.group = "Choose a group.";
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!isPositiveMoney(form.total_amount)) nextErrors.total_amount = "Amount must be greater than zero.";
    if (!form.paid_by) nextErrors.paid_by = "Choose who paid.";
    if (form.split_type === "custom" && Math.abs(customTotal - Number(form.total_amount)) > 0.009) {
      nextErrors.custom = "Custom split total must match the expense total.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = {
      category: form.category,
      description: form.description,
      expense_date: form.expense_date,
      group: Number(group.id),
      paid_by: Number(form.paid_by),
      split_type: form.split_type,
      title: form.title,
      total_amount: form.total_amount,
    };

    if (form.split_type === "custom") {
      payload.custom_splits = customSplits.map((split) => ({ amount: split.amount, user: Number(split.user) }));
    } else {
      payload.split_participant_ids = parseIdList(form.split_participant_ids);
    }

    setIsLoading(true);
    try {
      await onSubmit(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={submit}>
      <Select error={errors.group} label="Group" onChange={(event) => onGroupChange(event.target.value)} value={group?.id ?? ""}>
        <option value="">Choose group</option>
        {groups.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </Select>
      <div className="grid gap-4 md:grid-cols-2">
        <Input error={errors.title} label="Title" name="title" onChange={update} value={form.title} />
        <Input error={errors.total_amount} label="Total amount" min="0" name="total_amount" onChange={update} type="number" value={form.total_amount} />
      </div>
      <Textarea label="Description" name="description" onChange={update} value={form.description} />
      <div className="grid gap-4 md:grid-cols-3">
        <Select error={errors.paid_by} label="Paid by" name="paid_by" onChange={update} value={form.paid_by}>
          <option value="">Choose member</option>
          {members.map((member) => (
            <option key={member.user} value={member.user}>{member.user_display || `User #${member.user}`}</option>
          ))}
        </Select>
        <Input label="Category" name="category" onChange={update} placeholder="Food, rent, travel" value={form.category} />
        <Input label="Date" name="expense_date" onChange={update} type="date" value={form.expense_date} />
      </div>
      <Select label="Split type" name="split_type" onChange={update} value={form.split_type}>
        {SPLIT_TYPES.map((type) => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </Select>
      {form.split_type === "equal" ? (
        <Input
          label="Participant user IDs"
          name="split_participant_ids"
          onChange={update}
          placeholder="Example: 1,2,3"
          value={form.split_participant_ids}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-ink">Custom split total: Rs. {customTotal.toFixed(2)}</p>
            <Button onClick={() => setCustomSplits((current) => [...current, { amount: "", user: "" }])} variant="secondary">
              Add row
            </Button>
          </div>
          {customSplits.map((split, index) => (
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" key={`${index}-${split.user}`}>
              <Select
                label="User"
                onChange={(event) => setCustomSplits((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, user: event.target.value } : item))}
                value={split.user}
              >
                <option value="">Choose member</option>
                {members.map((member) => (
                  <option key={member.user} value={member.user}>{member.user_display || `User #${member.user}`}</option>
                ))}
              </Select>
              <Input
                label="Amount"
                min="0"
                onChange={(event) => setCustomSplits((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, amount: event.target.value } : item))}
                type="number"
                value={split.amount}
              />
              <Button className="self-end" onClick={() => setCustomSplits((current) => current.filter((_, itemIndex) => itemIndex !== index))} variant="ghost">
                Remove
              </Button>
            </div>
          ))}
          {errors.custom ? <p className="text-sm text-red-600">{errors.custom}</p> : null}
        </div>
      )}
      <Button isLoading={isLoading} type="submit">
        Save expense
      </Button>
    </form>
  );
}
