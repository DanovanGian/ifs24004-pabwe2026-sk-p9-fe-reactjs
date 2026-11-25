import { login, register, logout } from './authApi'
import { apiRequest, saveSession, clearSession } from '../../../helpers/apiHelper'

vi.mock('../../../helpers/apiHelper', () => ({
  apiRequest: vi.fn(),
  saveSession: vi.fn(),
  clearSession: vi.fn(),
}))

beforeEach(() => vi.resetAllMocks())

describe('authApi', () => {
  it('login menyimpan sesi dan mengembalikan user', async () => {
    apiRequest.mockResolvedValue({ data: { token: 't', user: { id: 1 } } })
    expect(await login('budi', 'secret')).toEqual({ id: 1 })
    expect(apiRequest).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: { username: 'budi', password: 'secret' },
      auth: false,
    })
    expect(saveSession).toHaveBeenCalledWith('t', { id: 1 })
  })

  it('register mengembalikan data', async () => {
    apiRequest.mockResolvedValue({ data: { id: 2 } })
    expect(await register('a', 'a@x.com', 'pw')).toEqual({ id: 2 })
    expect(apiRequest).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: { username: 'a', email: 'a@x.com', password: 'pw' },
      auth: false,
    })
  })

  it('logout sukses menghapus sesi', async () => {
    apiRequest.mockResolvedValue({})
    await logout()
    expect(apiRequest).toHaveBeenCalledWith('/auth/logout', { method: 'POST' })
    expect(clearSession).toHaveBeenCalled()
  })

  it('logout gagal tetap menghapus sesi', async () => {
    apiRequest.mockRejectedValue(new Error('x'))
    await expect(logout()).rejects.toThrow('x')
    expect(clearSession).toHaveBeenCalled()
  })
})
