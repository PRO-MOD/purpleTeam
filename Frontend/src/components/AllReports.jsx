import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function ReportTable() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        // Fetch reports from the backend when the component mounts
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/reports/getAllReports', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('Hactify-Auth-token')
                },
            }); // Assuming the route is served from '/api'
            if (!response.ok) {
                throw new Error('Failed to fetch reports');
            }
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleReportClick = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/reports/${reportId}`);
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
    };

    const handleCloseModal = () => {
        setSelectedReport(null);
        setSelectedPhoto(null);
    };

    return (
        <div className="container mx-auto px-4  ">
            <h2 className="text-2xl font-semibold my-4 text-black-600">Your Submitted Reports </h2>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="px-4 py-2 border border-gray-400">Date</th>
                        <th className="px-4 py-2 border border-gray-400">Time</th>
                        <th className="px-4 py-2 border border-gray-400">Report Type</th>
                        <th className="px-4 py-2 border border-gray-400">View</th>
                        <th className="px-4 py-2 border border-gray-400">POCs</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report, index) => (
                        <tr key={report._id} className={`border ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}` }>
                             {/* <tr key={report._id} className="cursor-pointer hover:bg-gray-100" onClick={() => handleReportClick(report._id)}></tr> */}
                            <td className="px-4 py-2 border border-gray-300">{new Date(report.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-2  border border-gray-300">{new Date(report.createdAt).toLocaleTimeString()}</td>
                            <td className="px-4 py-2 border border-gray-300">{report.reportType}</td>
                            <td className="px-4 py-2 border border-gray-300">
                                <FontAwesomeIcon
                                    icon={faEye}
                                    onClick={(event) => handlePhotoClick(event, report.pocScreenshots)}
                                    className="text-blue-500 cursor-pointer mr-2"
                                /> </td>

                              <td className="px-4 py-2 border border-gray-300">  <a href={`http://localhost:5000/uploads/${report.pdfName}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">View POCs</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedPhoto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg relative max-h-full overflow-y-auto">
                        <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
                        <h3 className="text-lg font-semibold mb-4">Report Photos</h3>
                        <div className="h-96 overflow-y-auto">
                            {selectedPhoto.map((photoUrl, index) => (
                                <img key={index} src={photoUrl} alt={`Photo ${index}`} className="w-full max-h-full my-4 border-2" />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {selectedReport && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-1/2 h-auto max-h-3/4 overflow-y-auto relative">
                        <span className="text-2xl font-bold cursor-pointer absolute top-2 right-2" onClick={handleCloseModal}>&times;</span>
                        <h3 className="text-lg font-semibold mb-4">Report Details</h3>
                        <p><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleDateString()}</p>
                        <p><strong>Question 1:</strong></p>
                        <p>{selectedReport.question1}</p>
                        <p><strong>Question 2:</strong></p>
                        <p>{selectedReport.question2}</p>
                        <p><strong>Question 3:</strong></p>
                        <p>{selectedReport.question3}</p>
                        <p><strong>Question 4:</strong></p>
                        <p>{selectedReport.question4}</p>
                        <p><strong>Question 5:</strong></p>
                        <p>{selectedReport.question5}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportTable;
