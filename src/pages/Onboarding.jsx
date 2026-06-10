import { useState } from 'react'
import { useApp } from '../context/AppContext'

const INDUSTRIES = [
  { key:'cleaning',      icon:'🧹', label:'Cleaning',      sub:'Office, industrial, specialist' },
  { key:'security',      icon:'🛡️', label:'Security',      sub:'Manned guarding, CCTV' },
  { key:'construction',  icon:'🏗️', label:'Construction',  sub:'Coming soon', soon:true },
  { key:'facilities',    icon:'🏢', label:'Facilities',    sub:'Coming soon', soon:true },
]

const SERVICES = {
  cleaning: ['Office cleaning','Industrial cleaning','School cleaning','Healthcare cleaning','Window cleaning','Carpet cleaning','Waste management','Grounds maintenance'],
  security: ['Manned guarding','CCTV monitoring','Access control','Event security','Key holding','Mobile patrol'],
}

const STAFF = ['1-5','6-10','11-25','26-50','51-100','100+']

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  )
}

export default function Onboarding() {
  const { completeOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const [industry, setIndustry] = useState('')
  const [info, setInfo] = useState({ companyName:'', location:'', staffCount:'', operatingRegion:'', contractTargetRange:'' })
  const [services, setServices] = useState([])
  const [compliance, setCompliance] = useState({ publicLiability:false, publicLiabilityValue:'', employersLiability:false, healthSafety:false, riskAssessments:false, coshh:false, siaLicence:false, iso9001:false })
  const [experience, setExperience] = useState([])
  const [newProj, setNewProj] = useState(null)
  const [references, setReferences] = useState([])
  const [newRef, setNewRef] = useState(null)

  const TOTAL = 6
  const canNext = [
    ()=>!!industry,
    ()=>info.companyName&&info.location&&info.staffCount,
    ()=>services.length>0,
    ()=>true, ()=>true, ()=>true,
  ][step]?.()

  function toggleService(s){ setServices(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]) }

  function saveProject() {
    if (!newProj) { setNewProj({ clientName:'', sector:industry, contractValue:'', duration:'', description:'', outcome:'completed' }); return }
    if (newProj.clientName) { setExperience(e=>[...e,newProj]); setNewProj(null) }
  }

  function saveRef() {
    if (!newRef) { setNewRef({ name:'', company:'', contact:'' }); return }
    if (newRef.name) { setReferences(r=>[...r,newRef]); setNewRef(null) }
  }

  function finish() { completeOnboarding({ industry, ...info, services, compliance, experience, references }) }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-logo">
        <div className="onboarding-logo-icon">B</div>
        <span className="onboarding-logo-text">BidCopilot</span>
      </div>
      <div className="onboarding-card">
        <div className="step-dots">
          {Array.from({length:TOTAL}).map((_,i)=>(
            <div key={i} className={`step-dot ${i===step?'active':i<step?'done':''}`} />
          ))}
        </div>

        {step===0&&<>
          <div className="onboarding-step-title">What industry are you in?</div>
          <div className="onboarding-step-sub">This loads your industry rule pack, compliance templates, and matching opportunities.</div>
          <div className="industry-grid">
            {INDUSTRIES.map(ind=>(
              <button key={ind.key} className={`industry-card ${industry===ind.key?'selected':''} ${ind.soon?'coming-soon':''}`}
                onClick={()=>!ind.soon&&setIndustry(ind.key)} disabled={ind.soon}>
                <span className="industry-card-icon">{ind.icon}</span>
                <div className="industry-card-label">{ind.label}</div>
                <div className="industry-card-sub">{ind.sub}</div>
              </button>
            ))}
          </div>
        </>}

        {step===1&&<>
          <div className="onboarding-step-title">Tell us about your company</div>
          <div className="onboarding-step-sub">Used to personalise opportunities, scoring, and bid content.</div>
          <div className="form-group">
            <label className="form-label">Company name</label>
            <input type="text" placeholder="e.g. Bright Clean Ltd" value={info.companyName} onChange={e=>setInfo(b=>({...b,companyName:e.target.value}))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" placeholder="e.g. Manchester" value={info.location} onChange={e=>setInfo(b=>({...b,location:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Staff count</label>
              <select value={info.staffCount} onChange={e=>setInfo(b=>({...b,staffCount:e.target.value}))}>
                <option value="">Select</option>
                {STAFF.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Operating region</label>
            <input type="text" placeholder="e.g. Greater Manchester, North West" value={info.operatingRegion} onChange={e=>setInfo(b=>({...b,operatingRegion:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Target contract size</label>
            <div className="pill-grid">
              {[['1k-10k','£1k–£10k'],['10k-50k','£10k–£50k'],['50k-plus','£50k+']].map(([k,l])=>(
                <button key={k} className={`pill ${info.contractTargetRange===k?'selected':''}`} onClick={()=>setInfo(b=>({...b,contractTargetRange:k}))}>{l}</button>
              ))}
            </div>
          </div>
        </>}

        {step===2&&<>
          <div className="onboarding-step-title">What services do you offer?</div>
          <div className="onboarding-step-sub">Select all that apply. Used to match tender opportunities.</div>
          <div className="pill-grid">
            {(SERVICES[industry]||[]).map(s=>(
              <button key={s} className={`pill ${services.includes(s)?'selected':''}`} onClick={()=>toggleService(s)}>{s}</button>
            ))}
          </div>
        </>}

        {step===3&&<>
          <div className="onboarding-step-title">Compliance profile</div>
          <div className="onboarding-step-sub">Be accurate — this directly affects your compliance scores and gap analysis.</div>
          <div className="check-row">
            <div><div className="check-label">Public liability insurance</div><div className="check-sub">Required for almost all public sector tenders</div></div>
            <Toggle checked={compliance.publicLiability} onChange={v=>setCompliance(c=>({...c,publicLiability:v}))} />
          </div>
          {compliance.publicLiability&&(
            <div style={{paddingLeft:0,margin:'8px 0'}}>
              <label className="form-label">Coverage value (£M)</label>
              <input type="number" placeholder="e.g. 5" value={compliance.publicLiabilityValue} onChange={e=>setCompliance(c=>({...c,publicLiabilityValue:e.target.value}))} style={{width:120}} />
            </div>
          )}
          <div className="check-row">
            <div><div className="check-label">Employers liability insurance</div><div className="check-sub">Legally required if you have employees</div></div>
            <Toggle checked={compliance.employersLiability} onChange={v=>setCompliance(c=>({...c,employersLiability:v}))} />
          </div>
          <div className="check-row">
            <div><div className="check-label">Health & Safety policy</div><div className="check-sub">Written policy signed by a director</div></div>
            <Toggle checked={compliance.healthSafety} onChange={v=>setCompliance(c=>({...c,healthSafety:v}))} />
          </div>
          <div className="check-row">
            <div><div className="check-label">Risk assessments</div><div className="check-sub">Documented for your core work activities</div></div>
            <Toggle checked={compliance.riskAssessments} onChange={v=>setCompliance(c=>({...c,riskAssessments:v}))} />
          </div>
          {industry==='cleaning'&&<div className="check-row">
            <div><div className="check-label">COSHH compliance</div><div className="check-sub">Chemical handling assessments</div></div>
            <Toggle checked={compliance.coshh} onChange={v=>setCompliance(c=>({...c,coshh:v}))} />
          </div>}
          {industry==='security'&&<div className="check-row">
            <div><div className="check-label">SIA licence</div><div className="check-sub">Security Industry Authority licence</div></div>
            <Toggle checked={compliance.siaLicence} onChange={v=>setCompliance(c=>({...c,siaLicence:v}))} />
          </div>}
          <div className="check-row">
            <div><div className="check-label">ISO 9001 certification</div><div className="check-sub">Quality management system</div></div>
            <Toggle checked={compliance.iso9001} onChange={v=>setCompliance(c=>({...c,iso9001:v}))} />
          </div>
        </>}

        {step===4&&<>
          <div className="onboarding-step-title">Past contracts & experience</div>
          <div className="onboarding-step-sub">Add previous contracts. Used in bid generation and experience scoring. More = better bids.</div>
          {experience.map((p,i)=>(
            <div className="project-card" key={i}>
              <div className="project-card-header">
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{p.clientName}</div>
                  <div style={{fontSize:11,color:'#6B6B80'}}>{p.sector} · {p.contractValue} · {p.duration}</div>
                </div>
                <button className="btn btn-sm" style={{color:'#DC2626',borderColor:'#FECACA',fontSize:11}} onClick={()=>setExperience(e=>e.filter((_,j)=>j!==i))}>Remove</button>
              </div>
              <div style={{fontSize:12,color:'#4B5563'}}>{p.description}</div>
            </div>
          ))}
          {newProj?(
            <div className="project-card">
              <div className="form-row">
                <div className="form-group"><label className="form-label">Client name</label>
                  <input type="text" placeholder="e.g. Manchester City Council" value={newProj.clientName} onChange={e=>setNewProj(p=>({...p,clientName:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Contract value</label>
                  <input type="text" placeholder="e.g. £25,000" value={newProj.contractValue} onChange={e=>setNewProj(p=>({...p,contractValue:e.target.value}))} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Duration</label>
                  <input type="text" placeholder="e.g. 2 years" value={newProj.duration} onChange={e=>setNewProj(p=>({...p,duration:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Outcome</label>
                  <select value={newProj.outcome} onChange={e=>setNewProj(p=>({...p,outcome:e.target.value}))}>
                    <option value="completed">Completed</option><option value="ongoing">Ongoing</option>
                  </select></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label>
                <textarea placeholder="Describe the scope of work..." value={newProj.description} onChange={e=>setNewProj(p=>({...p,description:e.target.value}))} /></div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary btn-sm" onClick={saveProject}>Save project</button>
                <button className="btn btn-sm" onClick={()=>setNewProj(null)}>Cancel</button>
              </div>
            </div>
          ):<button className="add-btn" onClick={saveProject}>+ Add a past contract</button>}
        </>}

        {step===5&&<>
          <div className="onboarding-step-title">References</div>
          <div className="onboarding-step-sub">Client references strengthen your bids and credibility score. Contact details optional.</div>
          {references.map((r,i)=>(
            <div className="project-card" key={i}>
              <div className="project-card-header">
                <div><div style={{fontSize:13,fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:'#6B6B80'}}>{r.company}</div></div>
                <button className="btn btn-sm" style={{color:'#DC2626',borderColor:'#FECACA',fontSize:11}} onClick={()=>setReferences(r=>r.filter((_,j)=>j!==i))}>Remove</button>
              </div>
              {r.contact&&<div style={{fontSize:12,color:'#6B6B80'}}>{r.contact}</div>}
            </div>
          ))}
          {newRef?(
            <div className="project-card">
              <div className="form-row">
                <div className="form-group"><label className="form-label">Name</label>
                  <input type="text" placeholder="Contact name" value={newRef.name} onChange={e=>setNewRef(r=>({...r,name:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Company</label>
                  <input type="text" placeholder="Organisation" value={newRef.company} onChange={e=>setNewRef(r=>({...r,company:e.target.value}))} /></div>
              </div>
              <div className="form-group"><label className="form-label">Contact details (optional)</label>
                <input type="text" placeholder="Email or phone" value={newRef.contact} onChange={e=>setNewRef(r=>({...r,contact:e.target.value}))} /></div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary btn-sm" onClick={saveRef}>Save reference</button>
                <button className="btn btn-sm" onClick={()=>setNewRef(null)}>Cancel</button>
              </div>
            </div>
          ):<button className="add-btn" onClick={saveRef}>+ Add a reference</button>}
          <div style={{marginTop:16,padding:12,background:'#F9FAFB',borderRadius:8,border:'1px solid #E8E8EE',fontSize:12,color:'#6B6B80'}}>
            You can skip this for now — references can be added later in Company Profile.
          </div>
        </>}

        <div style={{display:'flex',gap:10,marginTop:24}}>
          {step>0&&<button className="btn" onClick={()=>setStep(s=>s-1)}>← Back</button>}
          {step<TOTAL-1
            ?<button className="btn btn-primary" style={{flex:1,justifyContent:'center'}} onClick={()=>setStep(s=>s+1)} disabled={!canNext}>Continue →</button>
            :<button className="btn btn-primary" style={{flex:1,justifyContent:'center'}} onClick={finish}>Complete setup →</button>
          }
        </div>
        <div style={{textAlign:'center',marginTop:10,fontSize:12,color:'#9CA3AF'}}>Step {step+1} of {TOTAL}</div>
      </div>
    </div>
  )
}
