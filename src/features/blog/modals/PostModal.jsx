import { useState } from 'react'
import Modal from '../../../components/Modal'
import MarkdownEditor from '../../../components/MarkdownEditor'
import { CATEGORIES, createPost, updatePost } from '../api/blogApi'
import { showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'

const EMPTY = {
  title: '',
  category: 'Umum',
  excerpt: '',
  content: '',
  cover_image_path: '',
  is_published: false,
}

export default function PostModal({ post, dark, onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY, ...post })
  const [saving, setSaving] = useState(false)

  const change = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSave() {
    setSaving(true)
    const body = {
      title: form.title,
      category: form.category,
      excerpt: form.excerpt,
      content: form.content,
      cover_image_path: form.cover_image_path,
      is_published: form.is_published,
    }
    try {
      await (form.id ? updatePost(form.id, body) : createPost(body))
      showSuccessAlert('Artikel disimpan')
      onSaved()
    } catch (err) {
      showErrorAlert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const footer = (
    <>
      <button type="button" className="btn-outline" onClick={onClose}>
        Batal
      </button>
      <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Menyimpan...' : 'Simpan'}
      </button>
    </>
  )

  return (
    <Modal
      title={form.id ? 'Ubah Artikel' : 'Tambah Artikel'}
      size="full"
      onClose={onClose}
      footer={footer}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="post-title" className="mb-1 block text-sm font-medium">Judul</label>
          <input id="post-title" className="field" value={form.title} onChange={change('title')} />
        </div>
        <div>
          <label htmlFor="post-category" className="mb-1 block text-sm font-medium">Kategori</label>
          <select id="post-category" className="field" value={form.category} onChange={change('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="post-excerpt" className="mb-1 block text-sm font-medium">Ringkasan</label>
          <input id="post-excerpt" className="field" value={form.excerpt} onChange={change('excerpt')} />
        </div>
        <div>
          <label htmlFor="post-cover" className="mb-1 block text-sm font-medium">URL Gambar Sampul</label>
          <input id="post-cover" className="field" value={form.cover_image_path} onChange={change('cover_image_path')} />
        </div>
      </div>
      <label className="my-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
        />
        Langsung terbitkan
      </label>
      <p className="mb-1 text-sm font-medium">Isi Artikel (Markdown)</p>
      <MarkdownEditor
        value={form.content}
        dark={dark}
        height="50vh"
        onChange={(content) => setForm((f) => ({ ...f, content }))}
      />
    </Modal>
  )
}
