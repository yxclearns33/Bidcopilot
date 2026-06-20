import { SECTOR_CPV_CODES, cpvToSector } from '../data/cpvCodes'
import { computeFitScore } from './fitScoring'
import { runComplianceCheck } from './complianceEngine'

const CF_API = 'https://www.contractsfinder.service.gov.uk/Published/Notices/PublicSearch/json'

// Transform Contracts Finder API result to our opportunity format
function transformNotice(notice, company) {
  const id = `cf-${notice.id || Math.random().toString(36).substr(2, 9)}`
  const title = notice.title || 'Untitled Tender'
  const buyer = notice.organisationName || notice.buyerDetails?.name || 'Unknown Buyer'
  const valueNum = notice.value?.amount || 0
  const value = valueNum > 0 ? `£${valueNum.toLocaleString()}` : 'Value not specified'
  const deadlineStr = notice.deadlineDate || notice.closingDate || ''
  const deadline = deadlineStr ? new Date(deadlineStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'See notice'
  const daysLeft = deadlineStr ? Math.max(0, Math.floor((new Date(deadlineStr) - new Date()) / (1000 * 60 * 60 * 24))) : 30
  const location = notice.location || notice.deliveryAddress?.town || 'United Kingdom'
  const cpvCode = notice.cpvCodes?.[0] || ''
  const industry = cpvToSector(cpvCode) || company?.industry || 'cleaning'
  const source = 'Contracts Finder'
  const sourceUrl = notice.noticeUrl || `https://www.contractsfinder.service.gov.uk/Notice/${notice.id}`
  const description = notice.description || notice.summary || ''

  // Determine min insurance from sector
  const minInsurance = industry === 'construction' ? 5 : industry === 'security' ? 5 : 5

  // Required compliance based on sector (expanded when Anthropic API connected)
  const sectorCompliance = {
    cleaning: ['public_liability', 'employers_liability', 'health_safety', 'coshh', 'risk_assessments'],
    security: ['public_liability', 'employers_liability', 'health_safety', 'risk_assessments'],
    construction: ['public_liability', 'employers_liability', 'health_safety', 'risk_assessments', 'rams'],
  }

  const opp = {
    id,
    title,
    buyer,
    value,
    valueNum,
    location,
    deadline,
    daysLeft,
    industry,
    source,
    sourceUrl,
    minInsurance,
    requiredCompliance: sectorCompliance[industry] || sectorCompliance.cleaning,
    extractedRequirements: [],
    evaluationCriteria: [
      { criterion: 'Quality & methodology', weight: 40 },
      { criterion: 'Price', weight: 35 },
      { criterion: 'Social value', weight: 15 },
      { criterion: 'Experience', weight: 10 },
    ],
    summary: description.substring(0, 300) || `${title} — ${buyer}`,
    winTips: [
      'Review the full notice on Contracts Finder for detailed requirements',
      'Check evaluation criteria in the tender documents',
      'Upload the tender PDF for a detailed compliance analysis',
    ],
    fromApi: true,
    rawDescription: description,
  }

  if (company) {
    opp.fitScore = computeFitScore(opp, company)
    opp.compliance = runComplianceCheck(opp, company)
  }

  return opp
}

// Fetch live tenders from Contracts Finder
export async function fetchContractsFinder(company, options = {}) {
  const {
    size = 20,
    page = 0,
    minValue = null,
    maxValue = null,
  } = options

  const sector = company?.industry || 'cleaning'
  const cpvCodes = SECTOR_CPV_CODES[sector] || SECTOR_CPV_CODES.cleaning

  const body = {
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
      valueFrom: minValue,
      valueTo: maxValue,
      statusFilter: 'ACTIVE',
      types: ['CONTRACT_NOTICE'],
    },
    size,
    page,
    sortBy: 'CLOSING_DATE',
    sortOrder: 'ASC',
  }

  try {
    const response = await fetch(CF_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) throw new Error(`API error: ${response.status}`)

    const data = await response.json()
    const notices = data.results || data.notices || []

    return {
      success: true,
      results: notices.map(n => transformNotice(n, company)),
      total: data.totalResults || notices.length,
      source: 'api',
    }
  } catch (err) {
    console.warn('Contracts Finder API failed:', err.message)
    return {
      success: false,
      results: [],
      error: err.message,
      source: 'fallback',
    }
  }
}

// Check if API is reachable
export async function pingContractsFinder() {
  try {
    const res = await fetch(CF_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchCriteria: { cpvCodes: ['90910000'], statusFilter: 'ACTIVE', types: ['CONTRACT_NOTICE'] },
        size: 1, page: 0,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
