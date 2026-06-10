import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { generateBidSections, BID_SECTIONS } from '../engines/bidGeneration'

export default function BidGenerator({ onNavigate }) {
  const { company, activeOpportunity, opportunities } = useApp()
  const opp = activeOpportunity || opportunities[0]
  const [activeKey, setActiveKey] = useState('exec')
  const [loading, setLoading] = useState(false)
  const [improved, setImproved] = useState([])
  const [content, setContent] = useState(() => opp && company ? generateBidSections(opp, company) : {})

  const currentIdx = BID_SECTIONS.findIndex(s=>s.key===activeKey)

  function switchSection(key) {
    setLoading(true); setActiveKey(key)
    setTimeout(()=>setLoading(false), 500)
  }

  function improveSection() {
    setLoading(true)
    setTimeout(()=>{ setLoading(false); setImproved(i=>[...new Set([...i,activeKey])]) }, 1800)
  }

  function regenerateAll() {
    if (opp && company) { setContent(generateBidSections(opp, company)); setImproved([]) }
  }

  if (!opp) return (
    <div className="empty-state"><div className="empty-icon">≡</div>
      <div className="empty-title">No tender loaded</div>
      <div style={{fontSize:13,color:'#6B6B80',marginBottom:16}}>Upload a tender first to generate a personalised bid pack.</div>
      <button className="btn btn-primary" onClick={()=>onNavigate('upload')}>Upload tender</button>
    </div>
  )

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,gap:12,flexWrap:'wrap'}}>
        <div>
          <div style={{fontSize:14,fontWeight:600,color:'#1A1A2E'}}>{opp.title}</div>
          <div style={{fontSize:12,color:'#6B6B80',marginTop:2}}>{opp.buyer} · Deadline: {opp.deadline}</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-sm" onClick={regenerateAll}>↺ Regenerate all</button>
          <button className="btn btn-sm">↓ Download PDF</button>
          <button className="btn btn-sm">↓ Download Word</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:16,alignItems:'start'}}>
        {/* Section nav */}
        <div className="card">
          <div className="card-header" style={{marginBottom:10}}>
            <div className="card-title">Proposal sections</div>
            <span className="badge badge-gray">{improved.length}/{BID_SECTIONS.length}</span>
          </div>
          {BID_SECTIONS.map(s=>(
            <button key={s.key} className={`section-nav-item ${activeKey===s.key?'active':''}`} onClick={()=>switchSection(s.key)}>
              <span style={{fontSize:13,color:improved.includes(s.key)?'#16A34A':'#C7C7D9',minWidth:14}}>
                {improved.includes(s.key)?'✓':'○'}
              </span>
              {s.label}
            </button>
          ))}
          <div style={{marginTop:14,paddingTop:12,borderTop:'1px solid #F0F0F5'}}>
            <div style={{fontSize:11,color:'#6B6B80',marginBottom:8}}>Generated from your profile + tender requirements</div>
            <button className="btn btn-primary btn-full btn-sm">↓ Download full pack</button>
          </div>
        </div>

        {/* Editor */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{BID_SECTIONS.find(s=>s.key===activeKey)?.label}</div>
              <div className="card-subtitle">
                {improved.includes(activeKey)?'AI improved · ':''} Generated from {company?.companyName} profile · Editable
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-sm" onClick={improveSection} disabled={loading}>✦ Improve with AI</button>
              <button className="btn btn-sm">↓ Export</button>
            </div>
          </div>

          {/* Toolbar */}
          <div style={{display:'flex',gap:6,marginBottom:14,paddingBottom:12,borderBottom:'1px solid #F0F0F5',flexWrap:'wrap',alignItems:'center'}}>
            <select style={{width:'auto',fontSize:11,padding:'4px 8px'}}>
              <option>Paragraph</option><option>Bullet list</option><option>Numbered</option>
            </select>
            {['B','I','U'].map(f=>(
              <button key={f} className="btn btn-sm btn-icon" style={{fontSize:12,fontWeight:f==='B'?700:400,fontStyle:f==='I'?'italic':'normal',textDecoration:f==='U'?'underline':'none'}}>{f}</button>
            ))}
            {improved.includes(activeKey)&&<span className="badge badge-green" style={{marginLeft:4}}>✓ AI improved</span>}
            <div style={{marginLeft:'auto',fontSize:11,color:'#9CA3AF'}}>{currentIdx+1} of {BID_SECTIONS.length}</div>
          </div>

          {loading?(
            <div style={{textAlign:'center',padding:'48px 0'}}>
              <div className="spinner" style={{margin:'0 auto 12px'}}/>
              <div style={{fontSize:13,color:'#6B6B80'}}>{improved.includes(activeKey)?'Improving with AI...':'Loading section...'}</div>
            </div>
          ):(
            <div
              className="editable-area"
              contentEditable
              suppressContentEditableWarning
              onBlur={e=>setContent(c=>({...c,[activeKey]:e.target.innerText}))}
            >{content[activeKey]||''}</div>
          )}

          <div style={{display:'flex',justifyContent:'space-between',marginTop:20,paddingTop:14,borderTop:'1px solid #F0F0F5'}}>
            <button className="btn btn-sm" disabled={currentIdx===0} onClick={()=>switchSection(BID_SECTIONS[currentIdx-1]?.key)}>← Previous</button>
            <button className="btn btn-primary btn-sm" disabled={currentIdx===BID_SECTIONS.length-1} onClick={()=>switchSection(BID_SECTIONS[currentIdx+1]?.key)}>Next section →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
