import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ReportTable from './AllReports';

export default function UserHomePage() {
  const navigateTo = (route) => {
    window.location.href = route;
  };

  return (
    <div className="">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4 py-4">Submit Report</h1>
        <hr className='mx-12 border-black'/>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 px-4 py-4">

      <button className="bg-purple-500 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded" onClick={() => navigateTo('/UserHome/report/day-end')}>
          <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>1. Add Notification Report
        </button> 
        <button className="bg-purple-500 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded" onClick={() => navigateTo('/UserHome/report/SITREP')}>
          <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>2. Add SITREP Report
        </button>
        <button className="bg-purple-500 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded" onClick={() => navigateTo('/UserHome/report/incident')}>
          <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>3. Add IRREP Report
        </button>
       
      </div>
      <ReportTable/>
    </div>
  );
}
