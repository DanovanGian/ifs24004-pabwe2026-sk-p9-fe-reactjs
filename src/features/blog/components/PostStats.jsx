export default function PostStats({ stats }) {
  const cards = [
    { label: 'Total Artikel', value: stats.total },
    { label: 'Total Terbit', value: stats.published },
    { label: 'Belum Selesai (Draf)', value: stats.draft },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <p className="text-sm text-slate-500 dark:text-slate-300">{c.label}</p>
          <p className="mt-1 text-3xl font-bold" style={{ color: 'var(--accent)' }}>
            {c.value}
          </p>
        </div>
      ))}
    </div>
  )
}
