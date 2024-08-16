
// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye } from '@fortawesome/free-solid-svg-icons';
// import StaticScore from './StaticScore';

// function UserReports({ userId, route }) {
//     const apiUrl = import.meta.env.VITE_Backend_URL;
//     const [reports, setReports] = useState([]);
//     const [selectedReport, setSelectedReport] = useState(null);
//     const [selectedPhoto, setSelectedPhoto] = useState(null);
//     const [manualScore, setManualScore] = useState('');
//     const [showPhotoModal, setShowPhotoModal] = useState(false);
//     const [showManualScoreModal, setShowManualScoreModal] = useState(false);
//     const [reportId, setReportId] = useState(null);
//     const [reportType, setReportType] = useState(null);
//     const progress = route;

//     useEffect(() => {
//         // Fetch reports from the backend when the component mounts
//         fetchReports();
//     }, []);

//     const fetchReports = async () => {
//         try {
//             const response = await fetch(`${apiUrl}/api/reports/user/${userId}`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "auth-token": localStorage.getItem('Hactify-Auth-token')
//                 },
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to fetch reports');
//             }
//             const data = await response.json();
//             setReports(data);
//         } catch (error) {
//             console.error('Error fetching reports:', error);
//         }
//     };

//     const handleReportClick = async (reportId, reportType) => {
//         try {
//             const response = await fetch(`${apiUrl}/api/reports/update/${reportType}/${reportId}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch report details');
//             }
//             const reportDetails = await response.json();
//             setSelectedReport(reportDetails);
//         } catch (error) {
//             console.error('Error fetching report details:', error);
//         }
//     };

//     const handlePhotoClick = (event, photoUrls) => {
//         event.stopPropagation(); // Prevent propagation of the click event
//         setSelectedPhoto(photoUrls);
//         setShowPhotoModal(true); // Open photo modal
//     };

//     const handleCloseModal = () => {
//         setSelectedReport(null);
//         setSelectedPhoto(null);
//         setShowManualScoreModal(false);
//         setShowPhotoModal(false);
//         setManualScore('');
//     };

//     const handleAddManualScore = async () => {
//         try {
//             // Calculate total manual score
//             const totalManualScore = Object.entries(selectedReport)
//                 .filter(([key, value]) => key.endsWith('Score') && key !== 'manualScore' && key !== 'penaltyScore') // Exclude penaltyScore from sum
//                 .reduce((total, [key, value]) => total + parseInt(value || 0, 10), 0) - (selectedReport.penaltyScore || 0);

//             // .filter(([key, value]) => key.endsWith('Score') && key !== 'manualScore')
//             // .reduce((total, [key, value]) => total + parseInt(value || 0, 10), 0);




//             // Add total manual score to the selected report object
//             const reportWithTotalScore = {
//                 ...selectedReport,
//                 totalManualScore,
//                 penalty: selectedReport.penalty || ''
//             };

//             const response = await fetch(`${apiUrl}/api/reports/${reportId}/${reportType}/manual-score`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(reportWithTotalScore) // Sending the selected report object with total score to the backend
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to add manual score');
//             }
//             // Refresh the reports list after adding manual score
//             fetchReports();
//             handleCloseModal();
//         } catch (error) {
//             console.error('Error adding manual score:', error);
//         }
//     };

//     const handleShowManualScoreModal = (reportId, reportType) => {
//         setShowManualScoreModal(true);
//         setReportId(reportId);
//         setReportType(reportType);
//     };



