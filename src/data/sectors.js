// ─── SECTOR DATA ─────────────────────────────────────────────────────────────
// All services, compliance requirements, dynamic questions, and accreditations
// for Cleaning, Security, and Construction sectors.
// Add new requirements here — they flow through automatically.

export const SECTORS = {
  cleaning: {
    label: 'Cleaning',
    icon: '🧹',
    description: 'Office, industrial, education, healthcare and specialist cleaning',
    services: [
      { id: 'commercial',   label: 'Commercial / Office Cleaning' },
      { id: 'education',    label: 'Education Cleaning' },
      { id: 'healthcare',   label: 'Healthcare / NHS Cleaning' },
      { id: 'housing',      label: 'Housing Association Cleaning' },
      { id: 'retail',       label: 'Retail Cleaning' },
      { id: 'industrial',   label: 'Industrial Cleaning' },
      { id: 'window',       label: 'Window Cleaning' },
      { id: 'street',       label: 'Street Cleansing' },
      { id: 'kitchen',      label: 'Kitchen & Duct Cleaning' },
      { id: 'waste',        label: 'Waste Removal Services' },
      { id: 'biohazard',    label: 'Specialist / Biohazard Cleaning' },
    ],
    insuranceLevels: ['£1M', '£2M', '£5M', '£10M+'],
    insuranceMin: 5,
    accreditations: [
      { id: 'chas',            label: 'CHAS',              sub: 'Contractor H&S Assessment Scheme' },
      { id: 'safecontractor',  label: 'SafeContractor',    sub: 'SSIP recognised H&S scheme' },
      { id: 'smas',            label: 'SMAS Worksafe',     sub: 'SSIP recognised H&S scheme' },
      { id: 'iso9001',         label: 'ISO 9001',          sub: 'Quality management system' },
      { id: 'iso14001',        label: 'ISO 14001',         sub: 'Environmental management' },
      { id: 'iso45001',        label: 'ISO 45001',         sub: 'Occupational H&S management' },
      { id: 'bicsc',           label: 'BICSc',             sub: 'British Institute of Cleaning Science' },
      { id: 'cyberessentials', label: 'Cyber Essentials',  sub: 'Required for digital/data contracts' },
    ],
    policies: [
      { id: 'healthSafety',     label: 'Health & Safety Policy',      sub: 'Signed by director, dated within 12 months', severity: 'critical' },
      { id: 'coshh',            label: 'COSHH Assessments',           sub: 'For all chemicals used', severity: 'critical' },
      { id: 'riskAssessments',  label: 'Risk Assessments',            sub: 'For all core cleaning activities', severity: 'critical' },
      { id: 'gdpr',             label: 'GDPR / Data Protection Policy',sub: 'Required for any contract involving personal data', severity: 'high' },
      { id: 'modernSlavery',    label: 'Modern Slavery Statement',     sub: 'Best practice for all public sector bids', severity: 'high' },
      { id: 'equalityDiversity',label: 'Equality & Diversity Policy',  sub: 'Required by most public sector buyers', severity: 'high' },
      { id: 'antiBribery',      label: 'Anti-Bribery Policy',         sub: 'Required under Bribery Act 2010', severity: 'high' },
      { id: 'whistleblowing',   label: 'Whistleblowing Policy',       sub: 'Good practice for public sector bids', severity: 'medium' },
      { id: 'environmental',    label: 'Environmental Policy',         sub: 'Increasingly required post-Procurement Act 2023', severity: 'medium' },
      { id: 'riddor',           label: 'RIDDOR Accident Reporting',   sub: 'Accident reporting system in place', severity: 'high' },
    ],
    dynamicQuestions: {
      education: {
        label: 'Education Cleaning',
        questions: [
          { id: 'enhancedDbs',         label: 'Enhanced DBS checks for all staff',  severity: 'critical' },
          { id: 'safeguardingPolicy',  label: 'Safeguarding policy',                severity: 'critical' },
          { id: 'safeguardingTraining',label: 'Safeguarding training completed',     severity: 'critical' },
          { id: 'educationExp',        label: 'Education cleaning experience',       severity: 'high' },
        ]
      },
      healthcare: {
        label: 'Healthcare / NHS Cleaning',
        questions: [
          { id: 'infectionControl',    label: 'Infection control training',          severity: 'critical' },
          { id: 'clinicalProcedures',  label: 'Clinical cleaning procedures',        severity: 'critical' },
          { id: 'healthcareExp',       label: 'Healthcare cleaning experience',      severity: 'critical' },
          { id: 'healthcareRefs',      label: 'Healthcare client references',        severity: 'high' },
          { id: 'htm0105',             label: 'HTM 01-05 / 01-06 awareness',         severity: 'high' },
        ]
      },
      window: {
        label: 'Window Cleaning',
        questions: [
          { id: 'workingAtHeight',     label: 'Working at Height training',          severity: 'critical' },
          { id: 'ipaf',                label: 'IPAF licence (powered access)',        severity: 'high' },
          { id: 'pasma',               label: 'PASMA (mobile towers)',               severity: 'high' },
          { id: 'rescueProcedures',    label: 'Rescue procedures documented',        severity: 'high' },
        ]
      },
      kitchen: {
        label: 'Kitchen & Duct Cleaning',
        questions: [
          { id: 'tr19',                label: 'TR19 compliance certification',       severity: 'critical' },
          { id: 'greaseExtraction',    label: 'Grease extraction procedures',        severity: 'critical' },
          { id: 'kitchenExp',          label: 'Commercial kitchen cleaning experience', severity: 'high' },
        ]
      },
      waste: {
        label: 'Waste Removal Services',
        questions: [
          { id: 'wasteCarrier',        label: 'Waste Carrier Licence (Environment Agency)', severity: 'critical' },
          { id: 'wasteDisposal',       label: 'Waste disposal procedures documented',       severity: 'critical' },
          { id: 'wasteTransfer',       label: 'Waste Transfer Note system in place',        severity: 'high' },
        ]
      },
      biohazard: {
        label: 'Specialist / Biohazard Cleaning',
        questions: [
          { id: 'biohazardCert',       label: 'Biohazard cleaning certification',    severity: 'critical' },
          { id: 'clinicalWaste',       label: 'Clinical waste disposal procedures',  severity: 'critical' },
          { id: 'specialistEquipment', label: 'Specialist PPE and equipment',        severity: 'critical' },
          { id: 'hazardousWaste',      label: 'Hazardous waste carrier licence',     severity: 'critical' },
        ]
      },
      street: {
        label: 'Street Cleansing',
        questions: [
          { id: 'streetWorksLicence',  label: 'Street Works Licence (NRSWA)',        severity: 'high' },
          { id: 'trafficManagement',   label: 'Traffic management qualification',    severity: 'high' },
          { id: 'localAuthorityExp',   label: 'Local authority experience',          severity: 'high' },
        ]
      },
      industrial: {
        label: 'Industrial Cleaning',
        questions: [
          { id: 'confinedSpace',       label: 'Confined space training',             severity: 'high' },
          { id: 'industrialExp',       label: 'Industrial cleaning experience',      severity: 'high' },
          { id: 'hazchemAwareness',    label: 'HAZCHEM awareness training',          severity: 'high' },
        ]
      },
    }
  },

  security: {
    label: 'Security',
    icon: '🛡️',
    description: 'Manned guarding, CCTV, access control and specialist security',
    services: [
      { id: 'manned',       label: 'Manned Guarding' },
      { id: 'mobile',       label: 'Mobile Patrols' },
      { id: 'cctv',         label: 'CCTV Monitoring' },
      { id: 'access',       label: 'Access Control' },
      { id: 'door',         label: 'Door Supervision' },
      { id: 'keyholding',   label: 'Key Holding & Alarm Response' },
      { id: 'event',        label: 'Event Security' },
      { id: 'retail',       label: 'Retail Security / Loss Prevention' },
      { id: 'close',        label: 'Close Protection' },
      { id: 'concierge',    label: 'Concierge Security' },
      { id: 'void',         label: 'Void Property Security' },
      { id: 'lone',         label: 'Lone Worker Protection' },
    ],
    insuranceLevels: ['£2M', '£5M', '£10M', '£20M+'],
    insuranceMin: 5,
    accreditations: [
      { id: 'siaAcs',          label: 'SIA Approved Contractor Scheme (ACS)', sub: 'Near-mandatory for public sector' },
      { id: 'nsiGold',         label: 'NSI Gold',                            sub: 'BS 7499 manned guarding + BS 7858 vetting' },
      { id: 'ssaib',           label: 'SSAIB',                               sub: 'Equivalent to NSI, accepted by police' },
      { id: 'bs7858',          label: 'BS 7858:2019 Staff Vetting',          sub: 'Required for most security contracts' },
      { id: 'iso9001',         label: 'ISO 9001',                            sub: 'Quality management system' },
      { id: 'iso45001',        label: 'ISO 45001',                           sub: 'Occupational H&S management' },
      { id: 'chas',            label: 'CHAS',                                sub: 'SSIP recognised H&S scheme' },
      { id: 'safecontractor',  label: 'SafeContractor',                      sub: 'SSIP recognised H&S scheme' },
      { id: 'cyberessentials', label: 'Cyber Essentials',                    sub: 'Required for CCTV/data contracts' },
    ],
    policies: [
      { id: 'healthSafety',      label: 'Health & Safety Policy',           sub: 'Signed by director, dated within 12 months', severity: 'critical' },
      { id: 'riskAssessments',   label: 'Risk Assessments',                 sub: 'For all security activities', severity: 'critical' },
      { id: 'gdpr',              label: 'GDPR / Data Protection Policy',    sub: 'Mandatory — security involves personal data', severity: 'critical' },
      { id: 'modernSlavery',     label: 'Modern Slavery Statement',         sub: 'Required for most public sector bids', severity: 'high' },
      { id: 'equalityDiversity', label: 'Equality & Diversity Policy',      sub: 'Required by most public sector buyers', severity: 'high' },
      { id: 'antiBribery',       label: 'Anti-Bribery Policy',              sub: 'Required under Bribery Act 2010', severity: 'high' },
      { id: 'useOfForce',        label: 'Use of Force Policy',              sub: 'Required for manned guarding contracts', severity: 'high' },
      { id: 'incidentReporting', label: 'Incident Reporting Procedures',    sub: 'Required for all security contracts', severity: 'high' },
      { id: 'loneWorking',       label: 'Lone Working Policy',              sub: 'Required where staff work alone', severity: 'high' },
      { id: 'conflictManagement',label: 'Conflict Management Policy',       sub: 'Required for manned guarding', severity: 'high' },
      { id: 'whistleblowing',    label: 'Whistleblowing Policy',            sub: 'Good practice for public sector bids', severity: 'medium' },
    ],
    dynamicQuestions: {
      cctv: {
        label: 'CCTV Monitoring',
        questions: [
          { id: 'cctvSiaLicence',    label: 'CCTV operator SIA licence (staff)',     severity: 'critical' },
          { id: 'icoRegistration',   label: 'ICO registration for CCTV operation',   severity: 'critical' },
          { id: 'dataRetention',     label: 'Data retention policy for CCTV footage',severity: 'critical' },
          { id: 'gdprCctv',          label: 'GDPR CCTV-specific policy',             severity: 'critical' },
          { id: 'cctvExp',           label: 'CCTV monitoring experience',            severity: 'high' },
        ]
      },
      door: {
        label: 'Door Supervision',
        questions: [
          { id: 'doorSupervisorSia', label: 'Door supervisor SIA licence (staff)',   severity: 'critical' },
          { id: 'firstAid',          label: 'First Aid at Work qualification',        severity: 'critical' },
          { id: 'conflictTraining',  label: 'Conflict management training',           severity: 'critical' },
          { id: 'eventExp',          label: 'Event / venue security experience',      severity: 'high' },
        ]
      },
      keyholding: {
        label: 'Key Holding & Alarm Response',
        questions: [
          { id: 'nsiKeyholding',     label: 'NSI / SSAIB key holding accreditation', severity: 'critical' },
          { id: 'policeUrn',         label: 'Police URN (Unique Reference Number)',   severity: 'high' },
          { id: 'response24_7',      label: '24/7 response capability',               severity: 'critical' },
          { id: 'responseSla',       label: 'Response time SLA documented',           severity: 'high' },
        ]
      },
      event: {
        label: 'Event Security',
        questions: [
          { id: 'eventSafetyPlan',   label: 'Event safety management plan',           severity: 'critical' },
          { id: 'crowdManagement',   label: 'Crowd management procedures',            severity: 'critical' },
          { id: 'actTraining',       label: 'ACT Counter Terrorism Awareness training',severity: 'high' },
          { id: 'eventExp',          label: 'Large event security experience',         severity: 'high' },
        ]
      },
      close: {
        label: 'Close Protection',
        questions: [
          { id: 'cpSiaLicence',      label: 'Close protection SIA licence (staff)',   severity: 'critical' },
          { id: 'cpTraining',        label: 'CP operative training certificates',     severity: 'critical' },
          { id: 'riskAssessmentCp',  label: 'CP risk assessment capability',          severity: 'high' },
          { id: 'routePlanning',     label: 'Route planning procedures',              severity: 'high' },
        ]
      },
      void: {
        label: 'Void Property Security',
        questions: [
          { id: 'vacantInsurance',   label: 'Vacant property insurance',             severity: 'critical' },
          { id: 'inspectionRecords', label: 'Regular inspection records',            severity: 'high' },
          { id: 'voidExp',           label: 'Void property security experience',     severity: 'high' },
        ]
      },
      retail: {
        label: 'Retail Security / Loss Prevention',
        questions: [
          { id: 'lpTraining',        label: 'Loss prevention training',              severity: 'high' },
          { id: 'retailExp',         label: 'Retail security experience',            severity: 'high' },
          { id: 'citizensArrest',    label: 'Citizens arrest procedures training',   severity: 'high' },
        ]
      },
    }
  },

  construction: {
    label: 'Construction',
    icon: '🏗️',
    description: 'Building, civil engineering, M&E, fit-out and specialist trades',
    services: [
      { id: 'general',      label: 'General Building & Refurbishment' },
      { id: 'civil',        label: 'Civil Engineering' },
      { id: 'groundworks',  label: 'Groundworks & Drainage' },
      { id: 'roofing',      label: 'Roofing' },
      { id: 'electrical',   label: 'Electrical (M&E)' },
      { id: 'plumbing',     label: 'Plumbing & Heating (M&E)' },
      { id: 'joinery',      label: 'Joinery & Carpentry' },
      { id: 'plastering',   label: 'Plastering & Drylining' },
      { id: 'decorating',   label: 'Painting & Decorating' },
      { id: 'flooring',     label: 'Flooring' },
      { id: 'demolition',   label: 'Demolition' },
      { id: 'scaffolding',  label: 'Scaffolding' },
      { id: 'fitout',       label: 'Fit-Out & Interior' },
      { id: 'landscaping',  label: 'Landscaping & Grounds' },
      { id: 'maintenance',  label: 'Facilities Maintenance' },
      { id: 'fire',         label: 'Fire Protection & Sprinklers' },
      { id: 'asbestos',     label: 'Asbestos Removal' },
      { id: 'highrise',     label: 'High-Risk Buildings (18m+)' },
    ],
    insuranceLevels: ['£2M', '£5M', '£10M', '£20M+'],
    insuranceMin: 5,
    accreditations: [
      { id: 'constructionline', label: 'Constructionline',    sub: 'Silver / Gold / Platinum — most widely required' },
      { id: 'chas',             label: 'CHAS',                sub: 'Standard or Premium Plus' },
      { id: 'safecontractor',   label: 'SafeContractor',      sub: 'SSIP recognised H&S scheme' },
      { id: 'smas',             label: 'SMAS Worksafe',       sub: 'SSIP recognised H&S scheme' },
      { id: 'iso9001',          label: 'ISO 9001',            sub: 'Quality management system' },
      { id: 'iso14001',         label: 'ISO 14001',           sub: 'Environmental management' },
      { id: 'iso45001',         label: 'ISO 45001',           sub: 'Occupational H&S management' },
      { id: 'cyberessentials',  label: 'Cyber Essentials',    sub: 'Required for digital contracts' },
      { id: 'cscs',             label: 'CSCS Cards (all staff)', sub: 'Required for all site workers' },
    ],
    policies: [
      { id: 'healthSafety',      label: 'Health & Safety Policy',         sub: 'Signed by director, dated within 12 months', severity: 'critical' },
      { id: 'rams',              label: 'RAMS (Risk Assessment & Method Statement)', sub: 'Project-specific, not generic templates', severity: 'critical' },
      { id: 'cdm2015',           label: 'CDM 2015 Compliance',            sub: 'Construction Design & Management regulations', severity: 'critical' },
      { id: 'coshh',             label: 'COSHH Assessments',              sub: 'For all hazardous substances used on site', severity: 'critical' },
      { id: 'gdpr',              label: 'GDPR / Data Protection Policy',  sub: 'Required for contracts involving personal data', severity: 'high' },
      { id: 'modernSlavery',     label: 'Modern Slavery Statement',       sub: 'Required for most public sector bids', severity: 'high' },
      { id: 'equalityDiversity', label: 'Equality & Diversity Policy',    sub: 'Required by most public sector buyers', severity: 'high' },
      { id: 'antiBribery',       label: 'Anti-Bribery Policy',            sub: 'Required under Bribery Act 2010', severity: 'high' },
      { id: 'environmental',     label: 'Environmental Policy',           sub: 'Required under Procurement Act 2023', severity: 'high' },
      { id: 'wasteManagement',   label: 'Waste Management Plan',          sub: 'Required for most construction contracts', severity: 'high' },
      { id: 'subcontractor',     label: 'Subcontractor Management Policy',sub: 'Required where subcontractors used', severity: 'high' },
      { id: 'whistleblowing',    label: 'Whistleblowing Policy',          sub: 'Good practice for public sector bids', severity: 'medium' },
    ],
    dynamicQuestions: {
      demolition: {
        label: 'Demolition',
        questions: [
          { id: 'hseNotification',   label: 'HSE demolition notification process',   severity: 'critical' },
          { id: 'asbestosSurvey',    label: 'Asbestos R&D survey before demolition', severity: 'critical' },
          { id: 'structuralEngineer',label: 'Structural engineer sign-off process',  severity: 'critical' },
          { id: 'demolitionExp',     label: 'Demolition experience (3+ projects)',    severity: 'high' },
        ]
      },
      asbestos: {
        label: 'Asbestos Removal',
        questions: [
          { id: 'hseLicence',        label: 'HSE Asbestos Licence (mandatory)',       severity: 'critical' },
          { id: 'asbestosTraining',  label: 'Licensed asbestos training (all staff)', severity: 'critical' },
          { id: 'airMonitoring',     label: 'Air monitoring procedures',              severity: 'critical' },
          { id: 'hazWasteCarrier',   label: 'Hazardous waste carrier licence',        severity: 'critical' },
          { id: 'asbestosExp',       label: 'Licensed asbestos removal experience',   severity: 'critical' },
        ]
      },
      scaffolding: {
        label: 'Scaffolding',
        questions: [
          { id: 'nasc',              label: 'NASC membership',                        severity: 'critical' },
          { id: 'cisrsCard',         label: 'CISRS card (all scaffold operatives)',   severity: 'critical' },
          { id: 'pasma',             label: 'PASMA (mobile towers)',                  severity: 'high' },
          { id: 'scaffoldInspection',label: 'Scaffold inspection records (weekly)',   severity: 'critical' },
          { id: 'wah',               label: 'Working at Height procedures',           severity: 'critical' },
        ]
      },
      electrical: {
        label: 'Electrical (M&E)',
        questions: [
          { id: 'niceic',            label: 'NICEIC / ECA registration',             severity: 'critical' },
          { id: 'partP',             label: 'Part P certification',                   severity: 'critical' },
          { id: '18thEdition',       label: '18th Edition Wiring Regulations',        severity: 'critical' },
          { id: 'jib',               label: 'JIB registered electricians',            severity: 'high' },
          { id: 'electricalExp',     label: 'Commercial electrical experience',       severity: 'high' },
        ]
      },
      plumbing: {
        label: 'Plumbing & Heating (M&E)',
        questions: [
          { id: 'gasSafe',           label: 'Gas Safe Register (mandatory for gas work)', severity: 'critical' },
          { id: 'waterRegs',         label: 'Water Regulations compliance',           severity: 'critical' },
          { id: 'legionella',        label: 'Legionella risk assessment capability',  severity: 'high' },
          { id: 'ciphe',             label: 'CIPHE / APHC membership',               severity: 'high' },
        ]
      },
      highrise: {
        label: 'High-Risk Buildings (18m+)',
        questions: [
          { id: 'buildingSafetyAct', label: 'Building Safety Act 2022 compliance',   severity: 'critical' },
          { id: 'bsrRegistration',   label: 'Building Safety Regulator (BSR) awareness', severity: 'critical' },
          { id: 'competenceFramework',label: 'Higher risk buildings competence framework', severity: 'critical' },
          { id: 'highRiseExp',       label: 'High-rise construction experience',      severity: 'critical' },
        ]
      },
      fire: {
        label: 'Fire Protection & Sprinklers',
        questions: [
          { id: 'bafe',              label: 'BAFE accreditation',                    severity: 'critical' },
          { id: 'bs5839',            label: 'BS 5839 compliance',                    severity: 'critical' },
          { id: 'fiaMemember',       label: 'FIA membership',                        severity: 'high' },
          { id: 'fireExp',           label: 'Fire protection installation experience',severity: 'high' },
        ]
      },
      roofing: {
        label: 'Roofing',
        questions: [
          { id: 'nfrc',              label: 'NFRC membership',                       severity: 'high' },
          { id: 'wahRoofing',        label: 'Working at Height procedures (roofing)', severity: 'critical' },
          { id: 'fallsPrevention',   label: 'Falls from height prevention plan',     severity: 'critical' },
          { id: 'roofingExp',        label: 'Commercial roofing experience',          severity: 'high' },
        ]
      },
    }
  }
}

