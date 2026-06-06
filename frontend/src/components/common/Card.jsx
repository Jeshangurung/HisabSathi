export default function Card({ children, className = "" }) {
  return (
    <section className={`rounded-lg border border-zinc-200 bg-white p-5 shadow-soft ${className}`}>
      {children}
    </section>
  );
}
