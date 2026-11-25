import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthorDashboard from './AuthorDashboard'
import { getMyPosts, getStats, togglePublish, deletePost } from '../api/blogApi'
import {
  formatDate,
  showConfirmDialog,
  showErrorAlert,
  showSuccessAlert,
} from '../../../helpers/toolsHelper'

vi.mock('../api/blogApi', () => ({
  getMyPosts: vi.fn(),
  getStats: vi.fn(),
  togglePublish: vi.fn(),
  deletePost: vi.fn(),
}))
vi.mock('../../../helpers/toolsHelper', () => ({
  formatDate: vi.fn(),
  showConfirmDialog: vi.fn(),
  showErrorAlert: vi.fn(),
  showSuccessAlert: vi.fn(),
}))
vi.mock('../modals/PostModal', () => ({
  default: ({ post, onClose, onSaved }) => (
    <div>
      <p>post-modal:{post ? post.title : 'baru'}</p>
      <button onClick={onClose}>stub-close</button>
      <button onClick={onSaved}>stub-saved</button>
    </div>
  ),
}))
vi.mock('../modals/AiPostGeneratorModal', () => ({
  default: ({ onClose, onApply }) => (
    <div>
      <p>ai-modal</p>
      <button onClick={onClose}>stub-ai-close</button>
      <button onClick={() => onApply({ title: 'Draf AI' })}>stub-ai-apply</button>
    </div>
  ),
}))

const posts = [
  { id: 1, slug: 'satu', title: 'Satu', category: 'Umum', is_published: true, created_at: 'x' },
  { id: 2, slug: 'dua', title: 'Dua', category: 'Bisnis', is_published: false, created_at: 'y' },
]

beforeEach(() => {
  vi.resetAllMocks()
  getMyPosts.mockResolvedValue(posts)
  getStats.mockResolvedValue({ total: 2, published: 1, draft: 1 })
  formatDate.mockReturnValue('tgl')
  showConfirmDialog.mockResolvedValue(true)
})

async function setup() {
  const onNavigate = vi.fn()
  const user = userEvent.setup()
  render(<AuthorDashboard dark={false} onNavigate={onNavigate} />)
  await screen.findByText('Satu')
  return { onNavigate, user }
}

describe('AuthorDashboard', () => {
  it('menampilkan statistik dan daftar artikel', async () => {
    await setup()
    expect(screen.getByText('Total Artikel')).toBeInTheDocument()
    expect(screen.getByText('Dua')).toBeInTheDocument()
  })

  it('menampilkan pesan kosong', async () => {
    getMyPosts.mockResolvedValue([])
    render(<AuthorDashboard dark={false} onNavigate={vi.fn()} />)
    expect(await screen.findByText('Belum ada artikel.')).toBeInTheDocument()
  })

  it('menampilkan error saat gagal memuat', async () => {
    getMyPosts.mockRejectedValue(new Error('gagal muat'))
    render(<AuthorDashboard dark={false} onNavigate={vi.fn()} />)
    expect(await screen.findByText('gagal muat')).toBeInTheDocument()
  })

  it('mengubah status terbit', async () => {
    togglePublish.mockResolvedValue({})
    const { user } = await setup()
    await user.click(screen.getAllByRole('switch')[0])
    await waitFor(() => expect(getMyPosts).toHaveBeenCalledTimes(2))
    expect(togglePublish).toHaveBeenCalledWith(1)
  })

  it('gagal mengubah status terbit', async () => {
    togglePublish.mockRejectedValue(new Error('gagal ubah'))
    const { user } = await setup()
    await user.click(screen.getAllByRole('switch')[1])
    await waitFor(() => expect(showErrorAlert).toHaveBeenCalledWith('gagal ubah'))
  })

  it('menu aksi: lihat artikel terbit dan menutup menu', async () => {
    const { user, onNavigate } = await setup()
    const kebabs = screen.getAllByLabelText('Menu aksi')

    await user.click(kebabs[0])
    await user.click(kebabs[0])
    expect(screen.queryByText('Edit')).toBeNull()

    await user.click(kebabs[0])
    await user.click(screen.getByRole('button', { name: 'Lihat Artikel' }))
    expect(onNavigate).toHaveBeenCalledWith('/posts/satu')
  })

  it('menu artikel draf tidak punya lihat artikel', async () => {
    const { user } = await setup()
    await user.click(screen.getAllByLabelText('Menu aksi')[1])
    expect(screen.queryByRole('button', { name: 'Lihat Artikel' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('edit membuka modal dan simpan memuat ulang', async () => {
    const { user } = await setup()
    await user.click(screen.getAllByLabelText('Menu aksi')[0])
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByText('post-modal:Satu')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'stub-saved' }))
    expect(screen.queryByText('post-modal:Satu')).toBeNull()
    await waitFor(() => expect(getMyPosts).toHaveBeenCalledTimes(2))
  })

  it('tambah artikel membuka modal baru lalu bisa ditutup', async () => {
    const { user } = await setup()
    await user.click(screen.getByRole('button', { name: /Tambah Artikel/ }))
    expect(screen.getByText('post-modal:baru')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'stub-close' }))
    expect(screen.queryByText('post-modal:baru')).toBeNull()
  })

  it('AI generator: tutup dan terapkan ke editor', async () => {
    const { user } = await setup()
    await user.click(screen.getByRole('button', { name: /AI Generator/ }))
    await user.click(screen.getByRole('button', { name: 'stub-ai-close' }))
    expect(screen.queryByText('ai-modal')).toBeNull()

    await user.click(screen.getByRole('button', { name: /AI Generator/ }))
    await user.click(screen.getByRole('button', { name: 'stub-ai-apply' }))
    expect(screen.queryByText('ai-modal')).toBeNull()
    expect(screen.getByText('post-modal:Draf AI')).toBeInTheDocument()
  })

  it('hapus artikel setelah konfirmasi', async () => {
    deletePost.mockResolvedValue(null)
    const { user } = await setup()
    await user.click(screen.getAllByLabelText('Menu aksi')[0])
    await user.click(screen.getByRole('button', { name: 'Hapus' }))
    await waitFor(() => expect(deletePost).toHaveBeenCalledWith(1))
    expect(showSuccessAlert).toHaveBeenCalled()
    await waitFor(() => expect(getMyPosts).toHaveBeenCalledTimes(2))
  })

  it('batal menghapus', async () => {
    showConfirmDialog.mockResolvedValue(false)
    const { user } = await setup()
    await user.click(screen.getAllByLabelText('Menu aksi')[0])
    await user.click(screen.getByRole('button', { name: 'Hapus' }))
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled())
    expect(deletePost).not.toHaveBeenCalled()
  })

  it('gagal menghapus', async () => {
    deletePost.mockRejectedValue(new Error('gagal hapus'))
    const { user } = await setup()
    await user.click(screen.getAllByLabelText('Menu aksi')[0])
    await user.click(screen.getByRole('button', { name: 'Hapus' }))
    await waitFor(() => expect(showErrorAlert).toHaveBeenCalledWith('gagal hapus'))
  })
})
