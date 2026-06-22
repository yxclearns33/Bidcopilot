import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const CF_API = 'https://www.contractsfinder.service.gov.uk/Published/Notices/PublicSearch/json'

// CPV codes per sector
const SECTOR_CPV = {
  cleaning: [
    '90910000','90911000','90911200','90919000','90919200','90919300',
    '90920000','90921000','90922000',
  ],
  security: [
    '79710000','79711000','79712000','79713000','79714000','79715000',
  ],
  construction: [
    '45000000','45100000','45200000','45210000','45300000','45310000',
    '45330000','45400000','45420000','45440000',
  ],
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const body = await req.json()
    const { sector = 'cleaning', page = 0, size = 20 } = body

    const cpvCodes = SECTOR_CPV[sector] || SECTOR_CPV.cleaning

    const cfBody = {
      searchCriteria: {
        keywords: '',
        cpvCodes,
        publishedFrom: '',
        publishedTo: '',
        deadlineFrom: new Date().toISOString().split('T')[0],
        deadlineTo: '',
        buyerTypes: [],
        locations: [],
        radius: 0,
        valueFrom: null,
        valueTo: null,
        statusFilter: 'ACTIVE',
        types: ['CONTRACT_NOTICE'],
      },
      size,
      page,
      sortBy: 'CLOSING_DATE',
      sortOrder: 'ASC',
    }

    const response = await fetch(CF_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfBody),
    })

    if (!response.ok) {
      throw new Error(`Contracts Finder returned ${response.status}`)
    }

    const data = await response.json()

    // Transform results to our format
    const results = (data.results || data.notices || []).map((notice: any) => {
      const valueNum = notice.value?.amount || 0
      const deadlineStr = notice.deadlineDate || notice.closingDate || ''
      let daysLeft = 30
      let deadline = 'See notice'

      if (deadlineStr) {
        try {
          const d = new Date(deadlineStr)
          daysLeft = Math.max(0, Math.floor((d.getTime() - Date.now()) / (1000*60*60*24)))
          deadline = d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
        } catch {}
      }

      return {
        id: `cf-${notice.id || Math.random().toString(36).substr(2,9)}`,
        title: notice.title || 'Untitled Tender',
        buyer: notice.organisationName || notice.buyerDetails?.name || 'Unknown Buyer',
        value: valueNum > 0
          ? `£${valueNum >= 1000000 ? (valueNum/1000000).toFixed(1)+'M' : Math.round(valueNum/1000)+'k'}`
          : 'Value not specified',
        valueNum,
        location: notice.location || notice.deliveryAddress?.town || 'United Kingdom',
        deadline,
        daysLeft,
        industry: sector,
        source: 'Contracts Finder',
        sourceUrl: `https://www.contractsfinder.service.gov.uk/Notice/${notice.id}`,
        summary: (notice.description || notice.summary || '').substring(0, 300),
        fromApi: true,
        cpvCodes: notice.cpvCodes || [],
        minInsurance: sector === 'construction' ? 5 : 5,
        requiredCompliance: sector === 'cleaning'
          ? ['public_liability','employers_liability','health_safety','coshh','risk_assessments']
          : sector === 'security'
          ? ['public_liability','employers_liability','health_safety','risk_assessments']
          : ['public_liability','employers_liability','health_safety','risk_assessments','rams'],
        evaluationCriteria: [
          { criterion:'Quality & methodology', weight:40 },
          { criterion:'Price', weight:35 },
          { criterion:'Social value', weight:15 },
          { criterion:'Experience', weight:10 },
        ],
        winTips: [
          'Review the full notice on Contracts Finder for detailed requirements',
          'Upload the tender PDF for a detailed compliance analysis',
          'Address all evaluation criteria explicitly in your bid',
        ],
      }
    })

    return new Response(
      JSON.stringify({ success: true, results, total: data.totalResults || results.length }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(
      JSON.stringify({ success: false, error: err.message, results: [] }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }
})
