const RULES = {
  cleaning: [
    { id: 'public_liability', label: 'Public liability insurance', severity: 'critical',
      check: (c,o) => { if (!c.compliance?.publicLiability) return 'fail'; return parseFloat(c.compliance.publicLiabilityValue||0) >= (o.minInsurance||1) ? 'pass' : 'risk' },
      failMsg: o => `Requires £${o.minInsurance||1}M public liability. Not on file.`,
      riskMsg: o => `Your coverage may be below the £${o.minInsurance||1}M minimum.`,
      impact: 94, fix: 'Contact your insurer for a certificate of currency. Usually 1–2 business days.' },
    { id: 'employers_liability', label: 'Employers liability insurance', severity: 'critical',
      check: c => c.compliance?.employersLiability ? 'pass' : 'fail',
      failMsg: () => 'Legally required for any business with employees.',
      impact: 88, fix: 'Legally required if you have staff. Contact your insurer immediately.' },
    { id: 'health_safety', label: 'Health & Safety policy', severity: 'high',
      check: c => c.compliance?.healthSafety ? 'pass' : 'risk',
      riskMsg: () => 'H&S policy not recorded. Required by most public sector buyers.',
      impact: 68, fix: 'A 1–2 page written policy signed by a director is sufficient.' },
    { id: 'risk_assessments', label: 'Risk assessments', severity: 'high',
      check: c => c.compliance?.riskAssessments ? 'pass' : 'risk',
      riskMsg: () => 'No risk assessments on file.',
      impact: 60, fix: 'Generic cleaning risk assessments available from the British Cleaning Council.' },
    { id: 'coshh', label: 'COSHH compliance', severity: 'medium',
      check: c => c.compliance?.coshh ? 'pass' : 'risk',
      riskMsg: () => 'COSHH compliance not confirmed.',
      impact: 45, fix: 'Complete a COSHH assessment for chemicals used. Free templates from HSE.' },
  ],
  security: [
    { id: 'public_liability', label: 'Public liability insurance', severity: 'critical',
      check: (c,o) => { if (!c.compliance?.publicLiability) return 'fail'; return parseFloat(c.compliance.publicLiabilityValue||0) >= (o.minInsurance||2) ? 'pass' : 'fail' },
      failMsg: o => `Requires £${o.minInsurance||2}M public liability.`,
      impact: 95, fix: 'Contact your insurer for updated certificate.' },
    { id: 'sia_licence', label: 'SIA licence', severity: 'critical',
      check: c => c.compliance?.siaLicence ? 'pass' : 'fail',
      failMsg: () => 'SIA licence mandatory for all security providers.',
      impact: 99, fix: 'Apply via the Security Industry Authority. Takes 6–8 weeks.' },
    { id: 'health_safety', label: 'Health & Safety policy', severity: 'high',
      check: c => c.compliance?.healthSafety ? 'pass' : 'risk',
      riskMsg: () => 'H&S policy not confirmed.',
      impact: 65, fix: 'Written policy signed by director required.' },
  ],
  construction: [
    { id: 'public_liability', label: 'Public liability insurance', severity: 'critical',
      check: (c,o) => { if (!c.compliance?.publicLiability) return 'fail'; return parseFloat(c.compliance.publicLiabilityValue||0) >= (o.minInsurance||5) ? 'pass' : 'fail' },
      failMsg: o => `Requires £${o.minInsurance||5}M public liability.`,
      impact: 90, fix: 'Obtain updated certificate from your insurer.' },
    { id: 'health_safety', label: 'Health & Safety policy', severity: 'critical',
      check: c => c.compliance?.healthSafety ? 'pass' : 'fail',
      failMsg: () => 'H&S policy mandatory for all construction tenders.',
      impact: 85, fix: 'Written policy with risk methodology required.' },
    { id: 'risk_assessments', label: 'Risk assessments (RAMS)', severity: 'critical',
      check: c => c.compliance?.riskAssessments ? 'pass' : 'fail',
      failMsg: () => 'RAMS required for all construction submissions.',
      impact: 88, fix: 'Method statement and risk assessment required per trade activity.' },
    { id: 'iso_9001', label: 'ISO 9001 certification', severity: 'medium',
      check: c => c.compliance?.iso9001 ? 'pass' : 'risk',
      riskMsg: () => 'ISO 9001 preferred. May affect quality scoring.',
      impact: 42, fix: 'Certification takes 3–6 months via a UKAS-accredited body.' },
  ],
}

export function runComplianceCheck(opp, company) {
  if (!company) return null
  const rules = RULES[company.industry?.toLowerCase()] || RULES.cleaning
  const results = rules.map(r => {
    const status = r.check(company, opp)
    const message = status === 'fail' ? (r.failMsg?.(opp) || '') : status === 'risk' ? (r.riskMsg?.(opp) || '') : ''
    return { id: r.id, label: r.label, status, severity: r.severity, message, impact: r.impact, fix: r.fix }
  })
  const critical = results.filter(r => r.status === 'fail' && r.severity === 'critical').length
  const high = results.filter(r => r.status !== 'pass' && r.severity === 'high').length
  const passed = results.filter(r => r.status === 'pass').length
  const verdict = critical > 0 ? 'at-risk' : high > 0 ? 'caution' : 'clear'
  return { results, critical, high, passed, total: results.length, verdict }
}
