import { useApp } from '../context/AppContext'

export default function BidImprovement({ onNavigate }) {
  const { opportunities, company } = useApp()
  const avgScore = Math.round(opportunities.reduce((s,o)=>s+(o.fitScore?.overall||0),0)/(opportunities.length||1))
  const history = [42,48,54,59,63,avgScore]
  const months = ['Jan','Feb','Mar','Apr','May','Jun']

  const W=360,H=140,PAD={t:8,r:30,b:20,l:28}
  const cW=W-PAD.l-PAD.r, cH=H-PAD.t-PAD.b
  const pts = history.map((s,i)=>({
    x:PAD.l+(i/(history.length-1))*cW,
    y:PAD.t+(1-s/100)*cH, s, m:months[i]
  }))
  const polyline = pts.map(p=>`${p.x},${p.y}`).join(' ')

  const topOpp = [...opportunities].sort((a,b)=>(b.fitScore?.overall||0)-(a.fitScore?.overall||0))[0]
  const gaps = (topOpp?.compliance?.results||[]).filter(r=>r.status!=='pass')
  const winProbability = Math.min(95, Math.round(avgScore * 0.8 + (gaps.length===0?15:0)))

  const improvements = [
    { label:'Complete compliance profile',      delta:'+12%', done:company?.compliance?.publicLiability },
    { label:'Add 2+ past contracts',            delta:'+8%',  done:(company?.experience||[]).length>=2 },
    { label:'Add Health & Safety policy',       delta:'+6%',  done:company?.compliance?.healthSafety },
    { label:'Add client references',            delta:'+4%',  done:(company?.references||[]).length>0 },
    { label:'Complete COSHH compliance',        delta:'+5%',  done:company?.compliance?.coshh },
  ]

  return (
    <div className="grid-2" style={{alignItems:'start'}}>
      <div>
        <div className="card" style={{marginBottom:16}}>
          <div className="card-header">
            <div className="card-title">Your bid readiness</div>
            <span className={`badge ${avgScore>=70?'badge-green':avgScore>=50?'badge-amber':'badge-red'}`}>{avgScore}% avg</span>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:24,margin:'20px 0'}}>
            <div className="score-circle prev">
              <div className="score-circle-num">{history[0]}%</div>
              <div className="score-circle-lbl">start</div>
            </div>
            <span style={{fontSize:24,color:'#4F46E5'}}>→</span>
            <div className="score-circle curr">
              <div className="score-circle-num">{avgScore}%</div>
              <div className="score-circle-lbl">current</div>
            </div>
          </div>
          <div style={{fontSize:13,fontWeight:600,color:'#1A1A2E',marginBottom:10}}>Improvement actions</div>
          {improvements.map(item=>(
            <div key={item.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #F0F0F5',fontSize:13}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:14,color:item.done?'#16A34A':'#E0E0EA'}}>{item.done?'✓':'○'}</span>
                <span style={{color:item.done?'#6B6B80':'#1A1A2E',textDecoration:item.done?'line-through':'none'}}>{item.label}</span>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:item.done?'#9CA3AF':'#16A34A'}}>{item.delta}</span>
            </div>
          ))}
          <button className="btn btn-primary btn-full btn-sm" style={{marginTop:14}} onClick={()=>onNavigate('compliance')}>View remaining gaps →</button>
        </div>

        {/* Win probability */}
        <div className="card" style={{background:'linear-gradient(135deg,#1E1B4B,#312E81)',border:'none'}}>
          <div style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.6)',marginBottom:8,textTransform:'uppercase',letterSpacing:'.05em'}}>Estimated win probability</div>
          <div style={{fontSize:40,fontWeight:700,color:'#fff',marginBottom:8}}>{winProbability}%</div>
          <div style={{height:6,background:'rgba(255,255,255,.2)',borderRadius:3,marginBottom:12}}>
            <div style={{width:`${winProbability}%`,height:'100%',background:'#818CF8',borderRadius:3}}/>
          </div>
          <div style={{fontSize:12,color:'rgba(255,255,255,.65)',lineHeight:1.5}}>
            Based on your readiness score and compliance profile. Fix critical gaps to push above 70%.
          </div>
        </div>
      </div>

      <div>
        <div className="card" style={{marginBottom:16}}>
          <div className="card-header">
            <div className="card-title">Score history</div>
            <div className="card-subtitle">6-month trend</div>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%">
            {[0,25,50,75,100].map(v=>{
              const y=PAD.t+(1-v/100)*cH
              return <g key={v}>
                <line x1={PAD.l} y1={y} x2={W-PAD.r} y2={y} stroke="#F0F0F5" strokeWidth="1"/>
                <text x={PAD.l-4} y={y+4} fontSize="9" fill="#9CA3AF" textAnchor="end">{v}%</text>
              </g>
            })}
            <path d={`M${pts[0].x},${PAD.t+cH} ${pts.map(p=>`L${p.x},${p.y}`).join(' ')} L${pts[pts.length-1].x},${PAD.t+cH}Z`} fill="#EEF2FF" opacity=".7"/>
            <polyline points={polyline} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {pts.map((p,i)=>(
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={i===pts.length-1?5:3.5} fill="#4F46E5" stroke="#fff" strokeWidth="2"/>
                <text x={p.x} y={H-4} fontSize="9" fill="#9CA3AF" textAnchor="middle">{p.m}</text>
                {i===pts.length-1&&<text x={p.x} y={p.y-10} fontSize="10" fill="#4F46E5" fontWeight="700" textAnchor="middle">{p.s}%</text>}
              </g>
            ))}
          </svg>
          <div style={{fontSize:12,color:'#6B6B80',marginTop:8}}>
            Readiness improved <strong style={{color:'#16A34A'}}>+{avgScore-history[0]}%</strong> since onboarding.
          </div>
        </div>

        {/* Per-opportunity scores */}
        <div className="card">
          <div className="card-header"><div className="card-title">Fit scores by opportunity</div></div>
          {opportunities.map(o=>(
            <div className="row-item" key={o.id}>
              <div className="row-item-left">
                <div className="row-item-title">{o.title.split('—')[0].trim()}</div>
                <div className="row-item-sub">{o.value} · {o.daysLeft}d left</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:80,height:6,background:'#F0F0F5',borderRadius:3,overflow:'hidden'}}>
                  <div style={{width:`${o.fitScore?.overall||0}%`,height:'100%',background:o.fitScore?.overall>=70?'#4F46E5':o.fitScore?.overall>=50?'#F97316':'#EF4444',borderRadius:3}}/>
                </div>
                <span style={{fontSize:12,fontWeight:600,color:'#1A1A2E',minWidth:32}}>{o.fitScore?.overall??'—'}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
