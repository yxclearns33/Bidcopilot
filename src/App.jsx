import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
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
import MyTenders from './pages/MyTenders'
import './App.css'

const TITLES = {
  dashboard:'Dashboard', upload:'Upload Tender', analysis:'Tender Analysis',
  compliance:'Bid Risk & Compliance Engine', generator:'Bid Pack Generator',
  improvement:'Bid Improvement', opportunities:'Opportunities',
  profile:'Company Profile', pipeline:'My Pipeline', mytenders:'My Tenders',
}

function Shell() {
  const { session, authLoading, dataLoading, onboardingDone, screen, setScreen } = useApp()

  if (authLoading || dataLoading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F5F5F7', flexDirection:'column', gap:16 }}>
        <div style={{ width:36, height:36, border:'3px solid #E8E8EE', borderTopColor:'#4F46E5', borderRadius:'50%', animation:'spin .75s linear infinite' }}/>
        <div style={{ fontSize:13, color:'#6B6B80' }}>Loading BidCopilot...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  // Show landing page for logged out users
  if (!session && screen !== 'auth') return <Landing />
  if (!session) return <Auth />
  if (!onboardingDone) return <Onboarding />

  const props = { onNavigate: setScreen }

  return (
    <div className="app-shell">
      <Sidebar current={screen} onNavigate={setScreen} />
      <div className="app-main">
        <Topbar title={TITLES[screen]||screen} onNewTender={()=>setScreen('upload')} />
        <div className="app-content">
          {screen==='dashboard'     && <Dashboard       {...props} />}
          {screen==='upload'        && <UploadTender    {...props} />}
          {screen==='mytenders'     && <MyTenders        {...props} />}
          {screen==='analysis'      && <Analysis         {...props} />}
          {screen==='compliance'    && <ComplianceEngine  {...props} />}
          {screen==='generator'     && <BidGenerator     {...props} />}
          {screen==='improvement'   && <BidImprovement   {...props} />}
          {screen==='opportunities' && <Opportunities     {...props} />}
          {screen==='profile'       && <CompanyProfile    {...props} />}
          {screen==='pipeline'      && <Pipeline          {...props} />}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return <AppProvider><Shell /></AppProvider>
}
