import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ScoreRing, ScoreBars } from '../components/ScoreRing'

export default function ComplianceEngine({ onNavigate }) {
  const { activeOpportunity, opportunities } = useApp()
  const opp = activeOpportunity || opportunities[0]
  const [expandedFix, setExpandedFix] = useState(null)
  const [resolved, setResolved] = useState([])
  const [selectedOpp, setSelectedOpp] = useState(opp?.id || opportunities[0]?.id)

  const currentOpp = opportunities.find(o=>o.id===selectedOpp) || opportunities[0]
  const comp = currentOpp?.compliance
  const fit = currentOpp?.fitScore

  if (!currentOpp) return <div className="empty-state"><div className="empty-icon">⚡</div><div className="empty-title">No tender loaded</div><button className="btn btn-primary" onClick={()=>onNavigate('upload')}>Upload a tender</button></div>

  const activeResults = (comp?.results||[]).filter(r=>r.status!=='pass'&&!resolved.includes(r.id))
  const passedResults = (comp?.results||[]).filter(r=>r.status==='pass'||resolved.includes(r.id))
  const verdict = resolved.length>0&&activeResults.filter(r=>r.severity==='critical').length===0?'caution':comp?.verdict

  return (
    <div>
      {/* Tender selector */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap'}}>
        <span style={{fontSize:12,color:'#6B6B80',fontWeight:500}}>Checking compliance for:</span>
        <select value={selectedOpp} onChange={e=>setSelectedOpp(e.target.value)} style={{width:'auto',fontSize:13}}>
          {opportunities.map(o=><option key={o.id} value={o.id}>{o.title.substring(0,60)}</option>)}
        </select>
        <button className="btn btn-sm" onClick={()=>onNavigate('upload')}>+ Upload new tender</button>
      </div>

      {/* Hero banner */}
      <div className="compliance-hero">
        <div className="compliance-hero-left">
          <div className="compliance-hero-title">Bid Risk & Compliance Engine</div>
          <div className="compliance-hero-sub">{currentOpp.title}</div>
          <div style={{display:'flex',gap:16,marginTop:10,flexWrap:'wrap'}}>
            <span style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>📅 Deadline: {currentOpp.deadline} · {currentOpp.daysLeft} days</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>💷 {currentOpp.value}</span>
          </div>
        </div>
        <div className="compliance-verdict">
          <div className="verdict-label">Disqualification risk</div>
          <div className={`verdict-status ${verdict}`}>
            {verdict==='at-risk'?'✗ At risk':verdict==='caution'?'⚠ Caution':'✓ Clear'}
          </div>
          <div style={{fontSize:11,color:'rgba(255,255,255,.5)',marginTop:4}}>
            {activeResults.filter(r=>r.severity==='critical').length} critical · {activeResults.filter(r=>r.severity==='high').length} high
          </div>
        </div>
      </div>

      <div className="grid-2" style={{alignItems:'start'}}>
        {/* Left — gaps */}
        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:'#1A1A2E'}}>Disqualification risks</div>
              <div style={{fontSize:12,color:'#6B6B80',marginTop:2}}>{activeResults.length} issues require attention</div>
            </div>
          </div>

          {activeResults.length===0&&(
            <div style={{textAlign:'center',padding:'32px 0',color:'#6B6B80'}}>
              <div style={{fontSize:32,marginBottom:8}}>✓</div>
              <div style={{fontSize:14,fontWeight:600,color:'#15803D'}}>No compliance gaps detected</div>
              <div style={{fontSize:13,marginTop:4}}>You're clear to proceed with this tender.</div>
            </div>
          )}

          {activeResults.map(r=>(
            <div key={r.id} className={`risk-card ${r.severity==='critical'?'critical':r.severity==='high'?'high':'medium'}`}>
              <div className="risk-card-header">
                <div className="risk-card-title">{r.label}</div>
                <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:4,background:r.severity==='critical'?'#FEE2E2':r.severity==='high'?'#FFEDD5':'#FEF9C3',color:r.severity==='critical'?'#991B1B':r.severity==='high'?'#9A3412':'#854D0E'}}>
                  {r.severity.toUpperCase()}
                </span>
              </div>
              <div className="risk-card-body">{r.message}</div>

              {/* Impact bar */}
              <div style={{marginTop:10,padding:'8px 10px',background:'rgba(0,0,0,.04)',borderRadius:6}}>
                <div style={{fontSize:11,fontWeight:600,color:'#374151',marginBottom:4}}>Impact of failure</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{flex:1,height:4,background:'#F3F4F6',borderRadius:2}}>
                    <div style={{width:`${r.impact}%`,height:'100%',background:r.severity==='critical'?'#EF4444':r.severity==='high'?'#F97316':'#EAB308',borderRadius:2}}/>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,color:r.severity==='critical'?'#DC2626':r.severity==='high'?'#C2410C':'#A16207',minWidth:36}}>{r.impact}%</span>
                </div>
                <div style={{fontSize:11,color:'#6B6B80',marginTop:4}}>
                  {r.impact>=80?'Automatic disqualification likely':r.impact>=60?'Significant score penalty':'Minor score reduction'}
                </div>
              </div>

              <div style={{marginTop:10}}>
                <button className="btn btn-sm" style={{fontSize:11}} onClick={()=>setExpandedFix(expandedFix===r.id?null:r.id)}>
                  {expandedFix===r.id?'▲ Hide fix':'▼ How to fix this'}
                </button>
                {expandedFix===r.id&&(
                  <div style={{marginTop:8,fontSize:12,color:'#374151',lineHeight:1.6,padding:'8px 10px',background:'#F9FAFB',borderRadius:6}}>{r.fix}</div>
                )}
              </div>
              <div style={{display:'flex',gap:6,marginTop:10}}>
                <button className="btn btn-primary btn-sm" style={{fontSize:11}}>Fix with AI</button>
                <button className="btn btn-sm" style={{fontSize:11}} onClick={()=>setResolved(d=>[...d,r.id])}>✓ Mark resolved</button>
              </div>
            </div>
          ))}

          {passedResults.length>0&&(
            <div style={{marginTop:12}}>
              <div style={{fontSize:12,fontWeight:600,color:'#6B6B80',marginBottom:8}}>✓ {passedResults.length} requirements passed</div>
              {passedResults.map(r=>(
                <div key={r.id} className="risk-card pass">
                  <div className="risk-card-header">
                    <div className="risk-card-title">✓ {r.label}</div>
                    <span style={{fontSize:10,fontWeight:600,padding:'2px 8px',borderRadius:4,background:'#DCFCE7',color:'#15803D'}}>PASS</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — score + requirements */}
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-header">
              <div className="card-title">Bid readiness score</div>
              <span className={`badge ${fit?.overall>=70?'badge-green':fit?.overall>=50?'badge-amber':'badge-red'}`}>{fit?.overall ?? '—'}%</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
              <ScoreRing score={fit?.overall} />
              <div style={{fontSize:13,color:'#4B5563',lineHeight:1.5}}>
                {activeResults.filter(r=>r.severity==='critical').length>0
                  ? `${activeResults.filter(r=>r.severity==='critical').length} critical gaps will cause automatic disqualification before scoring begins.`
                  : fit?.overall>=70 ? 'Strong position. Address remaining issues to maximise your score.'
                  : 'Moderate readiness. Fix the highlighted gaps to improve significantly.'}
              </div>
            </div>
            <ScoreBars breakdown={fit?.breakdown} />
            <div style={{display:'flex',gap:8,marginTop:14}}>
              <button className="btn btn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>onNavigate('improvement')}>View improvement path</button>
              <button className="btn btn-primary btn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>onNavigate('generator')}>Generate bid pack →</button>
            </div>
          </div>

          {/* Requirements checklist */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Tender requirements</div>
              <span className="badge badge-gray">{passedResults.length}/{comp?.total||0} met</span>
            </div>
            {(comp?.results||[]).map(r=>(
              <div className="row-item" key={r.id}>
                <span style={{fontSize:13,color:'#374151'}}>{r.label}</span>
                <span className={`badge ${r.status==='pass'||resolved.includes(r.id)?'badge-green':r.status==='risk'?'badge-amber':'badge-red'}`}>
                  {r.status==='pass'||resolved.includes(r.id)?'✓ Pass':r.status==='risk'?'⚠ Risk':'✗ Fail'}
                </span>
              </div>
            ))}
            <div style={{marginTop:14,padding:12,background:'#F9FAFB',borderRadius:8}}>
              <div style={{fontSize:12,fontWeight:600,color:'#1A1A2E',marginBottom:4}}>Need help?</div>
              <div style={{fontSize:12,color:'#6B6B80',marginBottom:8}}>AI can draft templates for missing documents or guide you to the right sources.</div>
              <button className="btn btn-primary btn-full btn-sm">Fix all gaps automatically</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
