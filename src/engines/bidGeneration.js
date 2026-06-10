export function generateBidSections(opportunity, company) {
  const name = company?.companyName || 'Our Company'
  const location = company?.location || 'the UK'
  const industry = company?.industry || 'services'
  const services = (company?.services || []).join(', ') || `${industry} services`
  const staff = company?.staffCount || 'experienced'
  const projects = company?.experience || []
  const topProject = projects[0]

  return {
    exec: `${name} is pleased to submit this proposal for ${opportunity.title}. We are a specialist ${services} provider based in ${location}, with a proven track record of delivering high-quality, compliant services to public and private sector clients.\n\nWe have carefully reviewed all tender documentation and confirm our full commitment to meeting every requirement set out by ${opportunity.buyer}. Our proposal demonstrates both our technical capability and our deep understanding of what this contract demands.`,

    understanding: `We understand that ${opportunity.buyer} requires ${opportunity.title}. Having reviewed the specification in full, we recognise the following key requirements:\n\n${(opportunity.extractedRequirements || []).map(r => `• ${r}`).join('\n') || `• Deliver the specified ${industry} services to the required standard\n• Maintain full regulatory compliance throughout\n• Provide responsive account management and reporting`}\n\nWe confirm our full ability to meet each of these requirements.`,

    methodology: `Our methodology ensures delivery of ${opportunity.title} to the highest standard:\n\n1. Mobilisation & site survey\nWe will commence with a detailed site assessment to confirm all specifications and agree the delivery schedule with ${opportunity.buyer}.\n\n2. Staffing & deployment\nAll staff assigned to this contract will be fully trained, vetted, and briefed before commencement. ${staff} trained operatives available.\n\n3. Service delivery\nDay-to-day delivery managed by a dedicated Contract Manager, with regular supervisor checks and client sign-off at agreed intervals.\n\n4. Quality monitoring\nWeekly quality audits, monthly reporting, and quarterly reviews with the client to ensure continuous improvement.`,

    delivery: `Our delivery plan provides ${opportunity.buyer} with a structured, milestone-driven approach:\n\n• Week 1–2: Contract mobilisation, staff induction, site survey\n• Week 3: Service commencement\n• Month 1 review: Initial performance assessment\n• Ongoing: Monthly reporting and quarterly client reviews\n\nA dedicated Contract Manager will be the single point of contact for all operational matters. They have direct authority to resolve issues without escalation delays.`,

    staffing: `${name} employs ${staff} staff across our operations. All personnel on this contract will:\n\n• Hold relevant qualifications and certifications\n• Have completed our induction and compliance training programme\n• Be subject to DBS checks where required\n• Be supervised by a named manager with direct accountability\n\nWe maintain a trained backup pool to guarantee service continuity with no disruption to ${opportunity.buyer}.`,

    risk: `Key risks identified for ${opportunity.title} and our mitigations:\n\n• Staff absence — Trained backup pool with 4-hour mobilisation SLA\n• Equipment failure — Fully maintained fleet with spare inventory on standby\n• Regulatory change — Dedicated compliance monitoring and quarterly policy reviews\n• Client site access — Access protocols agreed at mobilisation with named client contact\n\nAll risks are monitored throughout the contract and escalated immediately when thresholds are reached.`,

    quality: `${name} operates a robust quality management system${company?.compliance?.iso9001 ? ' certified to ISO 9001' : ''}. Our quality framework includes:\n\n• Regular site inspections and supervisor audits\n• Client satisfaction surveys at agreed intervals\n• Non-conformance reporting and corrective action procedures\n• Staff training and performance reviews\n\nWe are committed to continuous improvement and welcome client feedback as a core part of our quality cycle.`,

    social: `As a ${location}-based business, we deliver genuine social value through this contract:\n\n• Local employment: We prioritise recruiting from the local area\n• Training & development: We support apprenticeships and upskilling in our sector\n• Supply chain: We use local and SME suppliers wherever commercially viable\n• Environment: We actively reduce our operational carbon footprint year-on-year\n\nA detailed Social Value Plan specific to this contract is available on request.`,

    pricing: `Our pricing for ${opportunity.title} is competitive, transparent, and inclusive of all costs.\n\nAll labour, materials, management, insurance, and compliance overheads are included. We propose a fixed-price model to provide full cost certainty for ${opportunity.buyer}, with a clear change control process for any scope variations.\n\nA detailed pricing schedule is provided in the accompanying Appendix. We welcome discussion of our pricing structure or value engineering options at interview stage.`,
  }
}

export const BID_SECTIONS = [
  { key: 'exec',          label: '1. Executive Summary' },
  { key: 'understanding', label: '2. Understanding of Requirements' },
  { key: 'methodology',   label: '3. Methodology' },
  { key: 'delivery',      label: '4. Delivery Plan' },
  { key: 'staffing',      label: '5. Staffing Plan' },
  { key: 'risk',          label: '6. Risk Management' },
  { key: 'quality',       label: '7. Quality Assurance' },
  { key: 'social',        label: '8. Social Value' },
  { key: 'pricing',       label: '9. Pricing Narrative' },
]
