import { useApp } from '../context/AppContext'

const NAV = [
  { section: 'Core Engine' },
  { key: 'compliance', icon: '⚡', label: 'Compliance Engine' },
  { section: 'Workspace' },
  { key: 'dashboard',  icon: '▦',  label: 'Dashboard' },
  { key: 'upload',     icon: '↑',  label: 'Upload Tender' },
  { key: 'mytenders',  icon: '📄', label: 'My Tenders' },
  { key: 'analysis',   icon: '◎',  label: 'Analysis' },
  { key: 'planner',    icon: '📝', label: 'Bid Planner' },
  { section: 'Discover' },
  { key: 'opportunities', icon: '⊕', label: 'Opportunities' },
  { key: 'pipeline',      icon: '◧', label: 'Bid Tracker' },
  { section: 'Account' },
  { key: 'profile', icon: '◻', label: 'Company Profile' },
]

export default function Sidebar({ current, onNavigate }) {
  const { company, signOut, uploadedTenders } = useApp()
  const username = company?.companyName || 'My Company'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">B</div>
        <span className="sidebar-logo-text">BidCopilot</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item, i) => {
          if (item.section) {
            return <div key={i} className="sidebar-section-label">{item.section}</div>
          }
          return (
            <button
              key={item.key}
              className={`sidebar-item ${current === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
              {item.key === 'mytenders' && uploadedTenders.length > 0 && (
                <span style={{ marginLeft:'auto', fontSize:10, background:'rgba(255,255,255,.15)', padding:'1px 6px', borderRadius:10 }}>
                  {uploadedTenders.length}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{username.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{username}</div>
            <div className="sidebar-user-role">Free · Early access</div>
          </div>
        </div>
        <button className="sidebar-signout" onClick={signOut}>Sign out</button>
      </div>
    </aside>
  )
}
