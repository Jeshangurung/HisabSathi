import Badge from "../../../components/common/Badge.jsx";
import Card from "../../../components/common/Card.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


export default function RemindersPage() {
  return (
    <>
      <PageHeader description="Pending settlement and loan reminders sorted by urgency." eyebrow="Reminders" title="Reminders" />
      <div className="space-y-4">
        {["Confirm Asha payment", "Ramesh loan due tomorrow", "Upload proof for dinner split"].map((reminder, index) => (
          <Card className="flex items-center justify-between gap-4" key={reminder}>
            <div>
              <h2 className="font-bold text-ink">{reminder}</h2>
              <p className="mt-1 text-sm text-zinc-500">Reminder #{index + 1}</p>
            </div>
            <Badge variant={index === 1 ? "warning" : "neutral"}>{index === 1 ? "Due soon" : "Open"}</Badge>
          </Card>
        ))}
      </div>
    </>
  );
}
