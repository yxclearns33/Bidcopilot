import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ScoreRing, ScoreBars } from '../components/ScoreRing'

export default function ComplianceEngine({ onNavigate }) {
  const {
    uploadedTenders, apiTenders, activeTenderId, setActiveTenderId,
    addToBidPlan, isInBidPlan, isResolved,
  } = useApp()

  const allTenders = [...uploadedTenders, ...apiTenders.filter(t => !uploadedTenders.find(u => u.id === t.id))]
  const tender = allTenders.find(t => t.id === activeTenderId) || allTenders[0]

  const [expandedFix, setExpandedFix] = useState(null)
  const [addedFlash, setAddedFlash] = useState({})

  if (allTenders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⚡</div>
        <div className="empty-title">No tenders loaded</div>
        <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16 }}>Upload a tender to run a compliance check.</div>
        <button className="btn btn-primary" onClick={() => onNavigate('upload')}>Upload a tender</button>
      </div>
    )
  }

  const comp = tender?.compliance
  const fit = tender?.fitScore

  const activeResults = (comp?.results || []).filter(r => r.status !== 'pass' && !isResolved(tender?.id, r.id))
  const passedResults = (comp?.results || []).filter(r => r.status === 'pass' || isResolved(tender?.id, r.id))
  const verdict = comp?.verdict || 'caution'

  function handleAddToPlan(gapId) {
    if (!tender) return
    addToBidPlan(tender.id, gapId)
    setAddedFlash(f => ({ ...f, [gapId]: true }))
    setTimeout(() => setAddedFlash(f => ({ ...f, [gapId]: false })), 2000)
  }

  return (
    <div>
      {/* Tender selector */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, flexWrap:'wrap' }}>
        <span style={{ fontSize:12, color:'#6B6B80', fontWeight:500, flexShrink:0 }}>Checking:</span>
        <select
          value={tender?.id || ''}
          onChange={e => setActiveTenderId(e.target.value)}
          style={{ flex:1, minWidth:200, fontSize:13 }}
        >
          {allTenders.map(t => <option key={t.id} value={t.id}>{t.title?.substring(0,60)}</option>)}
        </select>
        <button className="btn btn-sm" onClick={() => onNavigate('upload')}>+ Upload new tender</button>
      </div>

      {/* Hero banner */}
      <div className="compliance-hero">
        <div className="compliance-hero-left">
          <div className="compliance-hero-title">Bid Risk & Compliance Engine</div>
          <div className="compliance-hero-sub">{tender?.title}</div>
          <div style={{ display:'flex', gap:16, marginTop:10, flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'rgba(255,255,255,.6)' }}>📅 Deadline: {tender?.deadline}</span>
            <span style={{ fontSize:12, color:'rgba(255,255,255,.6)' }}>💷 {tender?.value}</span>
            {tender?.fromUpload && <span style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>📄 Uploaded document</span>}
            {tender?.fromApi && <span style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>🔗 From Contracts Finder</span>}
          </div>
        </div>
        <div className="compliance-verdict">
          <div className="verdict-label">Disqualification risk</div>
          <div className={`verdict-status ${verdict}`}>
            {verdict === 'at-risk' ? '✗ At risk' : verdict === 'caution' ? '⚠ Caution' : '✓ Clear'}
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginTop:4 }}>
            {activeResults.filter(r => r.severity === 'critical').length} critical · {activeResults.filter(r => r.severity === 'high').length} high
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems:'start' }}>
        {/* Left — gaps */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'#1A1A2E' }}>Disqualification risks</div>
              <div style={{ fontSize:12, color:'#6B6B80', marginTop:2 }}>{activeResults.length} issues · add to your Bid Planner to schedule fixes</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('planner')}>
              View bid plan →
            </button>
          </div>

          {activeResults.length === 0 && (
            <div style={{ textAlign:'center', padding:'32px 0', color:'#6B6B80' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>✓</div>
              <div style={{ fontSize:14, fontWeight:600, color:'#15803D' }}>No compliance gaps detected</div>
              <div style={{ fontSize:13, marginTop:4 }}>You are clear to proceed with this tender.</div>
            </div>
          )}

          {activeResults.map(r => {
            const inPlan = isInBidPlan(tender?.id, r.id)
            const justAdded = addedFlash[r.id]
            return (
              <div key={r.id} className={`risk-card ${r.severity === 'critical' ? 'critical' : r.severity === 'high' ? 'high' : 'medium'}`}>
                <div className="risk-card-header">
                  <div className="risk-card-title">{r.label}</div>
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4, background: r.severity === 'critical' ? '#FEE2E2' : r.severity === 'high' ? '#FFEDD5' : '#FEF9C3', color: r.severity === 'critical' ? '#991B1B' : r.severity === 'high' ? '#9A3412' : '#854D0E' }}>
                    {r.severity?.toUpperCase()}
                  </span>
                </div>
                <div className="risk-card-body">{r.message}</div>

                {/* Impact bar */}
                <div style={{ marginTop:10, padding:'8px 10px', background:'rgba(0,0,0,.04)', borderRadius:6 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'#374151', marginBottom:4 }}>Impact of failure</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ flex:1, height:4, background:'#F3F4F6', borderRadius:2 }}>
                      <div style={{ width:`${r.impact}%`, height:'100%', background: r.severity === 'critical' ? '#EF4444' : r.severity === 'high' ? '#F97316' : '#EAB308', borderRadius:2 }} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color: r.severity === 'critical' ? '#DC2626' : r.severity === 'high' ? '#C2410C' : '#A16207', minWidth:36 }}>{r.impact}%</span>
                  </div>
                  <div style={{ fontSize:11, color:'#6B6B80', marginTop:4 }}>
                    {r.impact >= 80 ? 'Automatic disqualification likely' : r.impact >= 60 ? 'Significant score penalty' : 'Minor score reduction'}
                  </div>
                </div>

                {/* How to fix toggle */}
                <div style={{ marginTop:10 }}>
                  <button
                    className="btn btn-sm"
                    style={{ fontSize:11 }}
                    onClick={() => setExpandedFix(expandedFix === r.id ? null : r.id)}
                  >
                    {expandedFix === r.id ? '▲ Hide' : '▼ How to fix this'}
                  </button>
                  {expandedFix === r.id && (
                    <div style={{ marginTop:8, fontSize:12, color:'#374151', lineHeight:1.6, padding:'8px 10px', background:'#F9FAFB', borderRadius:6 }}>{r.fix}</div>
                  )}
                </div>

                {/* Add to bid plan */}
                <div style={{ marginTop:10 }}>
                  <button
                    className={`btn btn-sm ${inPlan ? '' : 'btn-primary'}`}
                    style={{ fontSize:11 }}
                    onClick={() => !inPlan && handleAddToPlan(r.id)}
                    disabled={inPlan}
                  >
                    {justAdded ? '✓ Added!' : inPlan ? '✓ In bid plan' : '+ Add to bid plan'}
                  </button>
                  {inPlan && (
                    <button className="btn btn-sm" style={{ fontSize:11, marginLeft:6 }} onClick={() => onNavigate('planner')}>
                      View plan →
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {/* Passed items */}
          {passedResults.length > 0 && (
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#6B6B80', marginBottom:8 }}>✓ {passedResults.length} requirements passed or resolved</div>
              {passedResults.map(r => (
                <div key={r.id} className="risk-card pass">
                  <div className="risk-card-header">
                    <div className="risk-card-title">✓ {r.label}</div>
                    <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:4, background:'#DCFCE7', color:'#15803D' }}>
                      {isResolved(tender?.id, r.id) ? 'RESOLVED' : 'PASS'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — score + checklist */}
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <div className="card-header">
              <div className="card-title">Bid readiness score</div>
              <span className={`badge ${fit?.overall >= 70 ? 'badge-green' : fit?.overall >= 50 ? 'badge-amber' : 'badge-red'}`}>
                {fit?.overall ?? '—'}%
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
              <ScoreRing score={fit?.overall} />
              <div style={{ fontSize:13, color:'#4B5563', lineHeight:1.5 }}>
                {activeResults.filter(r => r.severity === 'critical').length > 0
                  ? `${activeResults.filter(r => r.severity === 'critical').length} critical gaps will cause automatic disqualification before scoring begins.`
                  : fit?.overall >= 70 ? 'Strong position. Address remaining issues to maximise your score.'
                  : 'Moderate readiness. Fix the highlighted gaps to improve significantly.'}
              </div>
            </div>
            <ScoreBars breakdown={fit?.breakdown} />
            <div style={{ display:'flex', gap:8, marginTop:14 }}>
              <button className="btn btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={() => onNavigate('planner')}>
                View bid plan
              </button>
              <button className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={() => onNavigate('analysis')}>
                View analysis →
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Requirements checklist</div>
              <span className="badge badge-gray">{passedResults.length}/{comp?.total || 0} met</span>
            </div>
            {(comp?.results || []).map(r => (
              <div className="row-item" key={r.id}>
                <span style={{ fontSize:13, color:'#374151' }}>{r.label}</span>
                <span className={`badge ${r.status === 'pass' || isResolved(tender?.id, r.id) ? 'badge-green' : r.status === 'risk' ? 'badge-amber' : 'badge-red'}`}>
                  {r.status === 'pass' || isResolved(tender?.id, r.id) ? '✓ Pass' : r.status === 'risk' ? '⚠ Risk' : '✗ Fail'}
                </span>
              </div>
            ))}
            <div style={{ marginTop:14, padding:12, background:'#F9FAFB', borderRadius:8 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#1A1A2E', marginBottom:4 }}>Add gaps to your Bid Planner</div>
              <div style={{ fontSize:12, color:'#6B6B80', marginBottom:8 }}>Click "+ Add to bid plan" on each gap above to create a scheduled action plan.</div>
              <button className="btn btn-primary btn-full btn-sm" onClick={() => onNavigate('planner')}>Open Bid Planner →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
