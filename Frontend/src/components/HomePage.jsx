import { useState, useEffect, useContext } from 'react'
// import './App.css'
import SideNavbar from './SideNavbar'

import {
  Route,
  Routes,
  useNavigate,
  BrowserRouter as Router
} from "react-router-dom"
import { AddUsers, AssignTeams, Report, ScoresComponent, UserHomePage, UserDetails, AdminDataVisualization } from './index'
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
import NewReportSubmission from './NewReportUpdates';

// import of components
import MainChallenge from './Challenges/challenges/MainChallenge'
import CreateChallenge from './Challenges/challenges/CreateChallenge';
import LoginPage from './Challenges/Login/loginPage';
import UserChallengePage from './Challenges/UserChallenges/userChallengesPage';
import ChallengeDetailsPage from './Challenges/challenges/ChallengeDetails/ChallengeDetails';
import SubmissionTable from './Challenges/Submissions/submission';
import Configuration from './Config/config';
import ChallengesSubmissions from './Challenges/Submissions/challengeSubmission';
import Repository from './Repository/Repository';
import CreateRepo from './Repository/CreateRepo';
import RepoDetailsPage from './Repository/RepoDetail';

// import reports component
import MainReportPage from './Reports/MainReportPage';
import CreateReport from './Reports/CreateReport';
import ReportDetails from './Reports/ReportDetails/ReportDetailsMain'
import UserReports from './UserReports';
import ColorContext from '../context/ColorContext';
import DockerManagement from './Challenges/challenges/ChallengeDetails/EditChallenge/Contents/DockerManager';

// landing page components
import MainPage from './LandingPage';


function HomePage() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);

  const showAlert = (message, type) => {
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
        <div className="left_Home w-[13%] min-w-20" style={{ backgroundColor: sidenavColor }}>
          <SideNavbar />
        </div>
        <div className={`right_Home lg:w-[87%] h-screen overflow-y-scroll bg-white`} style={{backgroundColor: bgColor}}>
          {
            alert ?
              <Alert alert={alert} />
              :
              ""
          }
          <Routes>
            <Route exact path='/welcome' element={<Welcome />} />
            {/* <Route exact path='/personal/:userId' element={<UserDetails/>} /> */}
            <Route exact path='/progress' element={<UserProgress />} />
            <Route exact path='/home' element={<AdminDataVisualization />} />
            <Route exact path='/createuser' element={<ProtectedRoute Component={AddUsers} />} />
            <Route exact path='/assignTeams' element={<AssignTeams />} />
            <Route exact path='/scores' element={<ProtectedRoute Component={ScoresComponent} />} />
            <Route exact path='/updates' element={<ProtectedRoute Component={NewReportSubmission} />} />
            {/* <Route exact path='/scores1' element={<ProtectedRoute Component={ScorePage1}/>} /> */}
            <Route exact path='/UserHome' element={<UserHomePage />} />
            <Route exact path='/UserHome/report/SITREP' element={<IncidentReport />} />
            <Route exact path='/UserHome/report/:reportId' element={<Report />} />
            <Route exact path='/attacks' element={<ChallengeSubmissions />} />
            {/* <Route exact path='/UserHome/report/day-end' element={<Notification />} /> */}
            <Route exact path='/UserHome/report/notification' element={<Notification />} />
            <Route exact path="/user/:userId" element={<ProtectedRoute Component={UserDetails} />} />
            {/* <Route exact path="/user/:userId" element={<ProtectedRoute Component={UserReports} />} /> */}

            <Route exact path="/notes" element={<Home showAlert={showAlert} />} />
            <Route exact path="/chat/*" element={<ChatMainPage />} />
            <Route exact path="/flag" element={<FetchEncryptedFlag />} />
            <Route exact path="/profile" element={<UserProfile />} />
            {/* Challenges ROute */}
            <Route exact path='/admin/challenges' element={<MainChallenge />} />
            <Route exact path='/admin/challenge/create' element={<CreateChallenge />} />
            <Route exact path='/challenges/:id' element={<ChallengeDetailsPage />} />
            <Route exact path='/repositories/:id' element={<RepoDetailsPage />} />
            <Route exact path='/login' element={<LoginPage />} />
            <Route exact path='/challenges' element={<UserChallengePage />} />
            <Route exact path='/submissions' element={<SubmissionTable />} />
            <Route exact path='/config' element={<Configuration />} />
            <Route exact path='/admin/report' element={<MainReportPage />} />
            <Route exact path='/admin/report/create' element={<CreateReport />} />
            <Route exact path='/admin/report/details/:id' element={<ReportDetails/>}/>
            <Route exact path='/challenges/submissions/:id' element={<ChallengesSubmissions/>}/>
            <Route exact path='/challenges/docker' element={<DockerManagement/>}/>
            <Route exact path='/repository' element={<Repository/>}/>
            <Route exact path='/createRepo' element={<CreateRepo/>}/>
          </Routes>
          
        </div>
      </div>
      {/* </Router> */}
    </>
  )
}

export default HomePage
