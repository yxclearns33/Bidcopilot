import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import UploadTender from './pages/UploadTender'
import Analysis from './pages/Analysis'
import ComplianceEngine from './pages/ComplianceEngine'
import BidGenerator from './pages/BidGenerator'
import BidImprovement from './pages/BidImprovement'
import Opportunities from './pages/Opportunities'
import CompanyProfile from './pages/CompanyProfile'
import Pipeline from './pages/Pipeline'
import './App.css'

const TITLES = {
  dashboard: 'Dashboard',
  upload: 'Upload Tender',
  analysis: 'Tender Analysis',
  compliance: 'Bid Risk & Compliance Engine',
  generator: 'Bid Pack Generator',
  improvement: 'Bid Improvement',
  opportunities: 'Opportunities',
  profile: 'Company Profile',
  pipeline: 'My Pipeline',
}

function Shell() {
  const { onboardingDone, screen, setScreen } = useApp()

  if (!onboardingDone) return <Onboarding />

  const props = { onNavigate: setScreen }

  return (
    <div className="app-shell">
      <Sidebar current={screen} onNavigate={setScreen} />
      <div className="app-main">
        <Topbar title={TITLES[screen] || screen} onNewTender={() => setScreen('upload')} />
        <div className="app-content">
          {screen === 'dashboard'    && <Dashboard    {...props} />}
          {screen === 'upload'       && <UploadTender {...props} />}
          {screen === 'analysis'     && <Analysis     {...props} />}
          {screen === 'compliance'   && <ComplianceEngine {...props} />}
          {screen === 'generator'    && <BidGenerator  {...props} />}
          {screen === 'improvement'  && <BidImprovement {...props} />}
          {screen === 'opportunities'&& <Opportunities  {...props} />}
          {screen === 'profile'      && <CompanyProfile {...props} />}
          {screen === 'pipeline'     && <Pipeline       {...props} />}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return <AppProvider><Shell /></AppProvider>
}
