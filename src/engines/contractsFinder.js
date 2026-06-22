import { computeFitScore } from './fitScoring'
import { runComplianceCheck } from './complianceEngine'

// Supabase Edge Function URL — no CORS issues
const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contracts-finder`
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Hardcoded fallback tenders
const FALLBACK_TENDERS = {
  cleaning: [
    { id:'fallback-cl-1', title:'Office Cleaning Services — Manchester City Council', buyer:'Manchester City Council', value:'£45,000', valueNum:45000, location:'Manchester', deadline:'28 Jun 2026', daysLeft:18, industry:'cleaning', source:'Sample tender', minInsurance:5, summary:'Office cleaning services for Manchester City Council offices across the city centre. Daily cleaning of approximately 4,000 sq ft of office space.' },
    { id:'fallback-cl-2', title:'School Cleaning Contract — Salford Academy Trust', buyer:'Salford Academy Trust', value:'£28,000', valueNum:28000, location:'Salford', deadline:'5 Jul 2026', daysLeft:25, industry:'cleaning', source:'Sample tender', minInsurance:5, summary:'Cleaning services for three primary schools in the Salford area. Enhanced DBS checks required for all staff.' },
    { id:'fallback-cl-3', title:'Healthcare Cleaning — Trafford NHS Trust', buyer:'Trafford NHS Trust', value:'£95,000', valueNum:95000, location:'Trafford', deadline:'15 Jul 2026', daysLeft:35, industry:'cleaning', source:'Sample tender', minInsurance:10, summary:'Clinical and domestic cleaning services for NHS community health facilities.' },
  ],
  security: [
    { id:'fallback-sc-1', title:'Security Guarding Services — MediaCityUK', buyer:'MediaCityUK Ltd', value:'£120,000', valueNum:120000, location:'Salford', deadline:'10 Jul 2026', daysLeft:30, industry:'security', source:'Sample tender', minInsurance:5, summary:'Manned guarding and access control for MediaCityUK campus. SIA ACS required.' },
    { id:'fallback-sc-2', title:'CCTV Monitoring Contract — Trafford Council', buyer:'Trafford Metropolitan Borough Council', value:'£65,000', valueNum:65000, location:'Trafford', deadline:'20 Jul 2026', daysLeft:40, industry:'security', source:'Sample tender', minInsurance:5, summary:'Remote CCTV monitoring services for council-owned properties and town centres.' },
  ],
  construction: [
    { id:'fallback-cn-1', title:'Office Refurbishment — Salford City Council', buyer:'Salford City Council', value:'£250,000', valueNum:250000, location:'Salford', deadline:'1 Aug 2026', daysLeft:42, industry:'construction', source:'Sample tender', minInsurance:10, summary:'Internal refurbishment of Grade B office accommodation including M&E, partitioning and decoration.' },
    { id:'fallback-cn-2', title:'School Maintenance Framework — Greater Manchester', buyer:'Greater Manchester Combined Authority', value:'£500,000', valueNum:500000, location:'Greater Manchester', deadline:'15 Aug 2026', daysLeft:56, industry:'construction', source:'Sample tender', minInsurance:10, summary:'Reactive and planned maintenance works across school estate. CDM 2015 compliance required.' },
  ],
}

function addComplianceData(tender, company) {
  if (!company) return tender
  return {
    ...tender,
    requiredCompliance: tender.requiredCompliance || [],
    evaluationCriteria: tender.evaluationCriteria || [
      { criterion:'Quality & methodology', weight:40 },
      { criterion:'Price', weight:35 },
      { criterion:'Social value', weight:15 },
      { criterion:'Experience', weight:10 },
    ],
    winTips: tender.winTips || [
      'Address all evaluation criteria explicitly in your bid',
      'Upload the full tender document for a detailed compliance analysis',
      'Ensure all mandatory compliance documents are ready before submitting',
    ],
    fitScore: computeFitScore(tender, company),
    compliance: runComplianceCheck(tender, company),
  }
}

export async function fetchContractsFinder(company, options = {}) {
  const sector = company?.industry || 'cleaning'
  const { size = 20, page = 0 } = options

  // Try Edge Function first
  try {
    const response = await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ sector, size, page }),
    })

    if (!response.ok) throw new Error(`Edge function returned ${response.status}`)

    const data = await response.json()

    if (data.success && data.results && data.results.length > 0) {
      return {
        success: true,
        results: data.results.map(t => addComplianceData(t, company)),
        total: data.total,
        source: 'api',
      }
    }

    throw new Error('No results from API')

  } catch (err) {
    console.warn('Contracts Finder API unavailable, using fallback:', err.message)

    // Use fallback tenders for this sector
    const fallback = FALLBACK_TENDERS[sector] || FALLBACK_TENDERS.cleaning

    return {
      success: true,
      results: fallback.map(t => addComplianceData(t, company)),
      total: fallback.length,
      source: 'fallback',
    }
  }
}

export async function pingContractsFinder() {
  try {
    const res = await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ sector: 'cleaning', size: 1 }),
    })
    return res.ok
  } catch {
    return false
  }
}
