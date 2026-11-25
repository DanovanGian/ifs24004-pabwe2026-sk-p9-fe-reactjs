import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PublicArticleDetail from './PublicArticleDetail'
import { getPublicPost } from '../api/blogApi'

vi.mock('../api/blogApi', () => ({ getPublicPost: vi.fn() }))
vi.mock('../../../components/MarkdownViewer', () => ({
  default: ({ content, dark }) => (
    <div data-testid="viewer">
      {content}|{String(dark)}
    </div>
  ),
}))

const post = {
  title: 'Judul Satu',
  category: 'Teknologi',
  content: 'Isi artikel',
  cover_image_path: 'http://img/x.png',
  published_at: '2026-11-25T10:00:00Z',
  reading_time: 2,
  author: { username: 'budi' },
}

beforeEach(() => vi.resetAllMocks())

describe('PublicArticleDetail', () => {
  it('menampilkan artikel dengan sampul dan tombol kembali', async () => {
    getPublicPost.mockResolvedValue(post)
    const onBack = vi.fn()
    const user = userEvent.setup()
    render(<PublicArticleDetail slug="judul-satu" dark onBack={onBack} />)

    expect(await screen.findByText('Judul Satu')).toBeInTheDocument()
    expect(screen.getByAltText('Judul Satu')).toBeInTheDocument()
    expect(screen.getByTestId('viewer')).toHaveTextContent('Isi artikel|true')
    expect(getPublicPost).toHaveBeenCalledWith('judul-satu')

    await user.click(screen.getByRole('button', { name: 'Kembali' }))
    expect(onBack).toHaveBeenCalled()
  })

  it('tanpa gambar sampul', async () => {
    getPublicPost.mockResolvedValue({ ...post, cover_image_path: '' })
    render(<PublicArticleDetail slug="x" dark={false} onBack={vi.fn()} />)
    await screen.findByText('Judul Satu')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('menampilkan loading', () => {
    getPublicPost.mockReturnValue(new Promise(() => {}))
    render(<PublicArticleDetail slug="x" dark={false} onBack={vi.fn()} />)
    expect(screen.getByText('Memuat artikel...')).toBeInTheDocument()
  })

  it('menampilkan error', async () => {
    getPublicPost.mockRejectedValue(new Error('tidak ditemukan'))
    render(<PublicArticleDetail slug="x" dark={false} onBack={vi.fn()} />)
    expect(await screen.findByText('tidak ditemukan')).toBeInTheDocument()
  })
})
