import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthForm from './AuthForm'
import { login, register } from '../api/authApi'
import { showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'

vi.mock('../api/authApi', () => ({ login: vi.fn(), register: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({
  showErrorAlert: vi.fn(),
  showSuccessAlert: vi.fn(),
}))

beforeEach(() => vi.resetAllMocks())

async function fillLogin(user) {
  await user.type(screen.getByLabelText('Username'), 'budi')
  await user.type(screen.getByLabelText('Password'), 'secret')
}

describe('AuthForm login', () => {
  it('berhasil login', async () => {
    login.mockResolvedValue({ id: 1 })
    const onLoggedIn = vi.fn()
    const user = userEvent.setup()
    render(<AuthForm mode="login" onLoggedIn={onLoggedIn} onRegistered={vi.fn()} />)
    await fillLogin(user)
    await user.click(screen.getByRole('button', { name: 'Masuk' }))
    expect(login).toHaveBeenCalledWith('budi', 'secret')
    expect(onLoggedIn).toHaveBeenCalledWith({ id: 1 })
  })

  it('menampilkan error saat gagal', async () => {
    login.mockRejectedValue(new Error('salah'))
    const onLoggedIn = vi.fn()
    const user = userEvent.setup()
    render(<AuthForm mode="login" onLoggedIn={onLoggedIn} onRegistered={vi.fn()} />)
    await fillLogin(user)
    await user.click(screen.getByRole('button', { name: 'Masuk' }))
    expect(showErrorAlert).toHaveBeenCalledWith('salah')
    expect(onLoggedIn).not.toHaveBeenCalled()
  })

  it('menonaktifkan tombol saat memproses', async () => {
    let resolve
    login.mockReturnValue(new Promise((r) => (resolve = r)))
    const user = userEvent.setup()
    render(<AuthForm mode="login" onLoggedIn={vi.fn()} onRegistered={vi.fn()} />)
    await fillLogin(user)
    await user.click(screen.getByRole('button', { name: 'Masuk' }))
    expect(await screen.findByRole('button', { name: 'Memproses...' })).toBeDisabled()
    await act(async () => resolve({ id: 1 }))
  })
})

describe('AuthForm register', () => {
  it('berhasil mendaftar', async () => {
    register.mockResolvedValue({})
    const onRegistered = vi.fn()
    const user = userEvent.setup()
    render(<AuthForm mode="register" onLoggedIn={vi.fn()} onRegistered={onRegistered} />)
    await user.type(screen.getByLabelText('Username'), 'budi')
    await user.type(screen.getByLabelText('Email'), 'budi@x.com')
    await user.type(screen.getByLabelText('Password'), 'secret')
    await user.click(screen.getByRole('button', { name: 'Daftar' }))
    expect(register).toHaveBeenCalledWith('budi', 'budi@x.com', 'secret')
    expect(showSuccessAlert).toHaveBeenCalled()
    expect(onRegistered).toHaveBeenCalled()
  })
})
