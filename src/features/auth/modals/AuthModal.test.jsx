import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthModal from './AuthModal'

vi.mock('../components/AuthForm', () => ({
  default: ({ onLoggedIn }) => <button onClick={() => onLoggedIn({ id: 1 })}>stub-login</button>,
}))

describe('AuthModal', () => {
  it('meneruskan aksi login, daftar, dan tutup', async () => {
    const onClose = vi.fn()
    const onLoggedIn = vi.fn()
    const onRegister = vi.fn()
    const user = userEvent.setup()
    render(<AuthModal onClose={onClose} onLoggedIn={onLoggedIn} onRegister={onRegister} />)

    await user.click(screen.getByRole('button', { name: 'stub-login' }))
    expect(onLoggedIn).toHaveBeenCalledWith({ id: 1 })

    await user.click(screen.getByRole('button', { name: 'Daftar' }))
    expect(onRegister).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Tutup' }))
    expect(onClose).toHaveBeenCalled()
  })
})
