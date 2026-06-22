import { useApp } from '../context/AppContext'
import { ScoreRing } from '../components/ScoreRing'

function ScorePill({ score }) {
  if (score == null) return <span className="badge badge-gray">—</span>
  return <span className={`badge ${score>=70?'badge-green':score>=50?'badge-amber':'badge-red'}`}>{score}%</span>
}

export default function Dashboard({ onNavigate }) {
  const { uploadedTenders, apiTenders, pipeline, company, setActiveTenderId, session } = useApp()

  const uploadedList = uploadedTenders || []
  const allTenders = [...uploadedList, ...(apiTenders||[]).filter(t => !uploadedList.find(u => u.id === t.id))]
  const avgScore = allTenders.length > 0 ? Math.round(allTenders.reduce((s,o)=>s+(o.fitScore?.overall||0),0) / allTenders.length) : 0
  const criticalGaps = allTenders.reduce((s,o)=>s+(o.compliance?.critical||0),0)
  const pipelineActive = (pipeline||[]).filter(p=>!['won','lost'].includes(p.stage)).length
  const topOpps = [...allTenders].sort((a,b)=>(b.fitScore?.overall||0)-(a.fitScore?.overall||0)).slice(0,4)

  const username = company?.companyName || session?.user?.user_metadata?.username || 'there'

  const profilePct = Math.round([
    !!company?.companyName,
    !!company?.location,
    !!company?.staffCount,
    !!company?.yearsTrading,
    !!company?.turnoverBand,
    (company?.services||[]).length > 0,
    !!company?.compliance?.publicLiability,
  ].filter(Boolean).length / 7 * 100)

  const isNewUser = uploadedList.length === 0

  // ─── NEW USER WELCOME ─────────────────────────────────────────
  if (isNewUser) {
    return (
      <div>
        {/* Welcome */}
        <div style={{ background:'linear-gradient(135deg,#1E1B4B,#312E81)', borderRadius:12, padding:'24px', marginBottom:16, color:'#fff' }}>
          <div style={{ fontSize:20, fontWeight:700, marginBottom:6 }}>Welcome, {username} 👋</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.7)', lineHeight:1.6, marginBottom:20 }}>
            BidCopilot helps UK contractors check compliance, fix gaps, and plan bids before submission. Get started with two quick steps.
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { num:'1️⃣', title:'Complete your profile', desc:'Add your insurance, accreditations, and experience so we can check your compliance.', btn:'Go to profile →', screen:'profile', done: profilePct >= 50 },
              { num:'2️⃣', title:'Upload a tender', desc:'Upload any tender PDF and get an instant compliance check and bid action plan.', btn:'Upload tender →', screen:'upload', done: false },
            ].map(item => (
              <div key={item.screen} style={{ background: item.done ? 'rgba(134,239,172,.15)' : 'rgba(255,255,255,.1)', borderRadius:10, padding:'16px', border: item.done ? '1px solid rgba(134,239,172,.3)' : 'none' }}>
                <div style={{ fontSize:22, marginBottom:8 }}>{item.done ? '✅' : item.num}</div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{item.title}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.6)', marginBottom:12, lineHeight:1.5 }}>{item.desc}</div>
                <button onClick={() => onNavigate(item.screen)} style={{ fontSize:12, fontWeight:600, padding:'7px 14px', borderRadius:8, border:'none', background:'#fff', color:'#4F46E5', cursor:'pointer', fontFamily:'inherit' }}>
                  {item.done ? 'Update profile →' : item.btn}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Profile progress */}
        <div className="card" style={{ marginBottom:16 }}>
          <div className="card-header">
            <div className="card-title">Profile completion</div>
            <span className="badge badge-indigo">{profilePct}%</span>
          </div>
          <div style={{ height:6, background:'#F0F0F5', borderRadius:3, overflow:'hidden', marginBottom:10 }}>
            <div style={{ width:`${profilePct}%`, height:'100%', background: profilePct >= 80 ? '#16A34A' : '#4F46E5', borderRadius:3, transition:'width .4s' }} />
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {[
              { label:'Company info', done: !!company?.companyName && !!company?.location },
              { label:'Services', done: (company?.services||[]).length > 0 },
              { label:'Insurance', done: !!company?.compliance?.publicLiability },
              { label:'Accreditations', done: Object.values(company?.accreditations||{}).some(Boolean) },
              { label:'Policies', done: !!company?.compliance?.healthSafety },
              { label:'Experience', done: (company?.experience||[]).length > 0 },
              { label:'References', done: (company?.references||[]).length > 0 },
            ].map(item => (
              <span key={item.label} style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background: item.done ? '#DCFCE7' : '#F5F5F7', color: item.done ? '#15803D' : '#9CA3AF', fontWeight:500 }}>
                {item.done ? '✓' : '○'} {item.label}
              </span>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" style={{ marginTop:12 }} onClick={() => onNavigate('profile')}>
            Complete your profile →
          </button>
        </div>

        {/* How it works */}
        <div className="card">
          <div className="card-header"><div className="card-title">How BidCopilot works</div></div>
          {[
            { icon:'▦', title:'Build your profile once', desc:'Add your company details, insurance, accreditations, and experience. Used across every tender you check.' },
            { icon:'↑', title:'Upload a tender document', desc:'Upload any tender PDF or DOCX. Requirements, deadlines, and evaluation criteria are extracted automatically.' },
            { icon:'⚡', title:'Check your compliance', desc:'See exactly what will disqualify you before you spend time writing the bid. PASS, RISK, or FAIL per requirement.' },
            { icon:'📝', title:'Plan your bid', desc:'Get a step-by-step action plan — what to fix, how to fix it, and in what order before the deadline.' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom: i < 3 ? '1px solid #F0F0F5' : 'none', alignItems:'flex-start' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1A1A2E', marginBottom:2 }}>{item.title}</div>
                <div style={{ fontSize:12, color:'#6B6B80', lineHeight:1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─── RETURNING USER DASHBOARD ─────────────────────────────────
  const scoreHistory = [42,48,54,59,63,avgScore]
  const months = ['Jan','Feb','Mar','Apr','May','Jun']
  const W=340, H=120, PAD={t:8,r:20,b:20,l:24}
  const cW=W-PAD.l-PAD.r, cH=H-PAD.t-PAD.b
  const pts = scoreHistory.map((s,i)=>({ x:PAD.l+(i/(scoreHistory.length-1))*cW, y:PAD.t+(1-s/100)*cH, s, m:months[i] }))
  const polyline = pts.map(p=>`${p.x},${p.y}`).join(' ')

  return (
    <div>
      {/* Compliance alert */}
      {criticalGaps > 0 && (
        <div onClick={()=>onNavigate('compliance')} style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'12px 16px',marginBottom:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'#DC2626',marginBottom:2}}>⚡ {criticalGaps} critical gap{criticalGaps>1?'s':''} — automatic disqualification risk</div>
            <div style={{fontSize:12,color:'#6B6B80'}}>Fix these before submitting any bids.</div>
          </div>
          <button className="btn btn-sm" style={{color:'#DC2626',borderColor:'#FECACA',flexShrink:0}}>Fix now →</button>
        </div>
      )}

      {/* Stats */}
      <div className="stat-grid" style={{marginBottom:16}}>
        {[
          { label:'My Tenders', value:uploadedList.length, sub:'Uploaded or added', color:'' },
          { label:'Avg fit score', value:`${avgScore}%`, sub: avgScore>=60?'Good match':'Improve profile', color: avgScore>=60?'#16A34A':'#DC2626' },
          { label:'Active bids', value:pipelineActive, sub:'In Bid Tracker', color:'' },
          { label:'Critical gaps', value:criticalGaps, sub:criticalGaps>0?'Immediate action':'All clear', color:criticalGaps>0?'#DC2626':'#16A34A' },
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{color:s.color||'#1A1A2E'}}>{s.value}</div>
            <div className="stat-delta">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{marginBottom:16}}>
        {/* Top tenders */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Top matching tenders</div><div className="card-subtitle">Ranked by fit score</div></div>
            <button className="btn btn-sm" onClick={()=>onNavigate('mytenders')}>View all →</button>
          </div>
          {topOpps.length === 0 ? (
            <div style={{textAlign:'center',padding:'20px 0'}}>
              <div style={{fontSize:13,color:'#6B6B80',marginBottom:10}}>No tenders yet</div>
              <button className="btn btn-primary btn-sm" onClick={()=>onNavigate('upload')}>Upload your first tender</button>
            </div>
          ) : topOpps.map(o=>(
            <div className="row-item" key={o.id} style={{cursor:'pointer'}} onClick={()=>{ setActiveTenderId(o.id); onNavigate('analysis') }}>
              <div className="row-item-left">
                <div className="row-item-title">{(o.title||'').substring(0,40)}</div>
                <div className="row-item-sub">{o.buyer}</div>
              </div>
              <ScorePill score={o.fitScore?.overall} />
              <div style={{textAlign:'right',minWidth:60}}>
                <div style={{fontSize:11,fontWeight:600,color:'#4F46E5'}}>{o.value}</div>
                <div style={{fontSize:11,color:(o.daysLeft||30)<=10?'#DC2626':'#9CA3AF'}}>{o.daysLeft||'—'}d</div>
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-full btn-sm" style={{marginTop:12}} onClick={()=>onNavigate('upload')}>+ Upload a tender</button>
        </div>

        {/* Score chart */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Bid readiness trend</div><div className="card-subtitle">Average fit score over time</div></div>
            <span className="badge badge-indigo">{avgScore}% now</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{marginBottom:8}}>
            {[0,25,50,75,100].map(v=>{
              const y=PAD.t+(1-v/100)*cH
              return <g key={v}>
                <line x1={PAD.l} y1={y} x2={W-PAD.r} y2={y} stroke="#F0F0F5" strokeWidth="1"/>
                <text x={PAD.l-4} y={y+4} fontSize="9" fill="#9CA3AF" textAnchor="end">{v}%</text>
              </g>
            })}
            <path d={`M${pts[0].x},${PAD.t+cH} ${pts.map(p=>`L${p.x},${p.y}`).join(' ')} L${pts[pts.length-1].x},${PAD.t+cH}Z`} fill="#EEF2FF" opacity=".7"/>
            <polyline points={polyline} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {pts.map((p,i)=>(
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={i===pts.length-1?5:3.5} fill="#4F46E5" stroke="#fff" strokeWidth="2"/>
                <text x={p.x} y={H-4} fontSize="9" fill="#9CA3AF" textAnchor="middle">{p.m}</text>
                {i===pts.length-1&&<text x={p.x} y={p.y-10} fontSize="10" fill="#4F46E5" fontWeight="700" textAnchor="middle">{p.s}%</text>}
              </g>
            ))}
          </svg>
          <div style={{fontSize:12,color:'#6B6B80'}}>Upload more tenders to build your score history.</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Compliance summary */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Compliance summary</div><div className="card-subtitle">Across your tenders</div></div>
            <button className="btn btn-sm" onClick={()=>onNavigate('compliance')}>Full engine →</button>
          </div>
          {uploadedList.slice(0,4).map(o=>{
            const v=o.compliance?.verdict
            const cfg = v==='at-risk' ? {bg:'#FEF2F2',color:'#DC2626',icon:'✗',label:'At risk'}
                      : v==='caution'  ? {bg:'#FFFBEB',color:'#D97706',icon:'⚠',label:'Caution'}
                      : {bg:'#F0FDF4',color:'#16A34A',icon:'✓',label:'Clear'}
            return (
              <div className="row-item" key={o.id} style={{cursor:'pointer'}} onClick={()=>{ setActiveTenderId(o.id); onNavigate('compliance') }}>
                <div className="row-item-left">
                  <div className="row-item-title">{(o.title||'').substring(0,40)}</div>
                  <div className="row-item-sub">{o.compliance?.critical||0} critical · {o.compliance?.passed||0}/{o.compliance?.total||0} passed</div>
                </div>
                <span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,background:cfg.bg,color:cfg.color,whiteSpace:'nowrap'}}>{cfg.icon} {cfg.label}</span>
              </div>
            )
          })}
        </div>

        {/* Company snapshot */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Company snapshot</div><div className="card-subtitle">{company?.companyName||'Complete your profile'}</div></div>
            <button className="btn btn-sm" onClick={()=>onNavigate('profile')}>Edit →</button>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#6B6B80',marginBottom:4}}>
              <span>Profile {profilePct}% complete</span>
              {profilePct < 100 && <span style={{color:'#4F46E5',cursor:'pointer'}} onClick={()=>onNavigate('profile')}>Finish →</span>}
            </div>
            <div style={{height:4,background:'#F0F0F5',borderRadius:2,overflow:'hidden'}}>
              <div style={{width:`${profilePct}%`,height:'100%',background:profilePct>=80?'#16A34A':'#4F46E5',borderRadius:2}} />
            </div>
          </div>
          {[
            ['Industry', company?.industry ? company.industry.charAt(0).toUpperCase()+company.industry.slice(1) : '—'],
            ['Location', company?.location||'—'],
            ['Staff', company?.staffCount||'—'],
            ['Services', (company?.services||[]).length>0?`${(company?.services||[]).length} selected`:'None selected'],
            ['Contracts', `${(company?.experience||[]).length} on file`],
            ['References', `${(company?.references||[]).length} on file`],
          ].map(([label,value])=>(
            <div className="row-item" key={label}>
              <span style={{fontSize:12,color:'#6B6B80',minWidth:90}}>{label}</span>
              <span style={{fontSize:13,fontWeight:500,color:'#1A1A2E'}}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}