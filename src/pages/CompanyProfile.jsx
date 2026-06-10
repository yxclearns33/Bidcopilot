import { useState } from 'react'
import { useApp } from '../context/AppContext'

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  )
}

const DOC_VAULT = [
  { id:'public_liability',  label:'Public liability insurance',  key:'publicLiability' },
  { id:'employers',         label:'Employers liability insurance',key:'employersLiability' },
  { id:'health_safety',     label:'Health & Safety policy',      key:'healthSafety' },
  { id:'risk',              label:'Risk assessments',             key:'riskAssessments' },
  { id:'coshh',             label:'COSHH compliance records',    key:'coshh' },
  { id:'iso',               label:'ISO 9001 certificate',        key:'iso9001' },
]

export default function CompanyProfile() {
  const { company, updateCompany } = useApp()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(company || {})
  const [tab, setTab] = useState('info')
  const [newProj, setNewProj] = useState(null)
  const [newRef, setNewRef] = useState(null)

  function saveProfile() { updateCompany(draft); setEditing(false) }

  function addProject() {
    if (!newProj) { setNewProj({ clientName:'', sector:company?.industry||'', contractValue:'', duration:'', description:'', outcome:'completed' }); return }
    if (newProj.clientName) {
      const updated = [...(company?.experience||[]), newProj]
      updateCompany({ experience: updated })
      setDraft(d=>({...d,experience:updated}))
      setNewProj(null)
    }
  }

  function removeProject(i) {
    const updated = (company?.experience||[]).filter((_,j)=>j!==i)
    updateCompany({ experience: updated })
  }

  function addRef() {
    if (!newRef) { setNewRef({ name:'', company:'', contact:'' }); return }
    if (newRef.name) {
      const updated = [...(company?.references||[]), newRef]
      updateCompany({ references: updated })
      setNewRef(null)
    }
  }

  function removeRef(i) {
    updateCompany({ references: (company?.references||[]).filter((_,j)=>j!==i) })
  }

  const tabs = [
    { key:'info',       label:'Company info' },
    { key:'services',   label:'Services' },
    { key:'compliance', label:'Compliance & docs' },
    { key:'experience', label:'Experience' },
    { key:'references', label:'References' },
  ]

  return (
    <div>
      {/* Tab nav */}
      <div style={{display:'flex',gap:0,marginBottom:20,background:'#fff',border:'1px solid #E8E8EE',borderRadius:10,overflow:'hidden',width:'fit-content'}}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            style={{padding:'9px 18px',fontSize:13,fontWeight:500,border:'none',background:tab===t.key?'#4F46E5':'transparent',color:tab===t.key?'#fff':'#6B6B80',cursor:'pointer',transition:'all .15s',fontFamily:'inherit'}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Company info */}
      {tab==='info'&&(
        <div className="grid-2" style={{alignItems:'start'}}>
          <div className="card">
            <div className="card-header">
              <div><div className="card-title">Company information</div><div className="card-subtitle">Used across all bid generation</div></div>
              {editing
                ?<div style={{display:'flex',gap:6}}><button className="btn btn-primary btn-sm" onClick={saveProfile}>Save</button><button className="btn btn-sm" onClick={()=>{setEditing(false);setDraft(company||{})}}>Cancel</button></div>
                :<button className="btn btn-sm" onClick={()=>setEditing(true)}>✎ Edit</button>
              }
            </div>
            {[
              ['Company name', 'companyName', 'text', 'e.g. Bright Clean Ltd'],
              ['Location', 'location', 'text', 'e.g. Manchester'],
              ['Operating region', 'operatingRegion', 'text', 'e.g. North West'],
            ].map(([label,key,type,ph])=>(
              <div className="row-item" key={key}>
                <span style={{fontSize:12,color:'#6B6B80',minWidth:130}}>{label}</span>
                {editing
                  ?<input type={type} value={draft[key]||''} onChange={e=>setDraft(d=>({...d,[key]:e.target.value}))} placeholder={ph} style={{flex:1,fontSize:13}}/>
                  :<span style={{fontSize:13,fontWeight:500,color:'#1A1A2E'}}>{company?.[key]||'—'}</span>
                }
              </div>
            ))}
            <div className="row-item">
              <span style={{fontSize:12,color:'#6B6B80',minWidth:130}}>Staff count</span>
              {editing
                ?<select value={draft.staffCount||''} onChange={e=>setDraft(d=>({...d,staffCount:e.target.value}))} style={{flex:1,fontSize:13}}>
                  {['1-5','6-10','11-25','26-50','51-100','100+'].map(s=><option key={s}>{s}</option>)}
                </select>
                :<span style={{fontSize:13,fontWeight:500}}>{company?.staffCount||'—'}</span>
              }
            </div>
            <div className="row-item">
              <span style={{fontSize:12,color:'#6B6B80',minWidth:130}}>Industry</span>
              <span style={{fontSize:13,fontWeight:500,color:'#4F46E5',textTransform:'capitalize'}}>{company?.industry||'—'}</span>
            </div>
            <div className="row-item">
              <span style={{fontSize:12,color:'#6B6B80',minWidth:130}}>Contract target</span>
              <span style={{fontSize:13,fontWeight:500}}>{company?.contractTargetRange||'—'}</span>
            </div>
          </div>

          {/* Profile strength */}
          <div className="card">
            <div className="card-header"><div className="card-title">Profile strength</div></div>
            {[
              ['Company info',  !!(company?.companyName&&company?.location)],
              ['Services',      (company?.services||[]).length>0],
              ['Compliance',    !!(company?.compliance?.publicLiability||company?.compliance?.healthSafety)],
              ['Past contracts',(company?.experience||[]).length>0],
              ['References',    (company?.references||[]).length>0],
            ].map(([label,done])=>(
              <div className="row-item" key={label}>
                <span style={{fontSize:13,color:done?'#1A1A2E':'#9CA3AF'}}>{label}</span>
                <span className={`badge ${done?'badge-green':'badge-gray'}`}>{done?'✓ Complete':'Incomplete'}</span>
              </div>
            ))}
            <div style={{marginTop:14,padding:12,background:'#F9FAFB',borderRadius:8,fontSize:12,color:'#6B6B80',lineHeight:1.5}}>
              A complete profile generates better bid content and more accurate compliance checks.
            </div>
          </div>
        </div>
      )}

      {/* Services */}
      {tab==='services'&&(
        <div className="card" style={{maxWidth:560}}>
          <div className="card-header"><div className="card-title">Services offered</div><div className="card-subtitle">Used for opportunity matching</div></div>
          <div className="pill-grid">
            {['Office cleaning','Industrial cleaning','School cleaning','Healthcare cleaning','Window cleaning','Carpet cleaning','Waste management','Grounds maintenance','Manned guarding','CCTV monitoring','Access control','Event security'].map(s=>{
              const selected = (company?.services||[]).includes(s)
              return (
                <button key={s} className={`pill ${selected?'selected':''}`}
                  onClick={()=>{
                    const updated = selected?(company?.services||[]).filter(x=>x!==s):[...(company?.services||[]),s]
                    updateCompany({services:updated})
                  }}>{s}</button>
              )
            })}
          </div>
        </div>
      )}

      {/* Compliance & docs */}
      {tab==='compliance'&&(
        <div className="grid-2" style={{alignItems:'start'}}>
          <div className="card">
            <div className="card-header"><div className="card-title">Compliance toggles</div><div className="card-subtitle">Update when you obtain new documents</div></div>
            {DOC_VAULT.map(d=>(
              <div className="check-row" key={d.id}>
                <div>
                  <div className="check-label">{d.label}</div>
                  <div className="check-sub">{company?.compliance?.[d.key]?'✓ On file':'Not declared'}</div>
                </div>
                <Toggle checked={!!(company?.compliance?.[d.key])}
                  onChange={v=>updateCompany({compliance:{...(company?.compliance||{}),[d.key]:v}})} />
              </div>
            ))}
            {company?.compliance?.publicLiability&&(
              <div style={{marginTop:12}}>
                <label className="form-label">Public liability coverage (£M)</label>
                <input type="number" value={company?.compliance?.publicLiabilityValue||''} placeholder="e.g. 5"
                  onChange={e=>updateCompany({compliance:{...(company?.compliance||{}),publicLiabilityValue:e.target.value}})} style={{width:140}} />
              </div>
            )}
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Document vault</div><div className="card-subtitle">Upload your actual certificates</div></div>
            {DOC_VAULT.map(d=>{
              const on = company?.compliance?.[d.key]
              return (
                <div className="doc-row" key={d.id}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:on?'#22C55E':'#E0E0EA',flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,color:'#1A1A2E'}}>{d.label}</div>
                    <div style={{fontSize:11,color:'#6B6B80'}}>{on?'Declared — upload certificate to verify':'Not on file'}</div>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    {on&&<button className="btn btn-sm" style={{fontSize:11}}>↑ Upload</button>}
                    <span className={`badge ${on?'badge-green':'badge-red'}`}>{on?'On file':'Missing'}</span>
                  </div>
                </div>
              )
            })}
            <div style={{marginTop:12,padding:10,background:'#FEF3C7',borderRadius:8,fontSize:12,color:'#92400E',lineHeight:1.5}}>
              ⚠ Uploading actual certificates marks them as <strong>Verified</strong> and increases your compliance score weighting.
            </div>
          </div>
        </div>
      )}

      {/* Experience */}
      {tab==='experience'&&(
        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:'#1A1A2E'}}>Past contracts</div>
              <div style={{fontSize:12,color:'#6B6B80',marginTop:2}}>{(company?.experience||[]).length} contracts on file</div>
            </div>
          </div>
          {(company?.experience||[]).map((p,i)=>(
            <div className="project-card" key={i}>
              <div className="project-card-header">
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:'#1A1A2E'}}>{p.clientName}</div>
                  <div style={{fontSize:11,color:'#6B6B80',marginTop:2}}>{p.sector} · {p.contractValue} · {p.duration} · <span style={{color:p.outcome==='completed'?'#16A34A':'#4F46E5'}}>{p.outcome}</span></div>
                </div>
                <button className="btn btn-sm" style={{color:'#DC2626',borderColor:'#FECACA',fontSize:11}} onClick={()=>removeProject(i)}>Remove</button>
              </div>
              {p.description&&<div style={{fontSize:12,color:'#4B5563',lineHeight:1.5}}>{p.description}</div>}
            </div>
          ))}
          {newProj?(
            <div className="project-card">
              <div className="form-row">
                <div className="form-group"><label className="form-label">Client name</label>
                  <input type="text" value={newProj.clientName} onChange={e=>setNewProj(p=>({...p,clientName:e.target.value}))} placeholder="e.g. Manchester City Council"/></div>
                <div className="form-group"><label className="form-label">Contract value</label>
                  <input type="text" value={newProj.contractValue} onChange={e=>setNewProj(p=>({...p,contractValue:e.target.value}))} placeholder="e.g. £25,000"/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Duration</label>
                  <input type="text" value={newProj.duration} onChange={e=>setNewProj(p=>({...p,duration:e.target.value}))} placeholder="e.g. 2 years"/></div>
                <div className="form-group"><label className="form-label">Outcome</label>
                  <select value={newProj.outcome} onChange={e=>setNewProj(p=>({...p,outcome:e.target.value}))}>
                    <option value="completed">Completed</option><option value="ongoing">Ongoing</option>
                  </select></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label>
                <textarea value={newProj.description} onChange={e=>setNewProj(p=>({...p,description:e.target.value}))} placeholder="Briefly describe the scope..."/></div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary btn-sm" onClick={addProject}>Save contract</button>
                <button className="btn btn-sm" onClick={()=>setNewProj(null)}>Cancel</button>
              </div>
            </div>
          ):<button className="add-btn" onClick={addProject}>+ Add a past contract</button>}
        </div>
      )}

      {/* References */}
      {tab==='references'&&(
        <div>
          <div style={{fontSize:14,fontWeight:600,color:'#1A1A2E',marginBottom:16}}>{(company?.references||[]).length} references on file</div>
          {(company?.references||[]).map((r,i)=>(
            <div className="project-card" key={i}>
              <div className="project-card-header">
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{r.name}</div>
                  <div style={{fontSize:11,color:'#6B6B80'}}>{r.company}</div>
                  {r.contact&&<div style={{fontSize:11,color:'#4B5563',marginTop:2}}>{r.contact}</div>}
                </div>
                <button className="btn btn-sm" style={{color:'#DC2626',borderColor:'#FECACA',fontSize:11}} onClick={()=>removeRef(i)}>Remove</button>
              </div>
            </div>
          ))}
          {newRef?(
            <div className="project-card">
              <div className="form-row">
                <div className="form-group"><label className="form-label">Name</label>
                  <input type="text" value={newRef.name} onChange={e=>setNewRef(r=>({...r,name:e.target.value}))} placeholder="Contact name"/></div>
                <div className="form-group"><label className="form-label">Company</label>
                  <input type="text" value={newRef.company} onChange={e=>setNewRef(r=>({...r,company:e.target.value}))} placeholder="Organisation"/></div>
              </div>
              <div className="form-group"><label className="form-label">Contact details (optional)</label>
                <input type="text" value={newRef.contact} onChange={e=>setNewRef(r=>({...r,contact:e.target.value}))} placeholder="Email or phone"/></div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary btn-sm" onClick={addRef}>Save reference</button>
                <button className="btn btn-sm" onClick={()=>setNewRef(null)}>Cancel</button>
              </div>
            </div>
          ):<button className="add-btn" onClick={addRef}>+ Add a reference</button>}
        </div>
      )}
    </div>
  )
}
