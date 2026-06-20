// Anthropic API Client
// Placeholder — add VITE_ANTHROPIC_API_KEY to .env when ready
// All functions throw until the key is configured

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const MODEL = 'claude-sonnet-4-6'
const API_URL = 'https://api.anthropic.com/v1/messages'

export const anthropicEnabled = !!API_KEY

async function callClaude(prompt, maxTokens = 1000) {
  if (!API_KEY) throw new Error('Anthropic API key not configured')

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`)
  const data = await response.json()
  return data.content?.[0]?.text || ''
}

// ─── Tender document analysis ─────────────────────────────────────────────
// Replaces regex parser with Claude reading the full document
export async function extractTenderRequirements(rawText, company) {
  // TODO: Wire up when API key is configured
  // Prompt: Send full tender text, ask Claude to extract structured data
  // Returns: { title, buyer, deadline, value, requirements[], evaluationCriteria[], complianceItems[], winTips[] }
  throw new Error('Anthropic API not configured. Using rule-based extraction instead.')
}

// ─── Bid section improvement ──────────────────────────────────────────────
// Makes "Improve with AI" actually work in the bid generator
export async function improveBidSection(sectionKey, currentContent, tender, company) {
  // TODO: Wire up when API key is configured
  // Prompt: Send section content + tender requirements + company profile
  // Returns: Improved section text tailored to this specific tender
  throw new Error('Anthropic API not configured.')
}

// ─── Compliance fix guidance ──────────────────────────────────────────────
// Generates personalised fix guidance for a specific compliance gap
export async function generateFixGuidance(gapId, gapLabel, tender, company) {
  // TODO: Wire up when API key is configured
  // Prompt: Send gap details + tender context + company profile
  // Returns: Personalised step-by-step guidance for this company and tender
  throw new Error('Anthropic API not configured. Using pre-written guidance instead.')
}

// ─── Win strategy generation ──────────────────────────────────────────────
// Reads the full tender and generates specific win tips
export async function generateWinStrategy(rawText, tender, company) {
  // TODO: Wire up when API key is configured
  // Prompt: Send full tender + company profile
  // Returns: Specific tips based on actual tender wording and evaluation criteria
  throw new Error('Anthropic API not configured. Using rule-based tips instead.')
}

// ─── Bid section generation ───────────────────────────────────────────────
// Generates a full bid section tailored to the specific tender
export async function generateBidSection(sectionKey, tender, company) {
  // TODO: Wire up when API key is configured
  // Prompt: Send section requirements + tender context + company profile
  // Returns: Full personalised bid section
  throw new Error('Anthropic API not configured. Using template generation instead.')
}

export default {
  anthropicEnabled,
  extractTenderRequirements,
  improveBidSection,
  generateFixGuidance,
  generateWinStrategy,
  generateBidSection,
}
