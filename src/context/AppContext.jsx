import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { computeFitScore } from '../engines/fitScoring'
import { runComplianceCheck } from '../engines/complianceEngine'
import { OPPORTUNITIES_DATA } from '../data/opportunities'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [onboardingDone, setOnboardingDone] = useState(false)
  const [company, setCompany] = useState(null)
  const [screen, setScreen] = useState('dashboard')
  const [activeOpportunity, setActiveOpportunity] = useState(null)
  const [pipeline, setPipeline] = useState([])
  const [bids, setBids] = useState({})
  const [uploadedTender, setUploadedTender] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)

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
        setCompany(null)
        setOnboardingDone(false)
        setPipeline([])
        setBids({})
        setAuthLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData(userId) {
    setDataLoading(true)
    try {
      const { data: profile } = await supabase.from('company_profiles').select('*').eq('user_id', userId).single()
      const { data: experience } = await supabase.from('experience').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      const { data: refs } = await supabase.from('references_list').select('*').eq('user_id', userId)
      const { data: pipelineData } = await supabase.from('pipeline').select('*').eq('user_id', userId)
      const { data: bidsData } = await supabase.from('bids').select('*').eq('user_id', userId)

      if (profile) {
        setCompany({
          ...profile,
          companyName: profile.company_name,
          staffCount: profile.staff_count,
          operatingRegion: profile.operating_region,
          contractTargetRange: profile.contract_target_range,
          services: profile.services || [],
          compliance: profile.compliance || {},
          experience: (experience || []).map(e => ({ clientName: e.client_name, sector: e.sector, contractValue: e.contract_value, duration: e.duration, description: e.description, outcome: e.outcome, id: e.id })),
          references: (refs || []).map(r => ({ name: r.name, company: r.company, contact: r.contact, id: r.id })),
        })
        setOnboardingDone(true)
      }

      if (pipelineData) setPipeline(pipelineData.map(p => ({ opportunityId: p.opportunity_id, stage: p.stage, savedAt: p.saved_at })))
      if (bidsData) { const m = {}; bidsData.forEach(b => { m[b.opportunity_id] = b.sections }); setBids(m) }
    } catch (err) {
      console.error('Error loading user data:', err)
    } finally {
      setDataLoading(false)
      setAuthLoading(false)
    }
  }

  const opportunities = company
    ? OPPORTUNITIES_DATA.map(opp => ({ ...opp, fitScore: computeFitScore(opp, company), compliance: runComplianceCheck(opp, company) }))
    : OPPORTUNITIES_DATA.map(opp => ({ ...opp, fitScore: null, compliance: null }))

  const completeOnboarding = useCallback(async (data) => {
    if (!session?.user) return
    const userId = session.user.id
    try {
      await supabase.from('company_profiles').upsert({ user_id: userId, company_name: data.companyName, industry: data.industry, location: data.location, staff_count: data.staffCount, operating_region: data.operatingRegion, contract_target_range: data.contractTargetRange, services: data.services || [], compliance: data.compliance || {}, updated_at: new Date().toISOString() })
      if (data.experience?.length > 0) {
        await supabase.from('experience').delete().eq('user_id', userId)
        await supabase.from('experience').insert(data.experience.map(e => ({ user_id: userId, client_name: e.clientName, sector: e.sector, contract_value: e.contractValue, duration: e.duration, description: e.description, outcome: e.outcome })))
      }
      if (data.references?.length > 0) {
        await supabase.from('references_list').delete().eq('user_id', userId)
        await supabase.from('references_list').insert(data.references.map(r => ({ user_id: userId, name: r.name, company: r.company, contact: r.contact })))
      }
      setCompany(data)
      setOnboardingDone(true)
      setScreen('dashboard')
    } catch (err) { console.error('Error saving onboarding:', err) }
  }, [session])

  const updateCompany = useCallback(async (updates) => {
    if (!session?.user) return
    const userId = session.user.id
    setCompany(c => ({ ...c, ...updates }))
    try {
      if (updates.experience) {
        await supabase.from('experience').delete().eq('user_id', userId)
        if (updates.experience.length > 0) await supabase.from('experience').insert(updates.experience.map(e => ({ user_id: userId, client_name: e.clientName, sector: e.sector, contract_value: e.contractValue, duration: e.duration, description: e.description, outcome: e.outcome })))
        return
      }
      if (updates.references) {
        await supabase.from('references_list').delete().eq('user_id', userId)
        if (updates.references.length > 0) await supabase.from('references_list').insert(updates.references.map(r => ({ user_id: userId, name: r.name, company: r.company, contact: r.contact })))
        return
      }
      const p = {}
      if (updates.companyName !== undefined) p.company_name = updates.companyName
      if (updates.industry !== undefined) p.industry = updates.industry
      if (updates.location !== undefined) p.location = updates.location
      if (updates.staffCount !== undefined) p.staff_count = updates.staffCount
      if (updates.operatingRegion !== undefined) p.operating_region = updates.operatingRegion
      if (updates.contractTargetRange !== undefined) p.contract_target_range = updates.contractTargetRange
      if (updates.services !== undefined) p.services = updates.services
      if (updates.compliance !== undefined) p.compliance = updates.compliance
      if (Object.keys(p).length > 0) { p.updated_at = new Date().toISOString(); await supabase.from('company_profiles').update(p).eq('user_id', userId) }
    } catch (err) { console.error('Error updating company:', err) }
  }, [session])

  const saveToPipeline = useCallback(async (oppId, stage = 'saved') => {
    if (!session?.user) return
    setPipeline(p => { const exists = p.find(x => x.opportunityId === oppId); if (exists) return p.map(x => x.opportunityId === oppId ? { ...x, stage } : x); return [...p, { opportunityId: oppId, stage, savedAt: new Date().toISOString() }] })
    try { await supabase.from('pipeline').upsert({ user_id: session.user.id, opportunity_id: oppId, stage, updated_at: new Date().toISOString() }) }
    catch (err) { console.error('Error saving pipeline:', err) }
  }, [session])

  const getPipelineStage = useCallback((oppId) => pipeline.find(x => x.opportunityId === oppId)?.stage || null, [pipeline])

  const updateBid = useCallback(async (oppId, sections) => {
    if (!session?.user) return
    setBids(b => ({ ...b, [oppId]: sections }))
    try { await supabase.from('bids').upsert({ user_id: session.user.id, opportunity_id: oppId, sections, updated_at: new Date().toISOString() }) }
    catch (err) { console.error('Error saving bid:', err) }
  }, [session])

  const signOut = useCallback(async () => { await supabase.auth.signOut(); setScreen('dashboard') }, [])

  return (
    <AppContext.Provider value={{ session, authLoading, dataLoading, onboardingDone, company, screen, setScreen, activeOpportunity, setActiveOpportunity, opportunities, pipeline, bids, uploadedTender, setUploadedTender, completeOnboarding, updateCompany, saveToPipeline, getPipelineStage, updateBid, signOut }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
