// Task Library
// Pre-written guidance for every compliance gap across all sectors.
// When a gap is detected in the compliance engine and added to the Bid Planner,
// the planner looks up this library for the task content.

export const TASK_LIBRARY = {

  // ─── UNIVERSAL ────────────────────────────────────────────────────────────

  public_liability: {
    title: 'Obtain public liability insurance certificate',
    why: (opp) => `This tender requires a minimum of £${opp?.minInsurance || 5}M public liability insurance. Automatic disqualification without a valid certificate.`,
    time: '1–2 days',
    cost: '£200–£800/year depending on turnover',
    action: 'Contact your insurer',
    type: 'obtain',
    how: `Contact your current insurer and ask them to increase your public liability coverage to the required level and issue a certificate of currency.

If you do not currently hold public liability insurance, specialist brokers include:
• Simply Business (simplybusiness.co.uk)
• Hiscox (hiscox.co.uk)  
• AXA Business Insurance (axa.co.uk)

What to ask for:
• Coverage to the minimum level stated in the tender
• A certificate of currency valid at submission date AND contract start date
• Your company name must match exactly what appears on your tender submission

Processing time: Most insurers can issue certificates within 1–2 business days.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  employers_liability: {
    title: 'Obtain employers liability insurance certificate',
    why: () => 'Legally required for any business with employees. Most tenders require this as a gateway check — automatic disqualification without it.',
    time: '1–2 days',
    cost: 'Typically bundled with public liability',
    action: 'Contact your insurer',
    type: 'obtain',
    how: `Employers liability insurance is a legal requirement under the Employers Liability (Compulsory Insurance) Act 1969 if you have any employees.

Contact your current insurer — most include this alongside public liability. If not, arrange it immediately.

Minimum legal requirement: £5M coverage.
Most public sector tenders require evidence via a certificate.

Note: If you use subcontractors only and have no employees, you may be exempt — but check this with your insurer and read the tender requirements carefully.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  health_safety: {
    title: 'Produce a Health & Safety policy',
    why: () => 'Gateway requirement for all public sector tenders. Evaluators check this before scoring begins. Must be signed by a director.',
    time: '1 day',
    cost: 'Free',
    action: 'Write and sign',
    type: 'document',
    how: `A Health & Safety policy is a written statement of your commitment to managing health and safety. It does not need to be long — 1 to 2 pages is sufficient for most SMEs.

It must include:
• Your company's commitment to H&S
• Who is responsible (name the director or owner)
• How you identify and manage risks
• How you train and supervise staff
• How you report accidents (RIDDOR)
• Date and director signature

Free resources:
• HSE simple H&S policy guide: hse.gov.uk/simple-health-safety
• British Cleaning Council guidance: britishcleaningcouncil.org
• HSE example policy template: hse.gov.uk/pubns/indg232.pdf

Important: The policy must be specific to your business activities — not a generic downloaded template with no edits. Evaluators can tell.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  risk_assessments: {
    title: 'Complete and document risk assessments',
    why: () => 'Required for all work activities. Must be documented and specific to your actual work — not generic templates.',
    time: '1 day',
    cost: 'Free',
    action: 'Document your activities',
    type: 'document',
    how: `Risk assessments must be written, specific to your activities, and kept up to date.

For each main work activity:
1. Identify the hazards (what could cause harm)
2. Decide who might be harmed and how
3. Evaluate the risks and decide on controls
4. Record your findings
5. Review and update regularly

Free templates:
• HSE risk assessment template: hse.gov.uk/risk/risk-assessment-template.doc
• HSE example risk assessments by sector: hse.gov.uk/risk/casestudies

For cleaning companies: produce assessments covering at minimum — chemical handling, working at height (if applicable), lone working, manual handling.

For security companies: cover lone working, conflict management, use of force, CCTV operation.

For construction: produce project-specific RAMS (Risk Assessment and Method Statement) for each trade activity.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  financial_standing: {
    title: 'Review financial standing requirements',
    why: (opp) => `Most buyers require annual turnover of at least 2x the contract value (£${opp?.valueNum ? ((opp.valueNum * 2)/1000).toFixed(0) + 'k' : 'unknown'}+). Your declared turnover band may be below this threshold.`,
    time: '1–3 days to assess',
    cost: 'Free to assess — may need accountant input',
    action: 'Review tender requirements',
    type: 'assess',
    how: `Check the tender documents carefully for financial standing requirements. These are usually in the Selection Questionnaire (SQ) or Pre-Qualification Questionnaire (PQQ).

Common requirements:
• Annual turnover minimum (usually 2x contract value)
• Positive current ratio (assets ÷ liabilities > 1)
• No County Court Judgements (CCJs)
• No insolvency proceedings

Options if you fall short:
• Joint bid with another company (check tender allows this)
• Parent company guarantee (if part of a group)
• Provide additional evidence of financial stability
• Consider a smaller contract in this tender cycle

If you genuinely meet requirements but your declared turnover band is wrong — update your Company Profile with the correct information.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  years_trading: {
    title: 'Address years trading requirement',
    why: () => 'Many tenders require minimum 2 years trading history. Less than this may cause disqualification or reduced scoring.',
    time: '2–5 days to prepare evidence',
    cost: 'Free',
    action: 'Gather trading evidence',
    type: 'assess',
    how: `If you have been trading for less than 2 years, some options exist:

1. Check if the tender explicitly states a minimum trading period — not all do.

2. If it does, some buyers allow:
   • References from previous employers demonstrating relevant experience
   • Parent company or director personal guarantees
   • Enhanced insurance or bonding
   • Joint bid with an established company

3. Prepare strong evidence of what you have achieved in your trading period:
   • Any contracts completed, however small
   • Client references (even informal ones)
   • Relevant qualifications and experience of directors
   • Business bank statements showing trading activity

4. Consider targeting smaller contracts (below threshold values) where financial standing requirements are less strict.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  ssip_accreditation: {
    title: 'Obtain SSIP health & safety accreditation',
    why: () => 'Most public sector buyers require SSIP-recognised H&S accreditation (CHAS, SafeContractor, or SMAS). Without this your methodology score will be significantly reduced.',
    time: '4–8 weeks',
    cost: '£149–£350 depending on scheme',
    action: 'Apply for CHAS, SafeContractor or SMAS',
    type: 'obtain',
    how: `SSIP (Safety Schemes in Procurement) is an umbrella standard. Any one of the following counts:

CHAS (most widely recognised):
• Apply at chas.co.uk
• Cost: from £149+VAT
• You will need: H&S policy, risk assessments, employer liability insurance, public liability insurance
• Processing: 4–6 weeks

SafeContractor:
• Apply at safecontractor.com
• Cost: from £195+VAT
• Similar requirements to CHAS
• Processing: 3–5 weeks

SMAS Worksafe:
• Apply at smasworksafe.co.uk  
• Cost: from £99+VAT
• Processing: 4–6 weeks

Important: Start your application as soon as steps 1–3 of your plan are complete. The accreditation will benefit future tenders even if it is not ready for this one.

Once you hold one SSIP accreditation, most buyers will accept it without requiring a separate application to another scheme.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  references: {
    title: 'Add client references to your profile',
    why: () => 'Most tenders require minimum 2–3 client references for similar work. Missing references is one of the most common reasons for low experience scores.',
    time: '2–5 days',
    cost: 'Free',
    action: 'Contact previous clients',
    type: 'prepare',
    how: `Contact previous clients and ask for permission to use them as a reference on this tender.

What you need from them:
• Permission to name them as a reference
• Their organisation name
• The nature of the contract (brief description)
• Contract value (approximate is fine)
• Contract dates

You do not need their personal contact details for your BidCopilot profile — but you will need them for the actual tender submission form.

Tips:
• Email is fine for most requests — keep it brief and professional
• Give 3–5 days lead time before your submission deadline
• If you have no formal contracts, consider informal references from organisations you have done work for
• References from public sector clients carry more weight than private sector for public sector tenders`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  experience: {
    title: 'Document past contract experience',
    why: () => 'Evaluators need evidence of similar work. No documented experience significantly reduces your experience score.',
    time: '1–2 days',
    cost: 'Free',
    action: 'Add contracts to your profile',
    type: 'prepare',
    how: `Add your past contracts to your BidCopilot Company Profile. For each contract include:

• Client organisation name
• Contract value (even approximate)
• Contract duration
• Brief description of scope
• Outcome (completed or ongoing)

Even small contracts count. Even informal work counts if you can describe it clearly.

When writing about experience in your bid, focus on:
• Similarity to the contract you are bidding for (same sector, similar scale)
• Positive outcomes (retained for further work, positive feedback)
• Challenges overcome
• Specific deliverables achieved

If you genuinely have limited experience, be honest but strategic:
• Emphasise director experience even if company is new
• Reference any relevant training, qualifications, or industry membership
• Consider a joint bid with an experienced partner`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  gdpr: {
    title: 'Produce a GDPR / Data Protection policy',
    why: () => 'Required for contracts involving personal data. Most public sector contracts involve some personal data handling.',
    time: '1 day',
    cost: 'Free',
    action: 'Write and register if needed',
    type: 'document',
    how: `A data protection policy covers how your organisation handles personal data.

For most cleaning and security companies, this covers:
• Staff personal data (payroll, HR records)
• CCTV footage (if you operate cameras)
• Client contact details
• Any data you access on client premises

Free ICO resources:
• ico.org.uk/for-organisations/guide-to-data-protection
• ICO document checklists: ico.org.uk/for-organisations/documents-checklist

The policy should cover:
• What data you collect and why
• How long you keep it
• Who has access
• How you keep it secure
• How people can access or delete their data

Note: If you operate CCTV systems, you must register with the ICO (ico.org.uk/registration — £40/year). This is separate from having a policy.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  modernSlavery: {
    title: 'Produce a Modern Slavery statement',
    why: () => 'Required for public sector bids. Demonstrates your commitment to ethical supply chains.',
    time: 'Half day',
    cost: 'Free',
    action: 'Write and publish',
    type: 'document',
    how: `A Modern Slavery statement covers your commitment to preventing slavery and human trafficking in your business and supply chain.

Legally required for companies with turnover over £36M but best practice for all public sector bidders.

Your statement should cover:
• Your organisation and supply chain structure
• Policies in relation to slavery and human trafficking
• Due diligence processes
• Risk assessment and management
• Key performance indicators
• Training provided to staff

Free guidance:
• gov.uk/government/publications/transparency-in-supply-chains-a-practical-guide
• modernslavery.co.uk/resources

Keep it proportionate to your business size. A small cleaning company's statement will be much shorter than a large corporation's.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  equalityDiversity: {
    title: 'Produce an Equality & Diversity policy',
    why: () => 'Required by most public sector buyers. Affects social value scoring — often worth 10-15% of total score.',
    time: 'Half day',
    cost: 'Free',
    action: 'Write and sign',
    type: 'document',
    how: `An Equality & Diversity policy covers your commitment to fair treatment of staff and clients.

It should cover:
• Your commitment to equality of opportunity
• Protected characteristics (age, disability, race, religion, sex, sexual orientation etc)
• How you handle discrimination complaints
• Training provided to staff
• How you monitor equality in recruitment and promotion

Free guidance:
• ACAS equality and diversity guide: acas.org.uk/equality-and-discrimination
• Equality Act 2010 summary: gov.uk/guidance/equality-act-2010-guidance

Must be signed by a director and kept up to date. Review annually.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  antiBribery: {
    title: 'Produce an Anti-Bribery policy',
    why: () => 'Required under the Bribery Act 2010. Public sector buyers increasingly require this as standard.',
    time: 'Half day',
    cost: 'Free',
    action: 'Write and sign',
    type: 'document',
    how: `An anti-bribery policy covers your commitment to not engaging in bribery or corruption.

Under the Bribery Act 2010, organisations can be prosecuted if they fail to prevent bribery — having an adequate procedures policy is a legal defence.

Your policy should cover:
• Prohibition of bribes — giving or receiving
• Gifts and hospitality limits
• How to report suspected bribery
• Consequences of policy breach
• Training provided

Free guidance:
• gov.uk/government/publications/bribery-act-2010-guidance
• Transparency International UK: transparency.org.uk

Keep it brief and practical. One page is sufficient for most SMEs.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  environmental: {
    title: 'Produce an Environmental policy',
    why: () => 'Increasingly required under Procurement Act 2023. Affects social value scoring.',
    time: 'Half day',
    cost: 'Free',
    action: 'Write and sign',
    type: 'document',
    how: `An environmental policy covers your commitment to reducing your environmental impact.

It should cover:
• Your commitment to environmental improvement
• How you manage waste (recycling, disposal)
• Energy and water usage reduction
• Use of environmentally friendly products
• Carbon reduction plans
• How you monitor environmental performance

For cleaning companies specifically:
• Use of eco-friendly / biodegradable products
• Responsible chemical disposal
• Reducing single-use plastics

Free guidance:
• gov.uk/guidance/environmental-management-systems-iso-14001
• NetRegs for small businesses: netregs.org.uk

Must be signed by a director.`,
    sectors: ['cleaning', 'security', 'construction'],
  },

  // ─── CLEANING SPECIFIC ────────────────────────────────────────────────────

  coshh: {
    title: 'Complete COSHH assessments',
    why: () => 'Legally required for all cleaning companies using chemical products. Required by almost all public sector cleaning tenders.',
    time: 'Half day to 1 day',
    cost: 'Free',
    action: 'Document your chemicals',
    type: 'document',
    how: `COSHH (Control of Substances Hazardous to Health) assessments are required for every hazardous substance your staff use.

For each cleaning chemical:
1. Identify the substance (product name, manufacturer)
2. Identify who might be harmed and how (inhalation, skin contact, etc)
3. Evaluate the risk
4. Decide on control measures (PPE, ventilation, dilution rates)
5. Record the assessment
6. Review regularly

Free resources:
• HSE COSHH assessment tool: hse.gov.uk/coshh/detail/assessments.htm
• HSE COSHH essentials: hse.gov.uk/coshh
• Your product supplier must provide Safety Data Sheets (SDS) — these form the basis of your COSHH assessment

Keep a folder of all Safety Data Sheets for products you use. This demonstrates compliance quickly during audits.`,
    sectors: ['cleaning'],
  },

  enhancedDbs: {
    title: 'Arrange enhanced DBS checks for all staff',
    why: () => 'Mandatory for all staff working in education settings. Automatic disqualification for education cleaning contracts without this.',
    time: '2–4 weeks',
    cost: '£38 per person',
    action: 'Apply via gov.uk DBS service',
    type: 'obtain',
    how: `Enhanced DBS (Disclosure and Barring Service) checks are mandatory for all staff who will have unsupervised access to children or vulnerable adults.

How to apply:
1. Go to gov.uk/dbs-check-applicant-guidance
2. Use an umbrella body (registered organisations that process DBS applications)
3. Each staff member must complete an application form
4. Processing: 2–4 weeks (can be faster via online umbrella bodies)

Cost: £38 per enhanced check (2026 rate)

Umbrella bodies (process applications on your behalf):
• uCheck: ucheck.co.uk
• Disclosure Scotland: disclosurescotland.co.uk
• First Advantage: fadv.co.uk

Important:
• All staff must be checked BEFORE starting work on site
• Keep records of check dates and reference numbers
• Checks must be renewed — check your authority's renewal policy (usually every 3 years)
• The DBS Update Service (£13/year per person) allows instant online checking`,
    sectors: ['cleaning'],
  },

  safeguardingPolicy: {
    title: 'Produce a Safeguarding policy',
    why: () => 'Mandatory for all education and healthcare cleaning contracts. Must cover reporting procedures and name a designated safeguarding lead.',
    time: '1–2 days',
    cost: 'Free',
    action: 'Write and sign',
    type: 'document',
    how: `A safeguarding policy for a cleaning company covers how you protect children and vulnerable adults from harm while your staff work on their premises.

It must include:
• Your commitment to safeguarding
• Name of your designated safeguarding lead (DSL)
• How staff should report concerns
• How concerns are escalated to statutory agencies
• Staff training requirements
• Safer recruitment practices

Free guidance:
• NSPCC safeguarding guidance: nspcc.org.uk/safeguarding
• NCVO safeguarding resources: ncvo.org.uk/safeguarding
• Gov.uk keeping children safe: gov.uk/government/publications/keeping-children-safe-in-education--2

Your staff should receive safeguarding awareness training — not the full training required of school staff, but enough to know how to recognise and report concerns.

The policy must be signed by a director and reviewed annually.`,
    sectors: ['cleaning'],
  },

  tr19: {
    title: 'Obtain TR19 compliance certification',
    why: () => 'Required for all kitchen duct and grease extraction cleaning. Automatic disqualification for kitchen cleaning contracts without this.',
    time: 'Training: 1–2 days. Certification per job.',
    cost: 'Training: £200–£500. Per-job certification included in pricing.',
    action: 'Complete TR19 training',
    type: 'obtain',
    how: `TR19 is the industry standard (published by BESA) for the inspection, cleaning, and maintenance of kitchen ventilation systems.

To comply:
1. Complete TR19 training — available through BESA (thebesa.com) and specialist training providers
2. Follow TR19 procedures on every kitchen duct clean
3. Issue a TR19 certificate of cleanliness after each clean
4. Keep photographic records before and after

Training providers:
• BESA: thebesa.com/training
• Vent Cleaning UK: ventcleaninguk.co.uk/training
• Specialists in Ductwork: siduk.co.uk

Note: TR19 certification refers to the standard followed — not a company-level accreditation. You demonstrate compliance by following the standard and issuing certificates per job.`,
    sectors: ['cleaning'],
  },

  wasteCarrier: {
    title: 'Obtain Waste Carrier Licence',
    why: () => 'Legally required to transport waste from client premises. Automatic disqualification for waste removal contracts without this.',
    time: '5–10 working days',
    cost: '£154 for 3 years (upper tier)',
    action: 'Register with Environment Agency',
    type: 'obtain',
    how: `A Waste Carrier Licence is required if you transport waste as part of your business, even if you are transporting someone else's waste.

Types:
• Lower tier: free, for businesses that only carry their own waste
• Upper tier: £154 for 3 years — required if you carry other people's waste (including client waste)

For waste removal services you need the upper tier licence.

How to register:
• Apply online at: environment.agency.gov.uk
• Search "register as a waste carrier"
• You will receive a registration certificate within 5–10 working days

Once registered:
• Your registration number must appear on your vehicles and paperwork
• You must issue Waste Transfer Notes for every load
• Keep records for 2 years minimum`,
    sectors: ['cleaning'],
  },

  workingAtHeight: {
    title: 'Obtain Working at Height training and certification',
    why: () => 'Required for window cleaning and any work above ground level. Automatic disqualification for window cleaning contracts without evidence of competence.',
    time: '1–3 days training',
    cost: '£150–£400 depending on course',
    action: 'Book WAH training',
    type: 'obtain',
    how: `Working at Height Regulations 2005 require all work at height to be properly planned, supervised, and carried out by competent people.

Required training and certification:

PASMA (Prefabricated Access Suppliers and Manufacturers Association):
• For mobile access towers
• pasma.co.uk/training
• 1-day course, approximately £150–£200

IPAF (International Powered Access Federation):
• For powered access platforms (cherry pickers, scissor lifts)
• ipaf.org/training
• 1–2 day course, approximately £200–£400

Working at Height general training:
• Available through CITB, NEBOSH, and local training providers
• Covers planning, equipment selection, and emergency procedures

You must also have:
• Rescue procedures documented
• Emergency rescue plan per site
• Equipment inspection records
• Proof of insurance covering working at height`,
    sectors: ['cleaning'],
  },

  // ─── SECURITY SPECIFIC ────────────────────────────────────────────────────

  siaAcs: {
    title: 'Obtain or confirm SIA Approved Contractor Scheme (ACS) status',
    why: () => 'Near-mandatory for public sector security contracts. Many buyers specify ACS as a minimum requirement.',
    time: '3–6 months',
    cost: '£400–£2,400 depending on company size + assessor fees',
    action: 'Check status or apply at sia.homeoffice.gov.uk',
    type: 'obtain',
    how: `The SIA Approved Contractor Scheme (ACS) is voluntary but effectively required for most public sector security contracts.

Check your current status:
• Log in at sia.homeoffice.gov.uk
• Search the public ACS register: sia.homeoffice.gov.uk/Pages/acs-search

If not yet accredited — two routes:

Standard Route:
1. Complete SIA Self-Assessment Workbook (SAW)
2. Submit application with fee
3. Name an approved certification body (NSI or SSAIB)
4. Verification visit by the certification body
5. Approval granted (if standards met)

Passport Route (faster):
• If you already hold NSI Gold or equivalent UKAS-accredited certification
• Existing assessment substitutes for the SAW and verification visit
• Significantly faster and cheaper

Timeline: 3–6 months for Standard Route, faster for Passport Route.

Annual fee: £400–£2,400 (by company size band) + £15 per deployed SIA-licensed individual.

Note: Even if ACS will not be ready for this tender — start the application now. It is essential for future public sector bids.`,
    sectors: ['security'],
  },

  bs7858: {
    title: 'Implement BS 7858:2019 staff vetting procedures',
    why: () => 'Industry standard for security staff vetting. Required for most public sector and NHS security contracts.',
    time: '1–2 days to document procedures',
    cost: '£100–£300 per staff member for full vetting',
    action: 'Document your vetting process',
    type: 'document',
    how: `BS 7858:2019 is the British Standard for screening individuals employed in security environments.

What it requires for each staff member:
• 5-year employment history verification
• Identity verification (passport/driving licence)
• Right to work in the UK check
• Criminal record check (DBS)
• Character references
• Address history verification

How to implement:
1. Create a vetting procedure document that follows BS 7858
2. Apply the procedure to all new staff before deployment
3. Keep vetting records securely for the duration of employment + 3 years
4. Review vetting when staff move to different security roles

Specialist vetting providers:
• security-vetting.co.uk
• First Advantage: fadv.co.uk
• Experian: experian.co.uk/consumer/identity-verification

Note: BS 7858 vetting is required for your staff — it is not a company accreditation. Document your procedures and keep records as evidence.`,
    sectors: ['security'],
  },

  icoRegistration: {
    title: 'Register with the ICO for CCTV operation',
    why: () => 'Legally required to operate or monitor CCTV systems. Cannot bid on CCTV monitoring contracts without ICO registration.',
    time: '2–5 days for registration number',
    cost: '£40/year (Tier 1 — small organisations)',
    action: 'Register at ico.org.uk/registration',
    type: 'obtain',
    how: `Any organisation that operates CCTV must register with the Information Commissioner's Office (ICO) as a data controller.

How to register:
1. Go to ico.org.uk/registration
2. Complete the online registration form (approximately 10 minutes)
3. Pay the annual fee (£40 for Tier 1 — organisations with turnover under £36M and fewer than 250 staff)
4. Receive your registration certificate and reference number within 2–5 working days

Your ICO registration number must be:
• Quoted in tender submissions for CCTV contracts
• Displayed on your website
• Available to clients on request

Annual renewal: Registration must be renewed annually. Set a reminder — letting it lapse is a legal breach and will disqualify you from CCTV contracts.

Additional GDPR requirements for CCTV:
• CCTV-specific privacy notice at each camera location
• Data retention policy (how long footage is kept)
• Procedure for subject access requests (people asking for footage of themselves)`,
    sectors: ['security'],
  },

  useOfForce: {
    title: 'Produce a Use of Force policy',
    why: () => 'Required for manned guarding and door supervision contracts. Evaluators expect to see this for any physical security role.',
    time: '1 day',
    cost: 'Free',
    action: 'Write and sign',
    type: 'document',
    how: `A Use of Force policy covers how your security staff may lawfully use force in the course of their duties.

It must cover:
• Legal framework (Common Law, Criminal Law Act 1967, Human Rights Act)
• Principles: force must be necessary, proportionate, and reasonable
• When force may be used (self-defence, defence of others, prevention of crime)
• De-escalation as the primary response
• Prohibited actions (excessive force, restraint positions)
• Reporting requirements after any use of force
• Training requirements
• Consequences of policy breach

The policy must align with:
• SIA Code of Practice
• Use of Reasonable Force guidance from the College of Policing

Must be signed by a senior manager or director and reviewed annually.

All security staff must receive training on this policy and sign to confirm they have read and understood it.`,
    sectors: ['security'],
  },

  // ─── CONSTRUCTION SPECIFIC ────────────────────────────────────────────────

  rams: {
    title: 'Produce project-specific RAMS',
    why: () => 'Required for all construction tenders. Generic downloaded templates will not satisfy evaluators — must be specific to the project.',
    time: '1–3 days per project',
    cost: 'Free (internal) or £200–£500 (consultant)',
    action: 'Write project-specific RAMS',
    type: 'document',
    how: `RAMS (Risk Assessment and Method Statement) must be project-specific, not generic.

Risk Assessment covers:
• Specific hazards on this project
• Who is at risk
• Existing controls
• Additional controls needed
• Residual risk rating

Method Statement covers:
• Scope of work
• Sequence of operations
• Plant and equipment to be used
• Materials and substances
• Emergency procedures
• Welfare arrangements

Common RAMS mistakes:
• Using generic templates without adapting to the specific project
• Not referencing site-specific hazards
• Vague descriptions of control measures
• Missing signatures

Free resources:
• HSE construction RAMS guidance: hse.gov.uk/construction/safetytopics/rams.htm
• CITB guidance: citb.co.uk

For tender submissions — even before contract award — produce outline RAMS that demonstrate your approach. Full project RAMS are produced once the contract is awarded.`,
    sectors: ['construction'],
  },

  constructionline: {
    title: 'Obtain Constructionline registration',
    why: () => 'Most widely required pre-qualification scheme for UK construction tenders. Silver or Gold level needed for most public sector work.',
    time: '2–4 weeks',
    cost: '£199–£699 depending on level',
    action: 'Apply at constructionline.co.uk',
    type: 'obtain',
    how: `Constructionline is the UK's leading pre-qualification scheme for construction and facilities management.

Levels:
• Standard: basic registration, limited use for public sector
• Silver: £199+VAT — accepted for most contracts up to £5M
• Gold: £399+VAT — accepted for most contracts up to £10M  
• Platinum: £699+VAT — for larger contracts and framework agreements

What you need to apply:
• Company registration details
• Insurance certificates (PL and EL)
• H&S policy and accreditation (CHAS/SafeContractor)
• Financial information (accounts)
• Trade references

Processing time: 2–4 weeks if documentation is complete.

Apply at: constructionline.co.uk

Note: Once registered, your Constructionline certificate is accepted by most UK public sector buyers without further pre-qualification. It significantly reduces the paperwork burden for each tender.`,
    sectors: ['construction'],
  },

  cdm2015: {
    title: 'Demonstrate CDM 2015 compliance capability',
    why: () => 'Legal requirement for all construction projects with more than one contractor. Evidence of CDM competence required for all public sector construction tenders.',
    time: '1–2 days to prepare evidence',
    cost: 'Free to document',
    action: 'Prepare CDM competence evidence',
    type: 'document',
    how: `CDM 2015 (Construction Design and Management Regulations) applies to all construction projects involving more than one contractor.

As a contractor, you must demonstrate:
• Understanding of your CDM duties
• Ability to produce project-specific RAMS
• Competent staff with appropriate qualifications
• H&S management systems in place
• Ability to cooperate with Principal Contractor and Principal Designer

What to prepare as evidence:
• Written CDM policy or procedure
• Example RAMS from previous projects
• Staff CSCS cards and qualifications
• Records of toolbox talks and inductions
• Accident and near-miss records

For public sector tenders, you will typically be asked to:
• Describe your approach to CDM
• Provide evidence of previous compliance
• Name your competent person for H&S

Free guidance:
• HSE CDM 2015 guidance: hse.gov.uk/construction/cdm/2015
• CITB CDM awareness training: citb.co.uk/training`,
    sectors: ['construction'],
  },

  cisRegistration: {
    title: 'Confirm CIS (Construction Industry Scheme) registration',
    why: () => 'All construction subcontractors must be registered with HMRC under CIS. Required verification before first payment.',
    time: '1–5 days',
    cost: 'Free',
    action: 'Register or verify at gov.uk/what-is-the-construction-industry-scheme',
    type: 'obtain',
    how: `The Construction Industry Scheme (CIS) requires contractors to deduct money from subcontractor payments and pass it to HMRC.

As a subcontractor you must:
• Register with HMRC as a CIS subcontractor
• Provide your UTR (Unique Taxpayer Reference) to contractors
• Verify your registration is active before each new engagement

Registration options:
• Gross payment status (0% deduction) — apply if you meet turnover and compliance thresholds
• Standard registration (20% deduction) — default for registered subcontractors
• Unregistered (30% deduction) — avoid this

How to register:
• Online: gov.uk/register-as-a-construction-industry-scheme-subcontractor
• By phone: HMRC CIS helpline 0300 200 3210
• Processing: 1–5 working days

For each new principal contractor you work with:
• They must verify your CIS status before first payment
• Provide your UTR number promptly to avoid delays

Note: If you are a limited company, you register as both a contractor and subcontractor under CIS.`,
    sectors: ['construction'],
  },

  gasSafe: {
    title: 'Confirm Gas Safe Register registration',
    why: () => 'Legally required to carry out any gas work in the UK. Automatic disqualification for any M&E or plumbing contract involving gas without this.',
    time: 'Engineers must be individually registered',
    cost: '£174–£348 per engineer per year',
    action: 'Register at gassaferegister.co.uk',
    type: 'obtain',
    how: `Gas Safe Register is the official list of gas engineers who are legally allowed to work on gas appliances in the UK.

It is a legal requirement under the Gas Safety (Installation and Use) Regulations 1998.

Individual engineers must:
• Hold a current ACS (Accredited Certification Scheme) gas qualification
• Register individually with Gas Safe Register
• Carry a Gas Safe ID card at all times when working

As a company:
• Register as a gas company on the Gas Safe Register
• All engineers working for you must be individually registered
• Annual registration fees apply per engineer

How to register:
• gassaferegister.co.uk/for-businesses
• Annual fee: approximately £174–£348 per engineer depending on qualifications held

When bidding on contracts:
• Quote your Gas Safe Register company number
• Be prepared to provide individual engineer registration numbers
• Ensure all registrations are current at contract start date`,
    sectors: ['construction'],
  },

  niceic: {
    title: 'Obtain NICEIC or ECA registration',
    why: () => 'Required for all electrical contracting work in public sector buildings. Demonstrates electrical competence and compliance with BS 7671.',
    time: '4–8 weeks for assessment',
    cost: '£400–£1,500 depending on scheme level',
    action: 'Apply at niceic.com or eca.co.uk',
    type: 'obtain',
    how: `NICEIC (National Inspection Council for Electrical Installation Contracting) and ECA (Electrical Contractors Association) are the two main electrical competence schemes in the UK.

What registration demonstrates:
• Technical competence in electrical installation
• Compliance with BS 7671 (IET Wiring Regulations 18th Edition)
• Ability to self-certify electrical work
• Appropriate insurance

NICEIC registration:
• niceic.com/become-approved
• Assessment visit by NICEIC assessor
• All electricians must hold relevant qualifications (City & Guilds 2360/2357 or equivalent)
• Cost: approximately £400–£800 + annual fee

ECA membership:
• eca.co.uk/membership
• Similar requirements and process
• Wider industry body with training and support

All electricians you employ must hold:
• 18th Edition (BS 7671:2018) — IET qualification
• Inspection and Testing qualification (2391 or equivalent)
• Relevant installation qualifications for their trade`,
    sectors: ['construction'],
  },

  hseLicenceAsbestos: {
    title: 'Obtain HSE Asbestos Removal Licence',
    why: () => 'Legally required to remove licensed asbestos. Automatic disqualification for asbestos removal contracts without this licence.',
    time: '3–6 months',
    cost: '£1,500–£3,000+ application and assessment',
    action: 'Apply via HSE at hse.gov.uk/asbestos/licensing',
    type: 'obtain',
    how: `A licence from HSE is legally required to work with asbestos insulation, asbestos insulation board, and asbestos coating (licensed materials).

Without a licence you can only carry out:
• Short duration non-licensed work (SINS)
• Notifiable non-licensed work (NNLW)

To apply for an HSE Asbestos Licence:
1. Read HSE guidance: hse.gov.uk/asbestos/licensing
2. Complete application form (ASB5)
3. HSE will assess your application and visit your premises
4. Demonstrate: management systems, trained staff, equipment, insurance
5. Licence granted for 3 years if requirements met

Requirements:
• Duty holder (usually director) with asbestos management knowledge
• All staff trained to relevant CAR 2012 level
• Appropriate RPE (respiratory protective equipment)
• Decontamination facilities
• Air monitoring equipment or contracted air monitor
• Licensed asbestos waste disposal arrangements

Processing time: 3–6 months. Start well in advance.

Note: Licensed asbestos work must also be notified to HSE at least 14 days before starting work.`,
    sectors: ['construction'],
  },
}

// Get task content for a specific gap
export function getTaskForGap(gapId, opportunity) {
  const task = TASK_LIBRARY[gapId]
  if (!task) return null
  return {
    ...task,
    why: typeof task.why === 'function' ? task.why(opportunity) : task.why,
  }
}

// Get all tasks for a list of gap IDs
export function getTasksForGaps(gaps, opportunity) {
  return gaps
    .map(gap => {
      const task = getTaskForGap(gap.id, opportunity)
      if (!task) return null
      return {
        id: gap.id,
        severity: gap.severity,
        status: gap.status,
        ...task,
      }
    })
    .filter(Boolean)
}
