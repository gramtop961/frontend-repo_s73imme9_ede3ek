import { useEffect, useState } from 'react'

function timeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard({ user }) {
  const [data, setData] = useState({ upcoming: [], completed: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL
        const res = await fetch(`${base}/api/presentations/my?roll_number=${encodeURIComponent(user.roll_number)}`)
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const LinkChip = ({ href }) => (
    <a href={href} target="_blank" className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100">Submit PPT</a>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-slate-800">{timeGreeting()}, {user?.name || user?.roll_number}</h2>
      <p className="text-slate-500 mb-6">Here’s a quick look at your presentations.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold text-slate-800 mb-3">Upcoming</h3>
          {loading ? <p className="text-sm text-slate-500">Loading...</p> : (
            data.upcoming.length === 0 ? <p className="text-sm text-slate-500">No upcoming presentations.</p> : (
              <ul className="space-y-3">
                {data.upcoming.map(item => (
                  <li key={item.id} className="flex items-center justify-between gap-3 border border-slate-100 rounded p-3">
                    <div>
                      <p className="font-medium text-slate-800">{item.topic}</p>
                      <p className="text-xs text-slate-500">{item.subject_code} • {item.subject_acronym}</p>
                    </div>
                    {item.submission_link && <LinkChip href={item.submission_link} />}
                  </li>
                ))}
              </ul>
            )
          )}
        </section>
        <section className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold text-slate-800 mb-3">Completed</h3>
          {loading ? <p className="text-sm text-slate-500">Loading...</p> : (
            data.completed.length === 0 ? <p className="text-sm text-slate-500">No completed presentations yet.</p> : (
              <ul className="space-y-3">
                {data.completed.map(item => (
                  <li key={item.id} className="flex items-center justify-between gap-3 border border-slate-100 rounded p-3">
                    <div>
                      <p className="font-medium text-slate-800">{item.topic}</p>
                      <p className="text-xs text-slate-500">{item.subject_code} • {item.subject_acronym}</p>
                    </div>
                    {item.submission_link && <LinkChip href={item.submission_link} />}
                  </li>
                ))}
              </ul>
            )
          )}
        </section>
      </div>
    </div>
  )
}
