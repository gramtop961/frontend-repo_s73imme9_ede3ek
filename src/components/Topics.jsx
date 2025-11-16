import { useEffect, useMemo, useState } from 'react'

export default function Topics() {
  const [presentations, setPresentations] = useState([])
  const [active, setActive] = useState('ALL')

  useEffect(() => {
    const load = async () => {
      const base = import.meta.env.VITE_BACKEND_URL
      const res = await fetch(`${base}/api/presentations`)
      const data = await res.json()
      setPresentations(data)
    }
    load()
  }, [])

  const acronyms = useMemo(() => ['ALL', ...Array.from(new Set(presentations.map(p => p.subject_acronym)))], [presentations])
  const filtered = useMemo(() => active === 'ALL' ? presentations : presentations.filter(p => p.subject_acronym === active), [active, presentations])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">PPT Topics</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {acronyms.map(ac => (
          <button key={ac} onClick={() => setActive(ac)} className={`px-3 py-1 rounded border text-sm ${active===ac ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 border-slate-200'}`}>{ac}</button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="border border-slate-200 rounded-lg p-4 bg-white">
            <p className="font-medium text-slate-800 mb-1">{item.topic}</p>
            <p className="text-xs text-slate-500 mb-3">{item.subject_code} • {item.subject_acronym}</p>
            {item.submission_link && (
              <a href={item.submission_link} target="_blank" className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100">Submit PPT</a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
