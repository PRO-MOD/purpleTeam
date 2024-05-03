

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ReportTable from './AllReports';

export default function UserHomePage() {
  const navigateTo = (route) => {
    window.location.href = route;
  };

  return (
    <div className="bg-orange-50 pl-4">
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold text-black-400 mb-4 py-4">Share Your Report</h1>
        <hr className='mx-12 border-purple'/>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 px-4 py-4">
        <button className="bg-purple-500 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded" onClick={() => navigateTo('/UserHome/report/SITREP')}>
          <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>Add SITREP Report
        </button>
        <button className="bg-purple-500 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded" onClick={() => navigateTo('/UserHome/report/incident')}>
          <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>Add IRREP Report
        </button>
        <button className="bg-purple-500 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded" onClick={() => navigateTo('/UserHome/report/day-end')}>
          <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>Add Notification Report
        </button> 
      </div>
      <ReportTable/>
    </div>
  );
}
