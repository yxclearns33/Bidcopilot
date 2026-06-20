import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function Opportunities({ onNavigate }) {
  const {
    apiTenders, uploadedTenders, fetchLiveTenders, apiLoading,
    saveToPipeline, getPipelineStage, setActiveTenderId, saveUploadedTender
  } = useApp()

  const [sector, setSector] = useState('')
  const [sortBy, setSortBy] = useState('fit')

  useEffect(() => {
    if (apiTenders.length === 0) fetchLiveTenders()
  }, [])

  const uploadedIds = new Set((uploadedTenders || []).map(t => t.id))
  const opportunities = (apiTenders || []).filter(t => !uploadedIds.has(t.id))

  let filtered = opportunities.filter(o => !sector || o.industry === sector)
  if (sortBy === 'fit') filtered = [...filtered].sort((a,b) => (b.fitScore?.overall||0) - (a.fitScore?.overall||0))
  if (sortBy === 'deadline') filtered = [...filtered].sort((a,b) => (a.daysLeft||99) - (b.daysLeft||99))
  if (sortBy === 'value') filtered = [...filtered].sort((a,b) => (b.valueNum||0) - (a.valueNum||0))

  const sectors = [...new Set(opportunities.map(o => o.industry).filter(Boolean))]

  function startBidPlan(opp) {
    saveUploadedTender({ ...opp, fromApi: true })
    setActiveTenderId(opp.id)
    onNavigate('compliance')
  }

  function scoreColor(s) {
    if (!s) return '#6B6B80'
    if (s >= 70) return '#16A34A'
    if (s >= 50) return '#D97706'
    return '#DC2626'
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        <select value={sector} onChange={e => setSector(e.target.value)} style={{ fontSize:13 }}>
          <option value="">All sectors</option>
          {sectors.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ fontSize:13 }}>
          <option value="fit">Sort by fit score</option>
          <option value="deadline">Sort by deadline</option>
          <option value="value">Sort by value</option>
        </select>
        <button className="btn btn-sm" onClick={fetchLiveTenders} disabled={apiLoading}>
          {apiLoading ? 'Loading...' : '↻ Refresh'}
        </button>
        <span style={{ fontSize:12, color:'#6B6B80', marginLeft:'auto' }}>
          {filtered.length} tender{filtered.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {apiLoading && (
        <div style={{ textAlign:'center', padding:'32px 0', color:'#6B6B80', fontSize:13 }}>
          Loading live UK tenders from Contracts Finder...
        </div>
      )}

      {!apiLoading && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">⊕</div>
          <div className="empty-title">No opportunities found</div>
          <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16 }}>
            {opportunities.length === 0
              ? 'Could not load live tenders. Check your internet connection or try refreshing.'
              : 'No tenders match your current filter.'}
          </div>
          <button className="btn btn-primary" onClick={fetchLiveTenders}>Try again</button>
        </div>
      )}

      <div className="opp-grid" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
        {filtered.map(opp => {
          const score = opp.fitScore?.overall
          const stage = getPipelineStage(opp.id)
          const inPlan = uploadedIds.has(opp.id)
          const verdict = opp.compliance?.verdict

          return (
            <div key={opp.id} className="card" style={{ cursor:'default' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:10 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#1A1A2E', marginBottom:2, lineHeight:1.3 }}>{opp.title}</div>
                  <div style={{ fontSize:12, color:'#4F46E5', fontWeight:500 }}>{opp.buyer}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:22, fontWeight:700, color: scoreColor(score), letterSpacing:'-0.5px' }}>{score ?? '—'}%</div>
                  <div style={{ fontSize:10, color:'#9CA3AF' }}>match</div>
                </div>
              </div>

              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
                <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:'#F5F5F7', color:'#6B6B80' }}>💷 {opp.value}</span>
                <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background: (opp.daysLeft||30) <= 10 ? '#FEE2E2' : '#F5F5F7', color: (opp.daysLeft||30) <= 10 ? '#DC2626' : '#6B6B80' }}>
                  📅 {opp.daysLeft ?? '—'}d left
                </span>
                <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:'#F5F5F7', color:'#6B6B80' }}>📍 {opp.location}</span>
                {verdict && (
                  <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background: verdict === 'at-risk' ? '#FEE2E2' : verdict === 'caution' ? '#FEF3C7' : '#DCFCE7', color: verdict === 'at-risk' ? '#DC2626' : verdict === 'caution' ? '#D97706' : '#15803D', fontWeight:500 }}>
                    {verdict === 'at-risk' ? '✗ At risk' : verdict === 'caution' ? '⚠ Caution' : '✓ Clear'}
                  </span>
                )}
              </div>

              {opp.summary && (
                <div style={{ fontSize:12, color:'#6B6B80', lineHeight:1.5, marginBottom:12 }}>{opp.summary?.substring(0, 120)}...</div>
              )}

              <div style={{ display:'flex', gap:8 }}>
                {inPlan ? (
                  <button className="btn btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={() => { setActiveTenderId(opp.id); onNavigate('compliance') }}>
                    View compliance →
                  </button>
                ) : (
                  <button className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={() => startBidPlan(opp)}>
                    Start bid plan →
                  </button>
                )}
                <button
                  className="btn btn-sm"
                  onClick={() => saveToPipeline(opp.id, stage ? stage : 'saved')}
                  style={{ flexShrink:0 }}
                >
                  {stage ? `◧ ${stage.charAt(0).toUpperCase()+stage.slice(1)}` : '+ Save'}
                </button>
                {opp.sourceUrl && (
                  <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ flexShrink:0 }}>↗</a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
