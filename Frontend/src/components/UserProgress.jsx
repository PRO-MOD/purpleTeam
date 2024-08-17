// import { useEffect, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthContext from '../context/AuthContext';
// import UserReports from "./UserReports";
// import DataVisualization from "./DataVisualization";
// import TimeSeriesGraph from "./TimeSeriesGraph";

// function UserProgress() {
//     const apiUrl = import.meta.env.VITE_Backend_URL;
//     const navigate = useNavigate();
//     const context = useContext(AuthContext);
//     const { user, fetchUserRole } = context;

//     useEffect(() => {
//         const getUserRole = async () => {
//             try {
//                 await fetchUserRole();
//             } catch (error) {
//                 console.error('Error fetching user role:', error);
//             }
//         };

//         getUserRole();
//     }, []);

//     const [jsonData, setJsonData] = useState(null);

//     useEffect(() => {
//         // Fetch JSON data from API if user exists
//         if (user._id) {
//             fetch(`${apiUrl}/api/reports/specific/${user._id}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     setJsonData(data);
//                 })
//                 .catch(error => {
//                     console.error('Error fetching data:', error);
//                 });
//         }
//     }, [user]);

//     // Render the component if user is authenticated and has required role
//     return (
//         <div className="container mx-auto px-4 py-8">
//           <h1 className="text-3xl font-bold mb-4">Progress</h1>
//           {user._id ? (
//             <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//               <div className='flex flex-row'>
//                 <div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
//                     <p className="text-gray-700">{user.name}</p>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
//                     <p className="text-gray-700">{user.email}</p>
//                   </div>
//                 </div>
//               </div>
//               {jsonData && 
//               <div className='flex flex-row flex-wrap justify-center items-center'>
//                 <DataVisualization jsonData={jsonData} />
//                 <TimeSeriesGraph jsonData={jsonData} />
//               </div>
//               }
//               <UserReports userId={user._id} route="progress"/>
//             </div>
//           ) : (
//             <p>Loading...</p>
//           )}
//         </div>
//       );
// }

// export default UserProgress;


import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import UserReports from "./UserReports";
import DataVisualization from "./DataVisualization";
import TimeSeriesGraph from "./TimeSeriesGraph";

function UserProgress() {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const { user, fetchUserRole } = context;

    const [jsonData, setJsonData] = useState(null);
    const [scoreData, setScoreData] = useState(null);

    useEffect(() => {
        const getUserRole = async () => {
            try {
                await fetchUserRole();
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        getUserRole();
    }, [fetchUserRole]);

    useEffect(() => {
        if (user._id) {
          console.log(user._id);
            // Fetch JSON data from API
            fetch(`${apiUrl}/api/responses/all/${user._id}`)
                .then(response => response.json())
                .then(data => setJsonData(data))
                .catch(error => console.error('Error fetching reports data:', error));

            // Fetch score data from API
            fetch(`${apiUrl}/api/score/score/${user._id}`)
                .then(response => response.json())
                .then(data => setScoreData(data))
                .catch(error => console.error('Error fetching score data:', error));
        }
    }, [user._id, apiUrl]);

    // Render the component if user is authenticated and has required role
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Progress</h1>
            {user._id ? (
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
                    <UserReports userId={user._id} route="progress"/>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default UserProgress;
