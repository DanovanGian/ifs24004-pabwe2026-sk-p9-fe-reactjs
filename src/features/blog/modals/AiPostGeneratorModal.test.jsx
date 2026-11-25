import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AiPostGeneratorModal from './AiPostGeneratorModal'
import { aiGenerate } from '../api/blogApi'
import { showErrorAlert } from '../../../helpers/toolsHelper'

vi.mock('../api/blogApi', () => ({
  CATEGORIES: ['Teknologi', 'Umum'],
  aiGenerate: vi.fn(),
}))
vi.mock('../../../helpers/toolsHelper', () => ({ showErrorAlert: vi.fn() }))

const article = {
  title: 'Judul AI',
  category: 'Teknologi',
  excerpt: 'Ring',
  content: 'Isi artikel',
  sources: [{ title: 'Sumber Satu', url: 'http://s', snippet: 'sn' }],
}

beforeEach(() => vi.resetAllMocks())

function setup() {
  const onClose = vi.fn()
  const onApply = vi.fn()
  render(<AiPostGeneratorModal onClose={onClose} onApply={onApply} />)
  return { onClose, onApply }
}

describe('AiPostGeneratorModal', () => {
  it('menolak topik kosong', async () => {
    const user = userEvent.setup()
    setup()
    expect(screen.getByText('Belum ada hasil.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Terapkan ke Editor' })).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(showErrorAlert).toHaveBeenCalledWith('Topik wajib diisi')
    expect(aiGenerate).not.toHaveBeenCalled()
  })

  it('menghasilkan artikel dengan sumber lalu menerapkannya', async () => {
    aiGenerate.mockResolvedValue(article)
    const user = userEvent.setup()
    const { onApply } = setup()

    await user.type(screen.getByLabelText('Topik'), '  go  ')
    await user.click(screen.getByRole('button', { name: 'Generate' }))

    expect(await screen.findByText('Judul AI')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sumber Satu' })).toHaveAttribute('href', 'http://s')
    expect(aiGenerate).toHaveBeenCalledWith({ topic: 'go', category: 'Umum', include_web_search: true })

    await user.click(screen.getByRole('button', { name: 'Terapkan ke Editor' }))
    expect(onApply).toHaveBeenCalledWith({
      title: 'Judul AI',
      category: 'Teknologi',
      excerpt: 'Ring',
      content: 'Isi artikel',
    })
  })

  it('tanpa sumber, kategori dan penelusuran diubah', async () => {
    aiGenerate.mockResolvedValue({ ...article, sources: [] })
    const user = userEvent.setup()
    setup()

    await user.type(screen.getByLabelText('Topik'), 'go')
    await user.selectOptions(screen.getByLabelText('Kategori'), 'Teknologi')
    await user.click(screen.getByLabelText('Gunakan penelusuran web'))
    await user.click(screen.getByRole('button', { name: 'Generate' }))

    expect(await screen.findByText('Tidak ada sumber rujukan.')).toBeInTheDocument()
    expect(aiGenerate).toHaveBeenCalledWith({ topic: 'go', category: 'Teknologi', include_web_search: false })
  })

  it('menampilkan error dari server', async () => {
    aiGenerate.mockRejectedValue(new Error('gagal ai'))
    const user = userEvent.setup()
    setup()
    await user.type(screen.getByLabelText('Topik'), 'go')
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(await screen.findByRole('button', { name: 'Generate' })).toBeEnabled()
    expect(showErrorAlert).toHaveBeenCalledWith('gagal ai')
  })

  it('menonaktifkan tombol saat menghasilkan dan batal menutup', async () => {
    let resolve
    aiGenerate.mockReturnValue(new Promise((r) => (resolve = r)))
    const user = userEvent.setup()
    const { onClose } = setup()
    await user.type(screen.getByLabelText('Topik'), 'go')
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(await screen.findByRole('button', { name: 'Menghasilkan...' })).toBeDisabled()
    await act(async () => resolve(article))

    await user.click(screen.getByRole('button', { name: 'Batal' }))
    expect(onClose).toHaveBeenCalled()
  })
})
