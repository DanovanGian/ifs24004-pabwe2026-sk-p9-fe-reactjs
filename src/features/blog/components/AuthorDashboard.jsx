import { useCallback, useEffect, useState } from 'react'
import { IconDotsVertical, IconPlus, IconSparkles } from '@tabler/icons-react'
import { getMyPosts, getStats, togglePublish, deletePost } from '../api/blogApi'
import {
  formatDate,
  showConfirmDialog,
  showErrorAlert,
  showSuccessAlert,
} from '../../../helpers/toolsHelper'
import PostStats from './PostStats'
import PostModal from '../modals/PostModal'
import AiPostGeneratorModal from '../modals/AiPostGeneratorModal'

const INITIAL_STATS = { total: 0, published: 0, draft: 0 }

export default function AuthorDashboard({ dark, onNavigate }) {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState(INITIAL_STATS)
  const [error, setError] = useState('')
  const [menuId, setMenuId] = useState(null)
  // undefined = modal tertutup, null = artikel baru, objek = ubah / draf AI
  const [editing, setEditing] = useState(undefined)
  const [aiOpen, setAiOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      const [list, summary] = await Promise.all([getMyPosts(), getStats()])
      setPosts(list)
      setStats(summary)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleToggle(post) {
    try {
      await togglePublish(post.id)
      await load()
    } catch (err) {
      showErrorAlert(err.message)
    }
  }

  async function handleDelete(post) {
    setMenuId(null)
    if (!(await showConfirmDialog(`Hapus artikel "${post.title}"?`))) return
    try {
      await deletePost(post.id)
      showSuccessAlert('Artikel dihapus')
      await load()
    } catch (err) {
      showErrorAlert(err.message)
    }
  }

  function handleSaved() {
    setEditing(undefined)
    load()
  }

  function handleApplyAi(draft) {
    setAiOpen(false)
    setEditing(draft)
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Ruang Kerja Penulis</h1>
        <div className="flex gap-2">
          <button type="button" className="btn-outline flex items-center gap-1" onClick={() => setAiOpen(true)}>
            <IconSparkles size={18} /> AI Generator
          </button>
          <button type="button" className="btn-primary flex items-center gap-1" onClick={() => setEditing(null)}>
            <IconPlus size={18} /> Tambah Artikel
          </button>
        </div>
      </div>

      <PostStats stats={stats} />
      {error ? <p role="alert" className="mb-3 text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="p-3">Judul</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Terbit</th>
              <th className="p-3">Dibuat</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">Belum ada artikel.</td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={p.is_published}
                      aria-label={`Status terbit ${p.title}`}
                      onClick={() => handleToggle(p)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        p.is_published ? 'bg-green-500' : 'bg-slate-400'
                      }`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition ${
                          p.is_published ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="p-3">{formatDate(p.created_at)}</td>
                  <td className="relative p-3 text-right">
                    <button
                      type="button"
                      aria-label="Menu aksi"
                      onClick={() => setMenuId(menuId === p.id ? null : p.id)}
                    >
                      <IconDotsVertical size={18} />
                    </button>
                    {menuId === p.id ? (
                      <div className="absolute right-3 z-10 mt-1 w-44 rounded-lg border border-slate-200 bg-white text-left shadow dark:border-slate-600 dark:bg-slate-700">
                        {p.is_published ? (
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-600"
                            onClick={() => {
                              setMenuId(null)
                              onNavigate(`/posts/${p.slug}`)
                            }}
                          >
                            Lihat Artikel
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-600"
                          onClick={() => {
                            setMenuId(null)
                            setEditing(p)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-left text-red-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                          onClick={() => handleDelete(p)}
                        >
                          Hapus
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing !== undefined && (
        <PostModal post={editing} dark={dark} onClose={() => setEditing(undefined)} onSaved={handleSaved} />
      )}
      {aiOpen && <AiPostGeneratorModal onClose={() => setAiOpen(false)} onApply={handleApplyAi} />}
    </section>
  )
}
