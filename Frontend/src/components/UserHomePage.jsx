
// import { useEffect, useState, useContext } from 'react';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import UserReports from './UserReports';
// import AuthContext from '../context/AuthContext';
// import ColorContext from '../context/ColorContext';
// import FontContext from '../context/FontContext';

// export default function UserHomePage() {
//    const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
//    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
//   const apiUrl = import.meta.env.VITE_Backend_URL;
//   const [reports, setReports] = useState([]);
//   const context = useContext(AuthContext);
  
//   const { user, fetchUserRole } = context;


//   useEffect(() => {
//     const getUserRole = async () => {
//         try {
//             await fetchUserRole();
//         } catch (error) {
//             console.error('Error fetching user role:', error);
//         }
//     };

//     getUserRole();
// }, []);
//   // Fetch reports from the backend
//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/api/reports/userReports`); // Make sure this matches your backend route
//         const data = await response.json();
//         setReports(data);
//       } catch (error) {
//         console.error('Error fetching reports:', error);
//       }
//     };

//     fetchReports();
//   }, []);

//   const navigateTo = (route) => {
//     window.location.href = route;
//   };

//   return (
//     <div className="">
//       <div className="text-center py-8">
//         <h1 className="text-4xl font-bold  mb-4 py-4" style={{color:sidenavColor}}>Submit Report</h1>
//         <hr className='mx-12 border-black'/>
//       </div>
//       <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 px-4 py-4">
        
//         {/* Map through the reports to dynamically create buttons */}
//         {reports.map((report, index) => (
//           <button
//             key={report._id}
//             className=" transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold py-2 px-4 rounded"
//             onClick={() => navigateTo(`/UserHome/report/${report._id}`)}
//           style={{backgroundColor:sidenavColor}}
//           >
//             <span className="mx-2"><FontAwesomeIcon icon={faPlus} /></span>
//             {index + 1}. {report.name}
           
//           </button>
//         ))}

//       </div>
//       <UserReports userId={user._id} route="progress" />
//     </div>
//   );
// }

import { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import UserReports from './UserReports';
import AuthContext from '../context/AuthContext';
import ColorContext from '../context/ColorContext';
import FontContext from '../context/FontContext';

export default function UserHomePage() {
  const { bgColor, textColor, sidenavColor } = useContext(ColorContext);
  const { navbarFont, headingFont, paraFont } = useContext(FontContext);
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const context = useContext(AuthContext);

  const { user, fetchUserRole } = context;

  useEffect(() => {
    const getUserRole = async () => {
      try {
        await fetchUserRole();
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    getUserRole();
  }, []);

  // Fetch reports from the backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/reports/userReports`);
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const handleSubmit = () => {
    if (selectedReport) {
      window.location.href = `/UserHome/report/${selectedReport}`;
    } else {
      alert('Please select a report to submit.');
    }
  };

  return (
    <div className="">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4 py-4" style={{ color: sidenavColor }}>Submit Report</h1>
        <hr className='mx-12 border-black' />
      </div>

      <div className="flex flex-col items-center space-y-6 px-4 py-4">
        <div className="w-full max-w-md">
          <select
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedReport || ""}
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <option value="" disabled>Select a report</option>
            {reports.map((report) => (
              <option key={report._id} value={report._id}>
                {report.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold py-2 px-6 rounded"
          style={{ backgroundColor: sidenavColor }}
          onClick={handleSubmit}
        >
          <span className="mx-2"><FontAwesomeIcon icon={faArrowRight} /></span>
          Open
        </button>
      </div>

      <UserReports userId={user._id} route="progress" />
    </div>
  );
}
