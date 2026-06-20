import { SECTORS, TURNOVER_VALUES } from '../data/sectors'

export function computeFitScore(opportunity, company) {
  if (!company || !company.industry) return null

  const industry  = scoreIndustryMatch(opportunity, company)
  const compliance = scoreComplianceMatch(opportunity, company)
  const experience = scoreExperienceMatch(opportunity, company)
  const capacity   = scoreCapacityMatch(opportunity, company)

  const weighted = industry*0.25 + compliance*0.25 + experience*0.30 + capacity*0.20

  return {
    overall: Math.round(weighted * 100),
    breakdown: {
      industry:   Math.round(industry * 100),
      compliance: Math.round(compliance * 100),
      experience: Math.round(experience * 100),
      capacity:   Math.round(capacity * 100),
    }
  }
}

function scoreIndustryMatch(opp, company) {
  if (!company.industry || !opp.industry) return 0.5
  if (opp.industry.toLowerCase() === company.industry.toLowerCase()) return 1.0

  // Related sectors
  const related = {
    cleaning: ['facilities','maintenance','hygiene'],
    security: ['facilities','events'],
    construction: ['infrastructure','civil','property'],
  }
  const rel = related[company.industry?.toLowerCase()] || []
  if (rel.some(r => opp.industry?.toLowerCase().includes(r))) return 0.6
  return 0.2
}

function scoreComplianceMatch(opp, company) {
  const sector = SECTORS[company.industry]
  if (!sector) return 0.5

  let score = 0
  let total = 0

  // Insurance check
  const plValue = parseFloat(company.compliance?.publicLiabilityValue) || 0
  const minIns = opp.minInsurance || sector.insuranceMin || 5
  total += 2
  if (company.compliance?.publicLiability && plValue >= minIns) score += 2
  else if (company.compliance?.publicLiability) score += 1

  if (company.compliance?.employersLiability) score++
  total++

  // Critical policies
  const criticalPolicies = (sector.policies || []).filter(p => p.severity === 'critical')
  for (const p of criticalPolicies) {
    total++
    if (company.compliance?.[p.id]) score++
  }

  // SSIP accreditation
  total++
  const hasSSIP = ['chas','safecontractor','smas'].some(a => company.accreditations?.[a])
  if (hasSSIP) score++

  return total > 0 ? score / total : 0.5
}

function scoreExperienceMatch(opp, company) {
  const projects = company.experience || []
  const refs = company.references || []

  if (projects.length === 0 && refs.length === 0) return 0.05

  let score = 0
  const oppValue = opp.valueNum || 0

  // References score
  if (refs.length >= 3) score += 0.3
  else if (refs.length >= 2) score += 0.2
  else if (refs.length >= 1) score += 0.1

  // Experience score
  for (const proj of projects) {
    const pv = parseFloat(proj.contractValue?.replace(/[^0-9.]/g, '')) || 0
    let pts = 0
    if (proj.sector?.toLowerCase() === opp.industry?.toLowerCase()) pts += 0.3
    else pts += 0.1
    if (oppValue > 0 && pv > 0) {
      pts += (Math.min(pv, oppValue) / Math.max(pv, oppValue)) * 0.3
    } else pts += 0.15
    if (proj.outcome === 'completed') pts += 0.1
    score = Math.max(score, score + pts * 0.5)
  }

  // Public sector bonus
  if (company.publicSectorExp) score += 0.1

  return Math.min(score, 1)
}

function scoreCapacityMatch(opp, company) {
  const turnover = TURNOVER_VALUES[company.turnoverBand] || 0
  const oppValue = opp.valueNum || 0

  if (oppValue === 0 || turnover === 0) return 0.6

  // 2x rule — turnover should be at least 2x contract value
  const ratio = turnover / (oppValue * 2)
  if (ratio >= 1) return 1.0
  if (ratio >= 0.75) return 0.8
  if (ratio >= 0.5) return 0.6
  if (ratio >= 0.25) return 0.35
  return 0.15
}
