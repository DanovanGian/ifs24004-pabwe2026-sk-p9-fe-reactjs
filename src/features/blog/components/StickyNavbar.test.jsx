import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StickyNavbar from './StickyNavbar'

const base = {
  user: null,
  theme: 'light',
  accent: 'blue',
  accents: ['blue', 'green'],
  onAccent: vi.fn(),
  onToggleTheme: vi.fn(),
  onNavigate: vi.fn(),
  onLogin: vi.fn(),
  onLogout: vi.fn(),
}

beforeEach(() => vi.clearAllMocks())

describe('StickyNavbar', () => {
  it('tamu: login, register, beranda, aksen, tema', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<StickyNavbar {...base} />)

    await user.click(screen.getByRole('button', { name: 'Delcom Blog' }))
    expect(base.onNavigate).toHaveBeenCalledWith('/')
    await user.click(screen.getByRole('button', { name: 'Login' }))
    expect(base.onLogin).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Register' }))
    expect(base.onNavigate).toHaveBeenCalledWith('/register')
    expect(screen.queryByRole('button', { name: 'Logout' })).toBeNull()

    await user.selectOptions(screen.getByLabelText('Warna aksen'), 'green')
    expect(base.onAccent).toHaveBeenCalledWith('green')

    await user.click(screen.getByRole('button', { name: 'Ganti tema' }))
    rerender(<StickyNavbar {...base} theme="dark" />)
    await user.click(screen.getByRole('button', { name: 'Ganti tema' }))
    expect(base.onToggleTheme).toHaveBeenCalledTimes(2)
  })

  it('member: ruang kerja dan logout, tanpa tombol admin', async () => {
    const user = userEvent.setup()
    render(<StickyNavbar {...base} user={{ role: 'member' }} />)

    await user.click(screen.getByRole('button', { name: 'Ruang Kerja' }))
    expect(base.onNavigate).toHaveBeenCalledWith('/author')
    expect(screen.queryByRole('button', { name: 'Admin' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Logout' }))
    expect(base.onLogout).toHaveBeenCalled()
  })

  it('admin: tombol admin tampil', async () => {
    const user = userEvent.setup()
    render(<StickyNavbar {...base} user={{ role: 'admin' }} />)

    await user.click(screen.getByRole('button', { name: 'Admin' }))
    expect(base.onNavigate).toHaveBeenCalledWith('/admin')
  })
})
