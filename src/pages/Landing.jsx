import { useApp } from '../context/AppContext'

export default function Landing() {
  const { setScreen } = useApp()

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:"'Inter',-apple-system,sans-serif" }}>

      <nav style={{ padding:'14px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #F0F0F5', position:'sticky', top:0, background:'#fff', zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, background:'#4F46E5', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:15 }}>B</div>
          <span style={{ fontSize:15, fontWeight:700, color:'#1A1A2E' }}>BidCopilot</span>
        </div>
        <div className="nav-links" style={{ display:'flex', alignItems:'center', gap:24 }}>
          <a href="#what" style={{ fontSize:13, color:'#6B6B80', textDecoration:'none', fontWeight:500 }}>What it does</a>
          <a href="#who" style={{ fontSize:13, color:'#6B6B80', textDecoration:'none', fontWeight:500 }}>Who it&apos;s for</a>
          <a href="#try" style={{ fontSize:13, color:'#6B6B80', textDecoration:'none', fontWeight:500 }}>Request to try</a>
          <button onClick={()=>setScreen('auth')} style={{ fontSize:13, color:'#1A1A2E', background:'none', border:'none', cursor:'pointer', fontWeight:500, fontFamily:'inherit' }}>Log in</button>
          <button onClick={()=>setScreen('auth')} style={{ fontSize:13, background:'#4F46E5', color:'#fff', border:'none', borderRadius:8, padding:'8px 18px', cursor:'pointer', fontWeight:600, fontFamily:'inherit' }}>Request to try</button>
        </div>
        <div style={{ display:'none' }} className="mobile-nav-header">
          <button onClick={()=>setScreen('auth')} style={{ fontSize:13, background:'#4F46E5', color:'#fff', border:'none', borderRadius:8, padding:'8px 14px', cursor:'pointer', fontWeight:600, fontFamily:'inherit' }}>Try it</button>
        </div>
      </nav>

      <section style={{ padding:'72px 40px 56px', textAlign:'center', maxWidth:780, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#EEF2FF', padding:'5px 14px', borderRadius:20, fontSize:12, color:'#4338CA', fontWeight:600, marginBottom:24 }}>
          🇬🇧 Currently testing with UK contractors · Free · No catch
        </div>
        <h1 style={{ fontSize:48, fontWeight:800, color:'#1A1A2E', lineHeight:1.1, marginBottom:18, letterSpacing:'-1.5px' }}>
          Find out why you&apos;re losing<br />
          <span style={{ color:'#4F46E5' }}>before you submit your bid</span>
        </h1>
        <p style={{ fontSize:17, color:'#6B6B80', lineHeight:1.7, marginBottom:12, maxWidth:560, margin:'0 auto 12px' }}>
          BidCopilot checks your compliance profile against a tender and tells you exactly what&apos;s missing, what will disqualify you, and how to fix it.
        </p>
        <p style={{ fontSize:13, color:'#9CA3AF', lineHeight:1.6, marginBottom:36, maxWidth:500, margin:'0 auto 36px' }}>
          Built as a free tool for UK SME contractors in cleaning, security and construction. Currently in testing — we need real contractors to try it and tell us what we&apos;re getting wrong.
        </p>
        <div className="hero-buttons" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <a href="#try" style={{ fontSize:15, background:'#4F46E5', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', cursor:'pointer', fontWeight:600, fontFamily:'inherit', textDecoration:'none', display:'inline-block', textAlign:'center' }}>
            Request to try →
          </a>
          <button onClick={()=>setScreen('auth')} style={{ fontSize:15, background:'#fff', color:'#1A1A2E', border:'1.5px solid #E0E0EA', borderRadius:10, padding:'14px 32px', cursor:'pointer', fontWeight:500, fontFamily:'inherit' }}>
            I already have access
          </button>
        </div>
        <div style={{ marginTop:16, fontSize:12, color:'#9CA3AF' }}>Free · No email required · No credit card · Just feedback</div>
      </section>

      <section style={{ padding:'48px 40px', background:'#F9F9FB', borderTop:'1px solid #F0F0F5', borderBottom:'1px solid #F0F0F5' }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:26, fontWeight:700, color:'#1A1A2E', marginBottom:14, letterSpacing:'-0.5px' }}>Most SMEs don&apos;t lose tenders because their work isn&apos;t good enough</h2>
          <p style={{ fontSize:15, color:'#4B5563', lineHeight:1.7, marginBottom:28 }}>
            They lose because of missing insurance certificates, wrong accreditation levels, incomplete policies, or bids that don&apos;t address what evaluators score. These are fixable problems — if you know about them before you submit.
          </p>
          <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {[
              ['£300B+','UK public sector procurement spend per year'],
              ['83%','of SMEs disqualified for fixable compliance gaps'],
              ['£500–£2k','what bid consultants charge per submission'],
              ['Free','what BidCopilot costs — now and always'],
            ].map(([stat,label])=>(
              <div key={stat}>
                <div style={{ fontSize:24, fontWeight:800, color:'#4F46E5', letterSpacing:'-0.5px', marginBottom:4 }}>{stat}</div>
                <div style={{ fontSize:12, color:'#6B6B80', lineHeight:1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="what" style={{ padding:'64px 40px', maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontSize:30, fontWeight:800, color:'#1A1A2E', letterSpacing:'-0.5px', marginBottom:12 }}>What BidCopilot does</h2>
          <p style={{ fontSize:15, color:'#6B6B80', maxWidth:480, margin:'0 auto' }}>Three things — in the right order</p>
        </div>
        <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {[
            { step:'01', icon:'⚡', title:'Checks your compliance', desc:'You build a profile once — sector, services, insurance, accreditations, policies, experience. BidCopilot checks every tender against your actual capability.' },
            { step:'02', icon:'◎', title:'Scores your readiness', desc:'For each tender you get a match score and a compliance verdict — PASS, RISK, or FAIL per requirement. You see exactly what will disqualify you before you submit.' },
            { step:'03', icon:'≡', title:'Helps you build the bid', desc:'A 9-section bid structure is generated from your profile and the tender requirements. Edit it, improve it, and download it ready for submission.' },
          ].map(item=>(
            <div key={item.step} style={{ padding:'28px 24px', background:'#F9F9FB', borderRadius:14, border:'1px solid #F0F0F5', textAlign:'center' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#4F46E5', letterSpacing:'.1em', marginBottom:10 }}>STEP {item.step}</div>
              <div style={{ fontSize:30, marginBottom:12 }}>{item.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#1A1A2E', marginBottom:8 }}>{item.title}</div>
              <div style={{ fontSize:13, color:'#6B6B80', lineHeight:1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="who" style={{ padding:'64px 40px', background:'#F9F9FB', borderTop:'1px solid #F0F0F5' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontSize:30, fontWeight:800, color:'#1A1A2E', letterSpacing:'-0.5px', marginBottom:12 }}>Who it&apos;s built for</h2>
            <p style={{ fontSize:15, color:'#6B6B80', maxWidth:500, margin:'0 auto' }}>UK SME contractors who bid for public sector work and want to win more of it</p>
          </div>
          <div className="sectors-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[
              { icon:'🧹', sector:'Cleaning', desc:'Office, education, healthcare, industrial and specialist cleaning. COSHH, DBS, BICSc, CHAS — rules specific to your sector built in.' },
              { icon:'🛡️', sector:'Security', desc:'Manned guarding, CCTV, door supervision, key holding and events. SIA ACS, BS 7858, NSI/SSAIB — checked against every tender.' },
              { icon:'🏗️', sector:'Construction', desc:'General build, civil, M&E, fit-out, roofing and specialist trades. CDM, RAMS, Constructionline, CSCS — all sector rules built in.' },
            ].map(s=>(
              <div key={s.sector} style={{ textAlign:'center', padding:'28px 20px', background:'#fff', border:'1.5px solid #E8E8EE', borderRadius:14 }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{s.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:'#1A1A2E', marginBottom:8 }}>{s.sector}</div>
                <div style={{ fontSize:13, color:'#6B6B80', lineHeight:1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="try" style={{ padding:'72px 40px', background:'linear-gradient(135deg,#1E1B4B,#312E81)' }}>
        <div style={{ maxWidth:520, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,.12)', padding:'5px 14px', borderRadius:20, fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:600, marginBottom:24 }}>
            🧪 Currently in testing with UK contractors
          </div>
          <h2 style={{ fontSize:28, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:14 }}>Request to try BidCopilot</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.7)', marginBottom:10, lineHeight:1.6 }}>
            Create a free account and get instant access. Then tell us what we&apos;re getting right and wrong.
          </p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,.4)', marginBottom:32, lineHeight:1.5 }}>
            No email required. No personal data stored. Just a username and password.
            This is a free tool — you will never be asked to pay.
          </p>
          <button onClick={()=>setScreen('auth')} style={{ display:'block', width:'100%', maxWidth:300, margin:'0 auto 10px', padding:'14px', background:'#fff', color:'#4F46E5', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            Create free account →
          </button>
          <button onClick={()=>setScreen('auth')} style={{ display:'block', width:'100%', maxWidth:300, margin:'0 auto', padding:'12px', background:'transparent', color:'rgba(255,255,255,.55)', border:'1px solid rgba(255,255,255,.2)', borderRadius:10, fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>
            I already have access — log in
          </button>
          <div style={{ marginTop:16, fontSize:11, color:'rgba(255,255,255,.3)' }}>Instant access · Free · Your feedback shapes the product</div>
        </div>
      </section>

      <footer style={{ padding:'24px 40px', borderTop:'1px solid #F0F0F5' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:22, height:22, background:'#4F46E5', borderRadius:5, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:11 }}>B</div>
              <span style={{ fontSize:13, fontWeight:600, color:'#1A1A2E' }}>BidCopilot</span>
            </div>
            <div style={{ display:'flex', gap:20 }}>
              {['Privacy','Terms'].map(l=>(
                <a key={l} href="#" style={{ fontSize:12, color:'#9CA3AF', textDecoration:'none' }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ fontSize:11, color:'#C7C7D9', lineHeight:1.6 }}>
            BidCopilot is a free independent project built to help UK SME contractors access better bid intelligence.
            It is not a registered business, does not charge for any services, and has no commercial intent.
            Built in the UK by a student developer. No personal data is stored.
          </div>
        </div>
      </footer>

      <style>{`
        @media(max-width:768px){
          .nav-links{display:none !important}
          .mobile-nav-header{display:block !important}
          nav{padding:12px 16px !important}
          h1{font-size:28px !important}
          .hero-buttons{flex-direction:column !important;align-items:stretch !important}
          .hero-buttons a,.hero-buttons button{width:100% !important;text-align:center}
          .stats-grid{grid-template-columns:repeat(2,1fr) !important;gap:12px !important}
          .steps-grid{grid-template-columns:1fr !important;gap:12px !important}
          .sectors-grid{grid-template-columns:1fr !important;gap:12px !important}
          footer{padding:20px 16px !important}
        }
        @media(max-width:480px){
          h1{font-size:22px !important}
        }
      `}</style>
    </div>
  )
}
