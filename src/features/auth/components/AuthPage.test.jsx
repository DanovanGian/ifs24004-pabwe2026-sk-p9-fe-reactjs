import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthPage from './AuthPage'

vi.mock('./AuthForm', () => ({
  default: ({ mode, onLoggedIn, onRegistered }) => (
    <div>
      <p>form-{mode}</p>
      <button onClick={() => onLoggedIn({ id: 1 })}>stub-login</button>
      <button onClick={onRegistered}>stub-registered</button>
    </div>
  ),
}))

describe('AuthPage', () => {
  it('mode login', async () => {
    const onNavigate = vi.fn()
    const onLoggedIn = vi.fn()
    const user = userEvent.setup()
    render(<AuthPage mode="login" onLoggedIn={onLoggedIn} onNavigate={onNavigate} />)

    expect(screen.getByText('Masuk ke Delcom Blog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Daftar sekarang' }))
    expect(onNavigate).toHaveBeenCalledWith('/register')

    await user.click(screen.getByRole('button', { name: 'stub-login' }))
    expect(onLoggedIn).toHaveBeenCalledWith({ id: 1 })

    await user.click(screen.getByRole('button', { name: 'stub-registered' }))
    expect(onNavigate).toHaveBeenCalledWith('/login')

    await user.click(screen.getByRole('button', { name: 'Kembali ke beranda' }))
    expect(onNavigate).toHaveBeenCalledWith('/')
  })

  it('mode register', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()
    render(<AuthPage mode="register" onLoggedIn={vi.fn()} onNavigate={onNavigate} />)

    expect(screen.getByText('Daftar Penulis Baru')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Masuk di sini' }))
    expect(onNavigate).toHaveBeenCalledWith('/login')
  })
})
