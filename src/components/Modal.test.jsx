import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal'

describe('Modal', () => {
  it('ukuran kecil tanpa footer', async () => {
    const onClose = vi.fn()
    render(
      <Modal title="Judul" size="sm" onClose={onClose}>
        <p>isi</p>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Judul' })
    expect(dialog.firstChild.className).toContain('max-w-md')
    expect(screen.getByText('isi')).toBeInTheDocument()
    expect(screen.queryByText('Aksi')).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Tutup' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('ukuran penuh dengan footer', () => {
    render(
      <Modal title="Besar" size="full" onClose={() => {}} footer={<button>Aksi</button>}>
        <p>isi</p>
      </Modal>,
    )
    expect(screen.getByRole('dialog').firstChild.className).toContain('max-w-[96vw]')
    expect(screen.getByText('Aksi')).toBeInTheDocument()
  })
})
