import { useEffect, useState } from 'react'
import { getPublicPost } from '../api/blogApi'
import { formatDate } from '../../../helpers/toolsHelper'
import MarkdownViewer from '../../../components/MarkdownViewer'

export default function PublicArticleDetail({ slug, dark, onBack }) {
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setPost(await getPublicPost(slug))
        setError('')
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [slug])

  let body
  if (error) {
    body = <p role="alert" className="text-red-600">{error}</p>
  } else if (post) {
    body = (
      <article>
        {post.cover_image_path ? (
          <img
            src={post.cover_image_path}
            alt={post.title}
            className="mb-6 max-h-96 w-full rounded-xl object-cover"
          />
        ) : null}
        <span
          className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {post.category}
        </span>
        <h1 className="mt-3 text-3xl font-bold">{post.title}</h1>
        <p className="mb-6 mt-2 text-sm text-slate-500 dark:text-slate-400">
          {post.author.username} · {formatDate(post.published_at)} · {post.reading_time} menit baca
        </p>
        <MarkdownViewer content={post.content} dark={dark} />
      </article>
    )
  } else {
    body = <p>Memuat artikel...</p>
  }

  return (
    <section className="w-full">
      <button type="button" className="btn-outline mb-4" onClick={onBack}>
        Kembali
      </button>
      {body}
    </section>
  )
}
