import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('login') // login | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Check your email for a confirmation link.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-logo">
        <div className="onboarding-logo-icon">B</div>
        <span className="onboarding-logo-text">BidCopilot</span>
      </div>

      <div className="onboarding-card" style={{ maxWidth: 440 }}>
        <div className="onboarding-step-title">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </div>
        <div className="onboarding-step-sub">
          {mode === 'login'
            ? 'Sign in to access your bid intelligence platform'
            : 'Start winning more UK contracts today'}
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: '#DC2626', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, fontSize: 13, color: '#15803D', marginBottom: 16 }}>
            {message}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ padding: 12, marginTop: 8 }}
          onClick={handleSubmit}
          disabled={loading || !email || !password}
        >
          {loading
            ? 'Please wait...'
            : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#6B6B80' }}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => setMode('signup')} style={{ color: '#4F46E5', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                Sign up free
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')} style={{ color: '#4F46E5', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
        Built for UK SME contractors · Powered by BidCopilot
      </div>
    </div>
  )
}
