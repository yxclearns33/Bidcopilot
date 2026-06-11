import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

// Extract raw text from PDF
async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map(item => item.str).join(' ')
    fullText += pageText + '\n'
  }
  return fullText
}

// Extract raw text from DOCX
async function extractDocxText(file) {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

// Parse structured data from raw text
function parseStructuredData(text, filename) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const lower = text.toLowerCase()

  // Extract title — first meaningful line or filename
  let title = filename.replace(/\.(pdf|docx)$/i, '').replace(/[-_]/g, ' ')
  for (const line of lines.slice(0, 10)) {
    if (line.length > 20 && line.length < 150 && !line.match(/^(page|date|ref|version)/i)) {
      title = line
      break
    }
  }

  // Extract buyer/organisation
  let buyer = 'Unknown Buyer'
  const buyerPatterns = [
    /(?:issued by|contracting authority|buyer|organisation|authority)[:\s]+([A-Z][^\n]{5,60})/i,
    /([A-Z][a-z]+ (?:Council|Authority|NHS|Trust|University|College|Department|Ministry|Agency|Board))/,
  ]
  for (const pattern of buyerPatterns) {
    const match = text.match(pattern)
    if (match) { buyer = match[1].trim(); break }
  }

  // Extract deadline
  let deadline = 'See document'
  const deadlinePatterns = [
    /(?:closing date|deadline|submission date|return by|due date|submit by)[:\s]+([0-9]{1,2}[\s/.-][A-Za-z0-9]{2,9}[\s/.-][0-9]{2,4})/i,
    /([0-9]{1,2}[\s/.-][A-Za-z]{3,9}[\s/.-][0-9]{4})/,
  ]
  for (const pattern of deadlinePatterns) {
    const match = text.match(pattern)
    if (match) { deadline = match[1].trim(); break }
  }

  // Extract contract value
  let value = 'See document'
  const valuePatterns = [
    /(?:contract value|estimated value|budget|total value)[:\s]+[£$€]?([\d,]+(?:\.\d{2})?(?:\s*(?:million|m|k))?)/i,
    /[£$€]([\d,]+(?:\.\d{2})?(?:\s*(?:million|m|k))?)/,
  ]
  for (const pattern of valuePatterns) {
    const match = text.match(pattern)
    if (match) {
      let v = match[1].trim()
      if (!v.startsWith('£')) v = '£' + v
      value = v
      break
    }
  }

  // Extract location
  let location = 'United Kingdom'
  const locationPatterns = [
    /(?:location|place of performance|site|delivery address)[:\s]+([A-Z][^\n]{5,50})/i,
  ]
  for (const pattern of locationPatterns) {
    const match = text.match(pattern)
    if (match) { location = match[1].trim(); break }
  }

  // Detect industry
  let industry = 'cleaning'
  if (lower.includes('security') || lower.includes('guard') || lower.includes('sia')) industry = 'security'
  else if (lower.includes('construction') || lower.includes('build') || lower.includes('civil')) industry = 'construction'
  else if (lower.includes('clean') || lower.includes('hygiene') || lower.includes('janitor')) industry = 'cleaning'
  else if (lower.includes('facility') || lower.includes('facilities') || lower.includes('maintenance')) industry = 'facilities'

  // Extract requirements
  const requirements = []
  const reqKeywords = [
    'must', 'required', 'shall', 'mandatory', 'essential',
    'minimum', 'certificate', 'insurance', 'licence', 'accreditation',
    'experience', 'qualification', 'policy', 'assessment',
  ]
  for (const line of lines) {
    const lineLower = line.toLowerCase()
    if (
      reqKeywords.some(k => lineLower.includes(k)) &&
      line.length > 20 &&
      line.length < 200 &&
      requirements.length < 8
    ) {
      requirements.push(line)
    }
  }

  // Detect required compliance
  const requiredCompliance = []
  if (lower.includes('public liability')) requiredCompliance.push('public_liability')
  if (lower.includes('employers liability') || lower.includes("employer's liability")) requiredCompliance.push('employers_liability')
  if (lower.includes('health and safety') || lower.includes('health & safety')) requiredCompliance.push('health_safety')
  if (lower.includes('risk assessment')) requiredCompliance.push('risk_assessments')
  if (lower.includes('coshh')) requiredCompliance.push('coshh')
  if (lower.includes('sia licence') || lower.includes('sia license')) requiredCompliance.push('sia_licence')
  if (lower.includes('iso 9001')) requiredCompliance.push('iso_9001')

  // Extract insurance minimum value
  let minInsurance = 1
  const insMatch = text.match(/[£$€]([\d]+)[\s]*(?:million|m)\s*(?:public liability)/i)
    || text.match(/public liability[^£]*[£$€]([\d]+)[\s]*(?:million|m)/i)
  if (insMatch) minInsurance = parseInt(insMatch[1])

  // Extract evaluation criteria from text
  const evaluationCriteria = []
  const criteriaPatterns = [
    { pattern: /quality[^\n]*?(\d{1,3})\s*%/gi, label: 'Quality & methodology' },
    { pattern: /price[^\n]*?(\d{1,3})\s*%/gi, label: 'Price' },
    { pattern: /social value[^\n]*?(\d{1,3})\s*%/gi, label: 'Social value' },
    { pattern: /experience[^\n]*?(\d{1,3})\s*%/gi, label: 'Experience' },
    { pattern: /technical[^\n]*?(\d{1,3})\s*%/gi, label: 'Technical capability' },
  ]
  for (const { pattern, label } of criteriaPatterns) {
    const match = pattern.exec(text)
    if (match) evaluationCriteria.push({ criterion: label, weight: parseInt(match[1]) })
  }

  // Win tips based on evaluation criteria
  const winTips = []
  if (evaluationCriteria.find(c => c.criterion === 'Quality & methodology' && c.weight >= 30)) {
    winTips.push(`Quality & methodology is ${evaluationCriteria.find(c=>c.criterion==='Quality & methodology').weight}% of score — detail your processes thoroughly`)
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

  return {
    id: `uploaded-${Date.now()}`,
    title: title.substring(0, 100),
    buyer,
    value,
    location,
    deadline,
    daysLeft: 30,
    industry,
    source: 'Uploaded document',
    minInsurance,
    requiredCompliance: requiredCompliance.length > 0 ? requiredCompliance : ['public_liability', 'employers_liability', 'health_safety'],
    extractedRequirements: requirements.slice(0, 6),
    evaluationCriteria: evaluationCriteria.length > 0 ? evaluationCriteria : [
      { criterion: 'Quality & methodology', weight: 40 },
      { criterion: 'Price', weight: 35 },
      { criterion: 'Social value', weight: 15 },
      { criterion: 'Experience', weight: 10 },
    ],
    summary: `${title} — uploaded and analysed by BidCopilot. Review the extracted requirements and compliance gaps below.`,
    winTips: winTips.slice(0, 4),
    rawText: text.substring(0, 5000),
  }
}

// Main export — parse any file
export async function parseTenderDocument(file) {
  try {
    let text = ''
    const ext = file.name.split('.').pop().toLowerCase()

    if (ext === 'pdf') {
      text = await extractPdfText(file)
    } else if (ext === 'docx') {
      text = await extractDocxText(file)
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.')
    }

    if (!text || text.trim().length < 50) {
      throw new Error('Could not extract text from this document. It may be scanned or image-based.')
    }

    return { success: true, data: parseStructuredData(text, file.name) }
  } catch (error) {
    return { success: false, error: error.message }
  }
}