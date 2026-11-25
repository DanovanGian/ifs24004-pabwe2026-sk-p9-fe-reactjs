import Swal from 'sweetalert2'

export function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function showSuccessAlert(message) {
  return Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: message,
    timer: 1800,
    showConfirmButton: false,
  })
}

export function showErrorAlert(message) {
  return Swal.fire({ icon: 'error', title: 'Gagal', text: message })
}

export async function showConfirmDialog(message) {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Konfirmasi',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  })
  return result.isConfirmed
}
