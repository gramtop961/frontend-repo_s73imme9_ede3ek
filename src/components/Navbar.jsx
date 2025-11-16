import { useEffect, useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ onBellClick, notificationsCount = 0 }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded hover:bg-slate-100" onClick={() => setOpen(!open)}>
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
          <Link to="/" className="font-semibold text-slate-800 tracking-tight">
            ClassCom <span className="text-blue-600">v1.0.1</span>
          </Link>
        </div>
        <nav className={`$${open ? 'block' : 'hidden'} md:block`}>
          <ul className="flex items-center gap-4 text-sm text-slate-700">
            <li><Link className="hover:text-blue-600" to="/dashboard">Dashboard</Link></li>
            <li><Link className="hover:text-blue-600" to="/topics">PPT Topics</Link></li>
            <li><Link className="hover:text-blue-600" to="/syllabus">Syllabus</Link></li>
            <li><Link className="hover:text-blue-600" to="/tbd">TBD</Link></li>
            <li><Link className="hover:text-blue-600" to="/admin">Admin</Link></li>
          </ul>
        </nav>
        <button onClick={onBellClick} className="relative p-2 rounded hover:bg-slate-100">
          <Bell className="w-5 h-5 text-slate-700" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {notificationsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
