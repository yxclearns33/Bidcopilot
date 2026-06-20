import { useApp } from '../context/AppContext'
import { ScoreRing } from '../components/ScoreRing'

function ScorePill({ score }) {
  if (score == null) return <span className="badge badge-gray">—</span>
  return <span className={`badge ${score>=70?'badge-green':score>=50?'badge-amber':'badge-red'}`}>{score}%</span>
}

export default function Dashboard({ onNavigate }) {
  const { uploadedTenders, apiTenders, pipeline, company, setActiveTenderId } = useApp()

  const allTenders = [...(uploadedTenders||[]), ...(apiTenders||[]).filter(t => !(uploadedTenders||[]).find(u => u.id === t.id))]
  const opportunities = allTenders

  const topOpps = [...opportunities].sort((a,b)=>(b.fitScore?.overall||0)-(a.fitScore?.overall||0)).slice(0,4)
  const avgScore = opportunities.length > 0 ? opportunities.reduce((s,o)=>s+(o.fitScore?.overall||0),0) / opportunities.length : 0
  const criticalGaps = opportunities.reduce((s,o)=>s+(o.compliance?.critical||0),0)
  const pipelineActive = (pipeline||[]).filter(p=>!['won','lost'].includes(p.stage)).length

  const scoreHistory = [42,48,54,59,63,Math.round(avgScore)]
  const months = ['Jan','Feb','Mar','Apr','May','Jun']
  const W=340, H=120, PAD={t:8,r:20,b:20,l:24}
  const cW=W-PAD.l-PAD.r, cH=H-PAD.t-PAD.b
  const pts = scoreHistory.map((s,i)=>({
    x: PAD.l + (i/(scoreHistory.length-1))*cW,
    y: PAD.t + (1 - s/100)*cH,
    s, m: months[i],
  }))
  const polyline = pts.map(p=>`${p.x},${p.y}`).join(' ')

  return (
    <div>
      {/* Compliance alert */}
      {criticalGaps > 0 && (
        <div onClick={()=>onNavigate('compliance')} style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'12px 16px',marginBottom:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'#DC2626',marginBottom:2}}>⚡ {criticalGaps} critical compliance gap{criticalGaps>1?'s':''} detected</div>
            <div style={{fontSize:12,color:'#6B6B80'}}>These will cause automatic disqualification before evaluators read your bid. Fix them now.</div>
          </div>
          <button className="btn btn-danger btn-sm" style={{flexShrink:0}}>Open Compliance Engine →</button>
        </div>
      )}

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">My Tenders</div>
          <div className="stat-value">{(uploadedTenders||[]).length}</div>
          <div className="stat-delta">Uploaded or added</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg fit score</div>
          <div className="stat-value">{Math.round(avgScore)}%</div>
          <div className={`stat-delta ${avgScore>=60?'':'down'}`}>{avgScore>=60?'Good match':'Improve profile'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pipeline active</div>
          <div className="stat-value">{pipelineActive}</div>
          <div className="stat-delta neutral">Bids in progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Critical gaps</div>
          <div className="stat-value" style={{color:criticalGaps>0?'#DC2626':'#16A34A'}}>{criticalGaps}</div>
          <div className={`stat-delta ${criticalGaps>0?'down':''}`}>{criticalGaps>0?'Immediate action':'All clear'}</div>
        </div>
      </div>

      <div className="grid-2" style={{marginBottom:16}}>
        {/* Top tenders */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Top matching tenders</div><div className="card-subtitle">Ranked by fit score</div></div>
            <button className="btn btn-sm" onClick={()=>onNavigate('mytenders')}>View all →</button>
          </div>
          {topOpps.length === 0 ? (
            <div style={{textAlign:'center',padding:'24px 0',color:'#6B6B80'}}>
              <div style={{fontSize:13,marginBottom:12}}>No tenders yet</div>
              <button className="btn btn-primary btn-sm" onClick={()=>onNavigate('upload')}>Upload your first tender</button>
            </div>
          ) : topOpps.map(o=>(
            <div className="row-item" key={o.id} style={{cursor:'pointer'}} onClick={()=>{ setActiveTenderId(o.id); onNavigate('analysis') }}>
              <div className="row-item-left">
                <div className="row-item-title">{(o.title||'').split('—')[0].trim()}</div>
                <div className="row-item-sub">{o.buyer}</div>
              </div>
              <ScorePill score={o.fitScore?.overall} />
              <div style={{textAlign:'right',minWidth:72}}>
                <div style={{fontSize:12,fontWeight:600,color:'#4F46E5'}}>{o.value}</div>
                <div style={{fontSize:11,color:(o.daysLeft||30)<=10?'#DC2626':'#9CA3AF'}}>{o.daysLeft||'—'}d left</div>
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-full btn-sm" style={{marginTop:12}} onClick={()=>onNavigate('upload')}>+ Upload a tender document</button>
        </div>

        {/* Score history */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Bid readiness trend</div><div className="card-subtitle">Average fit score over time</div></div>
            <span className="badge badge-indigo">{Math.round(avgScore)}% now</span>
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
          <div style={{fontSize:12,color:'#6B6B80'}}>Complete your profile to improve your scores.</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Compliance summary */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Compliance summary</div><div className="card-subtitle">Across uploaded tenders</div></div>
            <button className="btn btn-sm" onClick={()=>onNavigate('compliance')}>Full engine →</button>
          </div>
          {(uploadedTenders||[]).length === 0 ? (
            <div style={{fontSize:13,color:'#6B6B80',padding:'12px 0'}}>No tenders uploaded yet.</div>
          ) : (uploadedTenders||[]).slice(0,4).map(o=>{
            const v = o.compliance?.verdict
            const icon = v==='at-risk'?'✗':v==='caution'?'⚠':'✓'
            const color = v==='at-risk'?'#DC2626':v==='caution'?'#D97706':'#16A34A'
            const bg = v==='at-risk'?'#FEF2F2':v==='caution'?'#FFFBEB':'#F0FDF4'
            return (
              <div className="row-item" key={o.id} style={{cursor:'pointer'}} onClick={()=>{ setActiveTenderId(o.id); onNavigate('compliance') }}>
                <div className="row-item-left">
                  <div className="row-item-title">{(o.title||'').split('—')[0].trim()}</div>
                  <div className="row-item-sub">{o.compliance?.critical||0} critical · {o.compliance?.passed||0}/{o.compliance?.total||0} passed</div>
                </div>
                <span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,background:bg,color}}>{icon} {v==='at-risk'?'At risk':v==='caution'?'Caution':'Clear'}</span>
              </div>
            )
          })}
        </div>

        {/* Company snapshot */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Company snapshot</div><div className="card-subtitle">{company?.companyName || 'Complete your profile'}</div></div>
            <button className="btn btn-sm" onClick={()=>onNavigate('profile')}>Edit →</button>
          </div>
          {[
            ['Industry', company?.industry ? company.industry.charAt(0).toUpperCase()+company.industry.slice(1) : '—'],
            ['Location', company?.location || '—'],
            ['Staff', company?.staffCount || '—'],
            ['Services', (company?.services||[]).length > 0 ? `${(company?.services||[]).length} selected` : 'None selected'],
            ['Past contracts', `${(company?.experience||[]).length} on file`],
            ['References', `${(company?.references||[]).length} on file`],
          ].map(([label,value])=>(
            <div className="row-item" key={label}>
              <span style={{fontSize:12,color:'#6B6B80',minWidth:110}}>{label}</span>
              <span style={{fontSize:13,fontWeight:500,color:'#1A1A2E'}}>{value}</span>
            </div>
          ))}
          {!company?.companyName && (
            <button className="btn btn-primary btn-full btn-sm" style={{marginTop:12}} onClick={()=>onNavigate('profile')}>Complete your profile →</button>
          )}
        </div>
      </div>
    </div>
  )
}
