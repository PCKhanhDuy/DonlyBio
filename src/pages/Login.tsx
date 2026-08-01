import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

type Tab = 'login' | 'register' | 'forgot'

export default function Login() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <Spinner />
  if (user) return <Navigate to="/dashboard" replace />

  const reset = (nextTab: Tab) => {
    setTab(nextTab); setError(''); setInfo('')
    setEmail(''); setPassword(''); setName('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(''); setInfo(''); setSubmitting(true)

    if (tab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else if (tab === 'register') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      })
      if (error) setError(error.message)
      else setInfo('Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) setError(error.message)
      else setInfo('Reset link sent! Check your inbox.')
    }
    setSubmitting(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#EBEDDF' }}>
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="DONLY" className="w-70 object-contain mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {tab === 'forgot' ? 'Reset your password' : 'Your link in bio, elevated.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          {tab === 'forgot' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot password?</h2>
                <p className="text-sm text-gray-500">We'll send you a reset link.</p>
              </div>
              <InputField icon={<Mail size={16} />} type="email" placeholder="your@email.com"
                value={email} onChange={setEmail} />
              <Alert type="error" msg={error} />
              <Alert type="success" msg={info} />
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Sending...' : 'Send Reset Link'} <ArrowRight size={16} />
              </button>
              <button type="button" onClick={() => reset('login')}
                className="w-full text-sm py-2 text-gray-400 hover:text-gray-600 transition-colors">
                ← Back to Sign In
              </button>
            </form>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex rounded-2xl p-1 mb-6 gap-1" style={{ background: '#EBEDDF' }}>
                {(['login', 'register'] as Tab[]).map(t => (
                  <button key={t} onClick={() => reset(t)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all ${
                      tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    {t === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>

              {/* Google */}
              <button onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">or with email</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'register' && (
                  <InputField icon={<User size={16} />} type="text" placeholder="Full name"
                    value={name} onChange={setName} required />
                )}
                <InputField icon={<Mail size={16} />} type="email" placeholder="Email address"
                  value={email} onChange={setEmail} required />
                <div className="relative">
                  <InputField icon={<Lock size={16} />} type={showPass ? 'text' : 'password'}
                    placeholder="Password" value={password} onChange={setPassword}
                    required minLength={6} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {tab === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" onClick={() => reset('forgot')}
                      className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Alert type="error" msg={error} />
                <Alert type="success" msg={info} />

                <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
                  {submitting ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs mt-6 text-gray-400">
          By continuing you agree to our Terms &amp; Privacy Policy
        </p>
      </div>
    </div>
  )
}

function InputField({ icon, onChange, ...props }: {
  icon: React.ReactNode
  onChange: (v: string) => void
  [k: string]: unknown
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input
        {...props as React.InputHTMLAttributes<HTMLInputElement>}
        onChange={e => onChange((e.target as HTMLInputElement).value)}
        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition"
        style={{ '--tw-ring-color': '#333A2F' } as React.CSSProperties}
      />
    </div>
  )
}

function Alert({ type, msg }: { type: 'error' | 'success'; msg: string }) {
  if (!msg) return null
  return (
    <div className={`text-sm px-4 py-3 rounded-2xl ${
      type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    }`}>{msg}</div>
  )
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#EBEDDF' }}>
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
    </div>
  )
}
