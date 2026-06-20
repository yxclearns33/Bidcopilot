import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { SECTORS } from '../data/sectors'

export default function Onboarding() {
  const { completeOnboarding, session } = useApp()
  const [industry, setIndustry] = useState('')
  const [what, setWhat] = useState('')
  const [loading, setLoading] = useState(false)

  const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'there'

  async function finish() {
    if (!industry) return
    setLoading(true)
    await completeOnboarding({
      industry,
      companyName: '',
      location: '',
      staffCount: '',
      yearsTrading: '',
      turnoverBand: '',
      services: [],
      compliance: {},
      accreditations: {},
      dynamicCompliance: {},
      experience: [],
      references: [],
      feedbackNote: what,
    })
    setLoading(false)
  }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-logo">
        <div className="onboarding-logo-icon">B</div>
        <span className="onboarding-logo-text">BidCopilot</span>
      </div>

      <div className="onboarding-card">
        <div className="onboarding-step-title">Welcome, {username} 👋</div>
        <div className="onboarding-step-sub">
          One quick question to get you started. You can complete the rest of your profile inside the app.
        </div>

        <div style={{ fontSize:13, fontWeight:600, color:'#1A1A2E', marginBottom:12 }}>What sector are you in?</div>

        <div className="industry-grid" style={{ marginBottom:20 }}>
          {Object.entries(SECTORS).map(([key, s]) => (
            <button
              key={key}
              className={`industry-card ${industry === key ? 'selected' : ''}`}
              onClick={() => setIndustry(key)}
            >
              <span className="industry-card-icon">{s.icon}</span>
              <div className="industry-card-label">{s.label}</div>
              <div className="industry-card-sub">{s.description}</div>
            </button>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">What do you most want BidCopilot to help you with? <span style={{ color:'#9CA3AF', fontWeight:400 }}>(optional)</span></label>
          <textarea
            placeholder="e.g. I keep losing tenders on compliance — I want to know what I'm missing before I submit..."
            value={what}
            onChange={e => setWhat(e.target.value)}
            style={{ minHeight:80 }}
          />
          <div className="form-hint">Your answer helps us improve the tool for your sector.</div>
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ padding:12 }}
          onClick={finish}
          disabled={!industry || loading}
        >
          {loading ? 'Setting up...' : 'Get started →'}
        </button>

        <div style={{ textAlign:'center', marginTop:12, fontSize:12, color:'#9CA3AF' }}>
          You can complete your full profile once you're inside the app.
        </div>
      </div>
    </div>
  )
}
