import Modal from '../../../components/Modal'
import AuthForm from '../components/AuthForm'

export default function AuthModal({ onClose, onLoggedIn, onRegister }) {
  return (
    <Modal title="Masuk" size="sm" onClose={onClose}>
      <AuthForm mode="login" onLoggedIn={onLoggedIn} onRegistered={onClose} />
      <p className="mt-4 text-sm">
        Belum punya akun?{' '}
        <button
          type="button"
          className="font-semibold underline"
          style={{ color: 'var(--accent)' }}
          onClick={onRegister}
        >
          Daftar
        </button>
      </p>
    </Modal>
  )
}
