import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Opportunities({ onNavigate }) {
  const { opportunities, saveToPipeline, getPipelineStage, setActiveOpportunity } = useApp()
  const [sector, setSector] = useState('')
  const [sortBy, setSortBy] = useState('fit')
  const [urgentOnly, setUrgentOnly] = useState(false)

  let filtered = opportunities.filter(o=>!sector||o.industry===sector)
  if (urgentOnly) filtered = filtered.filter(o=>o.daysLeft<=14)
  filtered = [...filtered].sort((a,b)=>{
    if (sortBy==='fit') return (b.fitScore?.overall||0)-(a.fitScore?.overall||0)
    if (sortBy==='value') return b.valueNum-a.valueNum
    if (sortBy==='deadline') return a.daysLeft-b.daysLeft
    return 0
  })

  function handleAnalyse(opp) {
    setActiveOpportunity(opp)
    saveToPipeline(opp.id,'reviewing')
    onNavigate('analysis')
  }

  function handleBid(opp) {
    setActiveOpportunity(opp)
    saveToPipeline(opp.id,'bidding')
    onNavigate('generator')
  }

  return (
    <div>
      {/* Filters */}
      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
        <select value={sector} onChange={e=>setSector(e.target.value)} style={{width:'auto'}}>
          <option value="">All sectors</option>
          <option value="cleaning">Cleaning</option>
          <option value="security">Security</option>
          <option value="construction">Construction</option>
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:'auto'}}>
          <option value="fit">Best match first</option>
          <option value="value">Highest value first</option>
          <option value="deadline">Closing soonest</option>
        </select>
        <label style={{display:'flex',alignItems:'center',gap:6,fontSize:13,cursor:'pointer',color:'#4B5563'}}>
          <input type="checkbox" checked={urgentOnly} onChange={e=>setUrgentOnly(e.target.checked)} />
          Urgent only (≤14 days)
        </label>
        <span style={{fontSize:12,color:'#6B6B80',marginLeft:4}}>{filtered.length} opportunities</span>
      </div>

      <div className="opp-grid">
        {filtered.map(o=>{
          const fit = o.fitScore?.overall
          const stage = getPipelineStage(o.id)
          const isTop = fit>=75
          return (
            <div key={o.id} className={`opp-card ${isTop?'top-match':''}`}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div className="opp-value">{o.value}</div>
                <div style={{display:'flex',gap:4,flexDirection:'column',alignItems:'flex-end'}}>
                  {fit!=null&&<span className={`badge ${fit>=70?'badge-green':fit>=50?'badge-amber':'badge-red'}`}>{fit}% fit</span>}
                  {stage&&<span className="badge badge-indigo">{stage}</span>}
                </div>
              </div>
              <div className="opp-name">{o.title.split('—')[0].trim()}</div>
              <div className="opp-org">{o.buyer}</div>
              <div style={{display:'flex',flexWrap:'wrap'}}>
                <span className="tag">{o.industry}</span>
                <span className="tag">📍 {o.location}</span>
                <span className="tag">📋 {o.source}</span>
              </div>

              {/* Compliance summary */}
              {o.compliance&&(
                <div style={{fontSize:11,padding:'6px 10px',borderRadius:6,background:o.compliance.verdict==='at-risk'?'#FEF2F2':o.compliance.verdict==='caution'?'#FFFBEB':'#F0FDF4',color:o.compliance.verdict==='at-risk'?'#DC2626':o.compliance.verdict==='caution'?'#D97706':'#15803D',fontWeight:500}}>
                  {o.compliance.verdict==='at-risk'?`⚡ ${o.compliance.critical} critical compliance gap${o.compliance.critical>1?'s':''}`
                    :o.compliance.verdict==='caution'?`⚠ ${o.compliance.high} compliance risk${o.compliance.high>1?'s':''}`
                    :'✓ Compliance clear'}
                </div>
              )}

              <div className="opp-footer">
                <span className="opp-deadline" style={{color:o.daysLeft<=7?'#DC2626':o.daysLeft<=14?'#D97706':'#9CA3AF'}}>
                  📅 {o.deadline} · {o.daysLeft}d left
                </span>
              </div>
              <div style={{display:'flex',gap:6,marginTop:4}}>
                <button className="btn btn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>handleAnalyse(o)}>Analyse</button>
                <button className="btn btn-primary btn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>handleBid(o)}>Start bid →</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
