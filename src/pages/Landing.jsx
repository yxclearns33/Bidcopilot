import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Landing() {
  const { setScreen } = useApp()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function joinWaitlist() {
    if (!email || !email.includes('@')) return
    setLoading(true)
    // Store in localStorage for now — replace with Supabase later
    const existing = JSON.parse(localStorage.getItem('waitlist') || '[]')
    if (!existing.includes(email)) {
      localStorage.setItem('waitlist', JSON.stringify([...existing, email]))
    }
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:"'Inter',-apple-system,sans-serif" }}>

      {/* Nav */}
      <nav style={{ padding:'16px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #F0F0F5', position:'sticky', top:0, background:'#fff', zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, background:'#4F46E5', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:16 }}>B</div>
          <span style={{ fontSize:16, fontWeight:700, color:'#1A1A2E' }}>BidCopilot</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:24 }}>
          <a href="#features" style={{ fontSize:13, color:'#6B6B80', textDecoration:'none', fontWeight:500 }}>Features</a>
          <a href="#how" style={{ fontSize:13, color:'#6B6B80', textDecoration:'none', fontWeight:500 }}>How it works</a>
          <a href="#waitlist" style={{ fontSize:13, color:'#6B6B80', textDecoration:'none', fontWeight:500 }}>Join waitlist</a>
          <button onClick={()=>setScreen('auth')} style={{ fontSize:13, color:'#1A1A2E', background:'none', border:'none', cursor:'pointer', fontWeight:500, fontFamily:'inherit' }}>Log in</button>
          <button onClick={()=>setScreen('auth')} style={{ fontSize:13, background:'#4F46E5', color:'#fff', border:'none', borderRadius:8, padding:'8px 18px', cursor:'pointer', fontWeight:600, fontFamily:'inherit' }}>Get early access</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding:'80px 40px 60px', textAlign:'center', maxWidth:800, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#EEF2FF', padding:'5px 14px', borderRadius:20, fontSize:12, color:'#4338CA', fontWeight:600, marginBottom:24 }}>
          🚀 Currently in early access · UK contractors only
        </div>
        <h1 style={{ fontSize:52, fontWeight:800, color:'#1A1A2E', lineHeight:1.1, marginBottom:20, letterSpacing:'-1.5px' }}>
          Stop losing contracts<br />
          <span style={{ color:'#4F46E5' }}>before they read your bid</span>
        </h1>
        <p style={{ fontSize:18, color:'#6B6B80', lineHeight:1.7, marginBottom:36, maxWidth:580, margin:'0 auto 36px' }}>
          BidCopilot tells you exactly why you'll be disqualified, what's missing from your bid, and how to fix it — before you submit.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <a href="#waitlist" style={{ fontSize:15, background:'#4F46E5', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', cursor:'pointer', fontWeight:600, fontFamily:'inherit', textDecoration:'none', display:'inline-block' }}>
            Join the waitlist →
          </a>
          <button onClick={()=>setScreen('auth')} style={{ fontSize:15, background:'#fff', color:'#1A1A2E', border:'1.5px solid #E0E0EA', borderRadius:10, padding:'14px 32px', cursor:'pointer', fontWeight:500, fontFamily:'inherit' }}>
            I have access — log in
          </button>
        </div>
        <div style={{ marginTop:20, fontSize:12, color:'#9CA3AF' }}>Free during early access · No credit card required</div>
      </section>

      {/* Stats bar */}
      <section style={{ background:'#F9F9FB', borderTop:'1px solid #F0F0F5', borderBottom:'1px solid #F0F0F5', padding:'28px 40px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {[
            ['£300B+', 'UK government procurement spend annually'],
            ['83%', 'of SMEs disqualified for fixable compliance gaps'],
            ['5 min', 'to get your full compliance analysis'],
            ['9 sections', 'AI-generated bid pack from your profile'],
          ].map(([stat, label]) => (
            <div key={stat}>
              <div style={{ fontSize:28, fontWeight:800, color:'#4F46E5', letterSpacing:'-0.5px' }}>{stat}</div>
              <div style={{ fontSize:12, color:'#6B6B80', marginTop:4, lineHeight:1.4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding:'72px 40px', maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontSize:34, fontWeight:800, color:'#1A1A2E', letterSpacing:'-0.5px', marginBottom:12 }}>How it works</h2>
          <p style={{ fontSize:15, color:'#6B6B80', maxWidth:480, margin:'0 auto' }}>From tender document to submission-ready bid in minutes</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32 }}>
          {[
            { step:'01', icon:'📄', title:'Upload your tender', desc:'Drop in any PDF or DOCX tender document. BidCopilot extracts all requirements, deadlines, evaluation criteria and compliance rules automatically.' },
            { step:'02', icon:'⚡', title:'Get your compliance check', desc:'Our engine compares the tender requirements against your company profile and tells you exactly what you\'re missing — before it\'s too late.' },
            { step:'03', icon:'≡', title:'Generate your bid pack', desc:'A full 9-section bid proposal generated from your company profile and tender requirements. Edit and export as PDF or Word.' },
          ].map(item => (
            <div key={item.step} style={{ textAlign:'center', padding:'32px 24px', background:'#F9F9FB', borderRadius:16, border:'1px solid #F0F0F5' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#4F46E5', letterSpacing:'.1em', marginBottom:16 }}>STEP {item.step}</div>
              <div style={{ fontSize:36, marginBottom:16 }}>{item.icon}</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#1A1A2E', marginBottom:10 }}>{item.title}</div>
              <div style={{ fontSize:13, color:'#6B6B80', lineHeight:1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding:'72px 40px', background:'#F9F9FB', borderTop:'1px solid #F0F0F5' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:34, fontWeight:800, color:'#1A1A2E', letterSpacing:'-0.5px', marginBottom:12 }}>Everything you need to win more contracts</h2>
            <p style={{ fontSize:15, color:'#6B6B80', maxWidth:480, margin:'0 auto' }}>Built specifically for UK SME contractors in cleaning, security, and construction</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[
              { icon:'⚡', title:'Compliance Engine', desc:'Rule-based PASS/FAIL/RISK checking against tender requirements. Know your disqualification risks before you submit.' },
              { icon:'◎', title:'Bid Readiness Score', desc:'A 0–100% score from your industry match, compliance, experience, and capacity. Know exactly where you stand.' },
              { icon:'≡', title:'Bid Generator', desc:'9-section bid proposal generated from your company profile and tender requirements. Edit and export as PDF or Word.' },
              { icon:'📄', title:'Document Parsing', desc:'Upload any PDF or DOCX tender. BidCopilot extracts requirements, deadlines, values, and evaluation criteria automatically.' },
              { icon:'◧', title:'Bid Pipeline', desc:'Track every tender from discovery through to won or lost. Never miss a deadline or lose track of a bid.' },
              { icon:'▦', title:'Company Profile', desc:'Build your compliance profile, document vault, experience portfolio, and references — used across every bid.' },
            ].map(f => (
              <div key={f.title} style={{ background:'#fff', border:'1px solid #E8E8EE', borderRadius:12, padding:'24px 20px' }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{f.icon}</div>
                <div style={{ fontSize:14, fontWeight:700, color:'#1A1A2E', marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:13, color:'#6B6B80', lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding:'72px 40px', maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontSize:34, fontWeight:800, color:'#1A1A2E', letterSpacing:'-0.5px', marginBottom:12 }}>Built for contractors who want to win</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {[
            { icon:'🧹', sector:'Cleaning', desc:'Office, industrial, school, and healthcare cleaning contractors bidding for public sector contracts.' },
            { icon:'🛡️', sector:'Security', desc:'Manned guarding, CCTV, and facilities security companies tendering for public and private sector work.' },
            { icon:'🏗️', sector:'Construction', desc:'Civil engineering, fit-out, and maintenance contractors bidding for local authority and NHS frameworks.' },
          ].map(s => (
            <div key={s.sector} style={{ textAlign:'center', padding:'32px 24px', border:'1.5px solid #E8E8EE', borderRadius:16 }}>
              <div style={{ fontSize:40, marginBottom:16 }}>{s.icon}</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#1A1A2E', marginBottom:10 }}>{s.sector}</div>
              <div style={{ fontSize:13, color:'#6B6B80', lineHeight:1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" style={{ padding:'80px 40px', background:'linear-gradient(135deg,#1E1B4B,#312E81)' }}>
        <div style={{ maxWidth:520, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,.15)', padding:'5px 14px', borderRadius:20, fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:600, marginBottom:24 }}>
            🎉 Early access — free for founding members
          </div>
          <h2 style={{ fontSize:36, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:16 }}>
            Get early access to BidCopilot
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.7)', marginBottom:32, lineHeight:1.6 }}>
            We're opening access to a small group of UK contractors first. Join the waitlist and we'll be in touch within 48 hours.
          </p>

          {submitted ? (
            <div style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:12, padding:'24px', textAlign:'center' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>🎉</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:8 }}>You're on the list!</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.7)' }}>We'll be in touch within 48 hours with your access details.</div>
            </div>
          ) : (
            <div style={{ display:'flex', gap:10, maxWidth:440, margin:'0 auto', flexWrap:'wrap' }}>
              <input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && joinWaitlist()}
                style={{ flex:1, padding:'13px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,.2)', background:'rgba(255,255,255,.1)', color:'#fff', fontSize:14, fontFamily:'inherit', outline:'none', minWidth:220 }}
              />
              <button
                onClick={joinWaitlist}
                disabled={loading || !email}
                style={{ padding:'13px 24px', background:'#fff', color:'#4F46E5', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', opacity: loading||!email ? 0.7 : 1 }}
              >
                {loading ? 'Joining...' : 'Join waitlist →'}
              </button>
            </div>
          )}

          <div style={{ marginTop:20, fontSize:12, color:'rgba(255,255,255,.4)' }}>
            No spam. No credit card. Just early access.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding:'32px 40px', borderTop:'1px solid #F0F0F5', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:24, height:24, background:'#4F46E5', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:12 }}>B</div>
          <span style={{ fontSize:13, fontWeight:600, color:'#1A1A2E' }}>BidCopilot</span>
        </div>
        <div style={{ fontSize:12, color:'#9CA3AF' }}>© 2026 BidCopilot · Built for UK contractors</div>
        <div style={{ display:'flex', gap:20 }}>
          {['Privacy','Terms','Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize:12, color:'#9CA3AF', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
