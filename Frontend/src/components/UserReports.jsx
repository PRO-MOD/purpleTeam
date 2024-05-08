import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function UserReports({ userId }) {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [manualScore, setManualScore] = useState('');
    const [showManualScoreModal, setShowManualScoreModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showReportDetailsModal, setShowReportDetailsModal] = useState(false);
    const [reportId, setReportId] = useState(null);
    const [reportType, setReportType] = useState(null);

    useEffect(() => {
        // Fetch reports from the backend when the component mounts
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch(`http://13.233.214.116:5000/api/reports/user/${userId}`, {
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

    // const handleReportClick = async (reportId) => {
    //     try {
    //         const response = await fetch(`http://13.233.214.116:5000/api/reports/${reportId}`);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch report details');
    //         }
    //         const reportDetails = await response.json();
    //         setSelectedReport(reportDetails);
    //         // setShowReportDetailsModal(true); // Open report details modal

    //     } catch (error) {
    //         console.error('Error fetching report details:', error);
    //     }
    // };

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
        setShowReportDetailsModal(false);
        setManualScore('');
    };

    const handleAddManualScore = async () => {
        try {
            const response = await fetch(`http://13.233.214.116:5000/api/reports/${reportId}/${reportType}/manual-score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ score: manualScore })
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

    const handleShowManualScoreModal = (reportId,reportType) => {
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
                        <th className="px-4 py-2">Report Type</th>
                        <th className="px-4 py-2">Manual Score</th>
                        <th className="px-4 py-2">Actions</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report._id} className="" >
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
                                <a href={`http://13.233.214.116:5000/uploads/${report.pdfName}`} target="_blank" rel="noopener noreferrer" className="text-blue-500" onClick={(event) => event.stopPropagation()}>View PDF</a>
                            </td>
                            <td>
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setShowManualScoreModal(true);
                                        handleShowManualScoreModal(report._id,report.reportType);
                                    }}
                                    className="text-blue-500 cursor-pointer"
                                >
                                    Add Manual Score
                                </button>
                                &nbsp;&nbsp;
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

           

            {showManualScoreModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-1/2 h-auto max-h-3/4 overflow-y-auto relative">
                        <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
                        <h3 className="text-lg font-semibold mb-4">Add Manual Score</h3>
                        <input
                            type="number"
                            className="border-gray-300 rounded-md w-full p-2 mb-4"
                            placeholder="Enter Manual Score"
                            value={manualScore}
                            onChange={(e) => setManualScore(e.target.value)}
                        />
                        <button onClick={handleAddManualScore} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserReports;
