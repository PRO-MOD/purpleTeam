import { useState, useEffect } from 'react'
// import './App.css'
import SideNavbar from './SideNavbar'

import {
  Route,
  Routes,
  useNavigate,
  BrowserRouter as Router
} from "react-router-dom"
import { AddUsers, AssignTeams, Report, ScoresComponent, UserHomePage, UserDetails } from './index'
import { Alert, Home } from './Notes';


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
        <div className="flex flex-row h-full mt-1">
          <div className="left_Home w-[5%] min-w-20">
            <SideNavbar />
          </div>
          <div className="right_Home lg:w-[95%]">
            <Alert alert={alert}/>
            <Routes>
              <Route exact path='/home' element={<>Hello</>} />
              <Route exact path='/createuser' element={<AddUsers />} />
              <Route exact path='/assignTeams' element={<AssignTeams />} />
              <Route exact path='/scores' element={<ScoresComponent />} />
              <Route exact path='/UserHome' element={<UserHomePage />} />
              <Route exact path='/UserHome/report/SITREP' element={<Report />} />
              <Route exact path='/UserHome/report/incident' element={<Report />} />
              <Route exact path="/user/:userId" element={<UserDetails/>} />
              <Route exact path="/notes" element={<Home showAlert={showAlert}/>}/>
            </Routes>
          </div>
        </div>
      {/* </Router> */}
    </>
  )
}

export default HomePage
