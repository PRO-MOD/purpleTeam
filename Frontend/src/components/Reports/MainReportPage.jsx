import React from 'react'
import { Link } from 'react-router-dom'

// fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

// import components reports
import PageHeader from '../Challenges/navbar/PageHeader'
import AllReports from './AllReports'

const MainReportPage = () => {
  return (
    <>
      <PageHeader pageTitle="Reports" checkRoute="/admin/report" route="/admin/report/create"/>
      <AllReports />
    </>
  )
}

export default MainReportPage;