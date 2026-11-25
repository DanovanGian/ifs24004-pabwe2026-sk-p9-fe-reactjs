import { useState } from 'react'
import useInput from '../../../hooks/useInput'
import { login, register } from '../api/authApi'
import { showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'

export default function AuthForm({ mode, onLoggedIn, onRegistered }) {
  const isLogin = mode === 'login'
  const prefix = isLogin ? 'login' : 'register'
  const [username, onUsername] = useInput('')
  const [email, onEmail] = useInput('')
  const [password, onPassword] = useInput('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        onLoggedIn(await login(username, password))
      } else {
        await register(username, email, password)
        await showSuccessAlert('Registrasi berhasil, silakan login')
        onRegistered()
      }
    } catch (err) {
      showErrorAlert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={`${prefix}-username`} className="mb-1 block text-sm font-medium">
          Username
        </label>
        <input
          id={`${prefix}-username`}
          className="field"
          value={username}
          onChange={onUsername}
          required
        />
      </div>
      {isLogin ? null : (
        <div>
          <label htmlFor="register-email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            className="field"
            value={email}
            onChange={onEmail}
            required
          />
        </div>
      )}
      <div>
        <label htmlFor={`${prefix}-password`} className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id={`${prefix}-password`}
          type="password"
          className="field"
          value={password}
          onChange={onPassword}
          required
        />
      </div>
      <button id={`${prefix}-submit`} type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
      </button>
    </form>
  )
}
