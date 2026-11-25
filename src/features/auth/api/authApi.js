import { apiRequest, saveSession, clearSession } from '../../../helpers/apiHelper'

export async function login(username, password) {
  const res = await apiRequest('/auth/login', {
    method: 'POST',
    body: { username, password },
    auth: false,
  })
  saveSession(res.data.token, res.data.user)
  return res.data.user
}

export async function register(username, email, password) {
  const res = await apiRequest('/auth/register', {
    method: 'POST',
    body: { username, email, password },
    auth: false,
  })
  return res.data
}

export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } finally {
    clearSession()
  }
}
