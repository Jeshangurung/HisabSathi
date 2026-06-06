export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-ink" />
      <span>{label}</span>
    </div>
  );
}
