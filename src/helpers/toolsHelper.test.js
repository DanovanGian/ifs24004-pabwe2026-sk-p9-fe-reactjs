import Swal from 'sweetalert2'
import {
  formatDate,
  showSuccessAlert,
  showErrorAlert,
  showConfirmDialog,
} from './toolsHelper'

vi.mock('sweetalert2', () => ({ default: { fire: vi.fn() } }))

describe('formatDate', () => {
  it('mengembalikan "-" jika kosong', () => {
    expect(formatDate(null)).toBe('-')
  })

  it('memformat tanggal Indonesia', () => {
    const out = formatDate(new Date(2026, 10, 25))
    expect(out).toContain('November')
    expect(out).toContain('2026')
  })
})

describe('alerts', () => {
  beforeEach(() => Swal.fire.mockReset())

  it('showSuccessAlert', () => {
    showSuccessAlert('ok')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success', text: 'ok' }))
  })

  it('showErrorAlert', () => {
    showErrorAlert('gagal')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error', text: 'gagal' }))
  })

  it('showConfirmDialog mengembalikan isConfirmed', async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true })
    expect(await showConfirmDialog('hapus?')).toBe(true)
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false })
    expect(await showConfirmDialog('hapus?')).toBe(false)
  })
})
