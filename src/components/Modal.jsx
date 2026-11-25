import { IconX } from '@tabler/icons-react'

export default function Modal({ title, size, onClose, footer, children }) {
  const width = size === 'full' ? 'max-w-[96vw] h-[94vh]' : 'max-w-md'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2"
    >
      <div
        className={`flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-800 dark:text-slate-100 ${width}`}
      >
        <header
          className="flex items-center justify-between px-5 py-3 text-white"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" aria-label="Tutup" onClick={onClose}>
            <IconX size={20} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 bg-slate-100 px-5 py-3 dark:bg-slate-700">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  )
}
