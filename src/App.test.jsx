import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { getUser } from './helpers/apiHelper'
import { logout } from './features/auth/api/authApi'

vi.mock('./helpers/apiHelper', () => ({ getUser: vi.fn() }))
vi.mock('./features/auth/api/authApi', () => ({ logout: vi.fn() }))
vi.mock('./features/auth/components/AuthPage', () => ({
  default: ({ mode, onLoggedIn, onNavigate }) => (
    <div>
      <p>auth-{mode}</p>
      <button onClick={() => onLoggedIn({ role: 'member' })}>do-login-member</button>
      <button onClick={() => onLoggedIn({ role: 'admin' })}>do-login-admin</button>
      <button onClick={() => onNavigate('/')}>auth-home</button>
    </div>
  ),
}))
vi.mock('./features/auth/modals/AuthModal', () => ({
  default: ({ onClose, onLoggedIn, onRegister }) => (
    <div>
      <p>auth-modal</p>
      <button onClick={onClose}>modal-close</button>
      <button onClick={() => onLoggedIn({ role: 'member' })}>modal-login</button>
      <button onClick={onRegister}>modal-register</button>
    </div>
  ),
}))
vi.mock('./features/blog/components/PublicArticleList', () => ({
  default: ({ onOpen }) => (
    <div>
      <p>page-home</p>
      <button onClick={() => onOpen('abc')}>open-abc</button>
    </div>
  ),
}))
vi.mock('./features/blog/components/PublicArticleDetail', () => ({
  default: ({ slug, onBack }) => (
    <div>
      <p>page-detail-{slug}</p>
      <button onClick={onBack}>detail-back</button>
    </div>
  ),
}))
vi.mock('./features/blog/components/AuthorDashboard', () => ({ default: () => <p>page-author</p> }))
vi.mock('./features/admin/components/AdminDashboard', () => ({ default: () => <p>page-admin</p> }))

const go = (path) => window.history.pushState({}, '', path)
const member = { role: 'member' }
const admin = { role: 'admin' }

beforeEach(() => {
  vi.resetAllMocks()
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  getUser.mockReturnValue(null)
  go('/')
})

describe('App routing', () => {
  it('beranda, detail artikel, dan kembali', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText('page-home')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'open-abc' }))
    expect(screen.getByText('page-detail-abc')).toBeInTheDocument()
    expect(window.location.pathname).toBe('/posts/abc')

    await user.click(screen.getByRole('button', { name: 'detail-back' }))
    expect(screen.getByText('page-home')).toBeInTheDocument()
  })

  it('path tidak dikenal menampilkan beranda', () => {
    go('/tidak-ada')
    render(<App />)
    expect(screen.getByText('page-home')).toBeInTheDocument()
  })

  it('halaman login lalu masuk sebagai member', async () => {
    go('/login')
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText('auth-login')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'auth-home' }))
    expect(screen.getByText('page-home')).toBeInTheDocument()

    go('/login')
    act(() => window.dispatchEvent(new PopStateEvent('popstate')))
    await user.click(screen.getByRole('button', { name: 'do-login-member' }))
    expect(screen.getByText('page-author')).toBeInTheDocument()
    expect(window.location.pathname).toBe('/author')
  })

  it('halaman register lalu masuk sebagai admin', async () => {
    go('/register')
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText('auth-register')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'do-login-admin' }))
    expect(screen.getByText('page-admin')).toBeInTheDocument()
  })

  it('rute terlindungi meminta login bagi tamu', () => {
    go('/author')
    const { unmount } = render(<App />)
    expect(screen.getByText('auth-login')).toBeInTheDocument()
    unmount()

    go('/admin')
    render(<App />)
    expect(screen.getByText('auth-login')).toBeInTheDocument()
  })

  it('member membuka ruang kerja tetapi ditolak di admin', () => {
    getUser.mockReturnValue(member)
    go('/author')
    const { unmount } = render(<App />)
    expect(screen.getByText('page-author')).toBeInTheDocument()
    unmount()

    go('/admin')
    render(<App />)
    expect(screen.getByText(/Akses ditolak/)).toBeInTheDocument()
  })

  it('admin membuka panel admin', () => {
    getUser.mockReturnValue(admin)
    go('/admin')
    render(<App />)
    expect(screen.getByText('page-admin')).toBeInTheDocument()
  })

  it('mengikuti popstate dan melepas listener saat unmount', () => {
    const { unmount } = render(<App />)
    act(() => {
      go('/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(screen.getByText('auth-login')).toBeInTheDocument()
    unmount()
  })
})

describe('App navbar & modal', () => {
  it('modal login: tutup, login, dan menuju register', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Login' }))
    expect(screen.getByText('auth-modal')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'modal-close' }))
    expect(screen.queryByText('auth-modal')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Login' }))
    await user.click(screen.getByRole('button', { name: 'modal-register' }))
    expect(screen.queryByText('auth-modal')).toBeNull()
    expect(screen.getByText('auth-register')).toBeInTheDocument()

    go('/')
    act(() => window.dispatchEvent(new PopStateEvent('popstate')))
    await user.click(screen.getByRole('button', { name: 'Login' }))
    await user.click(screen.getByRole('button', { name: 'modal-login' }))
    expect(screen.queryByText('auth-modal')).toBeNull()
    expect(screen.getByText('page-author')).toBeInTheDocument()
  })

  it('logout berhasil', async () => {
    getUser.mockReturnValue(member)
    logout.mockResolvedValue()
    go('/author')
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Logout' }))
    expect(await screen.findByText('page-home')).toBeInTheDocument()
    expect(logout).toHaveBeenCalled()
  })

  it('logout gagal tetap keluar', async () => {
    getUser.mockReturnValue(member)
    logout.mockRejectedValue(new Error('x'))
    go('/author')
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Logout' }))
    expect(await screen.findByText('page-home')).toBeInTheDocument()
  })

  it('tombol navbar mengarahkan halaman', async () => {
    getUser.mockReturnValue(admin)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Ruang Kerja' }))
    expect(screen.getByText('page-author')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Admin' }))
    expect(screen.getByText('page-admin')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Delcom Blog' }))
    expect(screen.getByText('page-home')).toBeInTheDocument()
  })

  it('mengganti tema dan warna aksen', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Ganti tema' }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    await user.selectOptions(screen.getByLabelText('Warna aksen'), 'green')
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#16a34a')
  })
})
