const variants = {
  danger: "bg-red-600 text-white hover:bg-red-700",
  primary: "bg-ink text-white hover:bg-zinc-800",
  secondary: "bg-white text-ink ring-1 ring-zinc-200 hover:bg-zinc-50",
  subtle: "bg-zinc-100 text-ink hover:bg-zinc-200",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100",
};


export default function Button({ children, className = "", icon: Icon, isLoading = false, variant = "primary", ...props }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      type="button"
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
      {!isLoading && Icon ? <Icon aria-hidden="true" size={18} /> : null}
      <span>{children}</span>
    </button>
  );
}
