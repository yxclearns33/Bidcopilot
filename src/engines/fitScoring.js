export function computeFitScore(opportunity, company) {
  if (!company) return null
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
  return 0.3
}

function scoreComplianceMatch(opp, company) {
  const required = opp.requiredCompliance || []
  if (required.length === 0) return 0.8
  let passed = 0
  for (const req of required) {
    switch (req) {
      case 'public_liability':
        if (company.compliance?.publicLiability && parseFloat(company.compliance.publicLiabilityValue) >= (opp.minInsurance || 1)) passed++
        break
      case 'employers_liability': if (company.compliance?.employersLiability) passed++; break
      case 'health_safety': if (company.compliance?.healthSafety) passed++; break
      case 'risk_assessments': if (company.compliance?.riskAssessments) passed++; break
      case 'coshh': if (company.compliance?.coshh) passed++; break
      case 'iso_9001': if (company.compliance?.iso9001) passed++; break
      default: passed += 0.5
    }
  }
  return passed / required.length
}

function scoreExperienceMatch(opp, company) {
  const projects = company.experience || []
  if (projects.length === 0) return 0.1
  let best = 0
  for (const proj of projects) {
    let pts = 0
    if (proj.sector?.toLowerCase() === opp.industry?.toLowerCase()) pts += 0.4; else pts += 0.1
    const pv = parseFloat(proj.contractValue?.replace(/[^0-9.]/g, '')) || 0
    const ov = opp.valueNum || 0
    if (pv > 0 && ov > 0) pts += (Math.min(pv, ov) / Math.max(pv, ov)) * 0.4; else pts += 0.2
    if (proj.outcome === 'completed') pts += 0.2
    best = Math.max(best, pts)
  }
  return Math.min(best + Math.min(projects.length / 5, 0.3), 1)
}

function scoreCapacityMatch(opp, company) {
  const caps = { '1-5':10000,'6-10':30000,'11-25':80000,'26-50':200000,'51-100':500000,'100+':9999999 }
  const cap = caps[company.staffCount] || 50000
  const ov = opp.valueNum || 0
  if (ov === 0) return 0.7
  if (ov <= cap) return 1.0
  if (ov <= cap * 1.5) return 0.7
  if (ov <= cap * 2) return 0.4
  return 0.2
}
