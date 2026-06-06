import toast from "react-hot-toast";

import ReminderCard from "../../components/cards/ReminderCard.jsx";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { useApi } from "../../hooks/useApi.js";
import { listReminders, markAllRemindersRead, markReminderRead } from "./reminderService.js";


export default function RemindersPage() {
  const remindersApi = useApi(listReminders, [], { initialData: [] });

  const markRead = async (id) => {
    await markReminderRead(id);
    toast.success("Reminder marked as read.");
    remindersApi.reload();
  };

  const markAll = async () => {
    await markAllRemindersRead();
    toast.success("All reminders marked as read.");
    remindersApi.reload();
  };

  return (
    <>
      <PageHeader
        actions={<Button onClick={markAll} variant="secondary">Mark all read</Button>}
        description="Payment and loan reminders from settlements and due dates."
        eyebrow="Reminders"
        title="Reminders"
      />
      {remindersApi.isLoading ? <Loader label="Loading reminders" /> : null}
      <div className="space-y-3">
        {!remindersApi.isLoading && remindersApi.data?.length ? remindersApi.data.map((reminder) => (
          <ReminderCard key={reminder.id} onMarkRead={markRead} reminder={reminder} />
        )) : null}
      </div>
      {!remindersApi.isLoading && !remindersApi.data?.length ? <EmptyState description="No reminders are pending." title="No reminders" /> : null}
    </>
  );
}
