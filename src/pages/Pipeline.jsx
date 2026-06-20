import { useApp } from '../context/AppContext'

const STATUS_OPTIONS = [
  { key: 'reviewing',   label: 'Reviewing',       color: '#4F46E5', bg: '#EEF2FF' },
  { key: 'planning',    label: 'Planning',         color: '#D97706', bg: '#FEF3C7' },
  { key: 'ready',       label: 'Ready to submit',  color: '#0891B2', bg: '#E0F2FE' },
  { key: 'submitted',   label: 'Submitted',        color: '#7C3AED', bg: '#F3E8FF' },
  { key: 'won',         label: 'Won',              color: '#16A34A', bg: '#DCFCE7' },
  { key: 'lost',        label: 'Lost',             color: '#DC2626', bg: '#FEE2E2' },
]

function getStatus(key) {
  return STATUS_OPTIONS.find(s => s.key === key) || STATUS_OPTIONS[0]
}

export default function Pipeline({ onNavigate }) {
  const {
    uploadedTenders, apiTenders, pipeline,
    saveToPipeline, getPipelineStage, setActiveTenderId,
    bidPlanItems,
  } = useApp()

  const allTenders = [
    ...(uploadedTenders || []),
    ...(apiTenders || []).filter(t => !(uploadedTenders || []).find(u => u.id === t.id))
  ]

  // All tenders that are either uploaded or in pipeline
  const trackedTenders = allTenders.filter(t => {
    const inPipeline = (pipeline || []).find(p => p.opportunityId === t.id)
    return t.fromUpload || t.fromApi || inPipeline
  })

  // Auto-add uploaded tenders to pipeline if not already there
  trackedTenders.forEach(t => {
    const existing = (pipeline || []).find(p => p.opportunityId === t.id)
    if (!existing) saveToPipeline(t.id, 'reviewing')
  })

  function getPlanProgress(tenderId) {
    const items = bidPlanItems[tenderId] || {}
    const total = Object.keys(items).length
    const done = Object.values(items).filter(i => i.status === 'done').length
    const inprog = Object.values(items).filter(i => i.status === 'inprogress').length
    return { total, done, inprog }
  }

  function openTender(tenderId, screen = 'analysis') {
    setActiveTenderId(tenderId)
    onNavigate(screen)
  }

  const wonCount = trackedTenders.filter(t => getPipelineStage(t.id) === 'won').length
  const activeCount = trackedTenders.filter(t => !['won','lost'].includes(getPipelineStage(t.id) || 'reviewing')).length
  const submittedCount = trackedTenders.filter(t => getPipelineStage(t.id) === 'submitted').length

  return (
    <div>
      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom:20 }}>
        <div className="stat-card">
          <div className="stat-label">Active bids</div>
          <div className="stat-value">{activeCount}</div>
          <div className="stat-delta">In progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Submitted</div>
          <div className="stat-value" style={{ color:'#7C3AED' }}>{submittedCount}</div>
          <div className="stat-delta neutral">Awaiting result</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Won</div>
          <div className="stat-value" style={{ color:'#16A34A' }}>{wonCount}</div>
          <div className="stat-delta">Contracts awarded</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total tracked</div>
          <div className="stat-value">{trackedTenders.length}</div>
          <div className="stat-delta neutral">Across all stages</div>
        </div>
      </div>

      {trackedTenders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◧</div>
          <div className="empty-title">No bids tracked yet</div>
          <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16 }}>
            Upload a tender to start tracking your bids here. Every tender you upload automatically appears in your Bid Tracker.
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('upload')}>Upload a tender</button>
            <button className="btn" onClick={() => onNavigate('opportunities')}>Browse opportunities</button>
          </div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {trackedTenders.map(tender => {
            const currentStage = getPipelineStage(tender.id) || 'reviewing'
            const status = getStatus(currentStage)
            const fit = tender.fitScore
            const comp = tender.compliance
            const plan = getPlanProgress(tender.id)
            const critCount = comp?.critical || 0
            const score = fit?.overall

            return (
              <div key={tender.id} className="card" style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>

                  {/* Left — tender info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'#1A1A2E', lineHeight:1.3 }}>{tender.title}</div>
                      <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:status.bg, color:status.color, flexShrink:0 }}>
                        {status.label}
                      </span>
                    </div>
                    <div style={{ fontSize:12, color:'#4F46E5', fontWeight:500, marginBottom:6 }}>{tender.buyer}</div>
                    <div style={{ display:'flex', gap:12, fontSize:11, color:'#6B6B80', flexWrap:'wrap', marginBottom:10 }}>
                      {tender.deadline && <span>📅 {tender.deadline}</span>}
                      {tender.value && <span>💷 {tender.value}</span>}
                      {tender.daysLeft != null && (
                        <span style={{ color: tender.daysLeft <= 7 ? '#DC2626' : tender.daysLeft <= 14 ? '#D97706' : '#6B6B80', fontWeight: tender.daysLeft <= 14 ? 600 : 400 }}>
                          ⏰ {tender.daysLeft}d left
                        </span>
                      )}
                    </div>

                    {/* Progress indicators */}
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
                      {score != null && (
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <div style={{ height:4, width:80, background:'#F0F0F5', borderRadius:2, overflow:'hidden' }}>
                            <div style={{ width:`${score}%`, height:'100%', background: score >= 70 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626', borderRadius:2 }} />
                          </div>
                          <span style={{ fontSize:11, fontWeight:600, color: score >= 70 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626' }}>{score}%</span>
                          <span style={{ fontSize:11, color:'#9CA3AF' }}>readiness</span>
                        </div>
                      )}
                      {critCount > 0 && (
                        <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:'#FEE2E2', color:'#DC2626', fontWeight:500 }}>
                          {critCount} critical gap{critCount !== 1 ? 's' : ''}
                        </span>
                      )}
                      {plan.total > 0 && (
                        <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:'#EEF2FF', color:'#4338CA' }}>
                          📝 {plan.done}/{plan.total} tasks done
                          {plan.inprog > 0 && ` · ${plan.inprog} in progress`}
                        </span>
                      )}
                    </div>

                    {/* Move status */}
                    <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                      <span style={{ fontSize:11, color:'#9CA3AF' }}>Move to:</span>
                      {STATUS_OPTIONS.filter(s => s.key !== currentStage).map(s => (
                        <button
                          key={s.key}
                          onClick={() => saveToPipeline(tender.id, s.key)}
                          style={{ fontSize:10, padding:'2px 8px', borderRadius:20, border:`0.5px solid ${s.color}`, background:'transparent', color:s.color, cursor:'pointer', fontFamily:'inherit' }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right — quick actions */}
                  <div style={{ display:'flex', flexDirection:'column', gap:5, flexShrink:0 }}>
                    <button className="btn btn-sm" style={{ fontSize:11 }} onClick={() => openTender(tender.id, 'analysis')}>◎ Analysis</button>
                    <button className="btn btn-sm" style={{ fontSize:11 }} onClick={() => openTender(tender.id, 'compliance')}>⚡ Compliance</button>
                    <button className="btn btn-primary btn-sm" style={{ fontSize:11 }} onClick={() => openTender(tender.id, 'planner')}>📝 Bid plan</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
