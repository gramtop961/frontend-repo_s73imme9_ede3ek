import { useEffect, useState } from 'react'

export default function Login({ onLogin }) {
  const [roll, setRoll] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setPassword('')
  }, [isAdmin])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const base = import.meta.env.VITE_BACKEND_URL
      const res = await fetch(`${base}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roll_number: roll, password: isAdmin ? password : undefined })
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Login failed')
      const data = await res.json()
      onLogin(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <form onSubmit={submit} className="bg-white/80 backdrop-blur rounded-xl shadow p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-slate-800 mb-1">Welcome to ClassCom</h2>
        <p className="text-sm text-slate-500 mb-6">Please enter your Roll Number to continue</p>

        <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
        <input value={roll} onChange={(e) => setRoll(e.target.value)} required placeholder="e.g., CS23A001"
          className="w-full mb-4 px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label className="inline-flex items-center gap-2 text-sm text-slate-700 mb-3">
          <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
          I am an admin
        </label>

        {isAdmin && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={isAdmin}
              className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded px-4 py-2 font-medium">
          {loading ? 'Signing in...' : 'Continue'}
        </button>
      </form>
    </div>
  )
}
