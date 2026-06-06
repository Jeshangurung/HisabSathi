import { Inbox } from "lucide-react";


export default function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
      <Inbox className="mb-4 text-zinc-400" size={34} />
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-zinc-500">{description}</p>
    </div>
  );
}
