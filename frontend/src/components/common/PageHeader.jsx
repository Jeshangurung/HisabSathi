export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        {eyebrow ? <p className="text-xs font-bold uppercase text-sathi">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-bold text-ink md:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
