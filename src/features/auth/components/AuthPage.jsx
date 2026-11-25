import AuthForm from './AuthForm'

export default function AuthPage({ mode, onLoggedIn, onNavigate }) {
  const isLogin = mode === 'login'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow dark:bg-slate-800 dark:text-slate-100">
        <h1 className="mb-6 text-2xl font-bold">
          {isLogin ? 'Masuk ke Delcom Blog' : 'Daftar Penulis Baru'}
        </h1>
        <AuthForm mode={mode} onLoggedIn={onLoggedIn} onRegistered={() => onNavigate('/login')} />
        <p className="mt-4 text-sm">
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <button
            type="button"
            className="font-semibold underline"
            style={{ color: 'var(--accent)' }}
            onClick={() => onNavigate(isLogin ? '/register' : '/login')}
          >
            {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
          </button>
        </p>
        <button type="button" className="mt-4 text-sm underline" onClick={() => onNavigate('/')}>
          Kembali ke beranda
        </button>
      </div>
    </div>
  )
}
