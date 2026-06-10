import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'

export default function UploadTender({ onNavigate }) {
  const { setUploadedTender, setActiveOpportunity, opportunities } = useApp()
  const [step, setStep] = useState(0)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [industry, setIndustry] = useState('')
  const [country, setCountry] = useState('United Kingdom')
  const [size, setSize] = useState('')
  const ref = useRef()

  function handleFile(f) { if(!f) return; setFile(f); setStep(1) }
  function handleDrop(e) { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }

  function runAnalysis() {
    setLoading(true); setStep(2)
    setTimeout(()=>{
      setUploadedTender({ name: file?.name || 'tender.pdf', industry, country, size })
      const match = opportunities.find(o=>!industry||o.industry===industry) || opportunities[0]
      setActiveOpportunity(match)
      setLoading(false)
      onNavigate('analysis')
    }, 2600)
  }

  const STEPS = ['Upload document','Add context','Analysing']

  return (
    <div style={{maxWidth:640,margin:'0 auto'}}>
      {/* Step indicator */}
      <div style={{display:'flex',alignItems:'center',marginBottom:24}}>
        {STEPS.map((s,i)=>(
          <div key={s} style={{display:'flex',alignItems:'center',flex:i<STEPS.length-1?1:'auto'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:i<step||step===2?'#4F46E5':i===step?'#4F46E5':'#F0F0F5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:i<=step?'#fff':'#9CA3AF',flexShrink:0}}>
                {i<step||step===2?'✓':i+1}
              </div>
              <span style={{fontSize:12,fontWeight:500,color:i===step?'#1A1A2E':i<step?'#4F46E5':'#9CA3AF'}}>{s}</span>
            </div>
            {i<STEPS.length-1&&<div style={{flex:1,height:1,background:i<step?'#4F46E5':'#E0E0EA',margin:'0 10px'}}/>}
          </div>
        ))}
      </div>

      <div className="card">
        {step===0&&<>
          <div className="card-header">
            <div><div className="card-title">Upload tender document</div><div className="card-subtitle">AI will analyse requirements, risks, and compliance gaps</div></div>
          </div>
          <div className={`upload-zone ${dragging?'dragging':''}`}
            onClick={()=>ref.current.click()}
            onDragOver={e=>{e.preventDefault();setDragging(true)}}
            onDragLeave={()=>setDragging(false)}
            onDrop={handleDrop}>
            <div style={{fontSize:40,marginBottom:12}}>☁</div>
            <div style={{fontSize:15,fontWeight:600,color:'#1A1A2E',marginBottom:6}}>Drag & drop your tender document here</div>
            <div style={{fontSize:13,color:'#6B6B80',marginBottom:16}}>PDF or DOCX, up to 50 MB</div>
            <button className="btn">Browse files</button>
            <input ref={ref} type="file" accept=".pdf,.docx" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])} />
          </div>
          <div style={{marginTop:20,padding:14,background:'#F9FAFB',borderRadius:8}}>
            <div style={{fontSize:12,fontWeight:600,color:'#1A1A2E',marginBottom:8}}>What you'll get instantly</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[['⚡','Disqualification risk assessment'],['✓','Compliance requirements checklist'],['◎','Bid readiness score (0–100%)'],['≡','AI-generated bid pack draft']].map(([icon,text])=>(
                <div key={text} style={{display:'flex',gap:8,fontSize:12,color:'#4B5563'}}><span style={{color:'#4F46E5',fontWeight:700}}>{icon}</span>{text}</div>
              ))}
            </div>
          </div>
        </>}

        {step===1&&<>
          <div className="card-header">
            <div><div className="card-title">Additional context</div><div className="card-subtitle">Helps the engine personalise the analysis</div></div>
            <span className="badge badge-green">✓ {file?.name}</span>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select value={industry} onChange={e=>setIndustry(e.target.value)}>
                <option value="">Select industry</option>
                <option>cleaning</option><option>security</option><option>construction</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Company size</label>
              <select value={size} onChange={e=>setSize(e.target.value)}>
                <option value="">Select size</option>
                {['1-5','6-10','11-25','26-50','51-100','100+'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input type="text" value={country} onChange={e=>setCountry(e.target.value)} />
          </div>
          <div style={{display:'flex',gap:10,marginTop:8}}>
            <button className="btn" onClick={()=>setStep(0)}>← Back</button>
            <button className="btn btn-primary btn-full" onClick={runAnalysis}>⚡ Run compliance analysis</button>
          </div>
        </>}

        {step===2&&(
          <div style={{textAlign:'center',padding:'48px 0'}}>
            {loading?(
              <>
                <div className="spinner" style={{margin:'0 auto 16px'}}/>
                <div style={{fontSize:15,fontWeight:600,color:'#1A1A2E',marginBottom:8}}>Analysing tender document...</div>
                <div style={{fontSize:13,color:'#6B6B80'}}>Scanning for compliance gaps, disqualification risks, and scoring criteria</div>
              </>
            ):(
              <>
                <div style={{fontSize:40,marginBottom:12}}>✓</div>
                <div style={{fontSize:15,fontWeight:600}}>Analysis complete</div>
                <div style={{fontSize:13,color:'#6B6B80',marginTop:4}}>Redirecting...</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
