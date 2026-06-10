import { createContext, useContext, useState, useCallback } from 'react'
import { computeFitScore } from '../engines/fitScoring'
import { runComplianceCheck } from '../engines/complianceEngine'
import { OPPORTUNITIES_DATA } from '../data/opportunities'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [onboardingDone, setOnboardingDone] = useState(false)
  const [company, setCompany] = useState(null)
  const [screen, setScreen] = useState('dashboard')
  const [activeOpportunity, setActiveOpportunity] = useState(null)
  const [pipeline, setPipeline] = useState([])
  const [bids, setBids] = useState({})
  const [uploadedTender, setUploadedTender] = useState(null)

  const opportunities = company
    ? OPPORTUNITIES_DATA.map(opp => ({
        ...opp,
        fitScore: computeFitScore(opp, company),
        compliance: runComplianceCheck(opp, company),
      }))
    : OPPORTUNITIES_DATA.map(opp => ({ ...opp, fitScore: null, compliance: null }))

  const completeOnboarding = useCallback((data) => {
    setCompany(data)
    setOnboardingDone(true)
    setScreen('dashboard')
  }, [])

  const updateCompany = useCallback((updates) => {
    setCompany(c => ({ ...c, ...updates }))
  }, [])

  const saveToPipeline = useCallback((oppId, stage = 'saved') => {
    setPipeline(p => {
      const exists = p.find(x => x.opportunityId === oppId)
      if (exists) return p.map(x => x.opportunityId === oppId ? { ...x, stage } : x)
      return [...p, { opportunityId: oppId, stage, savedAt: new Date().toISOString() }]
    })
  }, [])

  const getPipelineStage = useCallback((oppId) => {
    return pipeline.find(x => x.opportunityId === oppId)?.stage || null
  }, [pipeline])

  const updateBid = useCallback((oppId, sections) => {
    setBids(b => ({ ...b, [oppId]: sections }))
  }, [])

  return (
    <AppContext.Provider value={{
      onboardingDone, company, screen, setScreen,
      activeOpportunity, setActiveOpportunity,
      opportunities, pipeline, bids,
      uploadedTender, setUploadedTender,
      completeOnboarding, updateCompany,
      saveToPipeline, getPipelineStage, updateBid,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