export const TURNOVER_BANDS = [
  { id: 'under50k',    label: 'Under £50,000' },
  { id: '50k-100k',   label: '£50,000 – £100,000' },
  { id: '100k-250k',  label: '£100,000 – £250,000' },
  { id: '250k-500k',  label: '£250,000 – £500,000' },
  { id: '500k-1m',    label: '£500,000 – £1,000,000' },
  { id: '1m-2m',      label: '£1,000,000 – £2,000,000' },
  { id: '2m-5m',      label: '£2,000,000 – £5,000,000' },
  { id: '5m-plus',    label: '£5,000,000+' },
]

export const TURNOVER_VALUES = {
  'under50k': 50000,
  '50k-100k': 100000,
  '100k-250k': 250000,
  '250k-500k': 500000,
  '500k-1m': 1000000,
  '1m-2m': 2000000,
  '2m-5m': 5000000,
  '5m-plus': 10000000,
}

export const STAFF_BANDS = [
  '1–5', '6–10', '11–25', '26–50', '51–100', '100+'
]

export const YEARS_TRADING = [
  'Less than 1 year', '1–2 years', '2–5 years', '5–10 years', '10+ years'
]

export const CONTRACT_RANGES = [
  { id: 'under10k',   label: 'Under £10,000' },
  { id: '10k-50k',    label: '£10,000 – £50,000' },
  { id: '50k-100k',   label: '£50,000 – £100,000' },
  { id: '100k-250k',  label: '£100,000 – £250,000' },
  { id: '250k-plus',  label: '£250,000+' },
]
