import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Set up PDF.js worker - compatible with pdfjs-dist v6
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

// Extract raw text from PDF
async function extractPdfText(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map(item => item.str || '').join(' ')
      fullText += pageText + '\n'
    }
    return fullText
  } catch (err) {
    console.error('PDF extraction error:', err)
    throw new Error('Could not read PDF. Make sure it is not a scanned image.')
  }
}

// Extract raw text from DOCX
async function extractDocxText(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  } catch (err) {
    throw new Error('Could not read DOCX file.')
  }
}

// Parse structured data from raw text
function parseStructuredData(text, filename) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const lower = text.toLowerCase()

  // Title — first meaningful line or filename
  let title = filename.replace(/\.(pdf|docx)$/i, '').replace(/[-_]/g, ' ')
  for (const line of lines.slice(0, 15)) {
    if (line.length > 10 && line.length < 150 && !line.match(/^(page|date|ref|version|tender|notice)/i)) {
      title = line
      break
    }
  }

  // Buyer
  let buyer = 'Unknown Buyer'
  const buyerPatterns = [
    /(?:issued by|contracting authority|buyer|organisation|authority|client|employer)[:\s]+([A-Z][^\n]{5,60})/i,
    /([A-Z][a-z]+ (?:Council|Authority|NHS|Trust|University|College|Department|Ministry|Agency|Board|District|Borough|County))/,
  ]
  for (const pattern of buyerPatterns) {
    const match = text.match(pattern)
    if (match) { buyer = match[1].trim(); break }
  }

  // Deadline
  let deadline = 'See document'
  let daysLeft = 30
  const deadlinePatterns = [
    /(?:closing date|deadline|submission date|return by|due date|submit by|close date)[:\s]+([0-9]{1,2}[\s/.-][A-Za-z0-9]{2,9}[\s/.-][0-9]{2,4})/i,
    /([0-9]{1,2}[\s/.-][A-Za-z]{3,9}[\s/.-][0-9]{4})/,
    /([A-Za-z]{3,9}[\s]+[0-9]{1,2}[,\s]+[0-9]{4})/,
  ]
  for (const pattern of deadlinePatterns) {
    const match = text.match(pattern)
    if (match) {
      deadline = match[1].trim()
      try {
        const d = new Date(deadline)
        if (!isNaN(d)) daysLeft = Math.max(0, Math.floor((d - new Date()) / (1000*60*60*24)))
      } catch {}
      break
    }
  }

  // Value
  let value = 'See document'
  let valueNum = 0
  const valuePatterns = [
    /(?:contract value|estimated value|budget|total value|annual value)[:\s]+[£$€]?([\d,]+(?:\.\d{2})?(?:\s*(?:million|m|k))?)/i,
    /[£$€]([\d,]+(?:\.\d{2})?(?:\s*(?:million|m|k))?)/,
  ]
  for (const pattern of valuePatterns) {
    const match = text.match(pattern)
    if (match) {
      let v = match[1].trim().replace(/,/g, '')
      if (v.toLowerCase().includes('million') || v.toLowerCase().includes('m')) {
        valueNum = parseFloat(v) * 1000000
      } else if (v.toLowerCase().includes('k')) {
        valueNum = parseFloat(v) * 1000
      } else {
        valueNum = parseFloat(v) || 0
      }
      value = '£' + (valueNum >= 1000000 ? (valueNum/1000000).toFixed(1) + 'M' : valueNum >= 1000 ? Math.round(valueNum/1000) + 'k' : valueNum.toLocaleString())
      break
    }
  }

  // Location
  let location = 'United Kingdom'
  const locationPatterns = [
    /(?:location|place of performance|site address|delivery|region)[:\s]+([A-Z][^\n]{5,50})/i,
    /\b(London|Manchester|Birmingham|Leeds|Sheffield|Bristol|Liverpool|Edinburgh|Glasgow|Cardiff|Belfast|Newcastle|Nottingham|Leicester|Southampton)\b/i,
  ]
  for (const pattern of locationPatterns) {
    const match = text.match(pattern)
    if (match) { location = match[1].trim(); break }
  }

  // Industry detection
  let industry = 'cleaning'
  const securityScore = (lower.match(/\b(security|guard|sia|cctv|patrol|surveillance|manned)\b/g) || []).length
  const constructionScore = (lower.match(/\b(construction|build|civil|demolition|refurb|contractor|works)\b/g) || []).length
  const cleaningScore = (lower.match(/\b(clean|hygiene|janitor|housekeep|sanitise|janitorial)\b/g) || []).length
  if (securityScore > constructionScore && securityScore > cleaningScore) industry = 'security'
  else if (constructionScore > cleaningScore) industry = 'construction'

  // Requirements
  const requirements = []
  const reqKeywords = ['must', 'required', 'shall', 'mandatory', 'essential', 'minimum', 'certificate', 'insurance', 'licence', 'accreditation', 'experience', 'qualification', 'policy', 'assessment']
  for (const line of lines) {
    const lineLower = line.toLowerCase()
    if (reqKeywords.some(k => lineLower.includes(k)) && line.length > 15 && line.length < 200 && requirements.length < 8) {
      requirements.push(line)
    }
  }
  // Fallback requirements if none found
  if (requirements.length === 0) {
    requirements.push('See full tender document for detailed requirements')
  }

  // Compliance items
  const requiredCompliance = []
  if (lower.includes('public liability')) requiredCompliance.push('public_liability')
  if (lower.includes('employers liability') || lower.includes("employer's liability")) requiredCompliance.push('employers_liability')
  if (lower.includes('health and safety') || lower.includes('health & safety')) requiredCompliance.push('health_safety')
  if (lower.includes('risk assessment')) requiredCompliance.push('risk_assessments')
  if (lower.includes('coshh')) requiredCompliance.push('coshh')
  if (lower.includes('dbs') || lower.includes('disclosure and barring')) requiredCompliance.push('enhancedDbs')
  if (lower.includes('iso 9001')) requiredCompliance.push('iso9001')
  if (lower.includes('chas') || lower.includes('safecontractor') || lower.includes('ssip')) requiredCompliance.push('ssip_accreditation')

  // Insurance minimum
  let minInsurance = 5
  const insPatterns = [
    /[£$€](\d+)\s*(?:million|m)\s*(?:public liability)/i,
    /public liability[^£]*[£$€](\d+)\s*(?:million|m)/i,
    /(\d+)\s*(?:million|m)\s*(?:public liability)/i,
  ]
  for (const p of insPatterns) {
    const m = text.match(p)
    if (m) { minInsurance = parseInt(m[1]); break }
  }

  // Evaluation criteria
  const evaluationCriteria = []
  const criteriaPatterns = [
    { pattern: /quality[^\n]*([\d]{1,3})\s*%/gi, label: 'Quality & methodology' },
    { pattern: /price[^\n]*([\d]{1,3})\s*%/gi, label: 'Price' },
    { pattern: /social value[^\n]*([\d]{1,3})\s*%/gi, label: 'Social value' },
    { pattern: /experience[^\n]*([\d]{1,3})\s*%/gi, label: 'Experience' },
    { pattern: /technical[^\n]*([\d]{1,3})\s*%/gi, label: 'Technical capability' },
  ]
  for (const { pattern, label } of criteriaPatterns) {
    pattern.lastIndex = 0
    const match = pattern.exec(text)
    if (match && parseInt(match[1]) <= 100) evaluationCriteria.push({ criterion: label, weight: parseInt(match[1]) })
  }

  // Win tips
  const winTips = []
  if (evaluationCriteria.find(c => c.criterion === 'Quality & methodology' && c.weight >= 30)) {
    winTips.push(`Quality & methodology is ${evaluationCriteria.find(c => c.criterion === 'Quality & methodology').weight}% of score — detail your processes thoroughly`)
  }
  if (evaluationCriteria.find(c => c.criterion === 'Price' && c.weight >= 40)) {
    winTips.push('Price is heavily weighted — be competitive on cost')
  }
  if (evaluationCriteria.find(c => c.criterion === 'Social value')) {
    winTips.push('Include a dedicated social value section — it is scored separately')
  }
  if (requiredCompliance.includes('public_liability')) {
    winTips.push('Confirm your public liability insurance upfront — it is a gateway requirement')
  }
  winTips.push('Address every evaluation criterion explicitly in your bid')

  const summary = lines.slice(0, 5).join(' ').substring(0, 300) ||
    `${title} — ${buyer}. Parsed and analysed by BidCopilot.`

  return {
    id: `uploaded-${Date.now()}`,
    title: title.substring(0, 100),
    buyer,
    value,
    valueNum,
    location,
    deadline,
    daysLeft,
    industry,
    source: 'Uploaded document',
    fromUpload: true,
    minInsurance,
    requiredCompliance: requiredCompliance.length > 0 ? requiredCompliance : ['public_liability', 'employers_liability', 'health_safety'],
    extractedRequirements: requirements.slice(0, 6),
    evaluationCriteria: evaluationCriteria.length > 0 ? evaluationCriteria : [
      { criterion: 'Quality & methodology', weight: 40 },
      { criterion: 'Price', weight: 35 },
      { criterion: 'Social value', weight: 15 },
      { criterion: 'Experience', weight: 10 },
    ],
    summary,
    winTips: winTips.slice(0, 4),
    rawText: text.substring(0, 5000),
  }
}

// Main export
export async function parseTenderDocument(file) {
  try {
    let text = ''
    const ext = file.name.split('.').pop().toLowerCase()

    if (ext === 'pdf') {
      text = await extractPdfText(file)
    } else if (ext === 'docx') {
      text = await extractDocxText(file)
    } else {
      return { success: false, error: 'Please upload a PDF or DOCX file.' }
    }

    // Even if very short — still try to parse
    if (!text || text.trim().length < 10) {
      // Return a basic structure using the filename
      const basicData = parseStructuredData(file.name + ' tender document', file.name)
      return { success: true, data: basicData }
    }

    return { success: true, data: parseStructuredData(text, file.name) }
  } catch (error) {
    console.error('Parse error:', error)
    return { success: false, error: error.message || 'Could not parse document. Please try again.' }
  }
}