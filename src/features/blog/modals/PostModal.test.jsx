import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostModal from './PostModal'
import { createPost, updatePost } from '../api/blogApi'
import { showErrorAlert } from '../../../helpers/toolsHelper'

vi.mock('../api/blogApi', () => ({
  CATEGORIES: ['Teknologi', 'Bisnis', 'Umum'],
  createPost: vi.fn(),
  updatePost: vi.fn(),
}))
vi.mock('../../../helpers/toolsHelper', () => ({
  showErrorAlert: vi.fn(),
  showSuccessAlert: vi.fn(),
}))
vi.mock('../../../components/MarkdownEditor', () => ({
  default: ({ value, onChange }) => (
    <textarea aria-label="Konten" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}))

beforeEach(() => vi.resetAllMocks())

function setup(post) {
  const onSaved = vi.fn()
  const onClose = vi.fn()
  render(<PostModal post={post} dark={false} onClose={onClose} onSaved={onSaved} />)
  return { onSaved, onClose }
}

describe('PostModal', () => {
  it('membuat artikel baru', async () => {
    createPost.mockResolvedValue({})
    const user = userEvent.setup()
    const { onSaved } = setup(null)
    expect(screen.getByText('Tambah Artikel')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Judul'), 'Halo')
    await user.type(screen.getByLabelText('Ringkasan'), 'Ring')
    await user.type(screen.getByLabelText('URL Gambar Sampul'), 'http://img')
    await user.selectOptions(screen.getByLabelText('Kategori'), 'Teknologi')
    await user.click(screen.getByLabelText('Langsung terbitkan'))
    await user.type(screen.getByLabelText('Konten'), 'isi')
    await user.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() => expect(onSaved).toHaveBeenCalled())
    expect(createPost).toHaveBeenCalledWith({
      title: 'Halo',
      category: 'Teknologi',
      excerpt: 'Ring',
      content: 'isi',
      cover_image_path: 'http://img',
      is_published: true,
    })
  })

  it('mengubah artikel yang ada', async () => {
    updatePost.mockResolvedValue({})
    const user = userEvent.setup()
    const { onSaved } = setup({
      id: 7,
      slug: 'lama',
      title: 'Lama',
      category: 'Umum',
      excerpt: '',
      content: 'c',
      cover_image_path: '',
      is_published: true,
    })
    expect(screen.getByText('Ubah Artikel')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Simpan' }))
    await waitFor(() => expect(onSaved).toHaveBeenCalled())
    expect(updatePost).toHaveBeenCalledWith(7, {
      title: 'Lama',
      category: 'Umum',
      excerpt: '',
      content: 'c',
      cover_image_path: '',
      is_published: true,
    })
  })

  it('draf dari AI disimpan sebagai artikel baru', async () => {
    createPost.mockResolvedValue({})
    const user = userEvent.setup()
    const { onSaved } = setup({ title: 'Draf AI', category: 'Bisnis', excerpt: 'e', content: 'c' })
    expect(screen.getByLabelText('Judul')).toHaveValue('Draf AI')

    await user.click(screen.getByRole('button', { name: 'Simpan' }))
    await waitFor(() => expect(onSaved).toHaveBeenCalled())
    expect(createPost).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Draf AI', category: 'Bisnis', is_published: false }),
    )
  })

  it('menampilkan error saat gagal menyimpan', async () => {
    createPost.mockRejectedValue(new Error('gagal'))
    const user = userEvent.setup()
    const { onSaved } = setup(null)
    await user.click(screen.getByRole('button', { name: 'Simpan' }))
    await waitFor(() => expect(showErrorAlert).toHaveBeenCalledWith('gagal'))
    expect(onSaved).not.toHaveBeenCalled()
  })

  it('menampilkan status menyimpan', async () => {
    let resolve
    createPost.mockReturnValue(new Promise((r) => (resolve = r)))
    const user = userEvent.setup()
    setup(null)
    await user.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(await screen.findByRole('button', { name: 'Menyimpan...' })).toBeDisabled()
    await act(async () => resolve({}))
  })

  it('tombol batal menutup modal', async () => {
    const user = userEvent.setup()
    const { onClose } = setup(null)
    await user.click(screen.getByRole('button', { name: 'Batal' }))
    expect(onClose).toHaveBeenCalled()
  })
})
