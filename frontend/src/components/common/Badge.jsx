const variants = {
  neutral: "bg-zinc-100 text-zinc-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-800",
};


export default function Badge({ children, variant = "neutral" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}
