import { useEffect, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { getCategories, getPublicPosts } from '../api/blogApi'
import { formatDate } from '../../../helpers/toolsHelper'

export default function PublicArticleList({ onOpen }) {
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const [postsError, setPostsError] = useState('')
  const [categoriesError, setCategoriesError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setCategories(await getCategories())
      } catch (err) {
        setCategoriesError(err.message)
      }
    }
    load()
  }, [])

  useEffect(() => {
    async function load() {
      try {
        setPosts(await getPublicPosts(q, category))
        setPostsError('')
      } catch (err) {
        setPostsError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [q, category])

  let body
  if (loading) {
    body = <p>Memuat artikel...</p>
  } else if (posts.length === 0) {
    body = <p>Belum ada artikel.</p>
  } else {
    body = (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onOpen(p.slug)}
            className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {p.category}
            </span>
            <h3 className="mt-2 text-lg font-bold">{p.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.excerpt}</p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {p.author.username} · {formatDate(p.published_at)} · {p.reading_time} menit baca
            </p>
          </button>
        ))}
      </div>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="relative mb-4">
        <IconSearch size={18} className="absolute left-3 top-3 text-slate-400" />
        <input
          aria-label="Cari artikel"
          className="field pl-10"
          placeholder="Cari artikel..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {['Semua', ...categories].map((c) => (
          <button
            key={c}
            type="button"
            className={category === c ? 'btn-primary' : 'btn-outline'}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {categoriesError ? <p role="alert" className="mb-2 text-red-600">{categoriesError}</p> : null}
      {postsError ? <p role="alert" className="mb-2 text-red-600">{postsError}</p> : null}
      {body}
    </section>
  )
}
