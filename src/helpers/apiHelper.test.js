import {
  apiRequest,
  getToken,
  getUser,
  saveSession,
  clearSession,
} from './apiHelper'

const mockFetch = (ok, json, status = 200) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: json instanceof Error ? () => Promise.reject(json) : () => Promise.resolve(json),
  })
}

describe('session', () => {
  beforeEach(() => localStorage.clear())

  it('menyimpan dan membaca sesi', () => {
    saveSession('tok', { id: 1 })
    expect(getToken()).toBe('tok')
    expect(getUser()).toEqual({ id: 1 })
  })

  it('getUser mengembalikan null jika kosong', () => {
    expect(getUser()).toBeNull()
  })

  it('clearSession menghapus sesi', () => {
    saveSession('tok', { id: 1 })
    clearSession()
    expect(getToken()).toBeNull()
    expect(getUser()).toBeNull()
  })
})

describe('apiRequest', () => {
  beforeEach(() => localStorage.clear())

  it('GET tanpa token dan tanpa body', async () => {
    mockFetch(true, { status: 'success', data: 1 })
    const res = await apiRequest('/x')
    expect(res.data).toBe(1)
    const [url, opts] = fetch.mock.calls[0]
    expect(url).toBe('/api/x')
    expect(opts.method).toBe('GET')
    expect(opts.headers.Authorization).toBeUndefined()
    expect(opts.body).toBeUndefined()
  })

  it('menyertakan token dan body', async () => {
    saveSession('tok', {})
    mockFetch(true, {})
    await apiRequest('/x', { method: 'POST', body: { a: 1 } })
    const [, opts] = fetch.mock.calls[0]
    expect(opts.method).toBe('POST')
    expect(opts.headers.Authorization).toBe('Bearer tok')
    expect(opts.body).toBe('{"a":1}')
  })

  it('tidak mengirim token jika auth=false', async () => {
    saveSession('tok', {})
    mockFetch(true, {})
    await apiRequest('/x', { auth: false })
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined()
  })

  it('melempar error dengan pesan dari server', async () => {
    mockFetch(false, { message: 'Gagal' }, 400)
    await expect(apiRequest('/x')).rejects.toMatchObject({ message: 'Gagal', status: 400 })
  })

  it('memakai pesan default jika tidak ada message', async () => {
    mockFetch(false, {}, 500)
    await expect(apiRequest('/x')).rejects.toThrow('Terjadi kesalahan')
  })

  it('memakai pesan default jika JSON tidak valid', async () => {
    mockFetch(false, new Error('bukan json'), 502)
    await expect(apiRequest('/x')).rejects.toMatchObject({ message: 'Terjadi kesalahan', status: 502 })
  })
})
