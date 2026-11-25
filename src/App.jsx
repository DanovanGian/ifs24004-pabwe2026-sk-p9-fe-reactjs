import { useCallback, useEffect, useState } from 'react'
import useTheme from './hooks/useTheme'
import { getUser } from './helpers/apiHelper'
import { logout } from './features/auth/api/authApi'
import AuthPage from './features/auth/components/AuthPage'
import AuthModal from './features/auth/modals/AuthModal'
import StickyNavbar from './features/blog/components/StickyNavbar'
import PublicArticleList from './features/blog/components/PublicArticleList'
import PublicArticleDetail from './features/blog/components/PublicArticleDetail'
import AuthorDashboard from './features/blog/components/AuthorDashboard'
import AdminDashboard from './features/admin/components/AdminDashboard'

function parsePath(pathname) {
  if (pathname === '/login') return { name: 'login' }
  if (pathname === '/register') return { name: 'register' }
  if (pathname === '/author') return { name: 'author' }
  if (pathname === '/admin') return { name: 'admin' }
  if (pathname.startsWith('/posts/')) return { name: 'detail', slug: pathname.slice(7) }
  return { name: 'home' }
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [user, setUser] = useState(getUser)
  const [showAuth, setShowAuth] = useState(false)
  const { theme, accent, accents, setAccent, toggleTheme } = useTheme()
  const dark = theme === 'dark'

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to) => {
    window.history.pushState({}, '', to)
    setPath(to)
  }, [])

  function handleLoggedIn(loggedUser) {
    setUser(loggedUser)
    setShowAuth(false)
    navigate(loggedUser.role === 'admin' ? '/admin' : '/author')
  }

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // sesi lokal tetap dihapus oleh authApi.logout
    }
    setUser(null)
    navigate('/')
  }

  const route = parsePath(path)
  const guarded = route.name === 'author' || route.name === 'admin'
  const isAuthRoute = route.name === 'login' || route.name === 'register'

  if (isAuthRoute || (guarded && !user)) {
    return (
      <AuthPage
        mode={route.name === 'register' ? 'register' : 'login'}
        onLoggedIn={handleLoggedIn}
        onNavigate={navigate}
      />
    )
  }

  let content
  if (route.name === 'detail') {
    content = <PublicArticleDetail slug={route.slug} dark={dark} onBack={() => navigate('/')} />
  } else if (route.name === 'author') {
    content = <AuthorDashboard dark={dark} onNavigate={navigate} />
  } else if (route.name === 'admin') {
    content =
      user.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <p className="text-red-600">Akses ditolak. Halaman ini khusus admin.</p>
      )
  } else {
    content = <PublicArticleList onOpen={(slug) => navigate(`/posts/${slug}`)} />
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <StickyNavbar
        user={user}
        theme={theme}
        accent={accent}
        accents={accents}
        onAccent={setAccent}
        onToggleTheme={toggleTheme}
        onNavigate={navigate}
        onLogin={() => setShowAuth(true)}
        onLogout={handleLogout}
      />
      <main className="w-full px-4 py-6">{content}</main>
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLoggedIn={handleLoggedIn}
          onRegister={() => {
            setShowAuth(false)
            navigate('/register')
          }}
        />
      )}
    </div>
  )
}
