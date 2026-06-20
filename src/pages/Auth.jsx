import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth({ onBack }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPass, setShowPass] = useState(false)

  function makeEmail(u) {
    return `${u.toLowerCase().replace(/[^a-z0-9]/g, '')}@bidcopilot.local`
  }

  async function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      setError('Please enter a username and password.')
      return
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError('')
    const email = makeEmail(username)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: username.trim() } }
      })
      if (error) {
        if (error.message.includes('already registered')) {
          setError('That username is already taken. Please choose another.')
        } else {
          setError(error.message)
        }
      } else {
        setMessage('Account created! Taking you in...')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Username or password incorrect. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-logo">
        <div className="onboarding-logo-icon">B</div>
        <span className="onboarding-logo-text">BidCopilot</span>
      </div>

      <div className="onboarding-card" style={{ maxWidth: 420 }}>
        <div className="onboarding-step-title">
          {mode === 'login' ? 'Welcome back' : 'Request access'}
        </div>
        <div className="onboarding-step-sub">
          {mode === 'login'
            ? 'Enter your username and password to continue'
            : 'Choose a username and password to get started'}
        </div>

        {error && (
          <div style={{ padding:'10px 14px', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, fontSize:13, color:'#DC2626', marginBottom:16 }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ padding:'10px 14px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8, fontSize:13, color:'#15803D', marginBottom:16 }}>
            {message}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="e.g. brightclean or john123"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoComplete="username"
          />
          {mode === 'signup' && (
            <div className="form-hint">Minimum 3 characters. Letters and numbers only. This is what you'll use to log in.</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position:'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#9CA3AF', padding:4 }}
            >
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ padding:12, marginTop:8 }}
          onClick={handleSubmit}
          disabled={loading || !username || !password}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Log in →' : 'Create account →'}
        </button>

        <div style={{ textAlign:'center', marginTop:16, fontSize:13, color:'#6B6B80' }}>
          {mode === 'login' ? (
            <>Don't have access?{' '}
              <button onClick={() => { setMode('signup'); setError('') }}
                style={{ color:'#4F46E5', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>
                Request access
              </button>
            </>
          ) : (
            <>Already have access?{' '}
              <button onClick={() => { setMode('login'); setError('') }}
                style={{ color:'#4F46E5', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>
                Log in
              </button>
            </>
          )}
        </div>

        {onBack && (
          <div style={{ textAlign:'center', marginTop:12 }}>
            <button onClick={onBack} style={{ fontSize:12, color:'#9CA3AF', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
              ← Back to home
            </button>
          </div>
        )}

        <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid #F0F0F5', fontSize:11, color:'#9CA3AF', textAlign:'center', lineHeight:1.5 }}>
          BidCopilot stores no personal data. Your username is not linked to your real name.
          This is a free testing tool — not a commercial service.
        </div>
      </div>
    </div>
  )
}
