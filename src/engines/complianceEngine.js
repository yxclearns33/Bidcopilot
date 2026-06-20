import { SECTORS, TURNOVER_VALUES } from '../data/sectors'

export function runComplianceCheck(opportunity, company) {
  if (!company || !company.industry) return null

  const sector = SECTORS[company.industry]
  if (!sector) return null

  const results = []
  const opp = opportunity
  const oppValue = opp.valueNum || 0

  // ─── 1. INSURANCE CHECK ──────────────────────────────────────────────────
  const plValue = parseFloat(company.compliance?.publicLiabilityValue) || 0
  const minIns = opp.minInsurance || sector.insuranceMin || 5

  if (!company.compliance?.publicLiability) {
    results.push({
      id: 'public_liability', label: 'Public liability insurance',
      status: 'fail', severity: 'critical',
      message: `Public liability insurance required. Minimum £${minIns}M for this tender.`,
      impact: 94,
      fix: 'Contact your insurer for a certificate of currency. Most insurers can issue within 1–2 business days.',
      category: 'Insurance'
    })
  } else if (plValue < minIns) {
    results.push({
      id: 'public_liability', label: 'Public liability insurance',
      status: 'risk', severity: 'critical',
      message: `Your coverage (£${plValue}M) may be below the £${minIns}M minimum required.`,
      impact: 88,
      fix: `Contact your insurer to increase coverage to £${minIns}M before submitting.`,
      category: 'Insurance'
    })
  } else {
    results.push({ id: 'public_liability', label: 'Public liability insurance', status: 'pass', severity: 'critical', category: 'Insurance' })
  }

  if (!company.compliance?.employersLiability) {
    results.push({
      id: 'employers_liability', label: 'Employers liability insurance',
      status: 'fail', severity: 'critical',
      message: 'Legally required if you have any employees. Most tenders require this as a gateway check.',
      impact: 90,
      fix: 'Contact your insurer — legally required for any business with employees.',
      category: 'Insurance'
    })
  } else {
    results.push({ id: 'employers_liability', label: 'Employers liability insurance', status: 'pass', severity: 'critical', category: 'Insurance' })
  }

  // ─── 2. FINANCIAL STANDING ───────────────────────────────────────────────
  if (oppValue > 0 && company.turnoverBand) {
    const turnover = TURNOVER_VALUES[company.turnoverBand] || 0
    const required = oppValue * 2
    if (turnover < required) {
      results.push({
        id: 'financial_standing', label: 'Financial standing (turnover)',
        status: turnover < oppValue ? 'fail' : 'risk',
        severity: 'critical',
        message: `Most buyers require annual turnover of at least 2x contract value (£${(required/1000).toFixed(0)}k+). Your declared band may fall short.`,
        impact: 85,
        fix: 'Some buyers allow joint bids or additional financial evidence. Check tender documents carefully.',
        category: 'Financial'
      })
    } else {
      results.push({ id: 'financial_standing', label: 'Financial standing (turnover)', status: 'pass', severity: 'critical', category: 'Financial' })
    }
  }

  if (company.yearsTrading === 'Less than 1 year') {
    results.push({
      id: 'years_trading', label: 'Years trading',
      status: 'risk', severity: 'high',
      message: 'Less than 1 year trading. Many tenders require minimum 2 years trading history.',
      impact: 70,
      fix: 'Some tenders allow new companies with strong references or parent company guarantees.',
      category: 'Financial'
    })
  } else if (company.yearsTrading === '1–2 years') {
    results.push({
      id: 'years_trading', label: 'Years trading',
      status: 'risk', severity: 'medium',
      message: '1–2 years trading. Some tenders require minimum 2–3 years trading history.',
      impact: 45,
      fix: 'Ensure you have strong references and audited accounts to compensate.',
      category: 'Financial'
    })
  } else {
    results.push({ id: 'years_trading', label: 'Years trading', status: 'pass', severity: 'medium', category: 'Financial' })
  }

  // ─── 3. POLICIES CHECK ───────────────────────────────────────────────────
  const policies = sector.policies || []
  for (const policy of policies) {
    const has = !!company.compliance?.[policy.id]
    results.push({
      id: policy.id,
      label: policy.label,
      status: has ? 'pass' : (policy.severity === 'critical' ? 'fail' : policy.severity === 'high' ? 'risk' : 'risk'),
      severity: policy.severity,
      message: has ? '' : `${policy.label} not declared. ${policy.sub}.`,
      impact: policy.severity === 'critical' ? 88 : policy.severity === 'high' ? 65 : 40,
      fix: `Produce a written ${policy.label.toLowerCase()} signed by a company director.`,
      category: 'Policies'
    })
  }

  // ─── 4. ACCREDITATIONS ───────────────────────────────────────────────────
  const accreds = sector.accreditations || []
  const hasAnyHs = accreds
    .filter(a => ['chas','safecontractor','smas'].includes(a.id))
    .some(a => company.accreditations?.[a.id])

  if (!hasAnyHs) {
    results.push({
      id: 'ssip_accreditation', label: 'SSIP H&S Accreditation (CHAS / SafeContractor / SMAS)',
      status: 'risk', severity: 'high',
      message: 'No SSIP-recognised H&S accreditation on file. Most public sector buyers require at least one.',
      impact: 72,
      fix: 'Apply for CHAS, SafeContractor, or SMAS. Takes 4–8 weeks. CHAS is most widely recognised.',
      category: 'Accreditations'
    })
  } else {
    results.push({ id: 'ssip_accreditation', label: 'SSIP H&S Accreditation', status: 'pass', severity: 'high', category: 'Accreditations' })
  }

  // ─── 5. EXPERIENCE CHECK ─────────────────────────────────────────────────
  const refs = company.references?.length || 0
  const exp = company.experience?.length || 0

  if (refs === 0) {
    results.push({
      id: 'references', label: 'Client references',
      status: 'fail', severity: 'critical',
      message: 'No client references on file. Most tenders require minimum 2–3 references.',
      impact: 80,
      fix: 'Add at least 2 client references to your profile. Contact previous clients for permission.',
      category: 'Experience'
    })
  } else if (refs < 2) {
    results.push({
      id: 'references', label: 'Client references',
      status: 'risk', severity: 'high',
      message: 'Only 1 reference on file. Most tenders require minimum 2–3.',
      impact: 60,
      fix: 'Add at least 1 more client reference to your profile.',
      category: 'Experience'
    })
  } else {
    results.push({ id: 'references', label: 'Client references', status: 'pass', severity: 'critical', category: 'Experience' })
  }

  if (exp === 0) {
    results.push({
      id: 'experience', label: 'Past contract experience',
      status: 'risk', severity: 'high',
      message: 'No past contracts on file. Evaluators need to see evidence of similar work.',
      impact: 65,
      fix: 'Add past contracts to your profile — even small ones demonstrate capability.',
      category: 'Experience'
    })
  } else {
    results.push({ id: 'experience', label: 'Past contract experience', status: 'pass', severity: 'high', category: 'Experience' })
  }

  // ─── 6. DYNAMIC SERVICE-SPECIFIC CHECKS ──────────────────────────────────
  const selectedServices = company.services || []
  const dynamicQ = sector.dynamicQuestions || {}

  for (const serviceId of selectedServices) {
    const dq = dynamicQ[serviceId]
    if (!dq) continue
    for (const q of dq.questions) {
      const has = !!company.dynamicCompliance?.[q.id]
      if (!has) {
        results.push({
          id: q.id, label: q.label,
          status: q.severity === 'critical' ? 'fail' : 'risk',
          severity: q.severity,
          message: `Required for ${dq.label}: ${q.label} not confirmed.`,
          impact: q.severity === 'critical' ? 90 : 65,
          fix: `Obtain or document ${q.label} before bidding on ${dq.label} contracts.`,
          category: dq.label
        })
      }
    }
  }

  // ─── SUMMARY ─────────────────────────────────────────────────────────────
  const critical = results.filter(r => r.status === 'fail' && r.severity === 'critical').length
  const high = results.filter(r => r.status !== 'pass' && r.severity === 'high').length
  const passed = results.filter(r => r.status === 'pass').length
  const verdict = critical > 0 ? 'at-risk' : high > 1 ? 'caution' : high === 1 ? 'caution' : 'clear'

  return { results, critical, high, passed, total: results.length, verdict }
}
