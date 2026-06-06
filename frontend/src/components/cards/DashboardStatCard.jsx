import Card from "../common/Card.jsx";


export default function DashboardStatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-4 text-2xl font-black text-ink">{value}</p>
        </div>
        {Icon ? (
          <span className="rounded-md bg-zinc-100 p-3 text-ink">
            <Icon size={20} />
          </span>
        ) : null}
      </div>
    </Card>
  );
}
