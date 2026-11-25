import { useState } from 'react'
import Modal from '../../../components/Modal'
import { CATEGORIES, aiGenerate } from '../api/blogApi'
import { showErrorAlert } from '../../../helpers/toolsHelper'

export default function AiPostGeneratorModal({ onClose, onApply }) {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('Umum')
  const [includeSearch, setIncludeSearch] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleGenerate() {
    if (!topic.trim()) {
      showErrorAlert('Topik wajib diisi')
      return
    }
    setLoading(true)
    try {
      setResult(
        await aiGenerate({
          topic: topic.trim(),
          category,
          include_web_search: includeSearch,
        }),
      )
    } catch (err) {
      showErrorAlert(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleApply() {
    onApply({
      title: result.title,
      category: result.category,
      excerpt: result.excerpt,
      content: result.content,
    })
  }

  const footer = (
    <>
      <button type="button" className="btn-outline" onClick={onClose}>
        Batal
      </button>
      <button type="button" className="btn-primary" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Menghasilkan...' : 'Generate'}
      </button>
      {result ? (
        <button type="button" className="btn-primary" onClick={handleApply}>
          Terapkan ke Editor
        </button>
      ) : null}
    </>
  )

  return (
    <Modal title="AI Blog Generator" size="full" onClose={onClose} footer={footer}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label htmlFor="ai-topic" className="mb-1 block text-sm font-medium">Topik</label>
          <input id="ai-topic" className="field" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ai-category" className="mb-1 block text-sm font-medium">Kategori</label>
          <select id="ai-category" className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <label className="my-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeSearch}
          onChange={(e) => setIncludeSearch(e.target.checked)}
        />
        Gunakan penelusuran web
      </label>

      {result ? (
        <div className="space-y-3">
          <h3 className="text-xl font-bold">{result.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {result.category} · {result.excerpt}
          </p>
          <pre className="whitespace-pre-wrap rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-700">
            {result.content}
          </pre>
          <h4 className="font-semibold">Sumber Rujukan</h4>
          {result.sources.length === 0 ? (
            <p className="text-sm">Tidak ada sumber rujukan.</p>
          ) : (
            <ul className="list-disc pl-5 text-sm">
              {result.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Belum ada hasil.</p>
      )}
    </Modal>
  )
}
