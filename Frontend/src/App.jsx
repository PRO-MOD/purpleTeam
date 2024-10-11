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
import SignIn from './components/Signin'
import HomePage from './components/HomePage'
import NoteState from './context/NoteState'
import AuthState from './context/AuthState'
import SocketState from './context/SocketState'
import ColorState from './context/ColorState'
import FontState from './context/FontState'


// landing page components
import MainPage from './components/LandingPage'

function App() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  // console.log(apiUrl);
  return (
    <>
      <AuthState>
        <SocketState>
          <NoteState>
            <ColorState>
            <FontState>              
            <Router>
              <Routes>
                <Route exact path='/*' element={<HomePage />} />
                <Route exact path='/' element={<MainPage />} />
                <Route exact path='/signin' element={<SignIn />} />
              </Routes>
            </Router>
            </FontState>
            </ColorState>
          </NoteState>
        </SocketState>
      </AuthState>
    </>
  )
}

export default App
