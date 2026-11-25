import { IconMoon, IconSun } from '@tabler/icons-react'

export default function StickyNavbar({
  user,
  theme,
  accent,
  accents,
  onAccent,
  onToggleTheme,
  onNavigate,
  onLogin,
  onLogout,
}) {
  return (
    <nav className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
      <button
        type="button"
        className="text-lg font-bold"
        style={{ color: 'var(--accent)' }}
        onClick={() => onNavigate('/')}
      >
        Delcom Blog
      </button>
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Warna aksen"
          className="field"
          style={{ width: 'auto' }}
          value={accent}
          onChange={(e) => onAccent(e.target.value)}
        >
          {accents.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <button type="button" aria-label="Ganti tema" className="p-2" onClick={onToggleTheme}>
          {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
        </button>
        {user ? (
          <>
            <button type="button" className="btn-outline" onClick={() => onNavigate('/author')}>
              Ruang Kerja
            </button>
            {user.role === 'admin' ? (
              <button type="button" className="btn-outline" onClick={() => onNavigate('/admin')}>
                Admin
              </button>
            ) : null}
            <button type="button" className="btn-primary" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn-primary" onClick={onLogin}>
              Login
            </button>
            <button type="button" className="btn-outline" onClick={() => onNavigate('/register')}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
