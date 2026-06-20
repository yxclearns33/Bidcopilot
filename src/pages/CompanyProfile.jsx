import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { SECTORS, TURNOVER_BANDS, STAFF_BANDS, YEARS_TRADING, CONTRACT_RANGES } from '../data/sectors'

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  )
}

function SectionCard({ title, subtitle, complete, children, id }) {
  const [open, setOpen] = useState(!complete)
  return (
    <div className="card" style={{ marginBottom:12, borderColor: complete ? '#BBF7D0' : '#E8E8EE' }} id={id}>
      <div
        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:24, height:24, borderRadius:'50%', background: complete ? '#DCFCE7' : '#F3F4F6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>
            {complete ? '✓' : '○'}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color: complete ? '#15803D' : '#1A1A2E' }}>{title}</div>
            {subtitle && <div style={{ fontSize:11, color:'#6B6B80', marginTop:1 }}>{subtitle}</div>}
          </div>
        </div>
        <span style={{ fontSize:12, color:'#9CA3AF' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid #F0F0F5' }}>{children}</div>}
    </div>
  )
}

export default function CompanyProfile() {
  const { company, updateCompany } = useApp()
  const sector = SECTORS[company?.industry]

  function update(key, value) { updateCompany({ [key]: value }) }

  function updateCompliance(key, value) {
    updateCompany({ compliance: { ...(company?.compliance || {}), [key]: value } })
  }

  function updateAccreditation(key, value) {
    updateCompany({ accreditations: { ...(company?.accreditations || {}), [key]: value } })
  }

  function updateDynamic(key, value) {
    updateCompany({ dynamicCompliance: { ...(company?.dynamicCompliance || {}), [key]: value } })
  }

  function toggleService(id) {
    const current = company?.services || []
    const updated = current.includes(id) ? current.filter(s => s !== id) : [...current, id]
    updateCompany({ services: updated })
  }

  function addProject() {
    const proj = { clientName:'', sector: company?.industry || '', contractValue:'', duration:'', description:'', outcome:'completed' }
    updateCompany({ experience: [...(company?.experience || []), proj] })
  }

  function updateProject(i, key, value) {
    const updated = [...(company?.experience || [])]
    updated[i] = { ...updated[i], [key]: value }
    updateCompany({ experience: updated })
  }

  function removeProject(i) {
    updateCompany({ experience: (company?.experience || []).filter((_, j) => j !== i) })
  }

  function addReference() {
    updateCompany({ references: [...(company?.references || []), { name:'', company:'' }] })
  }

  function updateReference(i, key, value) {
    const updated = [...(company?.references || [])]
    updated[i] = { ...updated[i], [key]: value }
    updateCompany({ references: updated })
  }

  function removeReference(i) {
    updateCompany({ references: (company?.references || []).filter((_, j) => j !== i) })
  }

  // ─── Progress calculation ─────────────────────────────────────────────────
  const checks = {
    business: !!(company?.companyName && company?.location && company?.staffCount && company?.yearsTrading && company?.turnoverBand),
    services: (company?.services || []).length > 0,
    insurance: !!(company?.compliance?.publicLiability && company?.compliance?.employersLiability),
    accreditations: Object.values(company?.accreditations || {}).some(Boolean),
    policies: ['healthSafety','coshh','riskAssessments'].every(p => company?.compliance?.[p]),
    experience: (company?.experience || []).length >= 1,
    references: (company?.references || []).length >= 1,
  }
  const completed = Object.values(checks).filter(Boolean).length
  const total = Object.keys(checks).length
  const pct = Math.round((completed / total) * 100)

  const selectedServices = company?.services || []
  const dynamicSections = selectedServices
    .map(id => sector?.dynamicQuestions?.[id])
    .filter(Boolean)

  return (
    <div>
      {/* Progress bar */}
      <div className="card" style={{ marginBottom:20, background:'linear-gradient(135deg,#1E1B4B,#312E81)', border:'none' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:600, color:'#fff', marginBottom:2 }}>Profile completion</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.6)' }}>
              {pct < 50 ? 'Complete your profile to unlock compliance scores' :
               pct < 80 ? 'Good progress — keep going for accurate match scores' :
               pct < 100 ? 'Almost there — finish your profile for full accuracy' :
               'Profile complete — your scores are fully accurate'}
            </div>
          </div>
          <div style={{ fontSize:36, fontWeight:800, color:'#fff', letterSpacing:'-1px' }}>{pct}%</div>
        </div>
        <div style={{ height:8, background:'rgba(255,255,255,.2)', borderRadius:4, overflow:'hidden' }}>
          <div style={{ width:`${pct}%`, height:'100%', background: pct === 100 ? '#86EFAC' : '#818CF8', borderRadius:4, transition:'width .5s' }} />
        </div>
        <div style={{ display:'flex', gap:16, marginTop:12, flexWrap:'wrap' }}>
          {Object.entries(checks).map(([key, done]) => (
            <span key={key} style={{ fontSize:11, color: done ? '#86EFAC' : 'rgba(255,255,255,.4)', display:'flex', alignItems:'center', gap:4 }}>
              {done ? '✓' : '○'} {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Business info */}
      <SectionCard title="Business information" subtitle="Company name, location, size and trading history" complete={checks.business} id="section-business">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Company name</label>
            <input type="text" placeholder="e.g. Bright Clean Ltd" value={company?.companyName || ''} onChange={e => update('companyName', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Location (town / city)</label>
            <input type="text" placeholder="e.g. Manchester" value={company?.location || ''} onChange={e => update('location', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Number of employees</label>
            <select value={company?.staffCount || ''} onChange={e => update('staffCount', e.target.value)}>
              <option value="">Select</option>
              {STAFF_BANDS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Years trading</label>
            <select value={company?.yearsTrading || ''} onChange={e => update('yearsTrading', e.target.value)}>
              <option value="">Select</option>
              {YEARS_TRADING.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Annual turnover band</label>
            <select value={company?.turnoverBand || ''} onChange={e => update('turnoverBand', e.target.value)}>
              <option value="">Select</option>
              {TURNOVER_BANDS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
            <div className="form-hint">Used to check financial standing against tender values</div>
          </div>
          <div className="form-group">
            <label className="form-label">Largest contract completed</label>
            <select value={company?.largestContract || ''} onChange={e => update('largestContract', e.target.value)}>
              <option value="">Select</option>
              {CONTRACT_RANGES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
        </div>
        <div className="check-row">
          <div>
            <div className="check-label">Public sector experience</div>
            <div className="check-sub">Have you previously worked on public sector contracts?</div>
          </div>
          <Toggle checked={company?.publicSectorExp} onChange={v => update('publicSectorExp', v)} />
        </div>
        <div className="form-group" style={{ marginTop:12 }}>
          <label className="form-label">Operating region</label>
          <input type="text" placeholder="e.g. Greater Manchester, North West" value={company?.operatingRegion || ''} onChange={e => update('operatingRegion', e.target.value)} />
        </div>
      </SectionCard>

      {/* Services */}
      <SectionCard title="Services offered" subtitle="Select all that apply — unlocks relevant compliance questions" complete={checks.services} id="section-services">
        {sector ? (
          <div className="pill-grid">
            {sector.services.map(s => (
              <button
                key={s.id}
                className={`pill ${selectedServices.includes(s.id) ? 'selected' : ''}`}
                onClick={() => toggleService(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ fontSize:13, color:'#6B6B80' }}>Industry not set — go to dashboard to complete onboarding.</div>
        )}
      </SectionCard>

      {/* Insurance */}
      <SectionCard title="Insurance" subtitle="Gateway requirement for all public sector tenders" complete={checks.insurance} id="section-insurance">
        <div className="check-row">
          <div>
            <div className="check-label">Public liability insurance</div>
            <div className="check-sub">Minimum £5M for most public sector tenders</div>
          </div>
          <Toggle checked={company?.compliance?.publicLiability} onChange={v => updateCompliance('publicLiability', v)} />
        </div>
        {company?.compliance?.publicLiability && (
          <div style={{ margin:'8px 0 12px', paddingLeft:0 }}>
            <label className="form-label">Coverage level</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:4 }}>
              {(sector?.insuranceLevels || ['£1M','£2M','£5M','£10M+']).map(level => (
                <button
                  key={level}
                  className={`pill ${company?.compliance?.publicLiabilityValue === level ? 'selected' : ''}`}
                  onClick={() => updateCompliance('publicLiabilityValue', level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="check-row">
          <div>
            <div className="check-label">Employers liability insurance</div>
            <div className="check-sub">Legally required if you have any employees</div>
          </div>
          <Toggle checked={company?.compliance?.employersLiability} onChange={v => updateCompliance('employersLiability', v)} />
        </div>
        <div className="check-row">
          <div>
            <div className="check-label">Professional indemnity insurance</div>
            <div className="check-sub">Required for some contracts — design & build, M&E, specialist</div>
          </div>
          <Toggle checked={company?.compliance?.professionalIndemnity} onChange={v => updateCompliance('professionalIndemnity', v)} />
        </div>
      </SectionCard>

      {/* Accreditations */}
      <SectionCard title="Accreditations" subtitle="CHAS, SafeContractor, ISO and sector-specific schemes" complete={checks.accreditations} id="section-accreditations">
        {(sector?.accreditations || []).map(acc => (
          <div className="check-row" key={acc.id}>
            <div>
              <div className="check-label">{acc.label}</div>
              <div className="check-sub">{acc.sub}</div>
            </div>
            <Toggle checked={company?.accreditations?.[acc.id]} onChange={v => updateAccreditation(acc.id, v)} />
          </div>
        ))}
      </SectionCard>

      {/* Policies */}
      <SectionCard title="Policies & compliance documents" subtitle="Written policies required for public sector bids" complete={checks.policies} id="section-policies">
        {(sector?.policies || []).map(policy => (
          <div className="check-row" key={policy.id}>
            <div>
              <div className="check-label" style={{ display:'flex', alignItems:'center', gap:6 }}>
                {policy.label}
                {policy.severity === 'critical' && <span style={{ fontSize:10, background:'#FEE2E2', color:'#DC2626', padding:'1px 6px', borderRadius:4, fontWeight:600 }}>CRITICAL</span>}
                {policy.severity === 'high' && <span style={{ fontSize:10, background:'#FEF3C7', color:'#D97706', padding:'1px 6px', borderRadius:4, fontWeight:600 }}>HIGH</span>}
              </div>
              <div className="check-sub">{policy.sub}</div>
            </div>
            <Toggle checked={company?.compliance?.[policy.id]} onChange={v => updateCompliance(policy.id, v)} />
          </div>
        ))}
      </SectionCard>

      {/* Dynamic service-specific questions */}
      {dynamicSections.length > 0 && dynamicSections.map(dq => (
        <SectionCard
          key={dq.label}
          title={`${dq.label} — specific requirements`}
          subtitle="Required for this service type"
          complete={dq.questions.every(q => company?.dynamicCompliance?.[q.id])}
          id={`section-dynamic-${dq.label}`}
        >
          {dq.questions.map(q => (
            <div className="check-row" key={q.id}>
              <div>
                <div className="check-label" style={{ display:'flex', alignItems:'center', gap:6 }}>
                  {q.label}
                  {q.severity === 'critical' && <span style={{ fontSize:10, background:'#FEE2E2', color:'#DC2626', padding:'1px 6px', borderRadius:4, fontWeight:600 }}>CRITICAL</span>}
                </div>
              </div>
              <Toggle checked={company?.dynamicCompliance?.[q.id]} onChange={v => updateDynamic(q.id, v)} />
            </div>
          ))}
        </SectionCard>
      ))}

      {/* Experience */}
      <SectionCard title="Past contracts" subtitle="Used in bid generation and experience scoring" complete={checks.experience} id="section-experience">
        {(company?.experience || []).map((proj, i) => (
          <div className="project-card" key={i}>
            <div className="project-card-header">
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{proj.clientName || 'Unnamed contract'}</div>
                <div style={{ fontSize:11, color:'#6B6B80' }}>{proj.contractValue} · {proj.duration} · {proj.outcome}</div>
              </div>
              <button className="btn btn-sm" style={{ color:'#DC2626', borderColor:'#FECACA', fontSize:11 }} onClick={() => removeProject(i)}>Remove</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Client / organisation</label>
                <input type="text" placeholder="e.g. Manchester City Council" value={proj.clientName || ''} onChange={e => updateProject(i, 'clientName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Contract value</label>
                <input type="text" placeholder="e.g. £25,000" value={proj.contractValue || ''} onChange={e => updateProject(i, 'contractValue', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input type="text" placeholder="e.g. 2 years" value={proj.duration || ''} onChange={e => updateProject(i, 'duration', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Outcome</label>
                <select value={proj.outcome || 'completed'} onChange={e => updateProject(i, 'outcome', e.target.value)}>
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea placeholder="Brief description of the work..." value={proj.description || ''} onChange={e => updateProject(i, 'description', e.target.value)} />
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addProject}>+ Add a past contract</button>
      </SectionCard>

      {/* References */}
      <SectionCard title="Client references" subtitle="Organisation names only — no personal contact details stored" complete={checks.references} id="section-references">
        {(company?.references || []).map((ref, i) => (
          <div className="project-card" key={i}>
            <div className="project-card-header">
              <div style={{ fontSize:13, fontWeight:600 }}>{ref.name || 'Unnamed reference'}</div>
              <button className="btn btn-sm" style={{ color:'#DC2626', borderColor:'#FECACA', fontSize:11 }} onClick={() => removeReference(i)}>Remove</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Reference description</label>
                <input type="text" placeholder="e.g. Office cleaning contract" value={ref.name || ''} onChange={e => updateReference(i, 'name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Client organisation</label>
                <input type="text" placeholder="e.g. Manchester City Council" value={ref.company || ''} onChange={e => updateReference(i, 'company', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addReference}>+ Add a reference</button>
        <div style={{ marginTop:12, fontSize:12, color:'#9CA3AF' }}>
          We only store organisation names — no personal contact details.
        </div>
      </SectionCard>

      {/* Feedback */}
      <div className="card" style={{ marginBottom:12, background:'#F9F9FB' }}>
        <div style={{ fontSize:13, fontWeight:600, color:'#1A1A2E', marginBottom:6 }}>Something missing from your sector?</div>
        <div style={{ fontSize:12, color:'#6B6B80', marginBottom:10 }}>BidCopilot is in testing. If a compliance requirement for your sector isn't listed above, let us know and we'll add it.</div>
        <textarea
          placeholder="e.g. Street works licence isn't listed for street cleansing..."
          value={company?.feedbackNote || ''}
          onChange={e => update('feedbackNote', e.target.value)}
          style={{ minHeight:60 }}
        />
        <button className="btn btn-sm" style={{ marginTop:8 }} onClick={() => {}}>Send feedback</button>
      </div>
    </div>
  )
}
