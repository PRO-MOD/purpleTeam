// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye } from '@fortawesome/free-solid-svg-icons';

// function UserReports({ userId }) {
//     const apiUrl = import.meta.env.VITE_Backend_URL;
//     const [reports, setReports] = useState([]);
//     const [selectedReport, setSelectedReport] = useState(null);
//     const [selectedPhoto, setSelectedPhoto] = useState(null);
//     const [manualScore, setManualScore] = useState('');
//     const [showPhotoModal, setShowPhotoModal] = useState(false);
//     const [showManualScoreModal, setShowManualScoreModal] = useState(false);
//     const [reportId, setReportId] = useState(null);
//     const [reportType, setReportType] = useState(null);

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

//     const handleReportClick = async (reportId,reportType) => {
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
//         setShowReportDetailsModal(false);
//         setManualScore('');

//     };

//     const handleAddManualScore = async () => {
//         try {
//             // Calculate total manual score
//             const totalManualScore = Object.entries(selectedReport)
//                 .filter(([key, value]) => key.endsWith('Score') && key !== 'manualScore')
//                 .reduce((total, [key, value]) => total + parseInt(value || 0, 10), 0);
    
//             // Add total manual score to the selected report object
//             const reportWithTotalScore = {
//                 ...selectedReport,
//                 totalManualScore
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
//             <table className="table-auto">
//                 <thead>
//                     <tr>
//                         <th className="px-4 py-2">Date</th>
//                         <th className="px-4 py-2">Time</th>
//                         <th className="px-4 py-2">Report Type</th>
//                         <th className="px-4 py-2">Manual Score</th>
//                         <th className="px-4 py-2">View</th>
//                         <th className="px-4 py-2">Add Manual Score</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {reports.map((report) => (
//                         <tr key={report._id} className="" onClick={() => handleReportClick(report._id,report.reportType)} >
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
//                             <td>
//                                 <button
//                                     onClick={() => handleShowManualScoreModal(report._id, report.reportType)}
//                                     className="text-blue-500 cursor-pointer"
//                                 >
//                                     Add Manual Score
//                                 </button>
//                                 &nbsp;&nbsp;
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* {showManualScoreModal && (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//         <div className="bg-white p-6 rounded-lg w-1/2 h-auto max-h-3/4 overflow-y-auto relative">
//             <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
//             <h3 className="text-lg font-semibold mb-4">Add Manual Score</h3>
//             <table className="table-auto w-full">
//                 <thead>
//                     <tr>
//                         <th className="px-4 py-2">Name</th>
//                         <th className="px-4 py-2">Values</th>
//                         <th className="px-4 py-2">Max Score</th>
//                         <th className="px-4 py-2">Score</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {selectedReport && Object.entries(selectedReport).map(([key, value]) => {
//                         const isScore = key.endsWith('Score') && key !== 'manualScore'; // Check if the key ends with 'Score' but not 'manualScore'
//                         if (isScore) {
//                             return (
//                                 <tr key={key}>
//                                     <td className="border px-4 py-2">{key.replace('Score', '')}</td>
//                                     <td className="border px-4 py-2">{selectedReport[key.replace('Score', '')]}</td>
//                                     <td className="border px-4 py-2">10</td>
//                                     <td className="border px-4 py-2">
//                                         <input
//                                             type="number"
//                                             className="border-gray-300 rounded-md w-full p-2"
//                                             value={selectedReport[key]} // Use the score value from the selected report
//                                             onChange={(e) => {
//                                                 // Update the selected report with the new score value
//                                                 setSelectedReport(prevReport => ({
//                                                     ...prevReport,
//                                                     [key]: e.target.value // Update the score field with the new value
//                                                 }));
//                                             }}
//                                         />
//                                     </td>
//                                 </tr>
//                             );
//                         }
//                         return null;
//                     })}
//                     <tr>
//                         <td className="border px-4 py-2" colSpan="3">Total Manual Score</td>
//                         <td className="border px-4 py-2">
//                             {selectedReport &&
//                                 Object.entries(selectedReport)
//                                     .filter(([key, value]) => key.endsWith('Score') && key !== 'manualScore')
//                                     .reduce((total, [key, value]) => total + parseInt(value || 0, 10), 0)}
//                         </td>
//                     </tr>
//                 </tbody>
//             </table>
//             <button onClick={handleAddManualScore} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
//         </div>
//     </div>
// )} */}
// {showPhotoModal && (
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


// {showManualScoreModal && (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//         <div className="bg-white p-6 rounded-lg w-1/2 h-2/3 max-h-2/3 overflow-y-auto relative"> {/* Decreased the height and added overflow-y-auto */}
//             <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
//             <h3 className="text-lg font-semibold mb-4">Add Manual Score</h3>
//             <table className="table-auto w-full">
//                 <thead>
//                     <tr>
//                         <th className="px-4 py-2">Name</th>
//                         <th className="px-4 py-2">Values</th>
//                         <th className="px-4 py-2">Max Score</th>
//                         <th className="px-4 py-2">Score</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {selectedReport && Object.entries(selectedReport).map(([key, value]) => {
//                         const isScore = key.endsWith('Score') && key !== 'manualScore'; // Check if the key ends with 'Score' but not 'manualScore'
//                         if (isScore) {
//                             return (
//                                 <tr key={key}>
//                                     <td className="border px-4 py-2">{key.replace('Score', '')}</td>
//                                     <td className="border px-4 py-2">{selectedReport[key.replace('Score', '')]}</td>
//                                     <td className="border px-4 py-2">50</td>
//                                     <td className="border px-2 py-2">
//                                         {/* <input
//                                             type="number"
//                                             className="border-gray-300 rounded-md w-full p-2"
//                                             value={selectedReport[key]} // Use the score value from the selected report
//                                             onChange={(e) => {
//                                                 // Update the selected report with the new score value
//                                                 setSelectedReport(prevReport => ({
//                                                     ...prevReport,
//                                                     [key]: e.target.value // Update the score field with the new value
//                                                 }));
//                                             }}
//                                         /> */}
//                                         <input
//     type="number"
//     className="border-gray-300 rounded-md w-full p-2"
//     value={selectedReport[key]}
//     onChange={(e) => {
//         // Parse the input value as a number
//         let inputValue = parseInt(e.target.value);
        
//         // Check if the input value is empty or within the range of 0 to 10
//         if (e.target.value === "" || (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 50)) {
//             // Update the selected report with the new score value
//             setSelectedReport(prevReport => ({
//                 ...prevReport,
//                 [key]: inputValue // Update the score field with the new value
//             }));
//         } else {
//             // If the input value is not within the range, do not update the state
//             // You can add additional logic here such as displaying an error message
//             // or resetting the input value
//         }
//     }}
// />

//                                     </td>
//                                 </tr>
//                             );
//                         }
//                         return null;
//                     })}
//                     <tr>
//                         <td className="border px-4 py-2" colSpan="3">Total Manual Score</td>
//                         <td className="border px-4 py-2">
//                             {selectedReport &&
//                                 Object.entries(selectedReport)
//                                     .filter(([key, value]) => key.endsWith('Score') && key !== 'manualScore')
//                                     .reduce((total, [key, value]) => total + parseInt(value || 0, 10), 0)}
//                         </td>
//                     </tr>
//                 </tbody>
//             </table>
//             <button onClick={handleAddManualScore} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
//         </div>
//     </div>
// )}

//         </div>
//     );
// }

// export default UserReports;
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function UserReports({ userId }) {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [manualScore, setManualScore] = useState('');
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showManualScoreModal, setShowManualScoreModal] = useState(false);
    const [reportId, setReportId] = useState(null);
    const [reportType, setReportType] = useState(null);

    useEffect(() => {
        // Fetch reports from the backend when the component mounts
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/reports/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('Hactify-Auth-token')
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch reports');
            }
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleReportClick = async (reportId, reportType) => {
        try {
            const response = await fetch(`${apiUrl}/api/reports/update/${reportType}/${reportId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch report details');
            }
            const reportDetails = await response.json();
            setSelectedReport(reportDetails);
        } catch (error) {
            console.error('Error fetching report details:', error);
        }
    };

    const handlePhotoClick = (event, photoUrls) => {
        event.stopPropagation(); // Prevent propagation of the click event
        setSelectedPhoto(photoUrls);
        setShowPhotoModal(true); // Open photo modal
    };

    const handleCloseModal = () => {
        setSelectedReport(null);
        setSelectedPhoto(null);
        setShowManualScoreModal(false);
        setShowPhotoModal(false);
        setManualScore('');
    };

    const handleAddManualScore = async () => {
        try {
            // Calculate total manual score
            const totalManualScore = Object.entries(selectedReport)
                .filter(([key, value]) => key.endsWith('Score') && key !== 'manualScore')
                .reduce((total, [key, value]) => total + parseInt(value || 0, 10), 0);

            // Add total manual score to the selected report object
            const reportWithTotalScore = {
                ...selectedReport,
                totalManualScore
            };

            const response = await fetch(`${apiUrl}/api/reports/${reportId}/${reportType}/manual-score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportWithTotalScore) // Sending the selected report object with total score to the backend
            });
            if (!response.ok) {
                throw new Error('Failed to add manual score');
            }
            // Refresh the reports list after adding manual score
            fetchReports();
            handleCloseModal();
        } catch (error) {
            console.error('Error adding manual score:', error);
        }
    };

    const handleShowManualScoreModal = (reportId, reportType) => {
        setShowManualScoreModal(true);
        setReportId(reportId);
        setReportType(reportType);
    };



    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-semibold my-4">User Reports</h2>
            <table className="table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Time</th>
                        <th className="px-4 py-2">Report Type</th>
                        <th className="px-4 py-2">Manual Score</th>
                        <th className="px-4 py-2">View</th>
                        <th className="px-4 py-2">Add Manual Score</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report._id} className="" onClick={() => handleReportClick(report._id, report.reportType)} >
                            <td className="border px-4 py-2">{new Date(report.createdAt).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">{new Date(report.createdAt).toLocaleTimeString()}</td>
                            <td className="border px-4 py-2">{report.reportType}</td>
                            <td className="border px-4 py-2">{report.manualScore !== null ? report.manualScore : 'No score assigned yet'}</td>
                            <td className="border px-4 py-2">
                                <FontAwesomeIcon
                                    icon={faEye}
                                    onClick={(event) => handlePhotoClick(event, report.pocScreenshots)}
                                    className="text-blue-500 cursor-pointer"
                                />
                                &nbsp;&nbsp;
                                <a href={`${apiUrl}/uploads/${report.pdfName}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">View PDF</a>
                            </td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleShowManualScoreModal(report._id, report.reportType)}
                                    className="text-blue-500 cursor-pointer"
                                >
                                    Add Manual Score
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showPhotoModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg relative max-h-full overflow-y-auto">
                        <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
                        <h3 className="text-lg font-semibold mb-4">Report Photos</h3>
                        <div className="h-96 overflow-y-auto">
                            {selectedPhoto.map((photoUrl, index) => (
                                <img key={index} src={photoUrl} alt={`Photo ${index}`} className="max-w-full max-h-full my-4 border-2" />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* {showManualScoreModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-1/2 h-2/3 max-h-2/3 overflow-y-auto relative">
                        <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
                        <h3 className="text-lg font-semibold mb-4">Add Manual Score</h3>
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Values</th>
                                    <th className="px-4 py-2">Max Score</th>
                                    <th className="px-4 py-2">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedReport && Object.entries(selectedReport).map(([key, value]) => {
                                    const isScore = key.endsWith('Score') && key !== 'manualScore'; // Check if the key ends with 'Score' but not 'manualScore'
                                    if (isScore) {
                                        return (
                                            <tr key={key}>
                                                <td className="border px-4 py-2">{key.replace('Score', '')}</td>
                                                <td className="border px-4 py-2 break-words max-w-xs">{selectedReport[key.replace('Score', '')]}</td>
                                                <td className="border px-4 py-2">50</td>
                                                <td className="border px-2 py-2">
                                                    <input
                                                        type="number"
                                                        className="border-gray-300 rounded-md w-full p-2"
                                                        value={selectedReport[key]}
                                                        onChange={(e) => {
                                                            // Parse the input value as a number
                                                            let inputValue = parseInt(e.target.value);

                                                            // Check if the input value is empty or within the range of 0 to 50
                                                            if (e.target.value === "" || (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 50)) {
                                                                // Update the selected report with the new score value
                                                                setSelectedReport((prevReport) => ({
                                                                    ...prevReport,
                                                                    [key]: inputValue || "" // Assign an empty string if the input is empty
                                                                }));
                                                            }
                                                        }}
                                                        min="0"
                                                        max="50"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    }
                                    return null;
                                })}
                            </tbody>
                        </table>

                        <div className="mt-4">
                            <button
                                onClick={handleAddManualScore}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Save Score
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
            {showManualScoreModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-1/2 h-2/3 max-h-2/3 overflow-y-auto relative">
            <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
            <h3 className="text-lg font-semibold mb-4">Add Manual Score</h3>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Values</th>
                        <th className="px-4 py-2">Max Score</th>
                        <th className="px-4 py-2">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedReport && Object.entries(selectedReport).map(([key, value]) => {
                        const isScore = key.endsWith('Score') && key !== 'manualScore'; // Check if the key ends with 'Score' but not 'manualScore'
                        if (isScore) {
                            return (
                                <tr key={key}>
                                    <td className="border px-4 py-2">{key.replace('Score', '')}</td>
                                    <td className={`border px-4 py-2 break-words max-w-xs ${key=="pocScreenshotsScore"?"text-indigo-500":""}`}>{key=="pocScreenshotsScore"?selectedReport[key.replace('Score', '')].map((data,index)=>{
                                        return <a href={data}>Screenshot {index+1}</a>
                                    }):selectedReport[key.replace('Score', '')]}</td>
                                    <td className="border px-4 py-2">{selectedReport.reportType=="SITREP" && key=="pocScreenshotsScore"?'30':selectedReport.reportType=="SITREP"?'20':selectedReport.reportType=="IRREP"?'50':'5'}</td>
                                    <td className="border px-2 py-2">
                                        <input
                                            type="number"
                                            className="border-gray-300 rounded-md w-full p-2"
                                            value={selectedReport[key]}
                                            onChange={(e) => {
                                                let inputValue = parseInt(e.target.value);
                                                if (e.target.value === "" || (!isNaN(inputValue) && inputValue >= 0 && inputValue <= (selectedReport.reportType=="SITREP" && key=="pocScreenshotsScore"?'30':selectedReport.reportType=="SITREP"?'20':selectedReport.reportType=="IRREP"?'50':'5'))) {
                                                    setSelectedReport(prevReport => ({
                                                        ...prevReport,
                                                        [key]: inputValue
                                                    }));
                                                }
                                            }}
                                        />
                                    </td>
                                </tr>
                            );
                        }
                        return null;
                    })}
                    <tr>
                        <td className="border px-4 py-2" colSpan="3">Total Manual Score</td>
                        <td className="border px-4 py-2">
                            {selectedReport &&
                                Object.entries(selectedReport)
                                    .filter(([key, value]) => key.endsWith('Score') && key !== 'manualScore')
                                    .reduce((total, [key, value]) => total + parseInt(value || 0, 10), 0)}
                        </td>
                    </tr>
                </tbody>
            </table>
            <button onClick={handleAddManualScore} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
        </div>
    </div>
)}

        </div>
    );
}

export default UserReports;
