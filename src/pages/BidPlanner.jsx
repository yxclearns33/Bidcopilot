import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { getTaskForGap } from '../data/taskLibrary'
import { getDefaultTasks } from '../data/defaultPlanTasks'

function daysUntil(dateStr) {
  if (!dateStr) return 30
  try {
    const d = new Date(dateStr)
    if (!isNaN(d)) return Math.max(0, Math.floor((d - new Date()) / (1000*60*60*24)))
  } catch {}
  return 30
}

export default function BidPlanner({ onNavigate }) {
  const {
    uploadedTenders, apiTenders, activeTenderId, setActiveTenderId,
    company, bidPlanItems, updateBidPlanItem, removeFromBidPlan,
  } = useApp()

  const allTenders = [
    ...(uploadedTenders || []),
    ...(apiTenders || []).filter(t => !(uploadedTenders || []).find(u => u.id === t.id))
  ]
  const tender = allTenders.find(t => t.id === activeTenderId) || allTenders[0]

  const [expanded, setExpanded] = useState({})
  const [howOpen, setHowOpen] = useState({})
  const [showDone, setShowDone] = useState(false)
  const [taskOrder, setTaskOrder] = useState({})

  // Persist planGenerated in localStorage so it survives navigation
  const planKey = `bidplan_generated_${tender?.id}`
  const isGenerated = tender ? localStorage.getItem(planKey) === 'true' : false

  function generatePlan() {
    if (!tender) return
    localStorage.setItem(planKey, 'true')
    // Force re-render
    setExpanded(e => ({ ...e }))
  }

  function deleteWholePlan() {
    if (!tender) return
    if (!window.confirm('Delete the entire bid plan for this tender? This cannot be undone.')) return
    // Remove all plan items for this tender
    const items = bidPlanItems[tender.id] || {}
    Object.keys(items).forEach(gapId => removeFromBidPlan(tender.id, gapId))
    // Remove generated flag
    localStorage.removeItem(planKey)
    setExpanded({})
    setHowOpen({})
  }
  const allTasks = useMemo(() => {
    if (!tender) return []

    const planItems = bidPlanItems[tender.id] || {}
    const gaps = tender.compliance?.results || []
    const generated = tender ? localStorage.getItem(`bidplan_generated_${tender.id}`) === 'true' : false

    // Compliance gap tasks added from Compliance Engine
    const gapTasks = Object.entries(planItems).map(([gapId, item]) => {
      const gap = gaps.find(g => g.id === gapId)
      const lib = getTaskForGap(gapId, tender)
      if (!lib) return null
      return {
        id: gapId,
        ...lib,
        severity: gap?.severity || 'high',
        status: item.status || 'none',
        addedAt: item.addedAt,
        isFromCompliance: true,
        order: taskOrder[`${tender.id}_${gapId}`] ?? 999,
      }
    }).filter(Boolean)

    // Default tasks — shown when plan is generated or no compliance tasks yet
    const defaultTasks = generated || gapTasks.length === 0
      ? getDefaultTasks(tender, company).map((t, i) => ({
          ...t,
          status: planItems[t.id]?.status || 'none',
          order: taskOrder[`${tender.id}_${t.id}`] ?? i,
        }))
      : []

    // Merge — compliance tasks first, then default tasks
    const merged = [...gapTasks, ...defaultTasks.filter(dt => !gapTasks.find(gt => gt.id === dt.id))]

    return merged.sort((a, b) => {
      const sevOrder = { critical: 0, high: 1, medium: 2, nice: 3 }
      const aOrder = taskOrder[`${tender.id}_${a.id}`] ?? (a.isFromCompliance ? 0 : 10 + (a.order || 0))
      const bOrder = taskOrder[`${tender.id}_${b.id}`] ?? (b.isFromCompliance ? 0 : 10 + (b.order || 0))
      if (aOrder !== bOrder) return aOrder - bOrder
      return (sevOrder[a.severity] ?? 2) - (sevOrder[b.severity] ?? 2)
    })
  }, [tender, bidPlanItems, taskOrder, company])

  const activeTasks = allTasks.filter(t => t.status !== 'done')
  const doneTasks = allTasks.filter(t => t.status === 'done')
  const daysLeft = daysUntil(tender?.deadline)

  function setStatus(gapId, status) {
    if (!tender) return
    updateBidPlanItem(tender.id, gapId, status)
  }

  function handleRemove(taskId, isDefault) {
    if (!tender) return
    if (isDefault) {
      updateBidPlanItem(tender.id, taskId, 'removed')
    } else {
      removeFromBidPlan(tender.id, taskId)
    }
  }

  function moveTask(taskId, dir) {
    const idx = activeTasks.findIndex(t => t.id === taskId)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= activeTasks.length) return
    const newOrder = {}
    activeTasks.forEach((t, i) => { newOrder[`${tender.id}_${t.id}`] = i })
    const aKey = `${tender.id}_${activeTasks[idx].id}`
    const bKey = `${tender.id}_${activeTasks[swapIdx].id}`
    const tmp = newOrder[aKey]
    newOrder[aKey] = newOrder[bKey]
    newOrder[bKey] = tmp
    setTaskOrder(prev => ({ ...prev, ...newOrder }))
  }

  // Group active tasks by week/category
  const weeks = {}
  activeTasks.filter(t => t.status !== 'removed').forEach((task, idx) => {
    const week = task.week || 'General tasks'
    if (!weeks[week]) weeks[week] = { end: task.weekEnd || '', tasks: [] }
    weeks[week].tasks.push({ ...task, idx })
  })

  const critCount = activeTasks.filter(t => t.severity === 'critical' && t.status !== 'removed').length
  const highCount = activeTasks.filter(t => t.severity === 'high' && t.status !== 'removed').length
  const ipCount = activeTasks.filter(t => t.status === 'inprogress').length
  const potentialScore = tender?.fitScore?.overall || 0
  const currentScore = doneTasks.length > 0
    ? Math.min(potentialScore, Math.round(potentialScore * (1 - (critCount * 0.1))))
    : Math.max(0, potentialScore - (critCount * 10))

  if (allTenders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <div className="empty-title">No tenders yet</div>
        <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16 }}>Upload a tender to create a bid plan.</div>
        <button className="btn btn-primary" onClick={() => onNavigate('upload')}>Upload a tender</button>
      </div>
    )
  }

  if (!tender) return null

  return (
    <div>
      {/* Top bar */}
      <div className="card" style={{ marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:12 }}>
          <select
            value={tender.id}
            onChange={e => { setActiveTenderId(e.target.value); setShowDone(false) }}
            style={{ flex:1, minWidth:200, fontSize:13, fontWeight:500 }}
          >
            {allTenders.map(t => <option key={t.id} value={t.id}>{t.title?.substring(0,60)}</option>)}
          </select>
          <button className="btn btn-sm"><i className="ti ti-download" aria-hidden="true"></i> Download</button>
          {isGenerated && (
            <button
              className="btn btn-sm"
              style={{ color:'#DC2626', borderColor:'#FECACA' }}
              onClick={deleteWholePlan}
            >
              🗑 Delete plan
            </button>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          {[
            { val:critCount, label:'Critical', color:'#DC2626' },
            { val:highCount, label:'High', color:'#D97706' },
            { val:ipCount, label:'In progress', color:'#4338CA' },
            { val:`${doneTasks.length}/${allTasks.filter(t=>t.status!=='removed').length}`, label:'Done', color:'#1A1A2E' },
          ].map((s,i) => (
            <div key={i} style={{ textAlign:'center', minWidth:44 }}>
              <div style={{ fontSize:18, fontWeight:500, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:10, color:'#6B6B80' }}>{s.label}</div>
            </div>
          ))}
          <div style={{ width:'0.5px', height:28, background:'#F0F0F5' }} />
          <div style={{ flex:1, minWidth:120 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#6B6B80', marginBottom:3 }}>
              <span>{currentScore}% now</span>
              <span>→ {potentialScore}% potential</span>
            </div>
            <div style={{ height:5, background:'#F0F0F5', borderRadius:3, overflow:'hidden' }}>
              <div style={{ width:`${currentScore}%`, height:'100%', background:'#4F46E5', borderRadius:3, transition:'width .4s' }} />
            </div>
          </div>
          <div style={{ width:'0.5px', height:28, background:'#F0F0F5' }} />
          <div style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 8px', borderRadius:6, background: daysLeft <= 7 ? '#FEE2E2' : '#FEF3C7', color: daysLeft <= 7 ? '#DC2626' : '#D97706', fontSize:10, fontWeight:500, whiteSpace:'nowrap' }}>
            📅 {daysLeft}d left
          </div>
        </div>
      </div>

      {/* Generate plan CTA — shown when no tasks yet */}
      {!isGenerated && allTasks.filter(t => t.isFromCompliance).length === 0 && (
        <div className="card" style={{ marginBottom:10, textAlign:'center', padding:'24px 20px', background:'linear-gradient(135deg,#F9F9FB,#EEF2FF)', border:'1px solid #C7D2FE' }}>
          <div style={{ fontSize:32, marginBottom:12 }}>📋</div>
          <div style={{ fontSize:14, fontWeight:600, color:'#1A1A2E', marginBottom:6 }}>Generate your bid plan</div>
          <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16, maxWidth:400, margin:'0 auto 16px' }}>
            Get a pre-built action plan for this tender — covering preparation, compliance, bid writing, and submission.
            You can also add specific compliance gaps from the Compliance Engine.
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn btn-primary" onClick={generatePlan}>
              Generate bid plan →
            </button>
            <button className="btn" onClick={() => onNavigate('compliance')}>
              ⚡ Check compliance first
            </button>
          </div>
        </div>
      )}

      {/* Add compliance gaps CTA */}
      {isGenerated && allTasks.filter(t => t.isFromCompliance).length === 0 && (
        <div style={{ padding:'10px 14px', background:'#EEF2FF', borderRadius:8, marginBottom:10, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
          <div style={{ fontSize:12, color:'#4338CA' }}>
            ⚡ Add your specific compliance gaps from the Compliance Engine to this plan
          </div>
          <button className="btn btn-sm" style={{ fontSize:11, flexShrink:0 }} onClick={() => onNavigate('compliance')}>
            Open Compliance Engine →
          </button>
        </div>
      )}

      {/* Task list */}
      {(isGenerated || allTasks.filter(t => t.isFromCompliance).length > 0) && (
        <>
          {Object.entries(weeks).map(([week, data]) => (
            <div key={week} style={{ marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, margin:'10px 0 5px' }}>
                <span style={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'.07em', color:'#6B6B80', whiteSpace:'nowrap' }}>{week}</span>
                <div style={{ flex:1, height:'0.5px', background:'#F0F0F5' }} />
                {data.end && <span style={{ fontSize:10, color:'#9CA3AF', whiteSpace:'nowrap' }}>{data.end}</span>}
              </div>

              {data.tasks.map(task => {
                const isExp = expanded[task.id]
                const isHow = howOpen[task.id]
                const isIP = task.status === 'inprogress'
                const isFirst = task.idx === 0
                const isLast = task.idx === activeTasks.filter(t=>t.status!=='removed').length - 1

                const sevTag = task.severity === 'critical'
                  ? <span style={{ fontSize:10, padding:'1px 6px', borderRadius:20, fontWeight:500, background:'#FEE2E2', color:'#DC2626', whiteSpace:'nowrap', flexShrink:0 }}>Critical</span>
                  : task.severity === 'high'
                  ? <span style={{ fontSize:10, padding:'1px 6px', borderRadius:20, fontWeight:500, background:'#FEF3C7', color:'#D97706', whiteSpace:'nowrap', flexShrink:0 }}>High</span>
                  : <span style={{ fontSize:10, padding:'1px 6px', borderRadius:20, fontWeight:500, background:'#DCFCE7', color:'#15803D', whiteSpace:'nowrap', flexShrink:0 }}>Prep</span>

                return (
                  <div
                    key={task.id}
                    style={{ background: isIP ? '#FAFAFE' : '#fff', border:`0.5px solid ${isIP ? '#4F46E5' : '#E8E8EE'}`, borderRadius:8, marginBottom:4, overflow:'hidden' }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 10px' }}>
                      {/* Move buttons */}
                      <div style={{ display:'flex', flexDirection:'column', gap:2, flexShrink:0 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => moveTask(task.id, 'up')} disabled={isFirst} style={{ width:16, height:14, border:'0.5px solid #E8E8EE', borderRadius:3, background:'#F5F5F7', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#6B6B80', padding:0, opacity: isFirst ? 0.2 : 1 }} aria-label="Move up">▲</button>
                        <button onClick={() => moveTask(task.id, 'down')} disabled={isLast} style={{ width:16, height:14, border:'0.5px solid #E8E8EE', borderRadius:3, background:'#F5F5F7', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#6B6B80', padding:0, opacity: isLast ? 0.2 : 1 }} aria-label="Move down">▼</button>
                      </div>

                      {/* Title */}
                      <div style={{ flex:1, minWidth:0, display:'flex', alignItems:'center', gap:5, overflow:'hidden', cursor:'pointer' }} onClick={() => setExpanded(e => ({ ...e, [task.id]: !e[task.id] }))}>
                        {sevTag}
                        {isIP && <span style={{ fontSize:10, padding:'1px 6px', borderRadius:20, fontWeight:500, background:'#EEF2FF', color:'#4338CA', whiteSpace:'nowrap', flexShrink:0 }}>In progress</span>}
                        {task.isFromCompliance && <span style={{ fontSize:9, color:'#9CA3AF', flexShrink:0 }}>⚡</span>}
                        <span style={{ fontSize:12, fontWeight:500, color:'#1A1A2E', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{task.title}</span>
                      </div>

                      {/* Status buttons */}
                      <div style={{ display:'flex', gap:4, flexShrink:0 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setStatus(task.id, isIP ? 'none' : 'inprogress')} style={{ padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:500, cursor:'pointer', border:`0.5px solid ${isIP ? '#4F46E5' : '#C7D2FE'}`, background: isIP ? '#EEF2FF' : '#F5F5F7', color: isIP ? '#4338CA' : '#6B6B80', fontFamily:'inherit' }}>⟳</button>
                        <button onClick={() => setStatus(task.id, 'done')} style={{ padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:500, cursor:'pointer', border:'0.5px solid #BBF7D0', background:'#F5F5F7', color:'#15803D', fontFamily:'inherit' }}>✓</button>
                      </div>

                      <span style={{ fontSize:9, color:'#9CA3AF', cursor:'pointer', display:'inline-block', transform: isExp ? 'rotate(180deg)' : 'none', flexShrink:0 }} onClick={() => setExpanded(e => ({ ...e, [task.id]: !e[task.id] }))}>▼</span>
                    </div>

                    {/* Expanded body */}
                    {isExp && (
                      <div style={{ padding:'8px 10px 10px 33px', borderTop:'0.5px solid #F0F0F5' }}>
                        <div style={{ fontSize:11, color:'#6B6B80', lineHeight:1.5, marginBottom:6 }}>{task.why}</div>
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:6 }}>
                          {task.time && <span style={{ fontSize:10, padding:'1px 7px', borderRadius:20, background:'#F5F5F7', color:'#6B6B80' }}>⏱ {task.time}</span>}
                          {task.cost && <span style={{ fontSize:10, padding:'1px 7px', borderRadius:20, background:'#F5F5F7', color:'#6B6B80' }}>{task.cost}</span>}
                          {task.action && <span style={{ fontSize:10, padding:'1px 7px', borderRadius:20, background:'#EFF6FF', color:'#1D4ED8' }}>{task.action}</span>}
                          {task.type && <span style={{ fontSize:10, padding:'1px 7px', borderRadius:20, background:'#F5F5F7', color:'#6B6B80' }}>
                            {task.type === 'document' ? '📄 Write document' : task.type === 'obtain' ? '📋 Obtain externally' : task.type === 'assess' ? '🔍 Assess' : '📝 Prepare'}
                          </span>}
                        </div>
                        <button style={{ fontSize:10, color:'#4F46E5', cursor:'pointer', background:'none', border:'none', fontFamily:'inherit', padding:0, marginBottom:4 }} onClick={() => setHowOpen(h => ({ ...h, [task.id]: !h[task.id] }))}>
                          {isHow ? '▲ Hide guidance' : '▼ How to do this'}
                        </button>
                        {isHow && (
                          <div style={{ marginTop:4, padding:'8px 10px', background:'#F9FAFB', borderRadius:6, fontSize:11, color:'#4B5563', lineHeight:1.6, border:'0.5px solid #F0F0F5', whiteSpace:'pre-wrap' }}>
                            {task.how}
                          </div>
                        )}
                        <div style={{ marginTop:8, paddingTop:8, borderTop:'0.5px solid #F0F0F5' }}>
                          <button style={{ fontSize:10, color:'#DC2626', cursor:'pointer', background:'none', border:'0.5px solid #FECACA', borderRadius:6, padding:'2px 8px', fontFamily:'inherit' }} onClick={() => handleRemove(task.id, task.isDefault)}>
                            ✕ Remove from plan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Done section */}
          {doneTasks.length > 0 && (
            <>
              <button onClick={() => setShowDone(s => !s)} style={{ display:'flex', alignItems:'center', gap:7, marginTop:10, cursor:'pointer', padding:'6px 10px', borderRadius:8, background:'#F5F5F7', border:'0.5px solid #E8E8EE', fontSize:11, color:'#6B6B80', fontFamily:'inherit', width:'100%', textAlign:'left' }}>
                <span style={{ color:'#15803D' }}>✓</span>
                <span>{showDone ? 'Hide' : 'Show'} completed ({doneTasks.length})</span>
                <span style={{ marginLeft:'auto', fontSize:10 }}>{showDone ? '▲' : '▼'}</span>
              </button>
              {showDone && (
                <div style={{ marginTop:4 }}>
                  {doneTasks.map(task => (
                    <div key={task.id} style={{ background:'#F5F5F7', border:'0.5px solid #E8E8EE', borderRadius:8, padding:'5px 10px', marginBottom:3, display:'flex', alignItems:'center', gap:8, opacity:.6 }}>
                      <span style={{ fontSize:10, padding:'1px 6px', borderRadius:20, background:'#DCFCE7', color:'#15803D', fontWeight:500, flexShrink:0 }}>✓</span>
                      <span style={{ flex:1, fontSize:11, color:'#6B6B80', textDecoration:'line-through', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{task.title}</span>
                      <button onClick={() => setStatus(task.id, 'none')} style={{ padding:'2px 7px', borderRadius:20, fontSize:10, border:'0.5px solid #E8E8EE', background:'#fff', color:'#6B6B80', cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}>↩ Restore</button>
                      <button onClick={() => handleRemove(task.id, task.isDefault)} style={{ padding:'2px 7px', borderRadius:20, fontSize:10, border:'0.5px solid #FECACA', background:'#fff', color:'#DC2626', cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Deadline strip */}
          <div style={{ border:'0.5px solid #E8E8EE', borderRadius:8, padding:'8px 12px', background:'#F9F9FB', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginTop:10, flexWrap:'wrap' }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ fontSize:14, color:'#16A34A' }}>🏁</span>
              <div>
                <div style={{ fontSize:11, fontWeight:500, color:'#1A1A2E' }}>Submit before deadline</div>
                <div style={{ fontSize:10, color:'#6B6B80' }}>{tender.deadline || 'See tender document'} · {daysLeft} days remaining</div>
              </div>
            </div>
            <span style={{ fontSize:10, fontWeight:500, padding:'3px 10px', borderRadius:20, background: daysLeft <= 7 ? '#FEE2E2' : '#FEF3C7', color: daysLeft <= 7 ? '#DC2626' : '#D97706' }}>
              {daysLeft <= 7 ? '⚠ Urgent' : daysLeft <= 14 ? 'This fortnight' : `${daysLeft} days away`}
            </span>
          </div>

          <div style={{ marginTop:7, padding:'6px 10px', borderRadius:8, background:'#F5F5F7', border:'0.5px solid #E8E8EE', fontSize:10, color:'#9CA3AF', lineHeight:1.5 }}>
            ⚡ tasks are from your Compliance Engine. Prep tasks are auto-generated. Click to expand. ⟳ = in progress · ✓ = done · ▲▼ = reorder.
          </div>
        </>
      )}
    </div>
  )
}