// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import DataVisualization from './DataVisualization'
// import TimeSeriesGraph from './TimeSeriesGraph'

// import UserReports from './UserReports';

// function UserDetails() {
//   const apiUrl = import.meta.env.VITE_Backend_URL;
//   const { userId } = useParams();
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/api/auth/${userId}`);
//         if (response.ok) {
//           const data = await response.json();
          
//           setUser(data);
//         } else {
//           throw new Error('Failed to fetch user details');
//         }
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//       }
//     };

//     if (userId) {
//       fetchUserDetails();
//     }
//   }, [userId]);

//   const handleGoBack = () => {
//     navigate(-1); // Navigate back to the previous page
//   };

//   const [jsonData, setJsonData] = useState(null);

//     useEffect(() => {
//         // Fetch JSON data from API
//         fetch(`${apiUrl}/api/reports/specific/${userId}`)
//             .then(response => response.json())
//             .then(data => {
//                 setJsonData(data);
                
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     }, []);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <button onClick={handleGoBack} className="text-blue-500 hover:text-blue-700 underline flex flex-row justify-center items-center my-8"><FontAwesomeIcon icon={faArrowLeft} className='me-4' /> Back</button>
//       <h1 className="text-3xl font-bold mb-4">User Details</h1>
//       {user ? (
//         <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//           <div className='flex flex-row'>
//             <div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
//                 <p className="text-gray-700">{user.name}</p>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
//                 <p className="text-gray-700">{user.email}</p>
//               </div>
//             </div>
//             {/* {jsonData && <TimeSeriesGraph jsonData={jsonData} />} */}
//           </div>
//           {jsonData && 
//           <div className='flex flex-row flex-wrap justify-center items-center'>
//             <DataVisualization jsonData={jsonData} />
//             <TimeSeriesGraph jsonData={jsonData} />
//           </div>
//           }
//           <UserReports userId={userId} />
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }

// export default UserDetails;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DataVisualization from './DataVisualization';
import TimeSeriesGraph from './TimeSeriesGraph';
import UserReports from './UserReports';

function UserDetails() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/auth/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          throw new Error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchUserReports = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/responses/all/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setJsonData(data);
        } else {
          throw new Error('Failed to fetch user reports');
        }
      } catch (error) {
        console.error('Error fetching user reports:', error);
      }
    };

    const fetchUserScore = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/score/score/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setScoreData(data);
          console.log(data);
        } else {
          throw new Error('Failed to fetch user score');
        }
      } catch (error) {
        console.error('Error fetching user score:', error);
      }
    };

    if (userId) {
      fetchUserDetails();
      fetchUserReports();
      fetchUserScore();
    }
  }, [userId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={handleGoBack} className="text-blue-500 hover:text-blue-700 underline flex flex-row justify-center items-center my-8">
        <FontAwesomeIcon icon={faArrowLeft} className='me-4' /> Back
      </button>
      <h1 className="text-3xl font-bold mb-4">User Details</h1>
      {user ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className='flex flex-row'>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <p className="text-gray-700">{user.name}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <p className="text-gray-700">{user.email}</p>
              </div>
            </div>
          </div>
          {jsonData && scoreData && 
          <div className='flex flex-row flex-wrap justify-center items-center'>
            <DataVisualization jsonData={jsonData} scoreData={scoreData} />
            {/* <TimeSeriesGraph jsonData={jsonData} /> */}
          </div>
          }
          <UserReports userId={userId} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserDetails;
