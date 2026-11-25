import { render, screen } from '@testing-library/react'
import AdminDashboard from './AdminDashboard'
import { getAdminPosts, getAdminUsers } from '../api/adminApi'

vi.mock('../api/adminApi', () => ({ getAdminUsers: vi.fn(), getAdminPosts: vi.fn() }))

beforeEach(() => vi.resetAllMocks())

describe('AdminDashboard', () => {
  it('menampilkan statistik, pengguna, dan artikel', async () => {
    getAdminUsers.mockResolvedValue([
      { id: 1, username: 'admin', email: 'admin@x.com', role: 'admin', total_posts: 0 },
      { id: 2, username: 'budi', email: 'budi@x.com', role: 'member', total_posts: 2 },
    ])
    getAdminPosts.mockResolvedValue([
      { id: 1, title: 'Judul A', author: { username: 'budi' }, category: 'Umum', is_published: true },
      { id: 2, title: 'Judul B', author: { username: 'budi' }, category: 'Bisnis', is_published: false },
    ])
    render(<AdminDashboard />)

    expect(await screen.findByText('budi@x.com')).toBeInTheDocument()
    expect(screen.getByText('Judul A')).toBeInTheDocument()
    expect(screen.getByText('Terbit')).toBeInTheDocument()
    expect(screen.getByText('Draf')).toBeInTheDocument()
    expect(screen.getByText('Total Pengguna').nextSibling).toHaveTextContent('2')
    expect(screen.getByText('Total Terbit').nextSibling).toHaveTextContent('1')
  })

  it('menampilkan error', async () => {
    getAdminUsers.mockRejectedValue(new Error('gagal admin'))
    getAdminPosts.mockResolvedValue([])
    render(<AdminDashboard />)
    expect(await screen.findByText('gagal admin')).toBeInTheDocument()
  })
})
