export default function AuthLayout({ children, title, subtitle }) {
  return (
    <main className="grid min-h-screen bg-mist px-4 py-8 md:grid-cols-[1fr_1.1fr] md:px-8">
      <section className="hidden flex-col justify-between rounded-lg bg-ink p-10 text-white md:flex">
        <div>
          <div className="text-2xl font-black">HisabSathi</div>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-300">
            A modern way for friends, roommates, offices, and travel groups to keep shared money clear.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {["Split bills", "Track loans", "Confirm payments"].map((item) => (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4" key={item}>
              <p className="text-sm font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
          <h1 className="text-3xl font-bold text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
      </section>
    </main>
  );
}
