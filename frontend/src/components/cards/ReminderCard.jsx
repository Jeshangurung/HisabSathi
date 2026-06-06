import { Check } from "lucide-react";

import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";
import Card from "../common/Card.jsx";


export default function ReminderCard({ onMarkRead, reminder }) {
  return (
    <Card className={reminder.is_read ? "opacity-70" : ""}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-ink">{reminder.title}</h3>
            <Badge variant={reminder.is_read ? "neutral" : "warning"}>{reminder.is_read ? "Read" : "Open"}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{reminder.message || "No message provided."}</p>
        </div>
        {!reminder.is_read ? (
          <Button icon={Check} onClick={() => onMarkRead(reminder.id)} variant="secondary">
            Mark read
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
