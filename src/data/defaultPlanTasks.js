// Default bid plan tasks auto-generated for every tender
// These appear in the Bid Planner even before the user adds gaps from Compliance Engine

export function getDefaultTasks(tender, company) {
  const industry = tender?.industry || company?.industry || 'cleaning'
  const deadline = tender?.deadline || ''
  const daysLeft = tender?.daysLeft || 30

  const tasks = []

  // ─── PREPARATION ─────────────────────────────────────────────
  tasks.push({
    id: 'default_read_tender',
    title: 'Read the full tender document carefully',
    why: 'Many contractors fail because they miss key requirements buried in the document. Read every page before starting your bid.',
    time: '1–2 hours',
    cost: 'Free',
    action: 'Review document',
    type: 'prepare',
    severity: 'high',
    week: 'Preparation — do first',
    weekEnd: 'Before anything else',
    day: 'Day 1',
    how: `Read the entire tender document from start to finish before doing anything else.

Pay special attention to:
• Section asking about company information and financial standing
• Mandatory requirements and gateway criteria
• Evaluation criteria and their weightings
• Submission format requirements (word limits, file format, naming conventions)
• Terms and conditions
• Any clarification questions process and deadline

Many bids are disqualified for missing minor formatting requirements — not for lack of capability.`,
    isDefault: true,
    category: 'preparation',
  })

  tasks.push({
    id: 'default_check_eligibility',
    title: 'Confirm you meet the basic eligibility requirements',
    why: 'Check financial thresholds, minimum years trading, and sector experience before investing time in a bid you cannot submit.',
    time: '30 minutes',
    cost: 'Free',
    action: 'Review eligibility section',
    type: 'assess',
    severity: 'critical',
    week: 'Preparation — do first',
    weekEnd: 'Before anything else',
    day: 'Day 1',
    how: `Check these before spending any more time on this tender:

Financial standing:
• Most tenders require annual turnover of at least 2x the contract value
• Check your current ratio (current assets ÷ current liabilities must be above 1)
• No CCJs or insolvency proceedings

Experience:
• Minimum years trading (usually 2 years)
• Similar contracts in same sector
• Number of references required

If you do not meet eligibility requirements, it is better to know now than after spending days on the bid.`,
    isDefault: true,
    category: 'preparation',
  })

  tasks.push({
    id: 'default_review_criteria',
    title: 'Review evaluation criteria weightings',
    why: 'Your bid should be weighted towards what scores most points. Spend the most time on the highest weighted sections.',
    time: '30 minutes',
    cost: 'Free',
    action: 'Note down all criteria and weights',
    type: 'prepare',
    severity: 'high',
    week: 'Preparation — do first',
    weekEnd: 'Before anything else',
    day: 'Day 1',
    how: `Find the evaluation criteria section in the tender document. It is usually labelled:
• "Award criteria"
• "How bids will be evaluated"
• "Scoring methodology"

Write down each criterion and its percentage weighting. For example:
• Quality 40% → spend 40% of your writing effort here
• Price 35% → be competitive but ensure you are profitable
• Social value 15% → do not neglect this — 15% is significant
• Experience 10% → strong references help here

Plan your bid sections around these weightings.`,
    isDefault: true,
    category: 'preparation',
  })

  // ─── COMPLIANCE ───────────────────────────────────────────────
  tasks.push({
    id: 'default_run_compliance',
    title: 'Run your compliance check in BidCopilot',
    why: 'Identify all compliance gaps before writing your bid. Fix critical gaps first — they will disqualify you before evaluators read your bid.',
    time: '15 minutes',
    cost: 'Free',
    action: 'Go to Compliance Engine',
    type: 'assess',
    severity: 'critical',
    week: 'Compliance — fix gaps',
    weekEnd: 'As early as possible',
    day: 'Day 1–2',
    how: `Go to the Compliance Engine in BidCopilot and check your compliance gaps for this tender.

For each gap:
1. Read the impact level — critical gaps cause automatic disqualification
2. Click "+ Add to bid plan" to add the fix as a task here
3. Work through critical gaps first
4. Then address high priority gaps

Your compliance tasks will appear in this plan once added from the Compliance Engine.`,
    isDefault: true,
    category: 'compliance',
  })

  // ─── BID WRITING ──────────────────────────────────────────────
  tasks.push({
    id: 'default_gather_references',
    title: 'Gather your client references',
    why: 'Most tenders require 2–3 references. Contact clients early — chasing references at the last minute is a common cause of missed deadlines.',
    time: '2–3 days',
    cost: 'Free',
    action: 'Contact previous clients',
    type: 'prepare',
    severity: 'high',
    week: 'Bid preparation',
    weekEnd: 'Early in the process',
    day: 'Day 2–3',
    how: `Contact previous clients and ask for permission to use them as a reference.

What to ask them for:
• Permission to name them as a reference
• A brief written reference or testimonial (optional but helps)
• Confirmation of contract details (value, duration, scope)

Tips:
• Email is fine — keep the request brief and professional
• Give them 3–5 days notice
• Chase them if you do not hear back within 2 days
• Add confirmed references to your Company Profile in BidCopilot

You do not need personal contact details for BidCopilot — but you will need them for the tender submission form itself.`,
    isDefault: true,
    category: 'bid_writing',
  })

  tasks.push({
    id: 'default_methodology',
    title: `Write your ${industry === 'security' ? 'security management' : industry === 'construction' ? 'construction methodology' : 'cleaning methodology'} section`,
    why: 'Methodology is typically the highest scored section. A generic response will not score well — it must be specific to this contract.',
    time: '2–4 hours',
    cost: 'Free',
    action: 'Write and review',
    type: 'prepare',
    severity: 'high',
    week: 'Bid writing',
    weekEnd: `Allow plenty of time before deadline`,
    day: 'Day 3–5',
    how: `Your methodology section should answer:
• How you will deliver the service day to day
• Your staffing model and supervision structure
• How you ensure quality and consistency
• How you handle problems or complaints
• What makes your approach better than competitors

Sector specific tips:
${industry === 'cleaning' ? `• Detail your cleaning schedules per area type
• Explain your product selection and COSHH compliance
• Describe your supervisor to operative ratios
• Include your quality audit process` :
industry === 'security' ? `• Detail your guarding schedules and patrol procedures
• Explain your staff vetting and training process
• Describe your incident reporting procedures
• Include your command and control structure` :
`• Detail your programme of works and sequencing
• Explain your health and safety approach on site
• Describe your quality inspection process
• Include your subcontractor management approach`}

Always reference the specific requirements mentioned in this tender document. Generic methodology sections score poorly.`,
    isDefault: true,
    category: 'bid_writing',
  })

  tasks.push({
    id: 'default_social_value',
    title: 'Write your social value statement',
    why: 'Social value is now mandatory at 10% weighting in all central government contracts and increasingly required by local authorities.',
    time: '1–2 hours',
    cost: 'Free',
    action: 'Write social value section',
    type: 'prepare',
    severity: 'high',
    week: 'Bid writing',
    weekEnd: 'Before deadline',
    day: 'Day 4–6',
    how: `Social value covers the wider benefit your contract will bring to the community. Common themes:

Employment and skills:
• Local employment commitments
• Apprenticeship opportunities
• Staff training and development
• Living wage commitment

Environment:
• Carbon reduction targets
• Sustainable product use
• Waste reduction plans

Community:
• Local supply chain commitments
• Volunteering and charity support
• Supporting disadvantaged groups

Be specific and measurable — "we will employ 2 local people" is better than "we support local employment". Vague commitments score poorly.`,
    isDefault: true,
    category: 'bid_writing',
  })

  tasks.push({
    id: 'default_pricing',
    title: 'Prepare your pricing schedule',
    why: 'Price is typically 30–40% of score. Being too high loses on price; being too low may raise concerns about quality or viability.',
    time: '2–4 hours',
    cost: 'Free',
    action: 'Complete pricing schedule',
    type: 'prepare',
    severity: 'high',
    week: 'Bid writing',
    weekEnd: 'Allow time for review',
    day: 'Day 5–7',
    how: `Before completing the pricing schedule:

1. Read the pricing requirements carefully — use the exact format requested
2. Calculate your true costs (labour, materials, overheads, profit)
3. Research the market rate for this type of contract
4. Consider your TUPE obligations if taking over an existing contract
5. Factor in any mobilisation costs
6. Double-check all calculations

Common pricing mistakes:
• Not including VAT where required
• Missing items from the schedule
• Arithmetic errors
• Underpricing to win then struggling to deliver

If you are uncertain, it is better to price accurately and lose on cost than to win at a price you cannot sustain.`,
    isDefault: true,
    category: 'bid_writing',
  })

  // ─── SUBMISSION ───────────────────────────────────────────────
  tasks.push({
    id: 'default_final_review',
    title: 'Final compliance and quality review',
    why: 'A quick final check before submission catches errors that cost you the contract. Allow at least 24 hours before the deadline.',
    time: '2–3 hours',
    cost: 'Free',
    action: 'Review full bid document',
    type: 'prepare',
    severity: 'high',
    week: 'Submission',
    weekEnd: `24+ hours before deadline`,
    day: daysLeft > 3 ? `Day ${Math.max(1, daysLeft - 2)}` : 'Urgent',
    how: `Final checklist before submission:

Compliance:
□ All mandatory documents attached
□ Insurance certificates current and correct level
□ All policies signed and dated
□ References confirmed and included

Content:
□ All sections completed — no blanks
□ Word limits respected
□ All questions answered
□ Evaluation criteria addressed in your responses
□ Specific tender requirements referenced

Format:
□ Correct file format (PDF, Word, portal upload)
□ Correct file naming convention
□ All appendices labelled correctly
□ Page numbers if required

Submit:
□ Submit via the correct portal or email
□ Allow time for upload (large files take time)
□ Request/save confirmation of receipt`,
    isDefault: true,
    category: 'submission',
  })

  tasks.push({
    id: 'default_submit',
    title: `Submit bid before deadline`,
    why: `Late submissions are automatically rejected — no exceptions. Submit at least 24 hours early to allow for technical issues.`,
    time: '30 minutes',
    cost: 'Free',
    action: `Submit via tender portal`,
    type: 'prepare',
    severity: 'critical',
    week: 'Submission',
    weekEnd: `Deadline: ${deadline || 'see tender document'}`,
    day: deadline ? `By ${deadline}` : 'Before deadline',
    how: `Submission checklist:

1. Log in to the tender portal or find the submission email address
2. Upload all required documents in the correct format
3. Complete any online questionnaire sections
4. Submit — do not just save as draft
5. Save or screenshot your confirmation of submission
6. Check your email for a confirmation receipt

If submitting via portal:
• Allow extra time for large file uploads
• Some portals lock submissions exactly at the deadline
• If you experience technical issues contact the buyer immediately

Keep your confirmation of submission safe — you may need it if there is a dispute.`,
    isDefault: true,
    category: 'submission',
  })

  return tasks
}
