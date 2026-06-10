export function ScoreRing({ score, size = 96, label = 'readiness' }) {
  const r = (size / 2) - (size * 0.094)
  const circ = 2 * Math.PI * r
  const pct = (score || 0) / 100
  const color = score >= 70 ? '#4F46E5' : score >= 50 ? '#F97316' : '#EF4444'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0F0F5" strokeWidth={size*0.094} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.094}
          strokeDasharray={`${circ * pct} ${circ}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center' }}>
        <div style={{ fontSize: size*0.229, fontWeight: 700, color: '#1A1A2E', lineHeight: 1 }}>{score ?? '—'}{score != null ? '%' : ''}</div>
        <div style={{ fontSize: size*0.104, color: '#6B6B80', fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  )
}

export function ScoreBars({ breakdown }) {
  const bars = [
    { label: 'Industry match', key: 'industry' },
    { label: 'Compliance',     key: 'compliance' },
    { label: 'Experience',     key: 'experience' },
    { label: 'Capacity',       key: 'capacity' },
  ]
  const color = v => v >= 70 ? '#4F46E5' : v >= 50 ? '#F97316' : '#EF4444'
  return (
    <div style={{ flex: 1 }}>
      {bars.map(b => {
        const v = breakdown?.[b.key] ?? 0
        return (
          <div className="score-bar-row" key={b.key}>
            <span className="score-bar-label">{b.label}</span>
            <div className="score-bar-track">
              <div className="score-bar-fill" style={{ width: `${v}%`, background: color(v) }} />
            </div>
            <span className="score-bar-pct">{v}%</span>
          </div>
        )
      })}
    </div>
  )
}
