import { useEffect, useMemo, useState } from 'react'

export default function Syllabus() {
  const [subjects, setSubjects] = useState([])
  const [active, setActive] = useState('')

  useEffect(() => {
    const load = async () => {
      const base = import.meta.env.VITE_BACKEND_URL
      const res = await fetch(`${base}/api/subjects`)
      const data = await res.json()
      setSubjects(data)
      setActive(data[0]?.acronym || '')
    }
    load()
  }, [])

  const acronyms = useMemo(() => subjects.map(s => s.acronym), [subjects])
  const activeSub = useMemo(() => subjects.find(s => s.acronym === active), [active, subjects])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Syllabus</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {acronyms.map(ac => (
          <button key={ac} onClick={() => setActive(ac)} className={`px-3 py-1 rounded border text-sm ${active===ac ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 border-slate-200'}`}>{ac}</button>
        ))}
      </div>
      {activeSub ? (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-slate-800 font-medium mb-2">{activeSub.title} ({activeSub.code})</p>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
            {activeSub.syllabus?.map((it, idx) => <li key={idx}>{it}</li>)}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No subject selected.</p>
      )}
    </div>
  )
}
