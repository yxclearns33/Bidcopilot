import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { parseTenderDocument } from '../engines/documentParser'
import { computeFitScore } from '../engines/fitScoring'
import { runComplianceCheck } from '../engines/complianceEngine'

export default function UploadTender({ onNavigate }) {
  const { company, saveUploadedTender, setActiveOpportunity } = useApp()
  const [step, setStep] = useState(0)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')
  const ref = useRef()

  function handleFile(f) {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['pdf','docx'].includes(ext)) { setError('Please upload a PDF or DOCX file.'); return }
    setError(''); setFile(f); setStep(1)
  }

  function handleDrop(e) { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }

  async function runAnalysis() {
    setLoading(true); setStep(2); setError('')
    try {
      setLoadingMsg('Reading document...')
      await new Promise(r => setTimeout(r, 500))
      setLoadingMsg('Extracting requirements and compliance rules...')
      const result = await parseTenderDocument(file)
      if (!result.success) { setError(result.error); setLoading(false); setStep(1); return }
      setLoadingMsg('Running compliance check against your profile...')
      await new Promise(r => setTimeout(r, 600))
      const parsedOpp = result.data
      if (company) {
        parsedOpp.fitScore = computeFitScore(parsedOpp, company)
        parsedOpp.compliance = runComplianceCheck(parsedOpp, company)
      }
      setLoadingMsg('Saving to your account...')
      await saveUploadedTender(parsedOpp)
      setLoadingMsg('Analysis complete!')
      await new Promise(r => setTimeout(r, 400))
      setActiveOpportunity(parsedOpp)
      setLoading(false)
      onNavigate('analysis')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false); setStep(1)
    }
  }

  const STEPS = ['Upload document', 'Confirm', 'Analysing']

  return (
    <div style={{ maxWidth:640, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:24 }}>
        {STEPS.map((s,i) => (
          <div key={s} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 'auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:i<=step?'#4F46E5':'#F0F0F5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:i<=step?'#fff':'#9CA3AF', flexShrink:0 }}>
                {i < step ? '✓' : i+1}
              </div>
              <span style={{ fontSize:12, fontWeight:500, color:i===step?'#1A1A2E':i<step?'#4F46E5':'#9CA3AF' }}>{s}</span>
            </div>
            {i < STEPS.length-1 && <div style={{ flex:1, height:1, background:i<step?'#4F46E5':'#E0E0EA', margin:'0 10px' }}/>}
          </div>
        ))}
      </div>

      <div className="card">
        {step===0 && <>
          <div className="card-header">
            <div><div className="card-title">Upload tender document</div><div className="card-subtitle">AI will extract requirements, deadlines, and run a compliance check</div></div>
          </div>
          {error && <div style={{ padding:'10px 14px', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, fontSize:13, color:'#DC2626', marginBottom:16 }}>{error}</div>}
          <div className={`upload-zone ${dragging?'drag-over':''}`} onClick={()=>ref.current.click()} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop}>
            <div style={{ fontSize:40, marginBottom:12 }}>☁</div>
            <div style={{ fontSize:15, fontWeight:600, color:'#1A1A2E', marginBottom:6 }}>Drag & drop your tender document here</div>
            <div style={{ fontSize:13, color:'#6B6B80', marginBottom:16 }}>PDF or DOCX, up to 50 MB</div>
            <button className="btn">Browse files</button>
            <input ref={ref} type="file" accept=".pdf,.docx" style={{ display:'none' }} onChange={e=>handleFile(e.target.files[0])} />
          </div>
          <div style={{ marginTop:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontSize:12, color:'#6B6B80' }}>Previously uploaded tenders are saved to your account</div>
            <button className="btn btn-sm" onClick={()=>onNavigate('mytenders')}>View my tenders →</button>
          </div>
        </>}

        {step===1 && <>
          <div className="card-header">
            <div><div className="card-title">Ready to analyse</div><div className="card-subtitle">Your document will be parsed and saved to your account</div></div>
            <span className="badge badge-green">✓ {file?.name}</span>
          </div>
          {error && <div style={{ padding:'10px 14px', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, fontSize:13, color:'#DC2626', marginBottom:16 }}>{error}</div>}
          <div style={{ padding:16, background:'#F9FAFB', borderRadius:8, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:500, color:'#1A1A2E', marginBottom:4 }}>File details</div>
            <div style={{ fontSize:12, color:'#6B6B80' }}>
              <div>Name: {file?.name}</div>
              <div>Size: {file ? (file.size/1024).toFixed(1)+' KB' : '—'}</div>
              <div>Type: {file?.name?.split('.').pop().toUpperCase()}</div>
            </div>
          </div>
          {!company && <div style={{ padding:'10px 14px', background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:8, fontSize:12, color:'#92400E', marginBottom:16 }}>⚠ Complete your company profile first for a personalised compliance check.</div>}
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn" onClick={()=>setStep(0)}>← Back</button>
            <button className="btn btn-primary btn-full" onClick={runAnalysis}>⚡ Run analysis</button>
          </div>
        </>}

        {step===2 && (
          <div style={{ textAlign:'center', padding:'48px 0' }}>
            {loading ? (
              <><div className="spinner" style={{ margin:'0 auto 16px' }}/><div style={{ fontSize:15, fontWeight:600, color:'#1A1A2E', marginBottom:8 }}>Analysing tender document...</div><div style={{ fontSize:13, color:'#6B6B80' }}>{loadingMsg}</div></>
            ) : (
              <><div style={{ fontSize:40, marginBottom:12 }}>✓</div><div style={{ fontSize:15, fontWeight:600 }}>Analysis complete</div><div style={{ fontSize:13, color:'#6B6B80', marginTop:4 }}>Redirecting to results...</div></>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
