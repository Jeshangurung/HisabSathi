export default function Input({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-ink focus:ring-2 focus:ring-ink/10"
        {...props}
      />
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
