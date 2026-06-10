import { useApp } from '../context/AppContext'

export default function Sidebar({ current, onNavigate }) {
  const { opportunities, pipeline } = useApp()
  const criticalCount = opportunities.reduce((acc, o) => acc + (o.compliance?.critical || 0), 0)
  const pipelineActive = pipeline.filter(p => !['won','lost'].includes(p.stage)).length

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">B</div>
        <span className="sidebar-logo-text">BidCopilot</span>
      </div>

      <div className="sidebar-nav">
        <div className="sidebar-section-label">Core Engine</div>
        <button className={`nav-item hero ${current==='compliance'?'active':''}`} onClick={()=>onNavigate('compliance')}>
          ⚡ Compliance Engine
          {criticalCount > 0 && <span className="nav-badge">{criticalCount}</span>}
        </button>

        <div className="sidebar-section-label" style={{marginTop:8}}>Workspace</div>
        {[
          ['dashboard',     '▦', 'Dashboard'],
          ['upload',        '↑', 'Upload Tender'],
          ['analysis',      '◎', 'Analysis'],
          ['generator',     '≡', 'Bid Generator'],
          ['improvement',   '↗', 'Improvement'],
        ].map(([key,icon,label])=>(
          <button key={key} className={`nav-item ${current===key?'active':''}`} onClick={()=>onNavigate(key)}>
            <span style={{width:18,textAlign:'center',flexShrink:0}}>{icon}</span>{label}
          </button>
        ))}

        <div className="sidebar-section-label" style={{marginTop:8}}>Discover</div>
        {[
          ['opportunities', '⊕', 'Opportunities'],
          ['pipeline',      '◧', 'My Pipeline', pipelineActive],
        ].map(([key,icon,label,badge])=>(
          <button key={key} className={`nav-item ${current===key?'active':''}`} onClick={()=>onNavigate(key)}>
            <span style={{width:18,textAlign:'center',flexShrink:0}}>{icon}</span>{label}
            {badge > 0 && <span className="nav-badge amber">{badge}</span>}
          </button>
        ))}

        <div className="sidebar-section-label" style={{marginTop:8}}>Account</div>
        <button className={`nav-item ${current==='profile'?'active':''}`} onClick={()=>onNavigate('profile')}>
          <span style={{width:18,textAlign:'center',flexShrink:0}}>◻</span> Company Profile
        </button>
      </div>

      <div className="sidebar-footer">
        <button className="nav-item" style={{color:'rgba(255,255,255,.4)'}}>
          <span style={{width:18,textAlign:'center'}}>→</span> Logout
        </button>
      </div>
    </div>
  )
}
