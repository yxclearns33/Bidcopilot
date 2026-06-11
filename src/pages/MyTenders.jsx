import { useApp } from '../context/AppContext'

export default function MyTenders({ onNavigate }) {
  const { uploadedTenders, deleteUploadedTender, setActiveOpportunity } = useApp()

  function openTender(tender) {
    setActiveOpportunity(tender)
    onNavigate('analysis')
  }

  function confirmDelete(e, tenderId) {
    e.stopPropagation()
    if (window.confirm('Delete this tender? This cannot be undone.')) {
      deleteUploadedTender(tenderId)
    }
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:'#1A1A2E' }}>My uploaded tenders</div>
          <div style={{ fontSize:12, color:'#6B6B80', marginTop:2 }}>{uploadedTenders.length} tender{uploadedTenders.length !== 1 ? 's' : ''} saved</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onNavigate('upload')}>+ Upload new tender</button>
      </div>

      {uploadedTenders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <div className="empty-title">No tenders uploaded yet</div>
          <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16 }}>Upload a tender document to get started with compliance checking and bid generation.</div>
          <button className="btn btn-primary" onClick={() => onNavigate('upload')}>Upload your first tender</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {uploadedTenders.map(tender => (
            <div
              key={tender.id}
              className="card"
              style={{ cursor:'pointer', transition:'border-color .15s', borderColor:'#E8E8EE' }}
              onClick={() => openTender(tender)}
              onMouseEnter={e => e.currentTarget.style.borderColor='#4F46E5'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#E8E8EE'}
            >
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'#1A1A2E', marginBottom:4 }}>{tender.title}</div>
                  <div style={{ fontSize:13, color:'#4F46E5', marginBottom:8, fontWeight:500 }}>{tender.buyer}</div>
                  <div style={{ display:'flex', gap:16, fontSize:12, color:'#6B6B80', flexWrap:'wrap' }}>
                    {tender.deadline && <span>📅 {tender.deadline}</span>}
                    {tender.value && <span>💷 {tender.value}</span>}
                    {tender.location && <span>📍 {tender.location}</span>}
                    {tender.industry && <span className="tag" style={{ textTransform:'capitalize' }}>{tender.industry}</span>}
                  </div>
                </div>

                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={e => { e.stopPropagation(); openTender(tender) }}
                    >
                      View analysis →
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ color:'#DC2626', borderColor:'#FECACA' }}
                      onClick={e => confirmDelete(e, tender.id)}
                    >
                      Delete
                    </button>
                  </div>
                  {tender.uploadedAt && (
                    <div style={{ fontSize:11, color:'#9CA3AF' }}>
                      Uploaded {new Date(tender.uploadedAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements preview */}
              {tender.extractedRequirements?.length > 0 && (
                <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid #F0F0F5' }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'#6B6B80', marginBottom:6 }}>EXTRACTED REQUIREMENTS</div>
                  <div>
                    {tender.extractedRequirements.slice(0, 3).map((r, i) => (
                      <span key={i} style={{ display:'inline-flex', fontSize:11, padding:'2px 8px', borderRadius:6, background:'#EEF2FF', color:'#4338CA', fontWeight:500, margin:2 }}>
                        ✓ {r.length > 60 ? r.substring(0, 60) + '...' : r}
                      </span>
                    ))}
                    {tender.extractedRequirements.length > 3 && (
                      <span style={{ fontSize:11, color:'#9CA3AF', marginLeft:4 }}>+{tender.extractedRequirements.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
