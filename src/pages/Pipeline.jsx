import { useApp } from '../context/AppContext'

const STAGES = [
  { key:'saved',     label:'Saved',      color:'#6B6B80' },
  { key:'reviewing', label:'Reviewing',  color:'#4F46E5' },
  { key:'bidding',   label:'Bidding',    color:'#D97706' },
  { key:'submitted', label:'Submitted',  color:'#0891B2' },
  { key:'won',       label:'Won',        color:'#16A34A' },
  { key:'lost',      label:'Lost',       color:'#DC2626' },
]

export default function Pipeline({ onNavigate }) {
  const { pipeline, opportunities, saveToPipeline, setActiveOpportunity } = useApp()

  function getOpp(id){ return opportunities.find(o=>o.id===id) }

  function moveStage(oppId, stage){ saveToPipeline(oppId, stage) }

  const grouped = STAGES.reduce((acc,s)=>{
    acc[s.key] = pipeline.filter(p=>p.stage===s.key)
    return acc
  },{})

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <div>
          <div style={{fontSize:14,fontWeight:600,color:'#1A1A2E'}}>Bid pipeline</div>
          <div style={{fontSize:12,color:'#6B6B80',marginTop:2}}>{pipeline.length} opportunities tracked</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={()=>onNavigate('opportunities')}>+ Add opportunity</button>
      </div>

      {pipeline.length===0?(
        <div className="empty-state">
          <div className="empty-icon">◧</div>
          <div className="empty-title">No bids in your pipeline yet</div>
          <div style={{fontSize:13,color:'#6B6B80',marginBottom:16}}>Go to Opportunities and click "Start bid" to track your progress.</div>
          <button className="btn btn-primary" onClick={()=>onNavigate('opportunities')}>Browse opportunities</button>
        </div>
      ):(
        <div className="pipeline-board">
          {STAGES.map(stage=>(
            <div className="pipeline-col" key={stage.key}>
              <div className="pipeline-col-header">
                <span style={{color:stage.color}}>{stage.label}</span>
                <span style={{background:'#E8E8EE',padding:'1px 6px',borderRadius:10,fontSize:10}}>{grouped[stage.key]?.length||0}</span>
              </div>
              {(grouped[stage.key]||[]).map(item=>{
                const opp=getOpp(item.opportunityId)
                if(!opp) return null
                return (
                  <div className="pipeline-item" key={item.opportunityId} onClick={()=>{setActiveOpportunity(opp);onNavigate('analysis')}}>
                    <div className="pipeline-item-title">{opp.title.split('—')[0].trim()}</div>
                    <div className="pipeline-item-sub">{opp.value} · {opp.daysLeft}d left</div>
                    <div style={{marginTop:6,display:'flex',gap:4,flexWrap:'wrap'}}>
                      {STAGES.filter(s=>s.key!==stage.key).map(s=>(
                        <button key={s.key} className="btn btn-sm" style={{fontSize:10,padding:'2px 6px'}}
                          onClick={e=>{e.stopPropagation();moveStage(item.opportunityId,s.key)}}>
                          → {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
