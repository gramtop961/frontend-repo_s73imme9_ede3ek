import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Topics from './components/Topics'
import Syllabus from './components/Syllabus'
import Notifications from './components/Notifications'

function Placeholder() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Coming Soon</h2>
      <p className="text-slate-600">This page is a placeholder for upcoming features.</p>
    </div>
  )
}

export default function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('classcom_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const onLogin = (u) => {
    setUser(u)
    localStorage.setItem('classcom_user', JSON.stringify(u))
    navigate('/dashboard')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('classcom_user')
    navigate('/')
  }

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL
        const res = await fetch(`${base}/api/messages`)
        const data = await res.json()
        setMessages(data)
      } catch (e) { console.error(e) }
    }
    load()
  }, [])

  const unreadCount = useMemo(() => messages.length, [messages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40">
      <Navbar notificationsCount={unreadCount} onBellClick={() => navigate('/notifications')} />

      <main className="py-6">
        <Routes>
          <Route index element={<Login onLogin={onLogin} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Login onLogin={onLogin} />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/tbd" element={<Placeholder />} />
          <Route path="*" element={<Placeholder />} />
        </Routes>
      </main>

      <div className="max-w-6xl mx-auto px-4">
        {user && (
          <div className="mb-6 flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4">
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="font-medium text-slate-800">{user.roll_number}{user.is_admin ? ' • Admin' : ''}</p>
            </div>
            <button onClick={logout} className="text-sm px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">Logout</button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
