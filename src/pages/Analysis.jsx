import { useApp } from '../context/AppContext'
import { ScoreRing, ScoreBars } from '../components/ScoreRing'

export default function Analysis({ onNavigate }) {
  const { activeOpportunity: opp, opportunities } = useApp()
  const active = opp || opportunities[0]
  if (!active) return <div className="empty-state"><div className="empty-icon">◎</div><div className="empty-title">No tender analysed yet</div><button className="btn btn-primary" onClick={()=>onNavigate('upload')}>Upload a tender</button></div>

  const fit = active.fitScore
  const comp = active.compliance

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:'#1A1A2E',marginBottom:4}}>{active.title}</div>
          <div style={{fontSize:13,color:'#4F46E5',marginBottom:6,fontWeight:500}}>{active.buyer}</div>
          <div style={{display:'flex',gap:20,fontSize:12,color:'#6B6B80',flexWrap:'wrap'}}>
            <span>📅 Deadline: {active.deadline}</span>
            <span>💷 Value: {active.value}</span>
            <span>📍 {active.location}</span>
            <span>📋 Source: {active.source}</span>
          </div>
        </div>
        <button className="btn btn-sm">↓ Download report</button>
      </div>

      <div className="grid-3c" style={{marginBottom:16}}>
        {/* Opportunity summary */}
        <div className="card">
          <div className="card-header"><div className="card-title">Opportunity summary</div></div>
          <p style={{fontSize:13,color:'#4B5563',lineHeight:1.6,marginBottom:14}}>{active.summary}</p>
          <div style={{fontSize:12,fontWeight:600,color:'#1A1A2E',marginBottom:8}}>Key requirements</div>
          {(active.extractedRequirements||[]).map(r=>(
            <span key={r} style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,padding:'3px 8px',borderRadius:6,background:'#EEF2FF',color:'#4338CA',fontWeight:500,margin:2}}>✓ {r}</span>
          ))}
        </div>

        {/* Risk flags */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Compliance flags</div>
            <button className="btn btn-sm" onClick={()=>onNavigate('compliance')}>Full engine →</button>
          </div>
          {(comp?.results||[]).map(r=>(
            <div key={r.id} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:'1px solid #F0F0F5'}}>
              <div style={{width:8,height:8,borderRadius:'50%',marginTop:4,flexShrink:0,background:r.status==='fail'?'#EF4444':r.status==='risk'?'#F97316':'#22C55E'}}/>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:'#1A1A2E'}}>{r.label}</div>
                {r.message&&<div style={{fontSize:11,color:'#6B6B80',marginTop:1}}>{r.message}</div>}
              </div>
              <span style={{marginLeft:'auto',fontSize:10,fontWeight:600,padding:'2px 6px',borderRadius:4,background:r.status==='fail'?'#FEE2E2':r.status==='risk'?'#FEF3C7':'#DCFCE7',color:r.status==='fail'?'#DC2626':r.status==='risk'?'#D97706':'#15803D',whiteSpace:'nowrap',alignSelf:'flex-start'}}>
                {r.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Score */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Bid readiness score</div>
            <span style={{fontSize:11,color:'#4F46E5',cursor:'pointer'}}>How calculated?</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
            <ScoreRing score={fit?.overall} />
            <div style={{fontSize:13,color:'#4B5563',lineHeight:1.5}}>
              {fit?.overall >= 70 ? 'Strong fit — you have a competitive chance.' : fit?.overall >= 50 ? 'Moderate fit — address gaps to improve your chances.' : 'Weak fit — significant gaps need resolving first.'}
            </div>
          </div>
          <ScoreBars breakdown={fit?.breakdown} />
          <div style={{display:'flex',gap:8,marginTop:14}}>
            <button className="btn btn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>onNavigate('compliance')}>Fix gaps</button>
            <button className="btn btn-primary btn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>onNavigate('generator')}>Generate bid →</button>
          </div>
        </div>
      </div>

      {/* Evaluation criteria */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Evaluation criteria</div><div className="card-subtitle">How your bid will be scored</div></div>
          {(active.evaluationCriteria||[]).map(c=>(
            <div className="eval-row" key={c.criterion}>
              <span className="eval-label">{c.criterion}</span>
              <div className="eval-track"><div className="eval-fill" style={{width:`${c.weight}%`}}/></div>
              <span className="eval-pct">{c.weight}%</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Win strategy tips</div><div className="card-subtitle">Based on this tender's scoring</div></div>
          {(active.winTips||[]).map((tip,i)=>(
            <div className="strategy-item" key={i}>
              <span className="strategy-icon">💡</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
