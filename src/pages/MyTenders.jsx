import { useApp } from '../context/AppContext'

export default function MyTenders({ onNavigate }) {
  const { uploadedTenders, deleteUploadedTender, setActiveTenderId, bidPlanItems } = useApp()

  function openTender(tender, screen = 'analysis') {
    setActiveTenderId(tender.id)
    onNavigate(screen)
  }

  function confirmDelete(e, tenderId) {
    e.stopPropagation()
    if (window.confirm('Delete this tender? This cannot be undone.')) {
      deleteUploadedTender(tenderId)
    }
  }

  function getPlanProgress(tenderId) {
    const items = bidPlanItems[tenderId] || {}
    const total = Object.keys(items).length
    const done = Object.values(items).filter(i => i.status === 'done').length
    return { total, done }
  }

  function getVerdictColor(verdict) {
    if (verdict === 'at-risk') return { bg:'#FEE2E2', color:'#DC2626', label:'✗ At risk' }
    if (verdict === 'caution') return { bg:'#FEF3C7', color:'#D97706', label:'⚠ Caution' }
    return { bg:'#DCFCE7', color:'#15803D', label:'✓ Clear' }
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:'#1A1A2E' }}>My Tenders</div>
          <div style={{ fontSize:12, color:'#6B6B80', marginTop:2 }}>
            {uploadedTenders.length} tender{uploadedTenders.length !== 1 ? 's' : ''} uploaded or added
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onNavigate('upload')}>+ Upload tender</button>
      </div>

      {uploadedTenders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <div className="empty-title">No tenders yet</div>
          <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16 }}>
            Upload a tender PDF or DOCX to get a compliance check and bid readiness score.
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('upload')}>Upload your first tender</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {uploadedTenders.map(tender => {
            const fit = tender.fitScore
            const comp = tender.compliance
            const verdict = comp?.verdict
            const verdictStyle = verdict ? getVerdictColor(verdict) : null
            const critCount = comp?.critical || 0
            const highCount = comp?.high || 0
            const plan = getPlanProgress(tender.id)
            const score = fit?.overall

            return (
              <div key={tender.id} className="card" style={{ padding:'14px 16px' }}>
                {/* Header row */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:10 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'#1A1A2E', marginBottom:2, lineHeight:1.3 }}>{tender.title}</div>
                    <div style={{ fontSize:12, color:'#4F46E5', fontWeight:500, marginBottom:6 }}>{tender.buyer}</div>
                    <div style={{ display:'flex', gap:12, fontSize:11, color:'#6B6B80', flexWrap:'wrap' }}>
                      {tender.deadline && <span>📅 {tender.deadline}</span>}
                      {tender.value && <span>💷 {tender.value}</span>}
                      {tender.location && <span>📍 {tender.location}</span>}
                      {tender.industry && <span style={{ textTransform:'capitalize' }}>🏷 {tender.industry}</span>}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign:'center', flexShrink:0 }}>
                    <div style={{ fontSize:28, fontWeight:800, color: score >= 70 ? '#16A34A' : score >= 50 ? '#D97706' : score ? '#DC2626' : '#9CA3AF', letterSpacing:'-1px', lineHeight:1 }}>
                      {score ?? '—'}
                    </div>
                    <div style={{ fontSize:10, color:'#9CA3AF', marginTop:2 }}>readiness</div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
                  {verdictStyle && (
                    <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:verdictStyle.bg, color:verdictStyle.color }}>
                      {verdictStyle.label}
                    </span>
                  )}
                  {critCount > 0 && (
                    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'#FEE2E2', color:'#DC2626', fontWeight:500 }}>
                      {critCount} critical gap{critCount !== 1 ? 's' : ''}
                    </span>
                  )}
                  {highCount > 0 && (
                    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'#FEF3C7', color:'#D97706', fontWeight:500 }}>
                      {highCount} high
                    </span>
                  )}
                  {plan.total > 0 && (
                    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'#EEF2FF', color:'#4338CA', fontWeight:500 }}>
                      📝 {plan.done}/{plan.total} plan tasks done
                    </span>
                  )}
                  {tender.daysLeft != null && tender.daysLeft <= 14 && (
                    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background: tender.daysLeft <= 7 ? '#FEE2E2' : '#FEF3C7', color: tender.daysLeft <= 7 ? '#DC2626' : '#D97706', fontWeight:500 }}>
                      ⏰ {tender.daysLeft}d left
                    </span>
                  )}
                </div>

                {/* Score bar */}
                {score != null && (
                  <div style={{ marginBottom:12 }}>
                    <div style={{ height:4, background:'#F0F0F5', borderRadius:2, overflow:'hidden' }}>
                      <div style={{ width:`${score}%`, height:'100%', background: score >= 70 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626', borderRadius:2, transition:'width .4s' }} />
                    </div>
                  </div>
                )}

                {/* Quick action buttons */}
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  <button
                    className="btn btn-sm"
                    onClick={() => openTender(tender, 'analysis')}
                  >
                    ◎ Analysis
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => openTender(tender, 'compliance')}
                  >
                    ⚡ Compliance
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openTender(tender, 'planner')}
                  >
                    📝 Bid plan
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ marginLeft:'auto', color:'#DC2626', borderColor:'#FECACA' }}
                    onClick={e => confirmDelete(e, tender.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
