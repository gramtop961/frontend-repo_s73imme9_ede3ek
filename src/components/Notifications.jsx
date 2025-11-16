import { useEffect, useState } from 'react'

export default function Notifications() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL
        const res = await fetch(`${base}/api/messages`)
        const data = await res.json()
        setMessages(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Notifications</h2>
      <div className="space-y-3">
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : (
          messages.length === 0 ? <p className="text-sm text-slate-500">No notifications yet.</p> : (
            messages.map(m => (
              <div key={m.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">{m.type}</p>
                <p className="font-medium text-slate-800">{m.title}</p>
                <p className="text-sm text-slate-600">{m.body}</p>
                <p className="text-[11px] text-slate-400 mt-2">{new Date(m.created_at).toLocaleString?.() || ''}</p>
              </div>
            ))
          )
        )}
      </div>
    </div>
  )
}
