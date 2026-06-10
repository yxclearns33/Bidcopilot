import { useApp } from '../context/AppContext'

export default function Topbar({ title, onNewTender }) {
  const { company } = useApp()
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        <span style={{fontSize:12,color:'#6B6B80'}}>Welcome, {company?.companyName || 'there'}</span>
        <button className="btn btn-sm" style={{color:'#6B6B80'}}>⚙ Settings</button>
        <button className="btn btn-primary btn-sm" onClick={onNewTender}>+ New Tender</button>
      </div>
    </div>
  )
}