//     return (
//         <div className="container mx-auto">
//             <h2 className="text-2xl font-semibold my-4">User Reports</h2>
//             {route == "progress" ? "" : <StaticScore userId={userId}/>}
//             <table className="table-auto">
//                 <thead>
//                     <tr>
//                         <th className="px-4 py-2">Date</th>
//                         <th className="px-4 py-2">Time</th>
//                         <th className="px-4 py-2">Report Type</th>
//                         <th className="px-4 py-2">Manual Score</th>
//                         <th className="px-4 py-2">View</th>
//                         <th className="px-4 py-2">{route == "progress" ? "Assigned Score" : "Add Manual Score"}</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {reports.map((report) => (
//                         <tr key={report._id} className="" onClick={() => handleReportClick(report._id, report.reportType)} >
//                             <td className="border px-4 py-2">{new Date(report.createdAt).toLocaleDateString()}</td>
//                             <td className="border px-4 py-2">{new Date(report.createdAt).toLocaleTimeString()}</td>
//                             <td className="border px-4 py-2">{report.reportType}</td>
//                             <td className="border px-4 py-2">{report.manualScore !== null ? report.manualScore : 'No score assigned yet'}</td>
//                             <td className="border px-4 py-2">
//                                 <FontAwesomeIcon
//                                     icon={faEye}
//                                     onClick={(event) => handlePhotoClick(event, report.pocScreenshots)}
//                                     className="text-blue-500 cursor-pointer"
//                                 />
//                                 &nbsp;&nbsp;
//                                 <a href={`${apiUrl}/uploads/${report.pdfName}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">View PDF</a>
//                             </td>
//                             <td className="border px-4 py-2 text-center">
//                                 <button
//                                     onClick={() => handleShowManualScoreModal(report._id, report.reportType)}
//                                     className="text-blue-500 cursor-pointer"
//                                 >
//                                     View
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {showPhotoModal && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg relative max-h-full overflow-y-auto">
//                         <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
//                         <h3 className="text-lg font-semibold mb-4">Report Photos</h3>
//                         <div className="h-96 overflow-y-auto">
//                             {selectedPhoto.map((photoUrl, index) => (
//                                 <img key={index} src={photoUrl} alt={`Photo ${index}`} className="max-w-full max-h-full my-4 border-2" />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* {showManualScoreModal && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg w-1/2 h-2/3 max-h-2/3 overflow-y-auto relative">
//                         <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
//                         <h3 className="text-lg font-semibold mb-4">Add Manual Score</h3>
//                         <table className="table-auto w-full">
//                             <thead>
//                                 <tr>
//                                     <th className="px-4 py-2">Name</th>
//                                     <th className="px-4 py-2">Values</th>
//                                     <th className="px-4 py-2">Max Score</th>
//                                     <th className="px-4 py-2">Score</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {selectedReport && Object.entries(selectedReport).map(([key, value]) => {
//                                     const isScore = key.endsWith('Score') && key !== 'manualScore'; // Check if the key ends with 'Score' but not 'manualScore'
//                                     if (isScore) {
//                                         return (
//                                             <tr key={key}>
//                                                 <td className="border px-4 py-2">{key.replace('Score', '')}</td>
//                                                 <td className="border px-4 py-2 break-words max-w-xs">{selectedReport[key.replace('Score', '')]}</td>
//                                                 <td className="border px-4 py-2">50</td>
//                                                 <td className="border px-2 py-2">
//                                                     <input
//                                                         type="number"
//                                                         className="border-gray-300 rounded-md w-full p-2"
//                                                         value={selectedReport[key]}
//                                                         onChange={(e) => {
//                                                             // Parse the input value as a number
//                                                             let inputValue = parseInt(e.target.value);

//                                                             // Check if the input value is empty or within the range of 0 to 50
//                                                             if (e.target.value === "" || (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 50)) {
//                                                                 // Update the selected report with the new score value
//                                                                 setSelectedReport((prevReport) => ({
//                                                                     ...prevReport,
//                                                                     [key]: inputValue || "" // Assign an empty string if the input is empty
//                                                                 }));
//                                                             }
//                                                         }}
//                                                         min="0"
//                                                         max="50"
//                                                     />
//                                                 </td>
//                                             </tr>
//                                         );
//                                     }
//                                     return null;
//                                 })}
//                             </tbody>
//                         </table>

//                         <div className="mt-4">
//                             <button
//                                 onClick={handleAddManualScore}
//                                 className="bg-blue-500 text-white px-4 py-2 rounded-md"
//                             >
//                                 Save Score
//                             </button>
//                             <button
//                                 onClick={handleCloseModal}
//                                 className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )} */}
//             {showManualScoreModal && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg w-1/2 h-2/3 max-h-2/3 overflow-y-auto relative">
//                         <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
//                         <h3 className="text-lg font-semibold mb-4">{route == "progress" ? "Detailed Score" : "Add Manual Score"}</h3>
//                         <table className="table-auto w-full">
//                             <thead>
//                                 <tr>
//                                     <th className="px-4 py-2">Name</th>
//                                     <th className="px-4 py-2">Values</th>
//                                     <th className="px-4 py-2">Max Score</th>
//                                     <th className="px-4 py-2">{progress == "progress" ? "Assigned " : ""}Score</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {selectedReport && Object.entries(selectedReport).map(([key, value]) => {
//                                     const isScore = key.endsWith('Score') && key !== 'manualScore'; // Check if the key ends with 'Score' but not 'manualScore'
//                                     if (isScore) {
//                                         return (
//                                             <tr key={key}>
//                                                 <td className="border px-4 py-2">{key.replace('Score', '')}</td>
//                                                 {/* <td className="border px-4 py-2 break-words max-w-xs">{selectedReport[key.replace('Score', '')]}</td> */}
//                                                 <td className={`border px-4 py-2 break-words max-w-xs ${key == "pocScreenshotsScore" ? "text-indigo-500" : ""}`}>
//                                                     {key == "pocScreenshotsScore" ? selectedReport[key.replace('Score', '')].map((data, index) => {
//                                                         return <div key={index + 1} ><a href={data} target='_blank'>Screenshot {index + 1}</a><br /></div>
//                                                     }) :
//                                                         key === 'penaltyScore' ? (
//                                                             <div>
//                                                                 <span className="font-semibold text-red-700  ">Remark: </span>
//                                                                 {/* <input
//                                                             type="text"
//                                                             className={`border-gray-300 rounded-md w-full p-2  ${key === 'penaltyScore' ? 'text-red-500' : ''}`}
//                                                             value={selectedReport.penalty || ''}
//                                                             onChange={(e) => {
//                                                                 const inputValue = e.target.value;
//                                                                 setSelectedReport(prevReport => ({
//                                                                     ...prevReport,
//                                                                     penalty: inputValue
//                                                                 }));
//                                                             }}
//                                                         /> */}
//                                                                 <textarea
//                                                                     className={`border-gray-300 rounded-md w-full p-2 resize-none  ${key === 'penaltyScore' ? 'text-red-500' : ''}`}
//                                                                     disabled={route == "progress"}
//                                                                     value={selectedReport.penalty || ''}
//                                                                     onChange={(e) => {
//                                                                         const inputValue = e.target.value;
//                                                                         setSelectedReport(prevReport => ({
//                                                                             ...prevReport,
//                                                                             penalty: inputValue
//                                                                         }));
//                                                                     }}
//                                                                     rows={4}
//                                                                     style={{ overflowY: 'auto' }}
//                                                                 />

//                                                             </div>
//                                                         ) : (
//                                                             selectedReport[key.replace('Score', '')]
//                                                         )}
//                                                 </td>
//                                     <td className="border px-4 py-2">{selectedReport.reportType=="SITREP" && key=="pocScreenshotsScore"?'0':key=="penaltyScore"?'':selectedReport.reportType=="SITREP"?'0':selectedReport.reportType=="IRREP"?'10':key==="penaltyScore"?'':'5'}</td>
//                                     <td className="border px-2 py-2">
//                                         {
//                                             route == "progress" 
//                                             ?
//                                             <p>{selectedReport[key]}</p>
//                                             :
//                                             <input
//                                                 type="number"
//                                                 className="border-gray-300 rounded-md w-full p-2"
//                                                 value={selectedReport[key]}
//                                                 disabled={route == "progress"}
//                                                 onChange={(e) => {
//                                                     let inputValue = parseInt(e.target.value);
//                                                     if (e.target.value === "" || (!isNaN(inputValue) && inputValue >= 0 && inputValue <= (selectedReport.reportType=="SITREP" && key=="pocScreenshotsScore"?'0':key=="penaltyScore"?'100000':selectedReport.reportType=="SITREP"?'0':selectedReport.reportType=="IRREP"?'10':'5'))) {
//                                                         setSelectedReport(prevReport => ({
//                                                             ...prevReport,
//                                                             [key]: inputValue
//                                                         }));
//                                                     }
//                                                 }}
//                                             />
//                                         }
//                                     </td>
//                                 </tr>
//                             );
//                         }
//                         return null;
//                     })}
//                     <tr>
//                         <td className="border px-4 py-2" colSpan="3">Total Manual Score</td>
//                         {/* <td className="border px-4 py-2">
//                             {selectedReport &&
//                                 Object.entries(selectedReport)
//                                     .filter(([key, value]) => key.endsWith('Score') && key !== 'manualScore')
//                                     .reduce((total, [key, value]) => total + parseInt(value || 0, 10), 0)}
//                         </td> */}
//                                     <td className="border px-4 py-2">
//                                         {selectedReport &&
//                                             Object.entries(selectedReport)
//                                                 .filter(([key, value]) => key.endsWith('Score') && key !== 'manualScore' && key !== 'penaltyScore') // Exclude penaltyScore from sum
//                                                 .reduce((total, [key, value]) => total + parseInt(value || 0, 10), 0) - (selectedReport.penaltyScore || 0)} {/* Subtract penaltyScore */}
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                         {route == "progress" ?
//                             ""
//                             :
//                             <button onClick={handleAddManualScore} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
//                         }
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// }

// export default UserReports;



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// function UserReports() {
//   const { userId } = useParams();
//   const [reports, setReports] = useState([]);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const apiUrl = import.meta.env.VITE_Backend_URL;
//     fetch(`${apiUrl}/api/responses/all/${userId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'auth-token': localStorage.getItem('Hactify-Auth-token'),
//       },
//     })
//       .then(res => res.json())
//       .then(data => setReports(data))
//       .catch(err => console.error('Error fetching reports:', err));
//   }, [userId]);

//   const viewDetails = (responseId) => {
//     const apiUrl = import.meta.env.VITE_Backend_URL;
//     fetch(`${apiUrl}/api/responses/detail/${responseId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'auth-token': localStorage.getItem('Hactify-Auth-token'),
//       },
//     })
//       .then(res => res.json())
//       .then(data => {
//         setSelectedReport(data);
//         setShowModal(true);
//       })
//       .catch(err => console.error('Error fetching response details:', err));
//   };

//   return (
//     <div>
//       <h2>User Reports</h2>
//       <table className="table-auto w-full">
//         <thead>
//           <tr>
//             <th>Report Name</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reports.map(report => (
//             <tr key={report._id}>
//               <td>{report.reportName}</td>
//               <td>{report.responseDate}</td>
//               <td>{report.responseTime}</td>
//               <td>
//                 <button onClick={() => viewDetails(report._id)}>View</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showModal && selectedReport && (
//         <div className="modal">
//           <div className="modal-content">
//             <h3>{selectedReport.reportName}</h3>
//             <p>Date: {selectedReport.responseDate}</p>
//             <p>Time: {selectedReport.responseTime}</p>
//             <table className="table-auto w-full">
//               <thead>
//                 <tr>
//                   <th>Question</th>
//                   <th>Answer</th>
//                   <th>Max Score</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedReport.responses.map((response, index) => (
//                   <tr key={index}>
//                     <td>{response.question}</td>
//                     <td>{response.answer}</td>
//                     <td>{response.maxScore}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <button onClick={() => setShowModal(false)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserReports;


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// function UserReports() {
//   const { userId } = useParams();
//   const [reports, setReports] = useState([]);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const apiUrl = import.meta.env.VITE_Backend_URL;
//     fetch(`${apiUrl}/api/responses/all/${userId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'auth-token': localStorage.getItem('Hactify-Auth-token'),
//       },
//     })
//       .then(res => res.json())
//       .then(data => setReports(data))
//       .catch(err => console.error('Error fetching reports:', err));
//   }, [userId]);

//   const viewDetails = (responseId) => {
//     const apiUrl = import.meta.env.VITE_Backend_URL;
//     fetch(`${apiUrl}/api/responses/detail/${responseId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'auth-token': localStorage.getItem('Hactify-Auth-token'),
//       },
//     })
//       .then(res => res.json())
//       .then(data => {
//         setSelectedReport(data);
//         setShowModal(true);
//       })
//       .catch(err => console.error('Error fetching response details:', err));
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">User Reports</h2>
//       <table className="table-auto w-full border-collapse border border-gray-200">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="px-4 py-2 border-b">Report Name</th>
//             <th className="px-4 py-2 border-b">Date</th>
//             <th className="px-4 py-2 border-b">Time</th>
//             <th className="px-4 py-2 border-b">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reports.map(report => (
//             <tr key={report._id}>
//               <td className="px-4 py-2 border-b">{report.reportName}</td>
//               <td className="px-4 py-2 border-b">{report.responseDate}</td>
//               <td className="px-4 py-2 border-b">{report.responseTime}</td>
//               <td className="px-4 py-2 border-b">
//                 <button 
//                   onClick={() => viewDetails(report._id)} 
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                   View
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showModal && selectedReport && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl">
//             <h3 className="text-xl font-semibold mb-4">{selectedReport.reportName}</h3>
//             <p className="mb-2">Date: {selectedReport.responseDate}</p>
//             <p className="mb-4">Time: {selectedReport.responseTime}</p>
//             <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
//               <thead>
//                 <tr className="bg-gray-100 text-left">
//                   <th className="px-4 py-2 border-b">Question</th>
//                   <th className="px-4 py-2 border-b">Answer</th>
//                   <th className="px-4 py-2 border-b">Max Score</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedReport.responses.map((response, index) => (
//                   <tr key={index}>
//                     <td className="px-4 py-2 border-b">{response.question}</td>
//                     <td className="px-4 py-2 border-b">{response.answer}</td>
//                     <td className="px-4 py-2 border-b">{response.maxScore}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <button 
//               onClick={() => setShowModal(false)} 
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserReports;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UserReports() {
  const { userId } = useParams();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignedScores, setAssignedScores] = useState([]);
  const [penalty, setPenalty] = useState(0);

  // Ensure apiUrl is defined correctly
  const apiUrl = import.meta.env.VITE_Backend_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/responses/all/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('Hactify-Auth-token'),
      },
    })
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error('Error fetching reports:', err));
  }, [userId, apiUrl]);

  const viewDetails = (responseId) => {
    fetch(`${apiUrl}/api/responses/detail/${responseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('Hactify-Auth-token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        setSelectedReport(data);
        console.log('Response Data:', data); 
        // Ensure questionId is included in the response items
        setAssignedScores(data.responses.map(response => ({
          ...response,
          assignedScore: response.assignedScore || 0
        })));
        setPenalty(data.penaltyScore || 0);
        setShowModal(true);
      })
      .catch(err => console.error('Error fetching response details:', err));
  };
  
  const handleScoreChange = (index, value) => {
    setAssignedScores(prevScores => {
      const updatedScores = [...prevScores];
      updatedScores[index].assignedScore = Math.max(0, Math.min(value, updatedScores[index].maxScore));
      return updatedScores;
    });
  };

  const handlePenaltyChange = (value) => {
    setPenalty(Math.max(0, value));
  };

  const handleUpdateScores = () => {
    // Check the assignedScores array to ensure it includes questionId
    const updatedResponses = assignedScores.map(({ questionId, assignedScore }) => ({
      questionId, // This should be included in the object
      assignedScore
    }));
  
    const totalAssignedScore = assignedScores.reduce((sum, { assignedScore }) => sum + assignedScore, 0);
    const finalScore = totalAssignedScore - penalty;
  
    fetch(`${apiUrl}/api/responses/update/${selectedReport._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('Hactify-Auth-token'),
      },
      body: JSON.stringify({
        updatedResponses,
        penaltyScore: penalty,
        finalScore
      }),
    })
      .then(res => res.json())
      .then(result => {
        console.log('Update result:', result);
        if (result.error) {
          console.error('Error updating scores:', result.error);
          return;
        }
        setShowModal(false);
        setReports(reports.map(report =>
          report._id === selectedReport._id ? { ...report, finalScore } : report
        ));
      })
      .catch(err => console.error('Error updating scores:', err));
  };
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Reports</h2>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border-b">Report Name</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Time</th>
            <th className="px-4 py-2 border-b">Total Score</th>
            <th className="px-4 py-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report._id}>
              <td className="px-4 py-2 border-b">{report.reportName}</td>
              <td className="px-4 py-2 border-b">{report.responseDate}</td>
              <td className="px-4 py-2 border-b">{report.responseTime}</td>
              <td className="px-4 py-2 border-b">{report.finalScore || 0}</td>
              <td className="px-4 py-2 border-b">
                <button 
                  onClick={() => viewDetails(report._id)} 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">{selectedReport.reportName}</h3>
            <p className="mb-2">Date: {selectedReport.responseDate}</p>
            <p className="mb-4">Time: {selectedReport.responseTime}</p>
            <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border-b">Question</th>
                  <th className="px-4 py-2 border-b">Answer</th>
                  <th className="px-4 py-2 border-b">Max Score</th>
                  <th className="px-4 py-2 border-b">Assigned Score</th>
                </tr>
              </thead>
              <tbody>
                {assignedScores.map((response, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b">{response.question}</td>
                    <td className="px-4 py-2 border-b">{response.answer}</td>
                    <td className="px-4 py-2 border-b">{response.maxScore}</td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="number"
                        value={response.assignedScore}
                        onChange={(e) => handleScoreChange(index, Number(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="px-4 py-2 border-b font-semibold">Total Assigned Score:</td>
                  <td className="px-4 py-2 border-b">
                    {assignedScores.reduce((sum, { assignedScore }) => sum + assignedScore, 0)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-4 py-2 border-b font-semibold">Penalty:</td>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="number"
                      value={penalty}
                      onChange={(e) => handlePenaltyChange(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-4 py-2 border-b font-semibold">Final Score:</td>
                  <td className="px-4 py-2 border-b">
                    {assignedScores.reduce((sum, { assignedScore }) => sum + assignedScore, 0) - penalty}
                  </td>
                </tr>
              </tfoot>
            </table>
            <button 
              onClick={handleUpdateScores} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Scores
            </button>
            <button 
              onClick={() => setShowModal(false)} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserReports;
