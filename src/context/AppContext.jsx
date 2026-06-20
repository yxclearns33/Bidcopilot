import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { computeFitScore } from '../engines/fitScoring'
import { runComplianceCheck } from '../engines/complianceEngine'
import { fetchContractsFinder } from '../engines/contractsFinder'
import { OPPORTUNITIES_DATA } from '../data/opportunities'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [onboardingDone, setOnboardingDone] = useState(false)
  const [company, setCompany] = useState(null)
  const [screen, setScreen] = useState('dashboard')
  const [activeTenderId, setActiveTenderId] = useState(null)
  const [uploadedTenders, setUploadedTenders] = useState([])
  const [apiTenders, setApiTenders] = useState([])
  const [apiLoading, setApiLoading] = useState(false)
  const [pipeline, setPipeline] = useState([])
  const [bids, setBids] = useState({})
  const [bidPlanItems, setBidPlanItems] = useState({})
  const [resolvedOverrides, setResolvedOverrides] = useState({})
  const [dataLoading, setDataLoading] = useState(false)

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadUserData(session.user.id)
      else setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadUserData(session.user.id)
      else {
        setCompany(null); setOnboardingDone(false)
        setUploadedTenders([]); setPipeline([])
        setBids({}); setBidPlanItems({}); setResolvedOverrides({})
        setAuthLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load all user data from Supabase
  async function loadUserData(userId) {
    setDataLoading(true)
    try {
      const [
        { data: profile },
        { data: experience },
        { data: refs },
        { data: pipelineData },
        { data: bidsData },
        { data: tendersData },
        { data: planData },
      ] = await Promise.all([
        supabase.from('company_profiles').select('*').eq('user_id', userId).single(),
        supabase.from('experience').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('references_list').select('*').eq('user_id', userId),
        supabase.from('pipeline').select('*').eq('user_id', userId),
        supabase.from('bids').select('*').eq('user_id', userId),
        supabase.from('uploaded_tenders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('bid_plan_items').select('*').eq('user_id', userId),
      ])

      if (profile) {
        setCompany({
          ...profile,
          companyName: profile.company_name,
          staffCount: profile.staff_count,
          operatingRegion: profile.operating_region,
          contractTargetRange: profile.contract_target_range,
          yearsTrading: profile.years_trading,
          turnoverBand: profile.turnover_band,
          largestContract: profile.largest_contract,
          publicSectorExp: profile.public_sector_exp,
          services: profile.services || [],
          compliance: profile.compliance || {},
          accreditations: profile.accreditations || {},
          dynamicCompliance: profile.dynamic_compliance || {},
          experience: (experience || []).map(e => ({
            clientName: e.client_name, sector: e.sector,
            contractValue: e.contract_value, duration: e.duration,
            description: e.description, outcome: e.outcome, id: e.id,
          })),
          references: (refs || []).map(r => ({
            name: r.name, company: r.company, id: r.id,
          })),
        })
        setOnboardingDone(true)
      }

      if (pipelineData) setPipeline(pipelineData.map(p => ({ opportunityId: p.opportunity_id, stage: p.stage, savedAt: p.saved_at })))
      if (bidsData) { const m = {}; bidsData.forEach(b => { m[b.opportunity_id] = b.sections }); setBids(m) }

      if (tendersData) {
        setUploadedTenders(tendersData.map(t => ({
          id: t.tender_id, title: t.title, buyer: t.buyer,
          value: t.value, valueNum: t.value_num || 0,
          deadline: t.deadline, daysLeft: t.days_left || 30,
          location: t.location, industry: t.industry,
          source: t.source || 'Uploaded document',
          summary: t.summary,
          extractedRequirements: t.extracted_requirements || [],
          evaluationCriteria: t.evaluation_criteria || [],
          requiredCompliance: t.required_compliance || [],
          winTips: t.win_tips || [],
          minInsurance: t.min_insurance || 5,
          uploadedAt: t.created_at,
          fromUpload: true,
        })))
      }

      // Build bidPlanItems and resolvedOverrides from plan data
      if (planData) {
        const planMap = {}
        const resolvedMap = {}
        planData.forEach(item => {
          if (!planMap[item.opportunity_id]) planMap[item.opportunity_id] = {}
          planMap[item.opportunity_id][item.gap_id] = {
            status: item.status,
            addedAt: item.added_at,
          }
          if (item.status === 'done') {
            if (!resolvedMap[item.opportunity_id]) resolvedMap[item.opportunity_id] = []
            resolvedMap[item.opportunity_id].push(item.gap_id)
          }
        })
        setBidPlanItems(planMap)
        setResolvedOverrides(resolvedMap)
      }
    } catch (err) {
      console.error('Error loading user data:', err)
    } finally {
      setDataLoading(false)
      setAuthLoading(false)
    }
  }

  // Fetch live tenders from Contracts Finder API
  const fetchLiveTenders = useCallback(async () => {
    if (!company) return
    setApiLoading(true)
    try {
      const result = await fetchContractsFinder(company, { size: 20 })
      if (result.success && result.results.length > 0) {
        setApiTenders(result.results)
      } else {
        // Fallback to hardcoded
        const { OPPORTUNITIES_DATA: fallback } = await import('../data/opportunities')
        setApiTenders(fallback.map(opp => ({
          ...opp,
          fitScore: computeFitScore(opp, company),
          compliance: runComplianceCheck(opp, company),
        })))
      }
    } catch {
      const { OPPORTUNITIES_DATA: fallback } = await import('../data/opportunities')
      setApiTenders(fallback.map(opp => ({
        ...opp,
        fitScore: computeFitScore(opp, company),
        compliance: runComplianceCheck(opp, company),
      })))
    } finally {
      setApiLoading(false)
    }
  }, [company])

  // Score uploaded tenders against current profile
  const scoredUploadedTenders = uploadedTenders.map(t => ({
    ...t,
    fitScore: company ? computeFitScore(t, company) : null,
    compliance: company ? runComplianceCheck(t, company) : null,
  }))

  // Active tender object
  const activeTender = activeTenderId
    ? (scoredUploadedTenders.find(t => t.id === activeTenderId) || apiTenders.find(t => t.id === activeTenderId))
    : null

  // Complete onboarding
  const completeOnboarding = useCallback(async (data) => {
    if (!session?.user) return
    const userId = session.user.id
    try {
      await supabase.from('company_profiles').upsert({
        user_id: userId,
        company_name: data.companyName,
        industry: data.industry,
        location: data.location,
        staff_count: data.staffCount,
        operating_region: data.operatingRegion,
        contract_target_range: data.contractTargetRange,
        years_trading: data.yearsTrading,
        turnover_band: data.turnoverBand,
        largest_contract: data.largestContract,
        public_sector_exp: data.publicSectorExp || false,
        services: data.services || [],
        compliance: data.compliance || {},
        accreditations: data.accreditations || {},
        dynamic_compliance: data.dynamicCompliance || {},
        updated_at: new Date().toISOString(),
      })
      setCompany(data)
      setOnboardingDone(true)
      setScreen('dashboard')
    } catch (err) { console.error('Error saving onboarding:', err) }
  }, [session])

  // Update company profile
  const updateCompany = useCallback(async (updates) => {
    if (!session?.user) return
    const userId = session.user.id
    setCompany(c => ({ ...c, ...updates }))
    try {
      if (updates.experience) {
        await supabase.from('experience').delete().eq('user_id', userId)
        if (updates.experience.length > 0) {
          await supabase.from('experience').insert(updates.experience.map(e => ({
            user_id: userId, client_name: e.clientName, sector: e.sector,
            contract_value: e.contractValue, duration: e.duration,
            description: e.description, outcome: e.outcome,
          })))
        }
        return
      }
      if (updates.references) {
        await supabase.from('references_list').delete().eq('user_id', userId)
        if (updates.references.length > 0) {
          await supabase.from('references_list').insert(updates.references.map(r => ({
            user_id: userId, name: r.name, company: r.company,
          })))
        }
        return
      }
      const p = {}
      const fieldMap = {
        companyName: 'company_name', industry: 'industry', location: 'location',
        staffCount: 'staff_count', operatingRegion: 'operating_region',
        contractTargetRange: 'contract_target_range', yearsTrading: 'years_trading',
        turnoverBand: 'turnover_band', largestContract: 'largest_contract',
        publicSectorExp: 'public_sector_exp', services: 'services',
        compliance: 'compliance', accreditations: 'accreditations',
        dynamicCompliance: 'dynamic_compliance', feedbackNote: 'feedback_note',
      }
      Object.entries(fieldMap).forEach(([key, col]) => {
        if (updates[key] !== undefined) p[col] = updates[key]
      })
      if (Object.keys(p).length > 0) {
        p.updated_at = new Date().toISOString()
        await supabase.from('company_profiles').update(p).eq('user_id', userId)
      }
    } catch (err) { console.error('Error updating company:', err) }
  }, [session])

  // Save uploaded tender
  const saveUploadedTender = useCallback(async (tender) => {
    if (!session?.user) return
    const userId = session.user.id
    setUploadedTenders(prev => {
      const exists = prev.find(t => t.id === tender.id)
      if (exists) return prev.map(t => t.id === tender.id ? { ...t, ...tender } : t)
      return [tender, ...prev]
    })
    setActiveTenderId(tender.id)
    try {
      await supabase.from('uploaded_tenders').upsert({
        user_id: userId,
        tender_id: tender.id,
        title: tender.title,
        buyer: tender.buyer,
        value: tender.value,
        value_num: tender.valueNum || 0,
        deadline: tender.deadline,
        days_left: tender.daysLeft || 30,
        location: tender.location,
        industry: tender.industry,
        source: tender.source,
        summary: tender.summary,
        extracted_requirements: tender.extractedRequirements || [],
        evaluation_criteria: tender.evaluationCriteria || [],
        required_compliance: tender.requiredCompliance || [],
        win_tips: tender.winTips || [],
        min_insurance: tender.minInsurance || 5,
      })
    } catch (err) { console.error('Error saving tender:', err) }
  }, [session])

  // Delete uploaded tender
  const deleteUploadedTender = useCallback(async (tenderId) => {
    if (!session?.user) return
    setUploadedTenders(prev => prev.filter(t => t.id !== tenderId))
    if (activeTenderId === tenderId) setActiveTenderId(null)
    try {
      await supabase.from('uploaded_tenders').delete().eq('user_id', session.user.id).eq('tender_id', tenderId)
    } catch (err) { console.error('Error deleting tender:', err) }
  }, [session, activeTenderId])

  // Add gap to bid plan
  const addToBidPlan = useCallback(async (tenderId, gapId) => {
    if (!session?.user) return
    const userId = session.user.id
    setBidPlanItems(prev => ({
      ...prev,
      [tenderId]: { ...(prev[tenderId] || {}), [gapId]: { status: 'none', addedAt: new Date().toISOString() } }
    }))
    try {
      await supabase.from('bid_plan_items').upsert({
        user_id: userId,
        opportunity_id: tenderId,
        gap_id: gapId,
        status: 'none',
        added_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch (err) { console.error('Error adding to bid plan:', err) }
  }, [session])

  // Update bid plan item status
  const updateBidPlanItem = useCallback(async (tenderId, gapId, status) => {
    if (!session?.user) return
    const userId = session.user.id

    setBidPlanItems(prev => ({
      ...prev,
      [tenderId]: { ...(prev[tenderId] || {}), [gapId]: { ...(prev[tenderId]?.[gapId] || {}), status } }
    }))

    // Sync resolved overrides
    setResolvedOverrides(prev => {
      const current = prev[tenderId] || []
      if (status === 'done') {
        return { ...prev, [tenderId]: [...new Set([...current, gapId])] }
      } else {
        return { ...prev, [tenderId]: current.filter(id => id !== gapId) }
      }
    })

    try {
      await supabase.from('bid_plan_items').upsert({
        user_id: userId,
        opportunity_id: tenderId,
        gap_id: gapId,
        status,
        updated_at: new Date().toISOString(),
      })
    } catch (err) { console.error('Error updating bid plan item:', err) }
  }, [session])

  // Check if gap is in bid plan
  const isInBidPlan = useCallback((tenderId, gapId) => {
    return !!bidPlanItems[tenderId]?.[gapId]
  }, [bidPlanItems])

  // Get bid plan item status
  const getBidPlanStatus = useCallback((tenderId, gapId) => {
    return bidPlanItems[tenderId]?.[gapId]?.status || 'none'
  }, [bidPlanItems])

  // Check if gap is resolved (done in bid plan)
  const isResolved = useCallback((tenderId, gapId) => {
    return resolvedOverrides[tenderId]?.includes(gapId) || false
  }, [resolvedOverrides])

  // Pipeline
  const saveToPipeline = useCallback(async (oppId, stage = 'saved') => {
    if (!session?.user) return
    setPipeline(p => {
      const exists = p.find(x => x.opportunityId === oppId)
      if (exists) return p.map(x => x.opportunityId === oppId ? { ...x, stage } : x)
      return [...p, { opportunityId: oppId, stage, savedAt: new Date().toISOString() }]
    })
    try {
      await supabase.from('pipeline').upsert({
        user_id: session.user.id,
        opportunity_id: oppId,
        stage,
        updated_at: new Date().toISOString(),
      })
    } catch (err) { console.error('Error saving pipeline:', err) }
  }, [session])

  const getPipelineStage = useCallback((oppId) => {
    return pipeline.find(x => x.opportunityId === oppId)?.stage || null
  }, [pipeline])

  const updateBid = useCallback(async (oppId, sections) => {
    if (!session?.user) return
    setBids(b => ({ ...b, [oppId]: sections }))
    try {
      await supabase.from('bids').upsert({
        user_id: session.user.id,
        opportunity_id: oppId,
        sections,
        updated_at: new Date().toISOString(),
      })
    } catch (err) { console.error('Error saving bid:', err) }
  }, [session])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setScreen('dashboard')
  }, [])

  return (
    <AppContext.Provider value={{
      session, authLoading, dataLoading,
      onboardingDone, company, screen, setScreen,
      activeTenderId, setActiveTenderId, activeTender,
      uploadedTenders: scoredUploadedTenders,
      apiTenders, apiLoading, fetchLiveTenders,
      pipeline, bids, bidPlanItems, resolvedOverrides,
      completeOnboarding, updateCompany,
      saveUploadedTender, deleteUploadedTender,
      addToBidPlan, updateBidPlanItem,
      isInBidPlan, getBidPlanStatus, isResolved,
      saveToPipeline, getPipelineStage, updateBid,
      signOut,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
