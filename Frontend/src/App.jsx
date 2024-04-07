import { useState } from 'react'
import './App.css'
import SideNavbar from './components/SideNavbar'
// import { AddUsers } from './components/index'

import {
  Route,
  Routes,
  BrowserRouter as Router
} from "react-router-dom"
import { AddUsers, AssignTeams, Report, ScoresComponent, UserHomePage } from './components'

function App() {

  return (
    <>
      <Router>
        <div className="flex flex-row h-full mt-1">
          <div className="left_Home w-[5%] min-w-20">
            <SideNavbar />
          </div>
          <div className="right_Home lg:w-[95%]">
            <Routes>
              <Route exact path='/' element={<>Hello</>} />
              <Route exact path='/createuser' element={<AddUsers />} />
              <Route exact path='/assignTeams' element={<AssignTeams />} />
              <Route exact path='/scores' element={<ScoresComponent />} />
              <Route exact path='/UserHome' element={<UserHomePage />} />
              <Route exact path='/UserHome/report/SITREP' element={<Report />} />
              <Route exact path='/UserHome/report/incident' element={<Report />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  )
}

export default App
