import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PublicArticleList from './PublicArticleList'
import { getCategories, getPublicPosts } from '../api/blogApi'

vi.mock('../api/blogApi', () => ({ getCategories: vi.fn(), getPublicPosts: vi.fn() }))

const post = {
  id: 1,
  slug: 'judul-satu',
  title: 'Judul Satu',
  category: 'Teknologi',
  excerpt: 'Ringkas',
  published_at: '2026-11-25T10:00:00Z',
  reading_time: 3,
  author: { username: 'budi' },
}

beforeEach(() => {
  vi.resetAllMocks()
  getCategories.mockResolvedValue(['Teknologi', 'Umum'])
  getPublicPosts.mockResolvedValue([post])
})

describe('PublicArticleList', () => {
  it('menampilkan loading lalu artikel dan membuka detail', async () => {
    const onOpen = vi.fn()
    const user = userEvent.setup()
    render(<PublicArticleList onOpen={onOpen} />)
    expect(screen.getByText('Memuat artikel...')).toBeInTheDocument()

    await user.click(await screen.findByText('Judul Satu'))
    expect(onOpen).toHaveBeenCalledWith('judul-satu')
    expect(screen.getByText(/3 menit baca/)).toBeInTheDocument()
  })

  it('mencari dan memfilter kategori', async () => {
    const user = userEvent.setup()
    render(<PublicArticleList onOpen={vi.fn()} />)
    await screen.findByText('Judul Satu')

    await user.click(screen.getByRole('button', { name: 'Teknologi' }))
    await waitFor(() => expect(getPublicPosts).toHaveBeenLastCalledWith('', 'Teknologi'))

    await user.type(screen.getByLabelText('Cari artikel'), 'go')
    await waitFor(() => expect(getPublicPosts).toHaveBeenLastCalledWith('go', 'Teknologi'))
  })

  it('menampilkan pesan kosong', async () => {
    getPublicPosts.mockResolvedValue([])
    render(<PublicArticleList onOpen={vi.fn()} />)
    expect(await screen.findByText('Belum ada artikel.')).toBeInTheDocument()
  })

  it('menampilkan error artikel', async () => {
    getPublicPosts.mockRejectedValue(new Error('gagal artikel'))
    render(<PublicArticleList onOpen={vi.fn()} />)
    expect(await screen.findByText('gagal artikel')).toBeInTheDocument()
  })

  it('menampilkan error kategori', async () => {
    getCategories.mockRejectedValue(new Error('gagal kategori'))
    render(<PublicArticleList onOpen={vi.fn()} />)
    expect(await screen.findByText('gagal kategori')).toBeInTheDocument()
  })
})
