import { useState, useEffect } from 'react'
// import './App.css'
import SideNavbar from './SideNavbar'

import {
  Route,
  Routes,
  useNavigate,
  BrowserRouter as Router
} from "react-router-dom"
import { AddUsers, AssignTeams, Report, ScoresComponent, UserHomePage, UserDetails,AdminDataVisualization } from './index'
import { Alert, Home } from './Notes';
import ChatMainPage from './Chats/ChatMainPage'
import FetchEncryptedFlag from './FetchEncryptedFlag';
import IncidentReport from './IncidentReport'
import UserProfile from './UserProfile'
import Notification from './Notification';
import ScorePage1 from './ScoresPage1';
import ProtectedRoute from './ProtectedRoute';
import UserProgress from './UserProgress';
import ChallengeSubmissions from './ChallengSubmissions';
import Welcome from './WelcomePage';
import NewReportSubmission from './NewReportUpdates'

function HomePage() {
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type)=>{
      setAlert({
        msg: message,
        type: type
      })
      setTimeout(() => {
          setAlert(null);
      }, 1500);
  }

    useEffect(() => {
        const authToken = localStorage.getItem('Hactify-Auth-token');
        if (!authToken) {
            navigate('/signin');
        }
    }, []);

  return (
    <>
      {/* <Router> */}
        <div className="flex flex-row h-screen b">
          <div className="left_Home w-[13%] min-w-20 bg-brown-650">
            <SideNavbar />
          </div>
          <div className="right_Home lg:w-[87%] h-screen overflow-y-scroll bg-white-100">
            {
              alert ? 
              <Alert alert={alert}/>
              :
              ""
            }
            <Routes>
              <Route exact path='/' element={<Welcome/>} />
              {/* <Route exact path='/personal/:userId' element={<UserDetails/>} /> */}
              <Route exact path='/progress' element={<UserProgress/>} />
              <Route exact path='/home' element={<AdminDataVisualization/>} />
              <Route exact path='/createuser' element={<AddUsers />} />
              <Route exact path='/assignTeams' element={<AssignTeams />} />
              <Route exact path='/scores' element={<ProtectedRoute Component={ScoresComponent}/>} />
              <Route exact path='/updates' element={<ProtectedRoute Component={NewReportSubmission}/>} />
              {/* <Route exact path='/scores1' element={<ProtectedRoute Component={ScorePage1}/>} /> */}
              <Route exact path='/UserHome' element={<UserHomePage />} />
              <Route exact path='/UserHome/report/SITREP' element={<IncidentReport />} />
              <Route exact path='/UserHome/report/IRREP' element={<Report />} />
              <Route exact path='/attacks' element={<ChallengeSubmissions />} />
              {/* <Route exact path='/UserHome/report/day-end' element={<Notification />} /> */}
              <Route exact path='/UserHome/report/notification' element={<Notification />} />
              <Route exact path="/user/:userId" element={<ProtectedRoute Component={UserDetails}/>} />
              <Route exact path="/notes" element={<Home showAlert={showAlert}/>}/>
              <Route exact path="/chat/*" element={<ChatMainPage/>}/>
              <Route exact path="/flag" element={<FetchEncryptedFlag/>}/>
              <Route exact path="/profile" element={<UserProfile/>}/>
            </Routes>
          </div>
        </div>
      {/* </Router> */}
    </>
  )
}

export default HomePage
