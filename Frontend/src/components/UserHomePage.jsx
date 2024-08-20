// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import ReportTable from './AllReports';

// export default function UserHomePage() {
//   const navigateTo = (route) => {
//     window.location.href = route;
//   };

//   return (
//     <div className="">
//       <div className="text-center py-8">
//         <h1 className="text-4xl font-bold text-brown-650 mb-4 py-4">Submit Report</h1>
//         <hr className='mx-12 border-black'/>
//       </div>
//       <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 px-4 py-4">

//       <button className="bg-brown-650 transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold py-2 px-4 rounded" onClick={() => navigateTo('/UserHome/report/notification')}>
//           <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>1. Add Notification Report
//         </button> 
//         <button className="bg-brown-650 transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold py-2 px-4 rounded" onClick={() => navigateTo('/UserHome/report/IRREP')}>
//           <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>2. Add IRREP Report
//         </button>
//         <button className="bg-brown-650 transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold py-2 px-4 rounded" onClick={() => navigateTo('/UserHome/report/SITREP')}>
//           <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>3. Add SITREP Report
//         </button>
       
//       </div>
//       <ReportTable/>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ReportTable from './AllReports';

export default function UserHomePage() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [reports, setReports] = useState([]);

  // Fetch reports from the backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/reports/`); // Make sure this matches your backend route
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const navigateTo = (route) => {
    window.location.href = route;
  };

  return (
    <div className="">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-brown-650 mb-4 py-4">Submit Report</h1>
        <hr className='mx-12 border-black'/>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 px-4 py-4">
        
        {/* Map through the reports to dynamically create buttons */}
        {reports.map((report, index) => (
          <button
            key={report._id}
            className="bg-brown-650 transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigateTo(`/UserHome/report/${report._id}`)}
          
          >
            <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>
            {index + 1}. {report.name}
           
          </button>
        ))}

      </div>
      <ReportTable/>
    </div>
  );
}

