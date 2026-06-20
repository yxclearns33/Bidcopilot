import { useApp } from '../context/AppContext'
import { ScoreRing, ScoreBars } from '../components/ScoreRing'

export default function Analysis({ onNavigate }) {
  const { activeTender, uploadedTenders, apiTenders, setActiveTenderId } = useApp()

  const allTenders = [
    ...(uploadedTenders || []),
    ...(apiTenders || []).filter(t => !(uploadedTenders || []).find(u => u.id === t.id))
  ]

  const active = activeTender || allTenders[0]

  if (allTenders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">◎</div>
        <div className="empty-title">No tenders yet</div>
        <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16 }}>Upload a tender to see your analysis.</div>
        <button className="btn btn-primary" onClick={() => onNavigate('upload')}>Upload a tender</button>
      </div>
    )
  }

  if (!active) {
    return (
      <div className="empty-state">
        <div className="empty-icon">◎</div>
        <div className="empty-title">Select a tender</div>
        <button className="btn btn-primary" onClick={() => setActiveTenderId(allTenders[0]?.id)}>Load first tender</button>
      </div>
    )
  }

  const fit = active.fitScore
  const comp = active.compliance

  return (
    <div>
      {/* Tender switcher */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <span style={{ fontSize:12, color:'#6B6B80', fontWeight:500, flexShrink:0 }}>Viewing:</span>
        <select
          value={active.id}
          onChange={e => setActiveTenderId(e.target.value)}
          style={{ flex:1, minWidth:200, fontSize:13 }}
        >
          {allTenders.map(t => (
            <option key={t.id} value={t.id}>{t.title?.substring(0, 60)}</option>
          ))}
        </select>
        <button className="btn btn-sm" onClick={() => onNavigate('upload')}>+ Upload new</button>
        <button className="btn btn-sm">↓ Download report</button>
      </div>

      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#1A1A2E', marginBottom:4 }}>{active.title}</div>
        <div style={{ fontSize:13, color:'#4F46E5', marginBottom:6, fontWeight:500 }}>{active.buyer}</div>
        <div style={{ display:'flex', gap:20, fontSize:12, color:'#6B6B80', flexWrap:'wrap' }}>
          <span>📅 Deadline: {active.deadline}</span>
          <span>💷 Value: {active.value}</span>
          {active.location && <span>📍 {active.location}</span>}
          {active.fromUpload && <span style={{ color:'#9CA3AF' }}>📄 Uploaded document</span>}
          {active.fromApi && <span style={{ color:'#9CA3AF' }}>🔗 From Contracts Finder</span>}
        </div>
      </div>

      <div className="grid-3c" style={{ marginBottom:16 }}>
        {/* Opportunity summary */}
        <div className="card">
          <div className="card-header"><div className="card-title">Opportunity summary</div></div>
          <p style={{ fontSize:13, color:'#4B5563', lineHeight:1.6, marginBottom:14 }}>{active.summary}</p>
          {(active.extractedRequirements || []).length > 0 && (
            <>
              <div style={{ fontSize:12, fontWeight:600, color:'#1A1A2E', marginBottom:8 }}>Key requirements</div>
              {(active.extractedRequirements || []).map(r => (
                <span key={r} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, padding:'3px 8px', borderRadius:6, background:'#EEF2FF', color:'#4338CA', fontWeight:500, margin:2 }}>✓ {r}</span>
              ))}
            </>
          )}
        </div>

        {/* Compliance flags */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Compliance flags</div>
            <button className="btn btn-sm" onClick={() => onNavigate('compliance')}>Full check →</button>
          </div>
          {(comp?.results || []).length === 0 ? (
            <div style={{ fontSize:13, color:'#6B6B80', padding:'12px 0' }}>No compliance data yet — run a check.</div>
          ) : (comp?.results || []).slice(0, 8).map(r => (
            <div key={r.id} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid #F0F0F5' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', marginTop:4, flexShrink:0, background: r.status === 'fail' ? '#EF4444' : r.status === 'risk' ? '#F97316' : '#22C55E' }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'#1A1A2E' }}>{r.label}</div>
                {r.message && <div style={{ fontSize:11, color:'#6B6B80', marginTop:1 }}>{r.message?.substring(0, 80)}</div>}
              </div>
              <span style={{ marginLeft:'auto', fontSize:10, fontWeight:600, padding:'2px 6px', borderRadius:4, background: r.status === 'fail' ? '#FEE2E2' : r.status === 'risk' ? '#FEF3C7' : '#DCFCE7', color: r.status === 'fail' ? '#DC2626' : r.status === 'risk' ? '#D97706' : '#15803D', whiteSpace:'nowrap', alignSelf:'flex-start' }}>
                {r.status?.toUpperCase()}
              </span>
            </div>
          ))}
          <button className="btn btn-primary btn-full btn-sm" style={{ marginTop:10 }} onClick={() => onNavigate('compliance')}>
            View full compliance check →
          </button>
        </div>

        {/* Score */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Bid readiness score</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
            <ScoreRing score={fit?.overall} />
            <div style={{ fontSize:13, color:'#4B5563', lineHeight:1.5 }}>
              {!fit ? 'Complete your profile to get a score.' :
               fit?.overall >= 70 ? 'Strong fit — you have a competitive chance.' :
               fit?.overall >= 50 ? 'Moderate fit — address gaps to improve.' :
               'Weak fit — significant gaps need resolving.'}
            </div>
          </div>
          <ScoreBars breakdown={fit?.breakdown} />
          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            <button className="btn btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={() => onNavigate('compliance')}>Compliance check</button>
            <button className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={() => onNavigate('planner')}>Bid plan →</button>
          </div>
        </div>
      </div>

      {/* Evaluation + win tips */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Evaluation criteria</div>
            <div className="card-subtitle">How your bid will be scored</div>
          </div>
          {(active.evaluationCriteria || []).length === 0 ? (
            <div style={{ fontSize:13, color:'#6B6B80' }}>Not extracted — upload the full tender document for detailed criteria.</div>
          ) : (active.evaluationCriteria || []).map(c => (
            <div className="eval-row" key={c.criterion}>
              <span className="eval-label">{c.criterion}</span>
              <div className="eval-track"><div className="eval-fill" style={{ width:`${c.weight}%` }} /></div>
              <span className="eval-pct">{c.weight}%</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Win strategy tips</div>
            <div className="card-subtitle">Based on this tender's scoring</div>
          </div>
          {(active.winTips || []).length === 0 ? (
            <div style={{ fontSize:13, color:'#6B6B80' }}>Upload the full tender document to get specific win tips.</div>
          ) : (active.winTips || []).map((tip, i) => (
            <div className="strategy-item" key={i}>
              <span className="strategy-icon">💡</span>
              <span>{tip}</span>
            </div>
          ))}
          <div style={{ marginTop:16, display:'flex', gap:8 }}>
            <button className="btn btn-sm" style={{ flex:1 }} onClick={() => onNavigate('compliance')}>Compliance check</button>
            <button className="btn btn-primary btn-sm" style={{ flex:1 }} onClick={() => onNavigate('planner')}>Start bid plan →</button>
          </div>
        </div>
      </div>
    </div>
  )
}