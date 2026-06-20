import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { getTaskForGap } from '../data/taskLibrary'

function daysUntil(dateStr) {
  if (!dateStr) return 30
  const formats = [
    /(\d{1,2})\s+(\w+)\s+(\d{4})/,
    /(\d{4})-(\d{2})-(\d{2})/,
  ]
  for (const fmt of formats) {
    const m = dateStr.match(fmt)
    if (m) {
      try {
        const d = new Date(dateStr)
        if (!isNaN(d)) return Math.max(0, Math.floor((d - new Date()) / (1000*60*60*24)))
      } catch {}
    }
  }
  return 30
}

function getWeekLabel(taskIndex, totalTasks, daysLeft) {
  if (daysLeft <= 7) return { week: 'This week — urgent', end: `Next ${daysLeft} days` }
  const position = taskIndex / totalTasks
  if (position < 0.4) return { week: 'Week 1 — do first', end: `Now → Day 7` }
  if (position < 0.7) return { week: 'Week 2 — do next', end: `Day 8 → Day 14` }
  return { week: 'Final stretch', end: `Day 15 onwards` }
}

export default function BidPlanner({ onNavigate }) {
  const {
    uploadedTenders, apiTenders, activeTenderId, setActiveTenderId,
    bidPlanItems, updateBidPlanItem, isResolved,
  } = useApp()

  const allTenders = [...uploadedTenders, ...apiTenders.filter(t => !uploadedTenders.find(u => u.id === t.id))]
  const tender = allTenders.find(t => t.id === activeTenderId) || allTenders[0]

  const [expanded, setExpanded] = useState({})
  const [howOpen, setHowOpen] = useState({})
  const [showDone, setShowDone] = useState(false)
  const [taskOrder, setTaskOrder] = useState({})

  // Build tasks from bid plan items + compliance gaps
  const allTasks = useMemo(() => {
    if (!tender) return []
    const planItems = bidPlanItems[tender.id] || {}
    const gaps = tender.compliance?.results || []

    return Object.entries(planItems)
      .map(([gapId, item]) => {
        const gap = gaps.find(g => g.id === gapId)
        const lib = getTaskForGap(gapId, tender)
        if (!lib) return null
        return {
          id: gapId,
          ...lib,
          severity: gap?.severity || 'high',
          status: item.status || 'none',
          addedAt: item.addedAt,
          order: taskOrder[`${tender.id}_${gapId}`] ?? Object.keys(planItems).indexOf(gapId),
        }
      })
      .filter(Boolean)
      .sort((a, b) => {
        // Sort by order override first
        if (a.order !== b.order) return a.order - b.order
        // Then by severity
        const sevOrder = { critical: 0, high: 1, medium: 2, nice: 3 }
        return (sevOrder[a.severity] ?? 2) - (sevOrder[b.severity] ?? 2)
      })
  }, [tender, bidPlanItems, taskOrder])

  const activeTasks = allTasks.filter(t => t.status !== 'done')
  const doneTasks = allTasks.filter(t => t.status === 'done')
  const daysLeft = daysUntil(tender?.deadline)

  function setStatus(gapId, status) {
    if (!tender) return
    updateBidPlanItem(tender.id, gapId, status)
  }

  function moveTask(gapId, dir) {
    const idx = activeTasks.findIndex(t => t.id === gapId)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= activeTasks.length) return
    const newOrder = {}
    activeTasks.forEach((t, i) => {
      newOrder[`${tender.id}_${t.id}`] = i
    })
    const aKey = `${tender.id}_${activeTasks[idx].id}`
    const bKey = `${tender.id}_${activeTasks[swapIdx].id}`
    const tmp = newOrder[aKey]
    newOrder[aKey] = newOrder[bKey]
    newOrder[bKey] = tmp
    setTaskOrder(prev => ({ ...prev, ...newOrder }))
  }

  // Group active tasks by week
  const weeks = {}
  activeTasks.forEach((task, idx) => {
    const { week, end } = getWeekLabel(idx, activeTasks.length, daysLeft)
    if (!weeks[week]) weeks[week] = { end, tasks: [] }
    weeks[week].tasks.push({ ...task, idx })
  })

  const critCount = activeTasks.filter(t => t.severity === 'critical').length
  const highCount = activeTasks.filter(t => t.severity === 'high').length
  const ipCount = activeTasks.filter(t => t.status === 'inprogress').length
  const potentialScore = tender?.fitScore?.overall || 0
  const currentScore = Math.max(0, potentialScore - (allTasks.length > 0 ? Math.round((doneTasks.length / allTasks.length) * (100 - potentialScore)) : 0))

  if (allTenders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <div className="empty-title">No tenders yet</div>
        <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16 }}>Upload a tender and add gaps to your bid plan from the Compliance Engine.</div>
        <button className="btn btn-primary" onClick={() => onNavigate('upload')}>Upload a tender</button>
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <div className="empty-title">Select a tender</div>
        <button className="btn btn-primary" onClick={() => setActiveTenderId(allTenders[0]?.id)}>Load first tender</button>
      </div>
    )
  }

  if (allTasks.length === 0) {
    return (
      <div>
        <div className="card" style={{ marginBottom:16 }}>
          <div className="card-header">
            <div>
              <div className="card-title">Bid Planner</div>
              <div className="card-subtitle">{tender.title}</div>
            </div>
            <select value={tender.id} onChange={e => setActiveTenderId(e.target.value)} style={{ fontSize:12, padding:'5px 8px', width:'auto' }}>
              {allTenders.map(t => <option key={t.id} value={t.id}>{t.title?.substring(0,50)}</option>)}
            </select>
          </div>
          <div className="empty-state" style={{ padding:'32px 0' }}>
            <div className="empty-icon">⚡</div>
            <div className="empty-title">No tasks in your plan yet</div>
            <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16 }}>Go to the Compliance Engine and click "Add to bid plan" on each gap you want to work on.</div>
            <button className="btn btn-primary" onClick={() => onNavigate('compliance')}>Go to Compliance Engine →</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Top bar */}
      <div className="card" style={{ marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:12 }}>
          <select
            value={tender.id}
            onChange={e => setActiveTenderId(e.target.value)}
            style={{ flex:1, minWidth:200, fontSize:13, fontWeight:500 }}
          >
            {allTenders.map(t => <option key={t.id} value={t.id}>{t.title?.substring(0,60)}</option>)}
          </select>
          <button className="btn btn-primary btn-sm"><i className="ti ti-download" aria-hidden="true"></i> Download plan</button>
          <button className="btn btn-sm"><i className="ti ti-printer" aria-hidden="true"></i></button>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <div style={{ textAlign:'center', minWidth:44 }}>
            <div style={{ fontSize:18, fontWeight:500, color:'#DC2626' }}>{critCount}</div>
            <div style={{ fontSize:10, color:'#6B6B80' }}>Critical</div>
          </div>
          <div style={{ width:'0.5px', height:28, background:'#F0F0F5' }} />
          <div style={{ textAlign:'center', minWidth:44 }}>
            <div style={{ fontSize:18, fontWeight:500, color:'#D97706' }}>{highCount}</div>
            <div style={{ fontSize:10, color:'#6B6B80' }}>High</div>
          </div>
          <div style={{ width:'0.5px', height:28, background:'#F0F0F5' }} />
          <div style={{ textAlign:'center', minWidth:44 }}>
            <div style={{ fontSize:18, fontWeight:500, color:'#4338CA' }}>{ipCount}</div>
            <div style={{ fontSize:10, color:'#6B6B80' }}>In progress</div>
          </div>
          <div style={{ width:'0.5px', height:28, background:'#F0F0F5' }} />
          <div style={{ textAlign:'center', minWidth:44 }}>
            <div style={{ fontSize:18, fontWeight:500 }}>{doneTasks.length}/{allTasks.length}</div>
            <div style={{ fontSize:10, color:'#6B6B80' }}>Done</div>
          </div>
          <div style={{ width:'0.5px', height:28, background:'#F0F0F5' }} />
          <div style={{ flex:1, minWidth:120 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#6B6B80', marginBottom:3 }}>
              <span>{currentScore}% now</span>
              <span>→ {potentialScore}% potential</span>
            </div>
            <div style={{ height:5, background:'#F0F0F5', borderRadius:3, overflow:'hidden' }}>
              <div style={{ width:`${currentScore}%`, height:'100%', background:'#E24B4A', borderRadius:3, transition:'width .4s' }} />
            </div>
          </div>
          <div style={{ width:'0.5px', height:28, background:'#F0F0F5' }} />
          <div style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 8px', borderRadius:6, background:'#FEF3C7', color:'#D97706', fontSize:10, fontWeight:500, whiteSpace:'nowrap' }}>
            <i className="ti ti-calendar" style={{ fontSize:11 }} aria-hidden="true"></i>
            {daysLeft} days left
          </div>
        </div>
      </div>

      {/* Task list */}
      {Object.entries(weeks).map(([week, data]) => (
        <div key={week} style={{ marginBottom:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, margin:'10px 0 5px' }}>
            <span style={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'.07em', color:'#6B6B80', whiteSpace:'nowrap' }}>{week}</span>
            <div style={{ flex:1, height:'0.5px', background:'#F0F0F5' }} />
            <span style={{ fontSize:10, color:'#9CA3AF', whiteSpace:'nowrap' }}>{data.end}</span>
          </div>

          {data.tasks.map((task, i) => {
            const isExp = expanded[task.id]
            const isHow = howOpen[task.id]
            const isIP = task.status === 'inprogress'
            const isFirst = task.idx === 0
            const isLast = task.idx === activeTasks.length - 1
            const sevTag = task.severity === 'critical'
              ? <span style={{ display:'inline-flex', fontSize:10, padding:'1px 6px', borderRadius:20, fontWeight:500, background:'#FEE2E2', color:'#DC2626', whiteSpace:'nowrap', flexShrink:0 }}>Critical</span>
              : task.severity === 'high'
              ? <span style={{ display:'inline-flex', fontSize:10, padding:'1px 6px', borderRadius:20, fontWeight:500, background:'#FEF3C7', color:'#D97706', whiteSpace:'nowrap', flexShrink:0 }}>High</span>
              : <span style={{ display:'inline-flex', fontSize:10, padding:'1px 6px', borderRadius:20, fontWeight:500, background:'#DCFCE7', color:'#15803D', whiteSpace:'nowrap', flexShrink:0 }}>Nice</span>

            return (
              <div
                key={task.id}
                style={{ background:'#fff', border:`0.5px solid ${isIP ? '#4F46E5' : '#E8E8EE'}`, borderRadius:8, marginBottom:4, overflow:'hidden', background: isIP ? '#FAFAFE' : '#fff' }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 10px' }}>
                  {/* Move buttons */}
                  <div style={{ display:'flex', flexDirection:'column', gap:2, flexShrink:0 }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => moveTask(task.id, 'up')}
                      disabled={isFirst}
                      style={{ width:16, height:14, border:'0.5px solid #E8E8EE', borderRadius:3, background:'#F5F5F7', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#6B6B80', padding:0, opacity: isFirst ? 0.2 : 1 }}
                      aria-label="Move up"
                    >▲</button>
                    <button
                      onClick={() => moveTask(task.id, 'down')}
                      disabled={isLast}
                      style={{ width:16, height:14, border:'0.5px solid #E8E8EE', borderRadius:3, background:'#F5F5F7', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#6B6B80', padding:0, opacity: isLast ? 0.2 : 1 }}
                      aria-label="Move down"
                    >▼</button>
                  </div>

                  {/* Title row */}
                  <div
                    style={{ flex:1, minWidth:0, display:'flex', alignItems:'center', gap:5, overflow:'hidden', cursor:'pointer' }}
                    onClick={() => setExpanded(e => ({ ...e, [task.id]: !e[task.id] }))}
                  >
                    {sevTag}
                    {isIP && <span style={{ display:'inline-flex', fontSize:10, padding:'1px 6px', borderRadius:20, fontWeight:500, background:'#EEF2FF', color:'#4338CA', whiteSpace:'nowrap', flexShrink:0 }}>In progress</span>}
                    <span style={{ fontSize:12, fontWeight:500, color:'#1A1A2E', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{task.title}</span>
                  </div>

                  {/* Status buttons */}
                  <div style={{ display:'flex', gap:4, flexShrink:0 }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setStatus(task.id, isIP ? 'none' : 'inprogress')}
                      style={{ padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:500, cursor:'pointer', border:`0.5px solid ${isIP ? '#4F46E5' : '#C7D2FE'}`, background: isIP ? '#EEF2FF' : '#F5F5F7', color: isIP ? '#4338CA' : '#6B6B80', fontFamily:'inherit' }}
                    >⟳</button>
                    <button
                      onClick={() => setStatus(task.id, 'done')}
                      style={{ padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:500, cursor:'pointer', border:'0.5px solid #BBF7D0', background:'#F5F5F7', color:'#15803D', fontFamily:'inherit' }}
                    >✓</button>
                  </div>

                  <span
                    style={{ fontSize:9, color:'#9CA3AF', cursor:'pointer', transition:'transform .2s', display:'inline-block', transform: isExp ? 'rotate(180deg)' : 'none', flexShrink:0 }}
                    onClick={() => setExpanded(e => ({ ...e, [task.id]: !e[task.id] }))}
                  >▼</span>
                </div>

                {/* Expanded body */}
                {isExp && (
                  <div style={{ padding:'8px 10px 10px 33px', borderTop:'0.5px solid #F0F0F5' }}>
                    <div style={{ fontSize:11, color:'#6B6B80', lineHeight:1.5, marginBottom:6 }}>{task.why}</div>
                    <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:6 }}>
                      {task.time && <span style={{ fontSize:10, padding:'1px 7px', borderRadius:20, background:'#F5F5F7', color:'#6B6B80' }}>⏱ {task.time}</span>}
                      {task.cost && <span style={{ fontSize:10, padding:'1px 7px', borderRadius:20, background:'#F5F5F7', color:'#6B6B80' }}>{task.cost}</span>}
                      {task.action && <span style={{ fontSize:10, padding:'1px 7px', borderRadius:20, background:'#EFF6FF', color:'#1D4ED8' }}>{task.action}</span>}
                      <span style={{ fontSize:10, padding:'1px 7px', borderRadius:20, background:'#F5F5F7', color:'#6B6B80', textTransform:'capitalize' }}>{task.type === 'document' ? '📄 Write document' : task.type === 'obtain' ? '📋 Obtain from external body' : task.type === 'assess' ? '🔍 Assess situation' : '📝 Prepare'}</span>
                    </div>
                    <button
                      style={{ fontSize:10, color:'#4F46E5', cursor:'pointer', background:'none', border:'none', fontFamily:'inherit', padding:0 }}
                      onClick={() => setHowOpen(h => ({ ...h, [task.id]: !h[task.id] }))}
                    >{isHow ? '▲ Hide guidance' : '▼ How to fix this'}</button>
                    {isHow && (
                      <div style={{ marginTop:6, padding:'8px 10px', background:'#F9FAFB', borderRadius:6, fontSize:11, color:'#4B5563', lineHeight:1.6, border:'0.5px solid #F0F0F5', whiteSpace:'pre-wrap' }}>
                        {task.how}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}

      {/* Done section toggle */}
      {doneTasks.length > 0 && (
        <>
          <button
            onClick={() => setShowDone(s => !s)}
            style={{ display:'flex', alignItems:'center', gap:7, marginTop:10, cursor:'pointer', padding:'6px 10px', borderRadius:8, background:'#F5F5F7', border:'0.5px solid #E8E8EE', fontSize:11, color:'#6B6B80', fontFamily:'inherit', width:'100%', textAlign:'left' }}
          >
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
                  <button
                    onClick={() => setStatus(task.id, 'none')}
                    style={{ padding:'2px 7px', borderRadius:20, fontSize:10, border:'0.5px solid #E8E8EE', background:'#fff', color:'#6B6B80', cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}
                  >↩ Restore</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Deadline strip */}
      <div style={{ border:'0.5px solid #E8E8EE', borderRadius:8, padding:'8px 12px', background:'#F9F9FB', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginTop:10, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <i className="ti ti-flag-2" style={{ fontSize:14, color:'#16A34A' }} aria-hidden="true"></i>
          <div>
            <div style={{ fontSize:11, fontWeight:500, color:'#1A1A2E' }}>Submit before deadline</div>
            <div style={{ fontSize:10, color:'#6B6B80' }}>{tender.deadline} · {daysLeft} days remaining</div>
          </div>
        </div>
        <span style={{ fontSize:10, fontWeight:500, padding:'3px 10px', borderRadius:20, background: daysLeft <= 7 ? '#FEE2E2' : '#FEF3C7', color: daysLeft <= 7 ? '#DC2626' : '#D97706' }}>
          {daysLeft <= 7 ? 'Urgent' : daysLeft <= 14 ? 'This fortnight' : `${daysLeft} days away`}
        </span>
      </div>

      <div style={{ marginTop:7, padding:'6px 10px', borderRadius:8, background:'#F5F5F7', border:'0.5px solid #E8E8EE', fontSize:10, color:'#9CA3AF', lineHeight:1.5 }}>
        Tasks added from Compliance Engine. Click to expand details. ⟳ marks in progress. ✓ marks done and hides the card. Restore anytime. Use ▲▼ to reprioritise.
      </div>
    </div>
  )
}
