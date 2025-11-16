import { useEffect, useMemo, useState } from 'react'

export default function Admin({ user }) {
  const base = import.meta.env.VITE_BACKEND_URL
  const [tab, setTab] = useState('send')
  const [messages, setMessages] = useState([])
  const [presentations, setPresentations] = useState([])

  const fetchAll = async () => {
    const [m, p] = await Promise.all([
      fetch(`${base}/api/messages`).then(r => r.json()),
      fetch(`${base}/api/presentations`).then(r => r.json()),
    ])
    setMessages(m)
    setPresentations(p)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  // Send Alert
  const [alertTitle, setAlertTitle] = useState('')
  const [alertBody, setAlertBody] = useState('')
  const sendAlert = async () => {
    await fetch(`${base}/api/admin/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'alert', title: alertTitle, body: alertBody, created_by: user?.roll_number }) })
    setAlertTitle(''); setAlertBody(''); fetchAll()
  }

  // Messages Tab
  const [msgTitle, setMsgTitle] = useState('')
  const [msgBody, setMsgBody] = useState('')
  const sendMessage = async () => {
    await fetch(`${base}/api/admin/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'message', title: msgTitle, body: msgBody, created_by: user?.roll_number }) })
    setMsgTitle(''); setMsgBody(''); fetchAll()
  }

  const deleteMessage = async (id) => {
    await fetch(`${base}/api/admin/messages/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  // Assign
  const [assignRoll, setAssignRoll] = useState('')
  const assign = async (pid) => {
    await fetch(`${base}/api/admin/assign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ presentation_id: pid, roll_number: assignRoll }) })
    setAssignRoll('')
    fetchAll()
  }

  // Update status
  const mark = async (pid, status) => {
    await fetch(`${base}/api/admin/presentations/${pid}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    fetchAll()
  }

  const acronyms = useMemo(() => Array.from(new Set(presentations.map(p => p.subject_acronym))), [presentations])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Admin Controls</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {['send','sent','messages','assign'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded border text-sm ${tab===t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 border-slate-200'}`}>{t === 'send' ? 'Send Alert' : t === 'sent' ? 'Alerts Sent' : t === 'messages' ? 'Messages' : 'Assign Topic'}</button>
        ))}
      </div>

      {tab === 'send' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-xl">
          <p className="text-sm text-slate-600 mb-3">Broadcast an alert to all students.</p>
          <input value={alertTitle} onChange={e=>setAlertTitle(e.target.value)} placeholder="Title" className="w-full border border-slate-200 rounded px-3 py-2 mb-2" />
          <textarea value={alertBody} onChange={e=>setAlertBody(e.target.value)} placeholder="Body" className="w-full border border-slate-200 rounded px-3 py-2 mb-3" />
          <button onClick={sendAlert} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Send Alert</button>
        </div>
      )}

      {tab === 'sent' && (
        <div className="space-y-3">
          {messages.filter(m=>m.type==='alert').map(m => (
            <div key={m.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">ALERT</p>
                <p className="font-medium text-slate-800">{m.title}</p>
                <p className="text-sm text-slate-600">{m.body}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>mark(m.id, 'completed')} className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100">Mark Complete</button>
                <button onClick={()=>mark(m.id, 'revoked')} className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">Revoke</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'messages' && (
        <div className="space-y-3">
          <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-xl">
            <p className="text-sm text-slate-600 mb-3">Send a message to all students.</p>
            <input value={msgTitle} onChange={e=>setMsgTitle(e.target.value)} placeholder="Title" className="w-full border border-slate-200 rounded px-3 py-2 mb-2" />
            <textarea value={msgBody} onChange={e=>setMsgBody(e.target.value)} placeholder="Body" className="w-full border border-slate-200 rounded px-3 py-2 mb-3" />
            <button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Send Message</button>
          </div>
          <div className="space-y-2">
            {messages.map(m => (
              <div key={m.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">{m.type}</p>
                  <p className="font-medium text-slate-800">{m.title}</p>
                  <p className="text-sm text-slate-600">{m.body}</p>
                </div>
                <button onClick={()=>deleteMessage(m.id)} className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'assign' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-xl">
            <p className="text-sm text-slate-600 mb-3">Assign a topic to a student.</p>
            <input value={assignRoll} onChange={e=>setAssignRoll(e.target.value)} placeholder="Roll Number" className="w-full border border-slate-200 rounded px-3 py-2" />
            <p className="text-xs text-slate-500 mt-2">Selecting a topic below will assign it to the roll number above.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {acronyms.map(ac => (
              <span key={ac} className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">{ac}</span>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {presentations.map(p => (
              <div key={p.id} className="border border-slate-200 rounded-lg p-4 bg-white">
                <p className="font-medium text-slate-800">{p.topic}</p>
                <p className="text-xs text-slate-500 mb-2">{p.subject_code} • {p.subject_acronym}</p>
                <div className="flex items-center gap-2">
                  <button onClick={()=>assign(p.id)} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100">Assign</button>
                  <button onClick={()=>mark(p.id, 'completed')} className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100">Complete</button>
                  <button onClick={()=>mark(p.id, 'revoked')} className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">Revoke</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
