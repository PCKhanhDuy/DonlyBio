import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AtSign, ArrowRight, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Onboarding() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = async (val: string) => {
    const clean = val.replace(/[^a-z0-9_]/gi, '').toLowerCase()
    setUsername(clean)
    setAvailable(false)
    setError('')
    if (clean.length < 3) return
    setChecking(true)
    const { data } = await supabase.from('profiles').select('username').eq('username', clean).maybeSingle()
    setChecking(false)
    if (data) setError('Username already taken.')
    else setAvailable(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || error || username.length < 3) return
    setSubmitting(true)

    const { error: rpcError } = await supabase.rpc('set_username', { p_username: username })
    if (rpcError) { setError(rpcError.message); setSubmitting(false); return }

    await refreshProfile()
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#EBEDDF' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="DONLY" className="w-16 h-16 object-contain mx-auto mb-3" />
          <p className="text-sm text-gray-500">One last step to get started</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Claim your link</h2>
            <p className="text-sm mt-1 text-gray-500">
              Your page will be at{' '}
              <span className="font-mono font-semibold" style={{ color: '#333A2F' }}>donly.bio/{username || 'yourname'}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <AtSign size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={e => handleChange(e.target.value)}
                placeholder="yourname"
                minLength={3}
                maxLength={30}
                required
                className="w-full pl-10 pr-24 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ '--tw-ring-color': '#333A2F' } as React.CSSProperties}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs">
                {checking && <span className="text-gray-400">checking…</span>}
                {!checking && available && (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle size={14} /> available
                  </span>
                )}
              </span>
            </div>
            <p className="text-xs text-gray-400">3–30 chars · letters, numbers, underscores</p>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !!error || !available}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-white text-sm font-semibold rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#333A2F' }}
              onMouseEnter={e => { if (!submitting && !error && available) (e.currentTarget as HTMLButtonElement).style.background = '#4a5240' }}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#333A2F'}
            >
              {submitting ? 'Setting up…' : 'Continue'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
