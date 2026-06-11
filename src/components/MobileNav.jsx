import { useApp } from '../context/AppContext'

const NAV_ITEMS = [
  { key:'dashboard',    icon:'▦',  label:'Home' },
  { key:'compliance',   icon:'⚡', label:'Compliance' },
  { key:'upload',       icon:'↑',  label:'Upload' },
  { key:'opportunities',icon:'⊕',  label:'Discover' },
  { key:'profile',      icon:'◻',  label:'Profile' },
]

export default function MobileNav({ current, onNavigate }) {
  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <div className="mobile-logo">
          <div className="mobile-logo-icon">B</div>
          <span className="mobile-logo-text">BidCopilot</span>
        </div>
        <div className="mobile-screen-title">
          {NAV_ITEMS.find(n => n.key === current)?.label || ''}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="mobile-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            className={`mobile-nav-item ${current === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <span className="mobile-nav-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </>
  )
}
