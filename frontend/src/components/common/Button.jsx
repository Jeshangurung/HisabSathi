const variants = {
  primary: "bg-ink text-white hover:bg-zinc-800",
  secondary: "bg-white text-ink ring-1 ring-zinc-200 hover:bg-zinc-50",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100",
};


export default function Button({ children, className = "", icon: Icon, variant = "primary", ...props }) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      type="button"
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" size={18} /> : null}
      {children}
    </button>
  );
}
