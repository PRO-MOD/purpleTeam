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

  function App() {

    return (
      <>
      <NoteState>
        <Router>
          <Routes>
            <Route exact path='/*' element={<HomePage/>}/>
            <Route exact path='/signin' element={<SignIn/>}/>
          </Routes>
        </Router>
        </NoteState>
      </>
    )
  }

  export default App
