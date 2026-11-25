import { useEffect, useState } from 'react'
import { getAdminPosts, getAdminUsers } from '../api/adminApi'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [u, p] = await Promise.all([getAdminUsers(), getAdminPosts()])
        setUsers(u)
        setPosts(p)
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [])

  const published = posts.filter((p) => p.is_published).length
  const cards = [
    { label: 'Total Pengguna', value: users.length },
    { label: 'Total Postingan', value: posts.length },
    { label: 'Total Terbit', value: published },
  ]

  return (
    <section className="w-full">
      <h1 className="mb-6 text-2xl font-bold">Panel Admin</h1>
      {error ? <p role="alert" className="mb-3 text-red-600">{error}</p> : null}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-sm text-slate-500 dark:text-slate-300">{c.label}</p>
            <p className="mt-1 text-3xl font-bold" style={{ color: 'var(--accent)' }}>{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-2 text-lg font-semibold">Direktori Pengguna</h2>
      <div className="mb-8 overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Jml Artikel</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.total_posts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-2 text-lg font-semibold">Arsip Seluruh Artikel</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="p-3">Judul</th>
              <th className="p-3">Penulis</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.author.username}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.is_published ? 'Terbit' : 'Draf'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
